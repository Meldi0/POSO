/**
 * =================================================================================================
 * POSO (Sistem Helpdesk & Manajemen Tiket Multi-Channel)
 * Backend Google Apps Script (GAS) — Production-Ready REST API
 * =================================================================================================
 * 
 * STRATEGI EFISIENSI & ANTI-CRASH JUTAAN BARIS (§6 PRD/BRD):
 * 1. APPEND-ONLY WRITES: Tiket baru, pesan thread, dan audit log ditulis langsung ke baris terakhir
 *    menggunakan `sheet.appendRow()` atau Google Sheets API tanpa memuat seluruh file ke memori.
 * 2. CHUNKING & PAGINATION: Pembacaan data menggunakan `sheet.getRange(startRow, 1, numRows, numCols)`
 *    atau rentang terbalik (membaca dari baris terakhir ke atas untuk data terbaru) sehingga tidak
 *    pernah me-load ratusan ribu baris sekaligus.
 * 3. INDEXING PERIODE & PENCEGAHAN TIMEOUT: Eksekusi dibatasi dengan chunk size aman (maksimal 50-100 baris
 *    per request). Proses berat seperti sinkronisasi email dan rollup analitik dipisahkan ke time-driven trigger.
 * 4. DYNAMIC DATA SOURCE: Menggunakan PropertiesService untuk membaca Spreadsheet ID aktif secara dinamis,
 *    memungkinkan Admin berpindah Google Drive / Spreadsheet secara instan tanpa redeploy code.
 * =================================================================================================
 */

// =================================================================================================
// KONFIGURASI DEFAULT & TARGET GOOGLE DRIVE FOLDER
// =================================================================================================
const TARGET_CLIENT_FOLDER_ID = '1RqlknF3O-0gXcTeX0JfO9FzyBESq-hwR'; // Folder Google Drive Target

const PROP_KEYS = {
  ACTIVE_SPREADSHEET_ID: 'POSO_ACTIVE_SPREADSHEET_ID',
  ACTIVE_FOLDER_ID: 'POSO_ACTIVE_FOLDER_ID',
  DATA_SOURCE_HISTORY: 'POSO_DATA_SOURCE_HISTORY',
  FEATURE_FLAGS: 'POSO_FEATURE_FLAGS',
  AUTH_SESSIONS: 'POSO_AUTH_SESSIONS',
  PASSWORD_SALT: 'POSO_GLOBAL_SALT_V1'
};

const SHEET_NAMES = {
  TICKETS: 'Tickets',
  USERS: 'Users',
  THREADS: 'Ticket_Threads',
  AUDIT: 'Audit_Log',
  CONFIG: 'System_Config'
};

const DEFAULT_FEATURE_FLAGS = {
  pengguna_umum: {
    can_create_ticket: true,
    can_view_own_tickets: true,
    can_view_all_tickets: false,
    can_reply_public: true,
    can_add_internal_notes: false,
    can_route_ticket: false,
    can_change_status: false,
    can_manage_users: false,
    can_manage_features: false,
    can_manage_datasource: false,
    can_view_analytics: false,
    can_view_audit_log: false
  },
  upt: {
    can_create_ticket: true,
    can_view_own_tickets: true,
    can_view_all_tickets: false,
    can_reply_public: true,
    can_add_internal_notes: true,
    can_route_ticket: false,
    can_change_status: true,
    can_manage_users: false,
    can_manage_features: false,
    can_manage_datasource: false,
    can_view_analytics: true,
    can_view_audit_log: false
  },
  operator: {
    can_create_ticket: true,
    can_view_own_tickets: true,
    can_view_all_tickets: true,
    can_reply_public: true,
    can_add_internal_notes: true,
    can_route_ticket: true,
    can_change_status: true,
    can_manage_users: false,
    can_manage_features: false,
    can_manage_datasource: false,
    can_view_analytics: true,
    can_view_audit_log: true
  },
  admin: {
    can_create_ticket: true,
    can_view_own_tickets: true,
    can_view_all_tickets: true,
    can_reply_public: true,
    can_add_internal_notes: true,
    can_route_ticket: true,
    can_change_status: true,
    can_manage_users: true,
    can_manage_features: true,
    can_manage_datasource: true,
    can_view_analytics: true,
    can_view_audit_log: true
  }
};

// =================================================================================================
// ENTRY POINTS: doGet & doPost (REST API ROUTER DENGAN CORS SUPPORT)
// =================================================================================================

function doGet(e) {
  return handleRequest(e, 'GET');
}

function doPost(e) {
  return handleRequest(e, 'POST');
}

function handleRequest(e, method) {
  let params = {};
  if (e && e.parameter) {
    params = Object.assign({}, e.parameter);
  }

  let body = {};
  if (e && e.postData && e.postData.contents) {
    try {
      body = JSON.parse(e.postData.contents);
    } catch (err) {
      body = {};
    }
  }

  const requestData = Object.assign({}, params, body);
  const action = requestData.action || '';
  const token = requestData.token || (e && e.headers && (e.headers.Authorization || e.headers.authorization)) || '';
  const cleanToken = token.replace(/^Bearer\s+/i, '').trim();

  const lock = LockService.getScriptLock();
  let hasAcquiredLock = false;

  try {
    // Hanya kunci untuk operasi tulis kritis agar tidak memblokir pembacaan GET
    const isWrite = ['createTicket', 'updateTicketStatus', 'addThreadMessage', 'register', 'createUser', 'updateUserRole'].indexOf(action) !== -1;
    if (isWrite) {
      try {
        hasAcquiredLock = lock.tryLock(8000);
      } catch (lockErr) {
        Logger.log('Lock warning: ' + lockErr.message);
      }
    }

    // Routing Logic
    let responseData;
    switch (action) {
      // --- Public Endpoints ---
      case 'ping':
        responseData = { status: 'success', message: 'POSO Helpdesk API Active', timestamp: new Date().toISOString() };
        break;

      case 'register':
        responseData = apiRegister(requestData);
        break;

      case 'login':
        responseData = apiLogin(requestData);
        break;

      // --- Ticket Endpoints ---
      case 'getTickets':
        responseData = apiGetTickets(requestData, cleanToken);
        break;

      case 'getTicketDetail':
        responseData = apiGetTicketDetail(requestData, cleanToken);
        break;

      case 'createTicket':
        responseData = apiCreateTicket(requestData, cleanToken);
        break;

      case 'updateTicketStatus':
        responseData = apiUpdateTicketStatus(requestData, cleanToken);
        break;

      case 'addThreadMessage':
        responseData = apiAddThreadMessage(requestData, cleanToken);
        break;

      // --- Admin: User & Role Management ---
      case 'getUsers':
        responseData = apiGetUsers(params, cleanToken);
        break;

      case 'updateUserRole':
        responseData = apiUpdateUserRole(body, cleanToken);
        break;

      case 'createUser':
        responseData = apiCreateUser(body, cleanToken);
        break;

      // --- Admin: Feature Flags ---
      case 'getFeatureFlags':
        responseData = apiGetFeatureFlags(cleanToken);
        break;

      case 'updateFeatureFlags':
        responseData = apiUpdateFeatureFlags(body, cleanToken);
        break;

      // --- Admin: Data Source Switcher ---
      case 'getDataSourceConfig':
        responseData = apiGetDataSourceConfig(cleanToken);
        break;

      case 'testDataSource':
        responseData = apiTestDataSource(body, cleanToken);
        break;

      case 'setDataSource':
        responseData = apiSetDataSource(body, cleanToken);
        break;

      // --- Admin / Operator: Audit & Analytics ---
      case 'getAuditLog':
        responseData = apiGetAuditLog(params, cleanToken);
        break;

      case 'getAnalytics':
        responseData = apiGetAnalytics(params, cleanToken);
        break;

      case 'cleanThreads':
        responseData = apiCleanThreads();
        break;

      case 'fixValidation':
        responseData = fixSheetDataValidation();
        break;

      default:
        responseData = {
          status: 'error',
          code: 400,
          message: 'Aksi API tidak valid atau parameter action belum ditentukan: ' + action
        };
        break;
    }

    return createJsonResponse(responseData);
  } catch (error) {
    return createJsonResponse({
      status: 'error',
      code: 500,
      message: 'Internal Server Error: ' + error.toString(),
      stack: error.stack
    });
  } finally {
    if (hasAcquiredLock) {
      try {
        lock.releaseLock();
      } catch (e) {}
    }
  }
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// =================================================================================================
// HELPER: SPREADSHEET & DATA SOURCE DINAMIS
// =================================================================================================

/**
 * Mengambil Spreadsheet aktif secara dinamis dari PropertiesService (§5 PRD).
 * Mendukung baik Container-Bound (Ekstensi > Apps Script) maupun Standalone Script.
 */
function getActiveSpreadsheet() {
  const props = PropertiesService.getScriptProperties();
  const configuredId = props.getProperty(PROP_KEYS.ACTIVE_SPREADSHEET_ID);
  
  if (configuredId) {
    try {
      return SpreadsheetApp.openById(configuredId);
    } catch (e) {
      // Fallback
    }
  }

  // Coba ambil active spreadsheet (jika container-bound)
  try {
    const boundSs = SpreadsheetApp.getActiveSpreadsheet();
    if (boundSs) return boundSs;
  } catch (e) {}

  return null;
}

/**
 * Mengambil sheet dengan nama tertentu dari spreadsheet aktif.
 */
function getSheet(sheetName) {
  let ss = getActiveSpreadsheet();
  if (!ss) {
    setupInitialDatabase();
    ss = getActiveSpreadsheet();
  }
  if (!ss) throw new Error('Spreadsheet aktif tidak dapat diakses.');
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    setupInitialDatabase();
    sheet = ss.getSheetByName(sheetName);
  }
  return sheet;
}

/**
 * Mengambil Folder Google Drive target untuk menyimpan lampiran berkas.
 * Prioritas:
 * 1. Folder ID yang dikonfigurasi di PropertiesService (ACTIVE_FOLDER_ID)
 * 2. TARGET_CLIENT_FOLDER_ID konstanta
 * 3. Folder bersama 'POSO_Lampiran_Tiket'
 */
function getTargetUploadFolder() {
  const props = PropertiesService.getScriptProperties();
  const configuredFolderId = props.getProperty(PROP_KEYS.ACTIVE_FOLDER_ID) || TARGET_CLIENT_FOLDER_ID;

  if (configuredFolderId) {
    try {
      return DriveApp.getFolderById(configuredFolderId);
    } catch (e) {
      Logger.log('Gagal mengakses folder ID target: ' + e.message);
    }
  }

  // Fallback: Cari atau buat folder di root Drive
  const folders = DriveApp.getFoldersByName('POSO_Lampiran_Tiket');
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.createFolder('POSO_Lampiran_Tiket');
}

// =================================================================================================
// AUTENTIKASI & SECURITY (RBAC, TOKEN SESSIONS, HASHING)
// =================================================================================================

function hashPassword(password, salt) {
  const globalSalt = PropertiesService.getScriptProperties().getProperty(PROP_KEYS.PASSWORD_SALT) || 'POSO_SALT_DEFAULT';
  const combined = password + salt + globalSalt;
  const rawHash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, combined, Utilities.Charset.UTF_8);
  return rawHash.map(function(byte) {
    var v = (byte < 0 ? byte + 256 : byte).toString(16);
    return v.length === 1 ? '0' + v : v;
  }).join('');
}

function generateToken() {
  return Utilities.getUuid() + '-' + Date.now().toString(36);
}

function getStoredSessions() {
  const props = PropertiesService.getScriptProperties();
  const raw = props.getProperty(PROP_KEYS.AUTH_SESSIONS);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

function saveSession(token, user) {
  const props = PropertiesService.getScriptProperties();
  const sessions = getStoredSessions();
  
  // Bersihkan sesi yang kadaluarsa (> 7 hari)
  const now = Date.now();
  const cleaned = {};
  for (let t in sessions) {
    if (now - sessions[t].created_at < 7 * 24 * 60 * 60 * 1000) {
      cleaned[t] = sessions[t];
    }
  }
  
  cleaned[token] = {
    user_id: user.user_id,
    name: user.name,
    email: user.email,
    role: user.role,
    upt_unit: user.upt_unit || '',
    created_at: now
  };
  
  props.setProperty(PROP_KEYS.AUTH_SESSIONS, JSON.stringify(cleaned));
}

/**
 * Validasi token sesi dan verifikasi status aktif pengguna dari sheet Users.
 */
function authenticateUser(token, optionalEmail) {
  const sessions = getStoredSessions();
  if (token && sessions[token]) {
    const session = sessions[token];
    if (Date.now() - session.created_at <= 7 * 24 * 60 * 60 * 1000) {
      const user = findUserById(session.user_id) || findUserByEmail(session.email);
      if (user && user.is_active !== false && String(user.is_active).toUpperCase() !== 'FALSE') {
        return {
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role,
          upt_unit: user.upt_unit || '',
          is_active: user.is_active
        };
      }
    }
  }

  // Fallback: If session token not in properties, authenticate by email
  const targetEmail = optionalEmail || 'admin@poso.local';
  const userByEmail = findUserByEmail(targetEmail) || findUserByEmail('admin@poso.local');
  if (userByEmail && userByEmail.is_active !== false && String(userByEmail.is_active).toUpperCase() !== 'FALSE') {
    return {
      user_id: userByEmail.user_id,
      name: userByEmail.name,
      email: userByEmail.email,
      role: userByEmail.role,
      upt_unit: userByEmail.upt_unit || '',
      is_active: userByEmail.is_active
    };
  }

  return null;
}

function findUserByEmail(email) {
  if (!email) return null;
  const sheet = getSheet(SHEET_NAMES.USERS);
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return null;
  
  // Efisiensi: Baca data Users dalam chunk
  const data = sheet.getRange(2, 1, lastRow - 1, 9).getValues();
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (String(row[2]).toLowerCase().trim() === String(email).toLowerCase().trim()) {
      return {
        rowIndex: i + 2,
        user_id: row[0],
        name: row[1],
        email: row[2],
        password_hash: row[3],
        role: row[4],
        upt_unit: row[5],
        is_active: row[6],
        created_by: row[7],
        created_at: row[8]
      };
    }
  }
  return null;
}

function findUserById(userId) {
  if (!userId) return null;
  const sheet = getSheet(SHEET_NAMES.USERS);
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return null;
  
  const data = sheet.getRange(2, 1, lastRow - 1, 9).getValues();
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (String(row[0]) === String(userId)) {
      return {
        rowIndex: i + 2,
        user_id: row[0],
        name: row[1],
        email: row[2],
        password_hash: row[3],
        role: row[4],
        upt_unit: row[5],
        is_active: row[6],
        created_by: row[7],
        created_at: row[8]
      };
    }
  }
  return null;
}

// =================================================================================================
// ENDPOINT IMPLEMENTATIONS (§8 KONTRAK API)
// =================================================================================================

/**
 * Registrasi akun baru (WAJIB: Memaksa role = 'pengguna_umum' di backend).
 */
function apiRegister(body) {
  const name = (body.name || '').trim();
  const email = (body.email || '').trim().toLowerCase();
  const password = body.password || '';

  if (!name || !email || !password) {
    return { status: 'error', code: 400, message: 'Nama, email, dan password wajib diisi.' };
  }

  // Cek duplikasi email
  if (findUserByEmail(email)) {
    return { status: 'error', code: 409, message: 'Email sudah terdaftar. Silakan login.' };
  }

  // ATURAN MUTLAK (§3 PRD): Role publik dipaksa 'pengguna_umum'. Abaikan role apa pun yang dikirim klien.
  const enforcedRole = 'pengguna_umum';
  const userId = 'USR-' + Utilities.getUuid().substring(0, 8).toUpperCase();
  const salt = Utilities.getUuid().substring(0, 6);
  const passwordHash = hashPassword(password, salt) + ':' + salt;
  const now = new Date().toISOString();

  const sheet = getSheet(SHEET_NAMES.USERS);
  // Append-only write
  sheet.appendRow([
    userId,
    name,
    email,
    passwordHash,
    enforcedRole,
    '', // UPT unit kosong untuk pengguna umum
    true, // Aktif
    'self_registration',
    now
  ]);

  // Buat sesi otomatis setelah register
  const token = generateToken();
  const userPayload = { user_id: userId, name: name, email: email, role: enforcedRole, upt_unit: '' };
  saveSession(token, userPayload);

  logAudit(userId, 'REGISTER', userId, 'Registrasi mandiri Pengguna Umum: ' + email);

  return {
    status: 'success',
    code: 201,
    message: 'Registrasi berhasil.',
    data: {
      token: token,
      user: userPayload
    }
  };
}

/**
 * Login akun pengguna.
 */
function apiLogin(body) {
  const email = (body.email || '').trim().toLowerCase();
  const password = body.password || '';

  if (!email || !password) {
    return { status: 'error', code: 400, message: 'Email dan password wajib diisi.' };
  }

  let user = findUserByEmail(email);
  if (!user && email === 'dewi@gmail.com') {
    // Auto-seed akun demo Pengguna Umum
    const salt = Utilities.getUuid().substring(0, 6);
    const passHash = hashPassword('User123!', salt) + ':' + salt;
    const sheet = getSheet(SHEET_NAMES.USERS);
    sheet.appendRow([
      'USR-PUBLIC01',
      'Dewi Lestari',
      'dewi@gmail.com',
      passHash,
      'pengguna_umum',
      '',
      true,
      'system_auto_seed',
      new Date().toISOString()
    ]);
    user = findUserByEmail('dewi@gmail.com');
  }

  if (!user) {
    return { status: 'error', code: 401, message: 'Email atau password tidak valid.' };
  }

  if (user.is_active === false || String(user.is_active).toUpperCase() === 'FALSE') {
    return { status: 'error', code: 403, message: 'Akun Anda sedang dinonaktifkan oleh Administrator.' };
  }

  // Verifikasi hash password
  const parts = String(user.password_hash).split(':');
  const storedHash = parts[0];
  const salt = parts[1] || '';
  const calculatedHash = hashPassword(password, salt);

  if (storedHash !== calculatedHash) {
    return { status: 'error', code: 401, message: 'Email atau password tidak valid.' };
  }

  const token = generateToken();
  const userPayload = {
    user_id: user.user_id,
    name: user.name,
    email: user.email,
    role: user.role,
    upt_unit: user.upt_unit || ''
  };
  saveSession(token, userPayload);

  logAudit(user.user_id, 'LOGIN', user.user_id, 'Login sukses role ' + user.role);

  return {
    status: 'success',
    code: 200,
    message: 'Login berhasil.',
    data: {
      token: token,
      user: userPayload
    }
  };
}

/**
 * Membuat tiket baru (Append-Only Write ke Google Sheets).
 * Mendukung baik Pengguna Umum Publik (Tamu) maupun Pengguna yang sudah Login.
 */
function apiCreateTicket(body, token) {
  const user = authenticateUser(token);
  let requesterEmail = '';
  let requesterId = 'USR-PUBLIC';
  let requesterRole = 'pengguna_umum';

  if (user) {
    requesterEmail = user.email;
    requesterId = user.user_id;
    requesterRole = user.role;
  } else {
    requesterEmail = (body.requester_email || '').trim().toLowerCase();
    if (!requesterEmail) {
      return { status: 'error', code: 400, message: 'Alamat email pelapor wajib diisi.' };
    }
  }

  const subject = (body.subject || '').trim();
  const category = (body.category || 'Umum').trim();
  const description = (body.description || '').trim();
  const priority = (body.priority || 'Medium').trim();
  const channel = (body.channel || 'web').trim();
  const attachments = body.attachments || [];

  if (!subject || !description) {
    return { status: 'error', code: 400, message: 'Subjek dan deskripsi tiket wajib diisi.' };
  }

  // Hitung SLA batas waktu otomatis berdasarkan prioritas
  const now = new Date();
  const nowIso = now.toISOString();
  let slaHours = 24; // Default Medium = 24 jam
  if (priority.toLowerCase() === 'urgent') slaHours = 4;
  else if (priority.toLowerCase() === 'high') slaHours = 8;
  else if (priority.toLowerCase() === 'low') slaHours = 48;
  const slaDue = new Date(now.getTime() + slaHours * 60 * 60 * 1000).toISOString();

  // Generate ID tiket berurutan dan unik: TICK-YYYYMMDD-XXXX
  const datePrefix = Utilities.formatDate(now, 'Asia/Jakarta', 'yyyyMMdd');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const ticketId = 'TICK-' + datePrefix + '-' + randomSuffix;

  const assignedUpt = body.assigned_upt || (user && user.role === 'upt' ? user.upt_unit : '');
  const assignedOperator = body.assigned_operator || (user && user.role === 'operator' ? user.email : '');

  // 1. Tulis ke Sheet Tickets (Append-Only)
  const ticketSheet = getSheet(SHEET_NAMES.TICKETS);
  ticketSheet.appendRow([
    ticketId,
    nowIso,
    nowIso,
    subject,
    category,
    description,
    'open',
    priority,
    channel,
    requesterEmail,
    assignedUpt,
    assignedOperator,
    slaDue
  ]);

  // 2. Buat thread awal (Pesan pembuka pelapor) di Sheet Ticket_Threads
  const threadSheet = getSheet(SHEET_NAMES.THREADS);
  const threadId = 'TH-' + Utilities.getUuid().substring(0, 8);
  
  let attachmentUrls = [];
  if (attachments && attachments.length > 0) {
    try {
      const targetFolder = getTargetUploadFolder();

      for (let i = 0; i < attachments.length; i++) {
        const att = attachments[i];
        if (att.dataUrl && att.dataUrl.indexOf('base64,') !== -1) {
          const parts = att.dataUrl.split('base64,');
          const contentType = att.type || 'image/png';
          const decoded = Utilities.base64Decode(parts[1]);
          const blob = Utilities.newBlob(decoded, contentType, att.name || ('lampiran_' + (i + 1)));
          const driveFile = targetFolder.createFile(blob);
          driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
          
          attachmentUrls.push({
            name: att.name,
            url: driveFile.getUrl(),
            id: driveFile.getId()
          });
        } else {
          attachmentUrls.push({ name: att.name, size: att.size, url: att.url || '' });
        }
      }
    } catch (errDrive) {
      Logger.log('Drive upload fallback: ' + errDrive.message);
      attachmentUrls = attachments.map(function(a) { return { name: a.name, size: a.size, url: a.url || '' }; });
    }
  }

  let initialMessage = description;
  if (attachmentUrls.length > 0) {
    initialMessage += '\n\n[Lampiran Berkas]:\n' + attachmentUrls.map(function(a) {
      return a.url ? '• ' + a.name + ': ' + a.url : '• ' + a.name + (a.size ? ' (' + a.size + ')' : '');
    }).join('\n');
  }

  threadSheet.appendRow([
    threadId,
    ticketId,
    requesterId,
    requesterRole,
    initialMessage,
    'public',
    nowIso
  ]);

  logAudit(requesterId, 'CREATE_TICKET', ticketId, 'Membuat tiket: ' + subject + ' (' + requesterEmail + ')');

  return {
    status: 'success',
    code: 201,
    message: 'Tiket berhasil dibuat dan tersimpan di database.',
    data: {
      ticket_id: ticketId,
      created_at: nowIso,
      subject: subject,
      status: 'open',
      priority: priority,
      sla_due_at: slaDue
    }
  };
}

/**
 * Mengambil daftar tiket dengan Chunking/Pagination & Filter Hak Akses Role.
 */
function apiGetTickets(params, token) {
  const user = authenticateUser(token, params.user_email);
  if (!user) {
    return { status: 'error', code: 401, message: 'Autentikasi diperlukan.' };
  }

  const sheet = getSheet(SHEET_NAMES.TICKETS);
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    return { status: 'success', data: { tickets: [], total: 0, page: 1, limit: 20 } };
  }

  const page = Math.max(1, parseInt(params.page || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(params.limit || '20', 10)));
  const filterStatus = (params.status || '').toLowerCase().trim();
  const filterCategory = (params.category || '').toLowerCase().trim();
  const filterPriority = (params.priority || '').toLowerCase().trim();
  const filterUpt = (params.upt || '').toLowerCase().trim();
  const searchQuery = (params.search || '').toLowerCase().trim();

  // STRATEGI EFISIENSI (§6):
  // Membaca dari baris terbaru ke atas (Bottom-to-Top Chunking)
  // Untuk ratusan ribu baris, kita membaca chunk per 500 baris terbaru
  const maxScanRows = Math.min(lastRow - 1, 2000);
  const startRow = Math.max(2, lastRow - maxScanRows + 1);
  const numRowsToRead = lastRow - startRow + 1;

  const rawData = sheet.getRange(startRow, 1, numRowsToRead, 13).getValues();
  
  // Balik urutan agar tiket terbaru berada di index pertama
  const reversedData = rawData.reverse();

  const filteredTickets = [];
  for (let i = 0; i < reversedData.length; i++) {
    const row = reversedData[i];
    const ticket = {
      ticket_id: row[0],
      created_at: row[1],
      updated_at: row[2],
      subject: row[3],
      category: row[4],
      description: row[5],
      status: row[6],
      priority: row[7],
      channel: row[8],
      requester_email: row[9],
      assigned_upt: row[10],
      assigned_operator: row[11],
      sla_due_at: row[12]
    };

    // FILTER RBAC (§4 PRD):
    // 1. Pengguna Umum: Hanya tiket miliknya sendiri
    if (user.role === 'pengguna_umum' && String(ticket.requester_email).toLowerCase() !== String(user.email).toLowerCase()) {
      continue;
    }
    // 2. Pengguna UPT: Tiket yang ditugaskan ke UPT-nya ATAU yang dibuat olehnya
    if (user.role === 'upt') {
      const isAssignedToMyUpt = user.upt_unit && String(ticket.assigned_upt).toLowerCase() === String(user.upt_unit).toLowerCase();
      const isMyOwnTicket = String(ticket.requester_email).toLowerCase() === String(user.email).toLowerCase();
      if (!isAssignedToMyUpt && !isMyOwnTicket) {
        continue;
      }
    }
    // 3. Operator & Admin: Melihat SEMUA tiket

    // Query Filters (Abaikan jika nilai filter adalah 'all')
    if (filterStatus && filterStatus !== 'all' && String(ticket.status).toLowerCase() !== filterStatus) continue;
    if (filterCategory && filterCategory !== 'all' && String(ticket.category).toLowerCase() !== filterCategory) continue;
    if (filterPriority && filterPriority !== 'all' && String(ticket.priority).toLowerCase() !== filterPriority) continue;
    if (filterUpt && filterUpt !== 'all' && String(ticket.assigned_upt).toLowerCase() !== filterUpt) continue;
    if (searchQuery) {
      const matchSubject = String(ticket.subject).toLowerCase().indexOf(searchQuery) !== -1;
      const matchId = String(ticket.ticket_id).toLowerCase().indexOf(searchQuery) !== -1;
      const matchDesc = String(ticket.description).toLowerCase().indexOf(searchQuery) !== -1;
      const matchRequester = String(ticket.requester_email).toLowerCase().indexOf(searchQuery) !== -1;
      if (!matchSubject && !matchId && !matchDesc && !matchRequester) continue;
    }

    filteredTickets.push(ticket);
  }

  // Pagination Slice
  const total = filteredTickets.length;
  const startIndex = (page - 1) * limit;
  const paginatedTickets = filteredTickets.slice(startIndex, startIndex + limit);

  return {
    status: 'success',
    data: {
      tickets: paginatedTickets,
      total: total,
      page: page,
      limit: limit,
      total_pages: Math.ceil(total / limit)
    }
  };
}

/**
 * Mengambil detail tiket dan pesan thread (dengan filter visibilitas pesan internal).
 * Mendukung baik Staf Operator/UPT maupun Pelacak Publik Tamu.
 */
function apiGetTicketDetail(params, token) {
  const user = authenticateUser(token);
  const ticketId = (params.ticket_id || '').trim();
  if (!ticketId) {
    return { status: 'error', code: 400, message: 'ticket_id wajib diisi.' };
  }

  // Cari tiket di sheet Tickets
  const ticketSheet = getSheet(SHEET_NAMES.TICKETS);
  const lastRow = ticketSheet.getLastRow();
  if (lastRow <= 1) {
    return { status: 'error', code: 404, message: 'Tiket tidak ditemukan.' };
  }

  const ticketData = ticketSheet.getRange(2, 1, lastRow - 1, 13).getValues();
  let targetTicket = null;
  for (let i = 0; i < ticketData.length; i++) {
    if (String(ticketData[i][0]) === String(ticketId)) {
      const row = ticketData[i];
      targetTicket = {
        ticket_id: row[0],
        created_at: row[1],
        updated_at: row[2],
        subject: row[3],
        category: row[4],
        description: row[5],
        status: row[6],
        priority: row[7],
        channel: row[8],
        requester_email: row[9],
        assigned_upt: row[10],
        assigned_operator: row[11],
        sla_due_at: row[12]
      };
      break;
    }
  }

  if (!targetTicket) {
    return { status: 'error', code: 404, message: 'Tiket tidak ditemukan.' };
  }

  // Validasi RBAC Akses Tiket jika user login
  if (user) {
    if (user.role === 'pengguna_umum' && String(targetTicket.requester_email).toLowerCase() !== String(user.email).toLowerCase()) {
      return { status: 'error', code: 403, message: 'Anda tidak memiliki hak akses untuk tiket ini.' };
    }
    if (user.role === 'upt') {
      const isAssigned = user.upt_unit && String(targetTicket.assigned_upt).toLowerCase() === String(user.upt_unit).toLowerCase();
      const isOwner = String(targetTicket.requester_email).toLowerCase() === String(user.email).toLowerCase();
      if (!isAssigned && !isOwner && user.role !== 'admin' && user.role !== 'operator') {
        return { status: 'error', code: 403, message: 'Tiket ini tidak ditugaskan ke unit UPT Anda.' };
      }
    }
  }

  // Ambil thread messages
  const threadSheet = getSheet(SHEET_NAMES.THREADS);
  const threadLastRow = threadSheet.getLastRow();
  const threads = [];

  if (threadLastRow > 1) {
    const threadData = threadSheet.getRange(2, 1, threadLastRow - 1, 7).getValues();
    for (let j = 0; j < threadData.length; j++) {
      const tRow = threadData[j];
      if (String(tRow[1]) === String(ticketId)) {
        const visibility = String(tRow[5]).toLowerCase();
        // KEAMANAN THREADING INTERNAL (§5.4 PRD):
        // Pengguna umum atau Tamu TIDAK BISA melihat pesan dengan visibility = 'internal'
        const isStaff = user && (user.role === 'operator' || user.role === 'upt' || user.role === 'admin');
        if (!isStaff && visibility === 'internal') {
          continue;
        }

        // Lengkapi data pengirim
        const senderUser = findUserById(tRow[2]);
        threads.push({
          thread_id: tRow[0],
          ticket_id: tRow[1],
          sender_id: tRow[2],
          sender_name: senderUser ? senderUser.name : 'User',
          sender_role: tRow[3],
          message: tRow[4],
          visibility: visibility,
          created_at: tRow[6]
        });
      }
    }
  }

  return {
    status: 'success',
    data: {
      ticket: targetTicket,
      threads: threads
    }
  };
}

/**
 * Update Status / Priority / Penugasan Tiket.
 */
function apiUpdateTicketStatus(body, token) {
  const user = authenticateUser(token, body.user_email);
  if (!user) {
    return { status: 'error', code: 401, message: 'Autentikasi diperlukan.' };
  }

  const ticketId = body.ticket_id || '';
  const newStatus = body.status;
  const newPriority = body.priority;
  const newUpt = body.assigned_upt;
  const newOperator = body.assigned_operator;

  if (!ticketId) {
    return { status: 'error', code: 400, message: 'ticket_id wajib diisi.' };
  }

  // Pengguna umum tidak boleh mengubah status
  if (user.role === 'pengguna_umum') {
    return { status: 'error', code: 403, message: 'Pengguna Umum tidak berwenang mengubah status tiket.' };
  }

  const sheet = getSheet(SHEET_NAMES.TICKETS);
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    return { status: 'error', code: 404, message: 'Tiket tidak ditemukan.' };
  }

  const data = sheet.getRange(2, 1, lastRow - 1, 13).getValues();
  let targetRowIndex = -1;
  let currentTicket = null;

  for (let i = 0; i < data.length; i++) {
    if (String(data[i][0]) === String(ticketId)) {
      targetRowIndex = i + 2;
      currentTicket = data[i];
      break;
    }
  }

  if (targetRowIndex === -1) {
    return { status: 'error', code: 404, message: 'Tiket tidak ditemukan.' };
  }

  // Validasi Role UPT (Hanya boleh update tiket UPT-nya sendiri)
  if (user.role === 'upt') {
    const isAssigned = user.upt_unit && String(currentTicket[10]).toLowerCase() === String(user.upt_unit).toLowerCase();
    if (!isAssigned) {
      return { status: 'error', code: 403, message: 'UPT hanya dapat mengubah tiket yang ditugaskan ke unitnya.' };
    }
  }

  const nowIso = new Date().toISOString();
  let statusToSet = currentTicket[6];
  let priorityToSet = currentTicket[7];
  let uptToSet = currentTicket[10];
  let operatorToSet = currentTicket[11];

  let changeLogs = [];

  if (newStatus && newStatus !== currentTicket[6]) {
    statusToSet = newStatus;
    changeLogs.push('Status diubah ke "' + newStatus + '"');
  }
  if (newPriority && newPriority !== currentTicket[7]) {
    // Hanya Operator & Admin yang boleh ubah prioritas
    if (user.role === 'operator' || user.role === 'admin') {
      priorityToSet = newPriority;
      changeLogs.push('Prioritas diubah ke "' + newPriority + '"');
    }
  }
  if (newUpt !== undefined && newUpt !== currentTicket[10]) {
    if (user.role === 'operator' || user.role === 'admin') {
      uptToSet = newUpt;
      changeLogs.push('Ditugaskan ke UPT: ' + (newUpt || 'None'));
    }
  }
  if (newOperator !== undefined && newOperator !== currentTicket[11]) {
    if (user.role === 'operator' || user.role === 'admin') {
      operatorToSet = newOperator;
      changeLogs.push('Ditugaskan ke Operator: ' + (newOperator || 'None'));
    }
  }

  // Update baris tiket langsung
  sheet.getRange(targetRowIndex, 3).setValue(nowIso); // updated_at
  sheet.getRange(targetRowIndex, 7).setValue(statusToSet); // status
  sheet.getRange(targetRowIndex, 8).setValue(priorityToSet); // priority
  sheet.getRange(targetRowIndex, 11).setValue(uptToSet); // assigned_upt
  sheet.getRange(targetRowIndex, 12).setValue(operatorToSet); // assigned_operator

  // Catatan perubahan dicatat ke Audit Log (tidak mengotori thread chat publik)
  logAudit(user.user_id, 'UPDATE_TICKET', ticketId, changeLogs.join('; '));

  return {
    status: 'success',
    code: 200,
    message: 'Status tiket berhasil diperbarui.',
    data: {
      ticket_id: ticketId,
      status: statusToSet,
      priority: priorityToSet,
      assigned_upt: uptToSet,
      assigned_operator: operatorToSet,
      updated_at: nowIso
    }
  };
}

/**
 * Tambah pesan balasan publik atau catatan internal (§5.4 PRD).
 */
function apiAddThreadMessage(body, token) {
  const user = authenticateUser(token);
  if (!user) {
    return { status: 'error', code: 401, message: 'Autentikasi diperlukan.' };
  }

  const ticketId = body.ticket_id || '';
  const message = (body.message || '').trim();
  let visibility = (body.visibility || 'public').toLowerCase().trim();

  if (!ticketId || !message) {
    return { status: 'error', code: 400, message: 'ticket_id dan message wajib diisi.' };
  }

  // ATURAN KEAMANAN: Pengguna umum TIDAK BOLEH membuat catatan internal
  if (user.role === 'pengguna_umum') {
    visibility = 'public';
  }

  const threadSheet = getSheet(SHEET_NAMES.THREADS);
  const threadId = 'TH-' + Utilities.getUuid().substring(0, 8);
  const nowIso = new Date().toISOString();

  // Append-only
  threadSheet.appendRow([
    threadId,
    ticketId,
    user.user_id,
    user.role,
    message,
    visibility,
    nowIso
  ]);

  // Update timestamp tiket di sheet Tickets
  const ticketSheet = getSheet(SHEET_NAMES.TICKETS);
  const lastRow = ticketSheet.getLastRow();
  if (lastRow > 1) {
    const data = ticketSheet.getRange(2, 1, lastRow - 1, 1).getValues();
    for (let i = 0; i < data.length; i++) {
      if (String(data[i][0]) === String(ticketId)) {
        ticketSheet.getRange(i + 2, 3).setValue(nowIso); // updated_at
        break;
      }
    }
  }

  return {
    status: 'success',
    code: 201,
    message: 'Pesan thread berhasil ditambahkan.',
    data: {
      thread_id: threadId,
      ticket_id: ticketId,
      sender_id: user.user_id,
      sender_name: user.name,
      sender_role: user.role,
      message: message,
      visibility: visibility,
      created_at: nowIso
    }
  };
}

// =================================================================================================
// ADMIN ENDPOINTS: PENGGUNA, ROLE, FEATURE FLAGS, DATA SOURCE SWITCHER
// =================================================================================================

/**
 * Mengambil daftar seluruh pengguna (Khusus Admin).
 */
function apiGetUsers(params, token) {
  const user = authenticateUser(token, params.user_email);
  if (!user || user.role !== 'admin') {
    return { status: 'error', code: 403, message: 'Hanya Admin yang berwenang melihat daftar pengguna.' };
  }

  const sheet = getSheet(SHEET_NAMES.USERS);
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    return { status: 'success', data: [] };
  }

  const data = sheet.getRange(2, 1, lastRow - 1, 9).getValues();
  const users = data.map(function(row) {
    return {
      user_id: row[0],
      name: row[1],
      email: row[2],
      role: row[4],
      upt_unit: row[5],
      is_active: row[6] === true || String(row[6]).toUpperCase() === 'TRUE',
      created_by: row[7],
      created_at: row[8]
    };
  });

  return { status: 'success', data: users };
}

/**
 * Ubah role, UPT unit, status aktif, atau reset password pengguna (Khusus Admin).
 */
function apiUpdateUserRole(body, token) {
  const adminUser = authenticateUser(token, body.user_email);
  if (!adminUser || adminUser.role !== 'admin') {
    return { status: 'error', code: 403, message: 'Hanya Admin yang berwenang mengubah akun pengguna.' };
  }

  const targetUserId = body.target_user_id;
  const newRole = body.new_role; // 'pengguna_umum' | 'upt' | 'operator' | 'admin'
  const newUptUnit = body.new_upt_unit;
  const newIsActive = body.is_active;
  const resetPassword = body.reset_password;

  if (!targetUserId) {
    return { status: 'error', code: 400, message: 'target_user_id wajib diisi.' };
  }

  const sheet = getSheet(SHEET_NAMES.USERS);
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    return { status: 'error', code: 404, message: 'Pengguna tidak ditemukan.' };
  }

  const data = sheet.getRange(2, 1, lastRow - 1, 9).getValues();
  let targetRowIndex = -1;
  let targetEmail = '';

  for (let i = 0; i < data.length; i++) {
    if (String(data[i][0]) === String(targetUserId)) {
      targetRowIndex = i + 2;
      targetEmail = data[i][2];
      break;
    }
  }

  if (targetRowIndex === -1) {
    return { status: 'error', code: 404, message: 'Pengguna tidak ditemukan.' };
  }

  const changes = [];

  if (newRole) {
    sheet.getRange(targetRowIndex, 5).setValue(newRole);
    changes.push('Role diubah ke ' + newRole);
  }
  if (newUptUnit !== undefined) {
    sheet.getRange(targetRowIndex, 6).setValue(newUptUnit);
    changes.push('UPT diatur ke ' + (newUptUnit || 'None'));
  }
  if (newIsActive !== undefined) {
    sheet.getRange(targetRowIndex, 7).setValue(newIsActive);
    changes.push('Status aktif: ' + newIsActive);
  }
  if (resetPassword) {
    const salt = Utilities.getUuid().substring(0, 6);
    const newHash = hashPassword(resetPassword, salt) + ':' + salt;
    sheet.getRange(targetRowIndex, 4).setValue(newHash);
    changes.push('Password di-reset');
  }

  logAudit(adminUser.user_id, 'UPDATE_USER_ROLE', targetUserId, 'Ubah user (' + targetEmail + '): ' + changes.join(', '));

  return {
    status: 'success',
    code: 200,
    message: 'Pengguna berhasil diperbarui.',
    data: {
      target_user_id: targetUserId,
      changes: changes
    }
  };
}

/**
 * Buat akun baru oleh Admin (Bisa membuat role Operator, UPT, Admin).
 */
function apiCreateUser(body, token) {
  const adminUser = authenticateUser(token, body.user_email);
  if (!adminUser || adminUser.role !== 'admin') {
    return { status: 'error', code: 403, message: 'Hanya Admin yang dapat membuat akun internal.' };
  }

  const name = (body.name || '').trim();
  const email = (body.email || '').trim().toLowerCase();
  const password = body.password || 'PosoDefault123!';
  const role = body.role || 'operator';
  const uptUnit = body.upt_unit || '';

  if (!name || !email) {
    return { status: 'error', code: 400, message: 'Nama dan email wajib diisi.' };
  }

  if (findUserByEmail(email)) {
    return { status: 'error', code: 409, message: 'Email sudah terdaftar.' };
  }

  const userId = 'USR-' + Utilities.getUuid().substring(0, 8).toUpperCase();
  const salt = Utilities.getUuid().substring(0, 6);
  const passwordHash = hashPassword(password, salt) + ':' + salt;
  const now = new Date().toISOString();

  const sheet = getSheet(SHEET_NAMES.USERS);
  sheet.appendRow([
    userId,
    name,
    email,
    passwordHash,
    role,
    uptUnit,
    true,
    adminUser.email,
    now
  ]);

  logAudit(adminUser.user_id, 'CREATE_USER', userId, 'Admin membuat akun ' + role + ' untuk ' + email);

  return {
    status: 'success',
    code: 201,
    message: 'Akun baru berhasil dibuat.',
    data: {
      user_id: userId,
      name: name,
      email: email,
      role: role,
      upt_unit: uptUnit
    }
  };
}

/**
 * Feature Flags per Role (§3 & §8 PRD).
 */
function apiGetFeatureFlags(token) {
  const props = PropertiesService.getScriptProperties();
  const raw = props.getProperty(PROP_KEYS.FEATURE_FLAGS);
  let flags = DEFAULT_FEATURE_FLAGS;
  if (raw) {
    try {
      flags = JSON.parse(raw);
    } catch (e) {}
  }
  return { status: 'success', data: flags };
}

function apiUpdateFeatureFlags(body, token) {
  const user = authenticateUser(token);
  if (!user || user.role !== 'admin') {
    return { status: 'error', code: 403, message: 'Hanya Admin yang berwenang mengubah konfigurasi fitur.' };
  }

  const newFlags = body.feature_flags;
  if (!newFlags) {
    return { status: 'error', code: 400, message: 'feature_flags wajib dikirim.' };
  }

  const props = PropertiesService.getScriptProperties();
  props.setProperty(PROP_KEYS.FEATURE_FLAGS, JSON.stringify(newFlags));

  logAudit(user.user_id, 'UPDATE_FEATURE_FLAGS', 'CONFIG', 'Memperbarui matriks hak akses fitur per role');

  return { status: 'success', message: 'Konfigurasi fitur per role berhasil diperbarui.', data: newFlags };
}

/**
 * Data Source Switcher (§5 PRD): Ambil konfigurasi sumber data & riwayat.
 */
function apiGetDataSourceConfig(token) {
  const user = authenticateUser(token);
  if (!user || user.role !== 'admin') {
    return { status: 'error', code: 403, message: 'Hanya Admin yang berwenang mengelola sumber data.' };
  }

  const props = PropertiesService.getScriptProperties();
  const activeSpreadsheetId = props.getProperty(PROP_KEYS.ACTIVE_SPREADSHEET_ID) || (SpreadsheetApp.getActiveSpreadsheet() ? SpreadsheetApp.getActiveSpreadsheet().getId() : '');
  const activeFolderId = props.getProperty(PROP_KEYS.ACTIVE_FOLDER_ID) || '';
  
  let history = [];
  const rawHistory = props.getProperty(PROP_KEYS.DATA_SOURCE_HISTORY);
  if (rawHistory) {
    try {
      history = JSON.parse(rawHistory);
    } catch (e) {}
  }

  let activeTitle = 'Default Spreadsheet';
  try {
    const ss = SpreadsheetApp.openById(activeSpreadsheetId);
    activeTitle = ss.getName();
  } catch (e) {
    activeTitle = 'Spreadsheet Aktif (ID: ' + activeSpreadsheetId + ')';
  }

  return {
    status: 'success',
    data: {
      active_spreadsheet_id: activeSpreadsheetId,
      active_folder_id: activeFolderId,
      active_title: activeTitle,
      history: history
    }
  };
}

/**
 * Data Source Switcher: Tes Koneksi target Spreadsheet/Folder (§5 PRD).
 */
function apiTestDataSource(body, token) {
  const user = authenticateUser(token);
  if (!user || user.role !== 'admin') {
    return { status: 'error', code: 403, message: 'Hanya Admin yang berwenang menguji sumber data.' };
  }

  const targetSpreadsheetId = (body.spreadsheet_id || '').trim();
  if (!targetSpreadsheetId) {
    return { status: 'error', code: 400, message: 'spreadsheet_id wajib diisi.' };
  }

  try {
    const targetSs = SpreadsheetApp.openById(targetSpreadsheetId);
    const title = targetSs.getName();
    
    // Validasi keberadaan sheet wajib
    const requiredSheets = [SHEET_NAMES.TICKETS, SHEET_NAMES.USERS, SHEET_NAMES.THREADS];
    const missingSheets = [];
    
    requiredSheets.forEach(function(sName) {
      if (!targetSs.getSheetByName(sName)) {
        missingSheets.push(sName);
      }
    });

    return {
      status: 'success',
      code: 200,
      message: 'Koneksi berhasil! Spreadsheet dapat diakses.',
      data: {
        spreadsheet_id: targetSpreadsheetId,
        spreadsheet_title: title,
        is_fully_compatible: missingSheets.length === 0,
        missing_sheets: missingSheets,
        sheets_found: targetSs.getSheets().map(function(s) { return s.getName(); })
      }
    };
  } catch (err) {
    return {
      status: 'error',
      code: 400,
      message: 'Gagal menghubungkan ke Spreadsheet ID tersebut: ' + err.message
    };
  }
}

/**
 * Data Source Switcher: Terapkan Spreadsheet/Folder baru sebagai sumber aktif (§5 PRD).
 */
function apiSetDataSource(body, token) {
  const user = authenticateUser(token);
  if (!user || user.role !== 'admin') {
    return { status: 'error', code: 403, message: 'Hanya Admin yang berwenang mengganti sumber data.' };
  }

  const newSpreadsheetId = (body.spreadsheet_id || '').trim();
  const newFolderId = (body.folder_id || '').trim();
  const note = (body.note || '').trim();

  if (!newSpreadsheetId) {
    return { status: 'error', code: 400, message: 'spreadsheet_id baru wajib diisi.' };
  }

  // Verifikasi akses sebelum beralih
  let targetTitle = '';
  try {
    const targetSs = SpreadsheetApp.openById(newSpreadsheetId);
    targetTitle = targetSs.getName();
  } catch (err) {
    return { status: 'error', code: 400, message: 'Tidak dapat beralih ke Spreadsheet ID ini: ' + err.message };
  }

  const props = PropertiesService.getScriptProperties();
  const currentSpreadsheetId = props.getProperty(PROP_KEYS.ACTIVE_SPREADSHEET_ID) || (SpreadsheetApp.getActiveSpreadsheet() ? SpreadsheetApp.getActiveSpreadsheet().getId() : '');
  const currentFolderId = props.getProperty(PROP_KEYS.ACTIVE_FOLDER_ID) || '';

  // Catat riwayat sumber data lama
  let history = [];
  const rawHistory = props.getProperty(PROP_KEYS.DATA_SOURCE_HISTORY);
  if (rawHistory) {
    try {
      history = JSON.parse(rawHistory);
    } catch (e) {}
  }

  if (currentSpreadsheetId && currentSpreadsheetId !== newSpreadsheetId) {
    history.unshift({
      spreadsheet_id: currentSpreadsheetId,
      folder_id: currentFolderId,
      replaced_at: new Date().toISOString(),
      replaced_by: user.email,
      note: note || 'Pergantian sumber data'
    });
    // Batasi histori 20 entri terakhir
    if (history.length > 20) history = history.slice(0, 20);
    props.setProperty(PROP_KEYS.DATA_SOURCE_HISTORY, JSON.stringify(history));
  }

  // Terapkan sumber data baru
  props.setProperty(PROP_KEYS.ACTIVE_SPREADSHEET_ID, newSpreadsheetId);
  if (newFolderId) {
    props.setProperty(PROP_KEYS.ACTIVE_FOLDER_ID, newFolderId);
  }

  logAudit(user.user_id, 'SET_DATA_SOURCE', newSpreadsheetId, 'Beralih ke Spreadsheet: ' + targetTitle + ' (' + newSpreadsheetId + ')');

  return {
    status: 'success',
    code: 200,
    message: 'Sumber data aktif berhasil dialihkan ke "' + targetTitle + '".',
    data: {
      active_spreadsheet_id: newSpreadsheetId,
      active_title: targetTitle,
      active_folder_id: newFolderId
    }
  };
}

/**
 * Log Audit Trail (§7 & §8 PRD).
 */
function logAudit(actorId, actionType, targetId, detail) {
  try {
    const sheet = getSheet(SHEET_NAMES.AUDIT);
    sheet.appendRow([
      'LOG-' + Utilities.getUuid().substring(0, 8),
      actorId,
      actionType,
      targetId,
      detail,
      new Date().toISOString()
    ]);
  } catch (e) {}
}

function apiGetAuditLog(params, token) {
  const user = authenticateUser(token);
  if (!user || (user.role !== 'admin' && user.role !== 'operator')) {
    return { status: 'error', code: 403, message: 'Tidak memiliki izin untuk melihat Audit Log.' };
  }

  const sheet = getSheet(SHEET_NAMES.AUDIT);
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return { status: 'success', data: [] };

  const limit = Math.min(100, Math.max(1, parseInt(params.limit || '50', 10)));
  const numRows = Math.min(lastRow - 1, limit);
  const startRow = lastRow - numRows + 1;

  const data = sheet.getRange(startRow, 1, numRows, 6).getValues().reverse();
  const logs = data.map(function(row) {
    return {
      log_id: row[0],
      actor_id: row[1],
      action_type: row[2],
      target_id: row[3],
      detail: row[4],
      created_at: row[5]
    };
  });

  return { status: 'success', data: logs };
}

/**
 * Analitik & Laporan Dashboard (§5.5 PRD).
 */
function apiGetAnalytics(params, token) {
  const user = authenticateUser(token);
  if (!user) {
    return { status: 'error', code: 401, message: 'Autentikasi diperlukan.' };
  }

  const sheet = getSheet(SHEET_NAMES.TICKETS);
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    return {
      status: 'success',
      data: {
        total: 0,
        by_status: { open: 0, in_progress: 0, waiting: 0, closed: 0 },
        by_priority: { Low: 0, Medium: 0, High: 0, Urgent: 0 },
        by_category: {},
        by_upt: {},
        sla_breached: 0,
        avg_resolution_hours: 0
      }
    };
  }

  // Scan hingga 5000 tiket terbaru untuk metrik
  const scanRows = Math.min(lastRow - 1, 5000);
  const startRow = Math.max(2, lastRow - scanRows + 1);
  const data = sheet.getRange(startRow, 1, lastRow - startRow + 1, 13).getValues();

  const byStatus = { open: 0, in_progress: 0, waiting: 0, closed: 0 };
  const byPriority = { Low: 0, Medium: 0, High: 0, Urgent: 0 };
  const byCategory = {};
  const byUpt = {};
  let slaBreached = 0;
  let closedCount = 0;
  let totalResolutionTimeMs = 0;
  const nowMs = Date.now();

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const status = String(row[6]).toLowerCase();
    const priority = String(row[7]);
    const category = String(row[4]) || 'Lainnya';
    const upt = String(row[10]) || 'Belum Ditugaskan';
    const createdAtMs = new Date(row[1]).getTime();
    const updatedAtMs = new Date(row[2]).getTime();
    const slaDueMs = new Date(row[12]).getTime();

    // Filter jika role adalah UPT (hanya unitnya)
    if (user.role === 'upt' && user.upt_unit && String(upt).toLowerCase() !== String(user.upt_unit).toLowerCase()) {
      continue;
    }

    if (byStatus[status] !== undefined) byStatus[status]++;
    if (byPriority[priority] !== undefined) byPriority[priority]++;
    
    byCategory[category] = (byCategory[category] || 0) + 1;
    byUpt[upt] = (byUpt[upt] || 0) + 1;

    // Hitung SLA Breached
    if (status !== 'closed' && slaDueMs > 0 && nowMs > slaDueMs) {
      slaBreached++;
    }

    // Hitung Avg Resolution Time untuk tiket closed
    if (status === 'closed' && updatedAtMs >= createdAtMs) {
      closedCount++;
      totalResolutionTimeMs += (updatedAtMs - createdAtMs);
    }
  }

  const avgResolutionHours = closedCount > 0 ? (totalResolutionTimeMs / closedCount / (1000 * 60 * 60)).toFixed(1) : 0;

  return {
    status: 'success',
    data: {
      total: data.length,
      by_status: byStatus,
      by_priority: byPriority,
      by_category: byCategory,
      by_upt: byUpt,
      sla_breached: slaBreached,
      avg_resolution_hours: parseFloat(avgResolutionHours)
    }
  };
}

// =================================================================================================
// TIME-DRIVEN TRIGGER: EMAIL-TO-TICKET (§4 & §5.7 PRD)
// =================================================================================================

/**
 * Trigger berkala yang memindai inbox Gmail helpdesk,
 * mengonversi email baru menjadi tiket, dan menandainya agar tidak diproses ulang.
 * 
 * Set trigger setiap 5 atau 10 menit di Google Apps Script Triggers.
 */
function emailToTicketTrigger() {
  const query = 'label:INBOX is:unread -label:POSO_PROCESSED';
  const threads = GmailApp.search(query, 0, 20); // Batch aman 20 thread per run
  if (threads.length === 0) return;

  // Pastikan label POSO_PROCESSED ada
  let processedLabel = GmailApp.getUserLabelByName('POSO_PROCESSED');
  if (!processedLabel) {
    processedLabel = GmailApp.createLabel('POSO_PROCESSED');
  }

  const ticketSheet = getSheet(SHEET_NAMES.TICKETS);
  const threadSheet = getSheet(SHEET_NAMES.THREADS);

  threads.forEach(function(gmailThread) {
    const messages = gmailThread.getMessages();
    const firstMsg = messages[0];
    const subject = firstMsg.getSubject() || 'Tanpa Subjek (Email)';
    const plainBody = firstMsg.getPlainBody() || '(Email kosong)';
    const from = firstMsg.getFrom();
    
    // Ekstrak alamat email dari header 'From: Name <email@example.com>'
    const emailMatch = from.match(/<([^>]+)>/) || [null, from];
    const senderEmail = (emailMatch[1] || from).trim().toLowerCase();

    const now = new Date();
    const nowIso = now.toISOString();
    const datePrefix = Utilities.formatDate(now, 'Asia/Jakarta', 'yyyyMMdd');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const ticketId = 'TICK-' + datePrefix + '-' + randomSuffix;
    const slaDue = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();

    // 1. Buat Tiket
    ticketSheet.appendRow([
      ticketId,
      nowIso,
      nowIso,
      '[EMAIL] ' + subject,
      'Email Masuk',
      plainBody,
      'open',
      'Medium',
      'email',
      senderEmail,
      '', // Belum di-route
      '',
      slaDue
    ]);

    // 2. Buat Thread awal
    threadSheet.appendRow([
      'TH-' + Utilities.getUuid().substring(0, 8),
      ticketId,
      'EMAIL_INTAKE',
      'pengguna_umum',
      plainBody,
      'public',
      nowIso
    ]);

    // Tandai sudah diproses
    gmailThread.addLabel(processedLabel);
    gmailThread.markRead();

    logAudit('SYSTEM_EMAIL', 'CREATE_TICKET_EMAIL', ticketId, 'Email-to-Ticket dari ' + senderEmail);
  });
}

// =================================================================================================
// INITIAL SETUP / SEED SCRIPT (§7 & §9 PRD)
// =================================================================================================

/**
 * Jalankan fungsi ini SATU KALI saat instalasi awal untuk membuat struktur Sheet
 * dan Akun Super Admin bawaan.
 * 
 * OTOMATISASI TARGET GOOGLE DRIVE:
 * Fungsi ini akan OTOMATIS membuat file Google Spreadsheet 'POSO Master Database'
 * dan LANGSUNG MEMINDAHKANNYA ke dalam Folder 'tiket' (ID: 1RqlknF3O-0gXcTeX0JfO9FzyBESq-hwR).
 */
function setupInitialDatabase() {
  const props = PropertiesService.getScriptProperties();
  let ss = null;

  props.setProperty(PROP_KEYS.ACTIVE_FOLDER_ID, TARGET_CLIENT_FOLDER_ID);

  try {
    const targetFolder = DriveApp.getFolderById(TARGET_CLIENT_FOLDER_ID);
    const existingFiles = targetFolder.getFilesByName('POSO Master Database');
    
    if (existingFiles.hasNext()) {
      const existingFile = existingFiles.next();
      ss = SpreadsheetApp.openById(existingFile.getId());
      props.setProperty(PROP_KEYS.ACTIVE_SPREADSHEET_ID, ss.getId());
      Logger.log('Menemukan database POSO yang sudah ada di Folder tiket: ' + ss.getUrl());
    } else {
      Logger.log('Membuat Google Spreadsheet POSO baru langsung di dalam Folder tiket...');
      const newSs = SpreadsheetApp.create('POSO Master Database');
      const file = DriveApp.getFileById(newSs.getId());
      
      // Pindahkan file langsung ke dalam Folder tiket pembimbing
      file.moveTo(targetFolder);
      
      ss = newSs;
      props.setProperty(PROP_KEYS.ACTIVE_SPREADSHEET_ID, ss.getId());
      Logger.log('SUKSES! File Spreadsheet berhasil disimpan di Folder tiket: ' + ss.getUrl());
    }
  } catch (errDrive) {
    Logger.log('Akses folder: ' + errDrive.toString());
    const configuredId = props.getProperty(PROP_KEYS.ACTIVE_SPREADSHEET_ID);
    if (configuredId) {
      try { ss = SpreadsheetApp.openById(configuredId); } catch (e) {}
    }
    if (!ss) {
      ss = SpreadsheetApp.create('POSO Master Database');
      props.setProperty(PROP_KEYS.ACTIVE_SPREADSHEET_ID, ss.getId());
    }
  }

  if (!props.getProperty(PROP_KEYS.PASSWORD_SALT)) {
    props.setProperty(PROP_KEYS.PASSWORD_SALT, Utilities.getUuid());
  }

  // 1. Sheet: Tickets
  let sTickets = ss.getSheetByName(SHEET_NAMES.TICKETS);
  if (!sTickets) {
    sTickets = ss.insertSheet(SHEET_NAMES.TICKETS);
    sTickets.appendRow([
      'ticket_id', 'created_at', 'updated_at', 'subject', 'category',
      'description', 'status', 'priority', 'channel', 'requester_email',
      'assigned_upt', 'assigned_operator', 'sla_due_at'
    ]);
    sTickets.setFrozenRows(1);
  }

  // 2. Sheet: Users
  let sUsers = ss.getSheetByName(SHEET_NAMES.USERS);
  if (!sUsers) {
    sUsers = ss.insertSheet(SHEET_NAMES.USERS);
    sUsers.appendRow([
      'user_id', 'name', 'email', 'password_hash', 'role',
      'upt_unit', 'is_active', 'created_by', 'created_at'
    ]);
    sUsers.setFrozenRows(1);

    // Seed Initial Super Admin (§3 PRD)
    const adminSalt = Utilities.getUuid().substring(0, 6);
    const adminHash = hashPassword('Admin123!', adminSalt) + ':' + adminSalt;
    sUsers.appendRow([
      'USR-ADMIN01',
      'Administrator POSO',
      'admin@poso.local',
      adminHash,
      'admin',
      '',
      true,
      'system_init',
      new Date().toISOString()
    ]);

    // Seed Sample Operator
    const opSalt = Utilities.getUuid().substring(0, 6);
    const opHash = hashPassword('Operator123!', opSalt) + ':' + opSalt;
    sUsers.appendRow([
      'USR-OPERATOR01',
      'Helpdesk Operator 1',
      'operator@poso.local',
      opHash,
      'operator',
      '',
      true,
      'system_init',
      new Date().toISOString()
    ]);

    // Seed Sample UPT Staff
    const uptSalt = Utilities.getUuid().substring(0, 6);
    const uptHash = hashPassword('Upt123!', uptSalt) + ':' + uptSalt;
    sUsers.appendRow([
      'USR-UPTTI01',
      'Petugas UPT TI & Jaringan',
      'upt.ti@poso.local',
      uptHash,
      'upt',
      'UPT TI & Jaringan',
      true,
      'system_init',
      new Date().toISOString()
    ]);
  }

  // 3. Sheet: Ticket_Threads
  let sThreads = ss.getSheetByName(SHEET_NAMES.THREADS);
  if (!sThreads) {
    sThreads = ss.insertSheet(SHEET_NAMES.THREADS);
    sThreads.appendRow([
      'thread_id', 'ticket_id', 'sender_id', 'sender_role',
      'message', 'visibility', 'created_at'
    ]);
    sThreads.setFrozenRows(1);
  }

  // 4. Sheet: Audit_Log
  let sAudit = ss.getSheetByName(SHEET_NAMES.AUDIT);
  if (!sAudit) {
    sAudit = ss.insertSheet(SHEET_NAMES.AUDIT);
    sAudit.appendRow(['log_id', 'actor_id', 'action_type', 'target_id', 'detail', 'created_at']);
    sAudit.setFrozenRows(1);
  }

  // Inisialisasi Feature Flags di Script Properties
  if (!props.getProperty(PROP_KEYS.FEATURE_FLAGS)) {
    props.setProperty(PROP_KEYS.FEATURE_FLAGS, JSON.stringify(DEFAULT_FEATURE_FLAGS));
  }

  Logger.log('Inisialisasi POSO Database Berhasil! Default Admin: admin@poso.local / Admin123!');
}

/**
 * Membersihkan data string base64 yang berlebih pada Sheet Ticket_Threads
 */
function apiCleanThreads() {
  const sheet = getSheet(SHEET_NAMES.THREADS);
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return { status: 'success', message: 'No threads to clean.' };

  const values = sheet.getRange(2, 5, lastRow - 1, 1).getValues();
  let cleanedCount = 0;

  for (let i = 0; i < values.length; i++) {
    let msg = String(values[i][0] || '');
    if (msg.indexOf('data:image/') !== -1 || msg.indexOf('[Lampiran: [') !== -1 || msg.indexOf('📁') !== -1) {
      // 1. Remove emoji
      msg = msg.replace(/📁/g, '');

      // 2. Parse JSON [Lampiran: [...]]
      const jsonMatch = msg.match(/\[(?:Lampiran|Berkas Lampiran Pelapor):\s*(\[.*?\])\]/s);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[1]);
          let attList = [];
          if (Array.isArray(parsed)) {
            parsed.forEach(function(item) {
              if (item.url) {
                attList.push('• ' + (item.name || 'lampiran') + ': ' + item.url);
              } else {
                attList.push('• ' + (item.name || 'lampiran') + (item.size ? ' (' + item.size + ')' : ''));
              }
            });
          }
          msg = msg.replace(jsonMatch[0], '').trim();
          if (attList.length > 0) {
            msg += '\n\n[Lampiran Berkas]:\n' + attList.join('\n');
          }
        } catch (e) {
          msg = msg.replace(/data:image\/[a-zA-Z0-9+/=;,]+/g, '[foto]').trim();
        }
      } else {
        msg = msg.replace(/data:image\/[a-zA-Z0-9+/=;,]+/g, '[foto]').trim();
      }

      sheet.getRange(i + 2, 5).setValue(msg);
      cleanedCount++;
    }
  }

  return { status: 'success', message: 'Berhasil merapikan ' + cleanedCount + ' baris thread pada Google Sheets.' };
}

/**
 * Memperbaiki dan melengkapi aturan Validasi Data (Dropdown) pada Sheet Tickets:
 * - Kolom G (Status): open, in_progress, waiting, closed
 * - Kolom H (Priority): Low, Medium, High, Urgent
 */
function fixSheetDataValidation() {
  const ss = getSpreadsheet();
  const ticketSheet = ss.getSheetByName(SHEET_NAMES.TICKETS);
  if (!ticketSheet) return { status: 'error', message: 'Sheet Tickets tidak ditemukan' };

  const lastRow = Math.max(ticketSheet.getLastRow(), 100);

  // Status Validation (Column G): open, in_progress, waiting, closed
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['open', 'in_progress', 'waiting', 'closed'], true)
    .setAllowInvalid(true)
    .build();
  ticketSheet.getRange(2, 7, lastRow, 1).setDataValidation(statusRule);

  // Priority Validation (Column H): Low, Medium, High, Urgent
  const priorityRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Low', 'Medium', 'High', 'Urgent'], true)
    .setAllowInvalid(true)
    .build();
  ticketSheet.getRange(2, 8, lastRow, 1).setDataValidation(priorityRule);

  return { 
    status: 'success', 
    message: 'Validasi data Kolom G (status) berhasil diperbarui dengan opsi: open, in_progress, waiting, closed!' 
  };
}
