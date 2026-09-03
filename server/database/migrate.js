import { pool } from '../config/db.js';
import { hashPassword } from '../utils/auth.js';

const SCHEMA_SQL = `
-- 1. Tabel users
CREATE TABLE IF NOT EXISTS users (
  user_id VARCHAR(50) NOT NULL,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  password_plain VARCHAR(255) DEFAULT NULL,
  role ENUM('admin', 'operator', 'upt', 'pengguna_umum') NOT NULL DEFAULT 'pengguna_umum',
  upt_unit VARCHAR(100) DEFAULT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  nip VARCHAR(50) DEFAULT NULL,
  department VARCHAR(150) DEFAULT NULL,
  role_title VARCHAR(150) DEFAULT NULL,
  avatar_url TEXT DEFAULT NULL,
  jabatan_fungsional VARCHAR(150) DEFAULT NULL,
  kantor_penempatan VARCHAR(150) DEFAULT NULL,
  phone_number VARCHAR(30) DEFAULT NULL,
  nopen_kc VARCHAR(20) DEFAULT NULL,
  nama_kc VARCHAR(100) DEFAULT NULL,
  nopen_kcu VARCHAR(20) DEFAULT NULL,
  nama_kcu VARCHAR(100) DEFAULT NULL,
  regional_code VARCHAR(20) DEFAULT NULL,
  regional_name VARCHAR(100) DEFAULT NULL,
  created_by VARCHAR(150) DEFAULT 'system',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  UNIQUE KEY uk_users_email (email),
  KEY idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabel tickets
CREATE TABLE IF NOT EXISTS tickets (
  ticket_id VARCHAR(50) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  department VARCHAR(150) DEFAULT NULL,
  topic VARCHAR(150) DEFAULT NULL,
  location VARCHAR(150) DEFAULT NULL,
  description TEXT NOT NULL,
  priority ENUM('Low', 'Medium', 'High', 'Urgent') NOT NULL DEFAULT 'Medium',
  status ENUM('open', 'in_progress', 'waiting', 'closed') NOT NULL DEFAULT 'open',
  channel ENUM('web', 'email') NOT NULL DEFAULT 'web',
  requester_name VARCHAR(150) DEFAULT NULL,
  requester_email VARCHAR(150) NOT NULL,
  requester_phone VARCHAR(30) DEFAULT NULL,
  assigned_upt VARCHAR(100) DEFAULT NULL,
  assigned_operator VARCHAR(150) DEFAULT NULL,
  sla_due_at DATETIME DEFAULT NULL,
  closed_at DATETIME DEFAULT NULL,
  is_archived TINYINT(1) NOT NULL DEFAULT 0,
  attachments JSON DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (ticket_id),
  KEY idx_tickets_status (status),
  KEY idx_tickets_priority (priority),
  KEY idx_tickets_category (category),
  KEY idx_tickets_requester_email (requester_email),
  KEY idx_tickets_assigned_upt (assigned_upt),
  KEY idx_tickets_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabel threads
CREATE TABLE IF NOT EXISTS threads (
  thread_id VARCHAR(50) NOT NULL,
  ticket_id VARCHAR(50) NOT NULL,
  sender_id VARCHAR(50) NOT NULL,
  sender_name VARCHAR(150) NOT NULL,
  sender_role VARCHAR(50) NOT NULL DEFAULT 'pengguna_umum',
  message TEXT NOT NULL,
  visibility ENUM('public', 'internal') NOT NULL DEFAULT 'public',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (thread_id),
  KEY idx_threads_ticket_id (ticket_id),
  KEY idx_threads_visibility (visibility),
  CONSTRAINT fk_threads_ticket FOREIGN KEY (ticket_id) REFERENCES tickets (ticket_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tabel audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
  log_id VARCHAR(50) NOT NULL,
  ticket_id VARCHAR(50) DEFAULT NULL,
  actor_id VARCHAR(50) DEFAULT NULL,
  actor_name VARCHAR(150) NOT NULL,
  actor_role VARCHAR(50) NOT NULL,
  action VARCHAR(100) NOT NULL,
  details TEXT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (log_id),
  KEY idx_audit_logs_ticket_id (ticket_id),
  KEY idx_audit_logs_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Tabel system_config
CREATE TABLE IF NOT EXISTS system_config (
  config_key VARCHAR(100) NOT NULL,
  config_value JSON NOT NULL,
  description VARCHAR(255) DEFAULT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (config_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

export async function runMigration() {
  console.log('=================================================================');
  console.log('       POSO DATABASE MIGRATION ENGINE — AIVEN FOR MYSQL          ');
  console.log('=================================================================');
  
  const connection = await pool.getConnection();

  try {
    // 1. Eksekusi Schema DDL
    console.log('[1/4] Membuat struktur tabel relasional...');
    const tables = [
      `CREATE TABLE IF NOT EXISTS users (
        user_id VARCHAR(50) NOT NULL,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(150) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        password_plain VARCHAR(255) DEFAULT NULL,
        role ENUM('admin', 'operator', 'upt', 'pengguna_umum') NOT NULL DEFAULT 'pengguna_umum',
        upt_unit VARCHAR(100) DEFAULT NULL,
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        nip VARCHAR(50) DEFAULT NULL,
        department VARCHAR(150) DEFAULT NULL,
        role_title VARCHAR(150) DEFAULT NULL,
        avatar_url TEXT DEFAULT NULL,
        jabatan_fungsional VARCHAR(150) DEFAULT NULL,
        kantor_penempatan VARCHAR(150) DEFAULT NULL,
        phone_number VARCHAR(30) DEFAULT NULL,
        nopen_kc VARCHAR(20) DEFAULT NULL,
        nama_kc VARCHAR(100) DEFAULT NULL,
        nopen_kcu VARCHAR(20) DEFAULT NULL,
        nama_kcu VARCHAR(100) DEFAULT NULL,
        regional_code VARCHAR(20) DEFAULT NULL,
        regional_name VARCHAR(100) DEFAULT NULL,
        created_by VARCHAR(150) DEFAULT 'system',
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id),
        UNIQUE KEY uk_users_email (email),
        KEY idx_users_role (role)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      `CREATE TABLE IF NOT EXISTS tickets (
        ticket_id VARCHAR(50) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        department VARCHAR(150) DEFAULT NULL,
        topic VARCHAR(150) DEFAULT NULL,
        location VARCHAR(150) DEFAULT NULL,
        description TEXT NOT NULL,
        priority ENUM('Low', 'Medium', 'High', 'Urgent') NOT NULL DEFAULT 'Medium',
        status ENUM('open', 'in_progress', 'waiting', 'closed') NOT NULL DEFAULT 'open',
        channel ENUM('web', 'email') NOT NULL DEFAULT 'web',
        requester_name VARCHAR(150) DEFAULT NULL,
        requester_email VARCHAR(150) NOT NULL,
        requester_phone VARCHAR(30) DEFAULT NULL,
        assigned_upt VARCHAR(100) DEFAULT NULL,
        assigned_operator VARCHAR(150) DEFAULT NULL,
        sla_due_at DATETIME DEFAULT NULL,
        closed_at DATETIME DEFAULT NULL,
        is_archived TINYINT(1) NOT NULL DEFAULT 0,
        attachments JSON DEFAULT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (ticket_id),
        KEY idx_tickets_status (status),
        KEY idx_tickets_priority (priority),
        KEY idx_tickets_category (category),
        KEY idx_tickets_requester_email (requester_email),
        KEY idx_tickets_assigned_upt (assigned_upt),
        KEY idx_tickets_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      `CREATE TABLE IF NOT EXISTS threads (
        thread_id VARCHAR(50) NOT NULL,
        ticket_id VARCHAR(50) NOT NULL,
        sender_id VARCHAR(50) NOT NULL,
        sender_name VARCHAR(150) NOT NULL,
        sender_role VARCHAR(50) NOT NULL DEFAULT 'pengguna_umum',
        message TEXT NOT NULL,
        visibility ENUM('public', 'internal') NOT NULL DEFAULT 'public',
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (thread_id),
        KEY idx_threads_ticket_id (ticket_id),
        KEY idx_threads_visibility (visibility),
        CONSTRAINT fk_threads_ticket FOREIGN KEY (ticket_id) REFERENCES tickets (ticket_id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      `CREATE TABLE IF NOT EXISTS audit_logs (
        log_id VARCHAR(50) NOT NULL,
        ticket_id VARCHAR(50) DEFAULT NULL,
        actor_id VARCHAR(50) DEFAULT NULL,
        actor_name VARCHAR(150) NOT NULL,
        actor_role VARCHAR(50) NOT NULL,
        action VARCHAR(100) NOT NULL,
        details TEXT DEFAULT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (log_id),
        KEY idx_audit_logs_ticket_id (ticket_id),
        KEY idx_audit_logs_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      `CREATE TABLE IF NOT EXISTS system_config (
        config_key VARCHAR(100) NOT NULL,
        config_value JSON NOT NULL,
        description VARCHAR(255) DEFAULT NULL,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (config_key)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
    ];

    for (const sql of tables) {
      await connection.query(sql);
    }

    // Pastikan kolom password_plain ada pada tabel users jika tabel sudah dibuat sebelumnya
    try {
      const [userCols] = await connection.query("SHOW COLUMNS FROM users LIKE 'password_plain'");
      if (userCols.length === 0) {
        await connection.query("ALTER TABLE users ADD COLUMN password_plain VARCHAR(255) DEFAULT NULL AFTER password_hash");
        console.log('   ✓ Kolom password_plain berhasil ditambahkan ke tabel users.');
      }
    } catch (e) {
      console.warn('   Notice checking password_plain:', e.message);
    }

    // Pastikan kolom is_archived ada pada tabel tickets
    try {
      const [ticketCols] = await connection.query("SHOW COLUMNS FROM tickets LIKE 'is_archived'");
      if (ticketCols.length === 0) {
        await connection.query("ALTER TABLE tickets ADD COLUMN is_archived TINYINT(1) NOT NULL DEFAULT 0 AFTER closed_at");
        console.log('   ✓ Kolom is_archived berhasil ditambahkan ke tabel tickets.');
      }
    } catch (e) {
      console.warn('   Notice checking is_archived:', e.message);
    }

    console.log('   ✓ Tabel users, tickets, threads, audit_logs, system_config terverifikasi.');

    // 2. Migrasi / Seed Data Pengguna Master
    console.log('[2/4] Melakukan seeding data pengguna master...');
    const adminPass = await hashPassword('Admin123!');
    const opPass = await hashPassword('Operator123!');
    const uptTiPass = await hashPassword('Poso123!');
    const uptSarprasPass = await hashPassword('Poso123!');
    const userPass = await hashPassword('User123!');

    const seedUsers = [
      {
        user_id: 'USR-ADMIN01',
        name: 'Administrator POSO (Super Admin)',
        email: 'admin@poso.local',
        password_hash: adminPass,
        password_plain: 'Admin123!',
        role: 'admin',
        upt_unit: null,
        nip: '198801012015011001',
        department: 'Direktorat TI & Sistem Informasi',
        role_title: 'Head of Helpdesk Operation',
        kantor_penempatan: 'Kantor Pusat Bandung'
      },
      {
        user_id: 'USR-OPERATOR01',
        name: 'Siti Rahma (Helpdesk Lead)',
        email: 'operator@poso.local',
        password_hash: opPass,
        password_plain: 'Operator123!',
        role: 'operator',
        upt_unit: null,
        nip: '199203152018022003',
        department: 'Pengendalian Operasi',
        role_title: 'Customer Service Specialist',
        kantor_penempatan: 'Pusat Layanan Terpadu'
      },
      {
        user_id: 'USR-UPTTI01',
        name: 'Ahmad Fauzi (UPT TI & Sistem Informasi)',
        email: 'upt.ti@poso.local',
        password_hash: uptTiPass,
        password_plain: 'Poso123!',
        role: 'upt',
        upt_unit: 'UPT TI & Sistem Informasi',
        nip: '199008202016031005',
        department: 'Infrastruktur Jaringan',
        role_title: 'Network & System Engineer',
        kantor_penempatan: 'UPT TI Graha Pos'
      },
      {
        user_id: 'USR-UPTSARPRAS01',
        name: 'Rudi Hermawan (UPT Sarpras CGS)',
        email: 'upt.sarpras@poso.local',
        password_hash: uptSarprasPass,
        password_plain: 'Poso123!',
        role: 'upt',
        upt_unit: 'UPT Sarana & Prasarana (CGS)',
        nip: '198711252014021008',
        department: 'Pemeliharaan Fasilitas',
        role_title: 'Building & Facility Officer',
        kantor_penempatan: 'UPT Sarpras Gedung Pusat'
      },
      {
        user_id: 'USR-PUBLIC01',
        name: 'Dewi Lestari',
        email: 'dewi@gmail.com',
        password_hash: userPass,
        password_plain: 'User123!',
        role: 'pengguna_umum',
        upt_unit: null,
        nip: null,
        department: 'Pelapor Eksternal / Pengguna Umum',
        role_title: 'Pelapor Layanan',
        kantor_penempatan: 'Umum'
      }
    ];

    for (const u of seedUsers) {
      await connection.query(`
        INSERT INTO users (
          user_id, name, email, password_hash, password_plain, role, upt_unit, is_active,
          nip, department, role_title, kantor_penempatan, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, 'system_seed')
        ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          password_plain = VALUES(password_plain),
          role = VALUES(role),
          upt_unit = VALUES(upt_unit),
          nip = VALUES(nip),
          department = VALUES(department),
          role_title = VALUES(role_title),
          kantor_penempatan = VALUES(kantor_penempatan)
      `, [
        u.user_id, u.name, u.email, u.password_hash, u.password_plain, u.role, u.upt_unit,
        u.nip, u.department, u.role_title, u.kantor_penempatan
      ]);
    }
    console.log(`   ✓ ${seedUsers.length} master pengguna siap pakai.`);

    // 3. Migrasi / Seed Data Tiket Awal
    console.log('[3/4] Melakukan seeding data tiket & percakapan awal...');
    const seedTickets = [
      {
        ticket_id: 'TICK-20260831-1001',
        subject: 'Gangguan Akses Wi-Fi & LAN di Gedung B Lantai 3',
        category: 'Jaringan & Internet',
        description: 'Koneksi internet di ruangan 302 tiba-tiba terputus sejak pagi ini. Switch indikator lampu orange berkedip cepat.',
        priority: 'High',
        status: 'in_progress',
        channel: 'web',
        requester_name: 'Dewi Lestari',
        requester_email: 'dewi@gmail.com',
        assigned_upt: 'UPT TI & Jaringan',
        assigned_operator: 'operator@poso.local',
        sla_hours: 8
      },
      {
        ticket_id: 'TICK-20260831-1002',
        subject: 'AC Ruang Server Utama Bocor dan Menetes',
        category: 'Sarana & Prasarana',
        description: 'Unit AC split di ruang server utama mengeluarkan tetesan air dekat rak switch distribusi. Mohon penanganan darurat.',
        priority: 'Urgent',
        status: 'open',
        channel: 'web',
        requester_name: 'Bambang Staff',
        requester_email: 'bambang.staff@domain.com',
        assigned_upt: 'UPT Sarana & Prasarana',
        assigned_operator: 'operator@poso.local',
        sla_hours: 2
      },
      {
        ticket_id: 'TICK-20260831-1003',
        subject: 'Permintaan Reset Password Akun Portal Pegawai',
        category: 'Layanan Akun & Portal',
        description: 'Akun portal SIM pegawai saya terkunci karena salah memasukkan password 3 kali. Mohon bantuan reset password.',
        priority: 'Medium',
        status: 'waiting',
        channel: 'email',
        requester_name: 'Anita Staff',
        requester_email: 'anita.staff@domain.ac.id',
        assigned_upt: 'UPT TI & Jaringan',
        assigned_operator: 'operator@poso.local',
        sla_hours: 24
      },
      {
        ticket_id: 'TICK-20260831-1004',
        subject: 'Penggantian Toner Printer HP LaserJet Ruang Keuangan',
        category: 'Hardware & Komputer',
        description: 'Hasil cetak printer di bagian keuangan sudah buram dan tipis. Perlu penggantian cartridge toner baru.',
        priority: 'Low',
        status: 'closed',
        channel: 'web',
        requester_name: 'Dewi Lestari',
        requester_email: 'dewi@gmail.com',
        assigned_upt: 'UPT Sarana & Prasarana',
        assigned_operator: 'operator@poso.local',
        sla_hours: 72
      }
    ];

    for (const t of seedTickets) {
      const slaDate = new Date(Date.now() + t.sla_hours * 3600000);
      await connection.query(`
        INSERT INTO tickets (
          ticket_id, subject, category, description, priority, status, channel,
          requester_name, requester_email, assigned_upt, assigned_operator, sla_due_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          subject = VALUES(subject),
          category = VALUES(category),
          status = VALUES(status),
          priority = VALUES(priority)
      `, [
        t.ticket_id, t.subject, t.category, t.description, t.priority, t.status, t.channel,
        t.requester_name, t.requester_email, t.assigned_upt, t.assigned_operator, slaDate
      ]);
    }

    // Seed Threads
    const seedThreads = [
      {
        thread_id: 'TH-1001',
        ticket_id: 'TICK-20260831-1001',
        sender_id: 'USR-PUBLIC01',
        sender_name: 'Dewi Lestari',
        sender_role: 'pengguna_umum',
        message: 'Koneksi internet di ruangan 302 tiba-tiba terputus sejak pagi ini. Switch indikator lampu orange berkedip cepat.',
        visibility: 'public'
      },
      {
        thread_id: 'TH-1002',
        ticket_id: 'TICK-20260831-1001',
        sender_id: 'USR-OPERATOR01',
        sender_name: 'Siti Rahma (Helpdesk)',
        sender_role: 'operator',
        message: 'Laporan Anda telah kami terima dan kami teruskan ke tim UPT TI & Jaringan untuk pengecekan switch distribusi.',
        visibility: 'public'
      },
      {
        thread_id: 'TH-1003',
        ticket_id: 'TICK-20260831-1001',
        sender_id: 'USR-UPTTI01',
        sender_name: 'Ahmad Fauzi (UPT TI)',
        sender_role: 'upt',
        message: 'Catatan internal: Teknisi lapangan sedang menuju Gedung B untuk reboot switch Cisco Catalyst di lantai 3.',
        visibility: 'internal'
      },
      {
        thread_id: 'TH-1004',
        ticket_id: 'TICK-20260831-1002',
        sender_id: 'USR-ADMIN01',
        sender_name: 'Bambang Staff',
        sender_role: 'pengguna_umum',
        message: 'Unit AC split di ruang server utama mengeluarkan tetesan air dekat rak switch distribusi. Mohon penanganan darurat.',
        visibility: 'public'
      },
      {
        thread_id: 'TH-1005',
        ticket_id: 'TICK-20260831-1002',
        sender_id: 'USR-UPTSARPRAS01',
        sender_name: 'Rudi Hermawan (UPT Sarpras)',
        sender_role: 'upt',
        message: 'Catatan internal: Teknisi pipa drainase AC sudah dihubungi. Ember penampung darurat sudah diletakkan.',
        visibility: 'internal'
      }
    ];

    for (const th of seedThreads) {
      await connection.query(`
        INSERT INTO threads (
          thread_id, ticket_id, sender_id, sender_name, sender_role, message, visibility
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE message = VALUES(message)
      `, [
        th.thread_id, th.ticket_id, th.sender_id, th.sender_name, th.sender_role, th.message, th.visibility
      ]);
    }
    console.log(`   ✓ ${seedTickets.length} tiket & ${seedThreads.length} thread tersimpan.`);

    // 4. Seed Konfigurasi Sistem & Feature Flags
    console.log('[4/4] Melakukan konfigurasi sistem & feature flags...');
    const defaultFeatureFlags = {
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

    await connection.query(`
      INSERT INTO system_config (config_key, config_value, description)
      VALUES ('FEATURE_FLAGS', ?, 'Matriks hak akses fitur per role RBAC')
      ON DUPLICATE KEY UPDATE config_value = VALUES(config_value)
    `, [JSON.stringify(defaultFeatureFlags)]);

    const [userCount] = await connection.query('SELECT COUNT(*) AS c FROM users');
    const [ticketCount] = await connection.query('SELECT COUNT(*) AS c FROM tickets');
    const [threadCount] = await connection.query('SELECT COUNT(*) AS c FROM threads');

    console.log('=================================================================');
    console.log('                 MIGRATION COMPLETED SUCCESSFULLY                ');
    console.log('=================================================================');
    console.log(`Database Source : Aiven MySQL (${process.env.DB_NAME})`);
    console.log(`Database Host   : ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    console.log(`Total Users     : ${userCount[0].c}`);
    console.log(`Total Tickets   : ${ticketCount[0].c}`);
    console.log(`Total Threads   : ${threadCount[0].c}`);
    console.log('Status          : SINGLE SOURCE OF TRUTH (Aiven MySQL)');
    console.log('=================================================================');
    return true;
  } catch (err) {
    console.error('MIGRATION FAILED:', err.message);
    console.error(err);
    throw err;
  } finally {
    connection.release();
  }
}

// Auto-run if executed directly
if (process.argv[1]?.endsWith('migrate.js')) {
  runMigration()
    .then(() => pool.end())
    .catch(() => process.exit(1));
}
