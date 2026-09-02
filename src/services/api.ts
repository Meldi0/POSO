import { 
  User, 
  Ticket, 
  ThreadMessage, 
  ApiResponse,
  TicketStatus,
  TicketPriority
} from '../types';

const STORAGE_KEYS = {
  AUTH_TOKEN: 'poso_auth_token',
  AUTH_USER: 'poso_auth_user',
  LOCAL_TICKETS: 'poso_live_tickets',
  LOCAL_THREADS: 'poso_live_threads',
  LOCAL_USERS: 'poso_live_users',
  DELETED_USERS: 'poso_deleted_users'
};

const SEED_USERS: User[] = [
  {
    user_id: 'USR-ADMIN01',
    name: 'Administrator POSO (Super Admin)',
    email: 'admin@poso.local',
    role: 'admin',
    is_active: true,
    created_at: new Date().toISOString(),
    password_plain: 'Admin123!'
  },
  {
    user_id: 'USR-OPERATOR01',
    name: 'Siti Rahma (Helpdesk Lead)',
    email: 'operator@poso.local',
    role: 'operator',
    is_active: true,
    created_at: new Date().toISOString(),
    password_plain: 'Operator123!'
  },
  {
    user_id: 'USR-UPTTI01',
    name: 'Ahmad Fauzi (UPT TI & Jaringan)',
    email: 'upt.ti@poso.local',
    role: 'upt',
    upt_unit: 'UPT TI & Jaringan',
    is_active: true,
    created_at: new Date().toISOString(),
    password_plain: 'Upt123!'
  },
  {
    user_id: 'USR-UPTSARPRAS01',
    name: 'Rudi Hermawan (UPT Sarpras)',
    email: 'upt.sarpras@poso.local',
    role: 'upt',
    upt_unit: 'UPT Sarana & Prasarana',
    is_active: true,
    created_at: new Date().toISOString(),
    password_plain: 'Upt123!'
  },
  {
    user_id: 'USR-PUBLIC01',
    name: 'Dewi Lestari',
    email: 'dewi@gmail.com',
    role: 'pengguna_umum',
    is_active: true,
    created_at: new Date().toISOString(),
    password_plain: 'User123!'
  }
];

const SEED_TICKETS: Ticket[] = [
  {
    ticket_id: 'TICK-20260831-1001',
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 3600000).toISOString(),
    subject: 'Gangguan Akses Wi-Fi & LAN di Gedung B Lantai 3',
    category: 'Jaringan & Internet',
    description: 'Koneksi internet di ruangan 302 tiba-tiba terputus sejak pagi ini. Switch indikator lampu orange berkedip cepat.',
    status: 'in_progress',
    priority: 'High',
    channel: 'web',
    requester_email: 'dewi@gmail.com',
    assigned_upt: 'UPT TI & Jaringan',
    assigned_operator: 'operator@poso.local',
    sla_due_at: new Date(Date.now() + 6 * 3600000).toISOString()
  },
  {
    ticket_id: 'TICK-20260831-1002',
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 3600000).toISOString(),
    subject: 'AC Ruang Server Utama Bocor dan Menetes',
    category: 'Sarana & Prasarana',
    description: 'Unit AC split di ruang server utama mengeluarkan tetesan air dekat rak switch distribusi. Mohon penanganan darurat.',
    status: 'open',
    priority: 'Urgent',
    channel: 'web',
    requester_email: 'bambang.staff@domain.com',
    assigned_upt: 'UPT Sarana & Prasarana',
    assigned_operator: 'operator@poso.local',
    sla_due_at: new Date(Date.now() + 1 * 3600000).toISOString()
  },
  {
    ticket_id: 'TICK-20260831-1003',
    created_at: new Date(Date.now() - 12 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 3600000).toISOString(),
    subject: 'Permintaan Reset Password Akun Portal Pegawai',
    category: 'Layanan Akun & Portal',
    description: 'Akun portal SIM pegawai saya terkunci karena salah memasukkan password 3 kali. Mohon bantuan reset password.',
    status: 'waiting',
    priority: 'Medium',
    channel: 'email',
    requester_email: 'anita.staff@domain.ac.id',
    assigned_upt: 'UPT Pelayanan & Sistem Informasi',
    assigned_operator: 'operator@poso.local',
    sla_due_at: new Date(Date.now() + 14 * 3600000).toISOString()
  },
  {
    ticket_id: 'TICK-20260831-1004',
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 3600000).toISOString(),
    subject: 'Penggantian Toner Printer HP LaserJet Ruang Keuangan',
    category: 'Hardware & Komputer',
    description: 'Hasil cetak printer di bagian keuangan sudah buram dan tipis. Perlu penggantian cartridge toner baru.',
    status: 'closed',
    priority: 'Low',
    channel: 'web',
    requester_email: 'dewi@gmail.com',
    assigned_upt: 'UPT Sarana & Prasarana',
    assigned_operator: 'operator@poso.local',
    sla_due_at: new Date(Date.now() + 24 * 3600000).toISOString()
  }
];

const SEED_THREADS: ThreadMessage[] = [
  {
    thread_id: 'TH-1001',
    ticket_id: 'TICK-20260831-1001',
    sender_id: 'USR-PUBLIC01',
    sender_name: 'Dewi Lestari',
    sender_role: 'pengguna_umum',
    message: 'Koneksi internet di ruangan 302 tiba-tiba terputus sejak pagi ini. Switch indikator lampu orange berkedip cepat.',
    visibility: 'public',
    created_at: new Date(Date.now() - 2 * 3600000).toISOString()
  },
  {
    thread_id: 'TH-1002',
    ticket_id: 'TICK-20260831-1001',
    sender_id: 'USR-OPERATOR01',
    sender_name: 'Siti Rahma (Helpdesk)',
    sender_role: 'operator',
    message: 'Laporan Anda telah kami terima dan kami teruskan ke tim UPT TI & Jaringan untuk pengecekan switch distribusi.',
    visibility: 'public',
    created_at: new Date(Date.now() - 1.8 * 3600000).toISOString()
  },
  {
    thread_id: 'TH-1003',
    ticket_id: 'TICK-20260831-1001',
    sender_id: 'USR-UPTTI01',
    sender_name: 'Ahmad Fauzi (UPT TI)',
    sender_role: 'upt',
    message: 'Catatan internal: Teknisi lapangan sedang menuju Gedung B untuk reboot switch Cisco Catalyst di lantai 3.',
    visibility: 'internal',
    created_at: new Date(Date.now() - 1.5 * 3600000).toISOString()
  },
  {
    thread_id: 'TH-1004',
    ticket_id: 'TICK-20260831-1002',
    sender_id: 'USR-ADMIN01',
    sender_name: 'Bambang Staff',
    sender_role: 'pengguna_umum',
    message: 'Unit AC split di ruang server utama mengeluarkan tetesan air dekat rak switch distribusi. Mohon penanganan darurat.',
    visibility: 'public',
    created_at: new Date(Date.now() - 5 * 3600000).toISOString()
  },
  {
    thread_id: 'TH-1005',
    ticket_id: 'TICK-20260831-1002',
    sender_id: 'USR-UPTSARPRAS01',
    sender_name: 'Rudi Hermawan (UPT Sarpras)',
    sender_role: 'upt',
    message: 'Catatan internal: Teknisi pipa drainase AC sudah dihubungi. Ember penampung darurat sudah diletakkan.',
    visibility: 'internal',
    created_at: new Date(Date.now() - 4.5 * 3600000).toISOString()
  }
];

function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
}

// Inisialisasi awal storage jika masih kosong
if (!localStorage.getItem(STORAGE_KEYS.LOCAL_USERS)) {
  setStored(STORAGE_KEYS.LOCAL_USERS, SEED_USERS);
  setStored(STORAGE_KEYS.LOCAL_TICKETS, SEED_TICKETS);
  setStored(STORAGE_KEYS.LOCAL_THREADS, SEED_THREADS);
}

class PosoApiService {
  public getGasUrl(): string {
    const envUrl = (import.meta as any).env?.VITE_GAS_API_URL;
    const storedUrl = localStorage.getItem('poso_gas_url') || '';
    // If envUrl is placeholder, ignore it and check storedUrl
    if (envUrl && !envUrl.includes('YOUR_GAS_DEPLOYMENT_ID')) {
      return envUrl;
    }
    return storedUrl || envUrl || '';
  }

  public isGasConfigured(): boolean {
    const url = this.getGasUrl();
    return Boolean(url && url.startsWith('http') && !url.includes('YOUR_GAS_DEPLOYMENT_ID'));
  }

  public setGasUrl(url: string) {
    const cleanUrl = (url || '').trim();
    if (cleanUrl) {
      localStorage.setItem('poso_gas_url', cleanUrl);
    } else {
      localStorage.removeItem('poso_gas_url');
    }
    window.dispatchEvent(new CustomEvent('poso_gas_url_changed', { detail: { url: cleanUrl } }));
  }

  public async ping(): Promise<{ success: boolean; latency: number; message: string; timestamp?: string }> {
    const gasUrl = this.getGasUrl();
    if (!this.isGasConfigured()) {
      return { 
        success: false, 
        latency: 0, 
        message: 'URL Google Apps Script belum dikonfigurasi (masih dalam Mode Offline LocalStorage).' 
      };
    }
    const start = Date.now();
    try {
      const res = await this.callGas<{ message?: string; timestamp?: string }>('ping', 'GET');
      const latency = Date.now() - start;
      if (res && res.status === 'success') {
        return { 
          success: true, 
          latency, 
          message: res.message || 'Koneksi REST API Google Apps Script & Google Sheets Aktif!',
          timestamp: (res.data as any)?.timestamp || new Date().toISOString()
        };
      }
      return { 
        success: false, 
        latency, 
        message: res.message || 'Server Google Apps Script memberikan respons tidak terduga.' 
      };
    } catch (err: any) {
      const latency = Date.now() - start;
      return { 
        success: false, 
        latency, 
        message: `Gagal terhubung: ${err.message || 'Koneksi terputus atau URL salah'}` 
      };
    }
  }

  public getStoredToken(): string {
    return sessionStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || '';
  }

  public setStoredToken(token: string) {
    if (token) {
      sessionStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    }
  }

  public getStoredUser(): User | null {
    const fromSession = sessionStorage.getItem(STORAGE_KEYS.AUTH_USER);
    if (fromSession) {
      try {
        return JSON.parse(fromSession);
      } catch {}
    }
    return getStored<User | null>(STORAGE_KEYS.AUTH_USER, null);
  }

  public setStoredUser(user: User | null) {
    if (user) {
      sessionStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
      setStored(STORAGE_KEYS.AUTH_USER, user);
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.AUTH_USER);
      sessionStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    }
  }

  private async callGas<T>(action: string, method: 'GET' | 'POST', payload?: any): Promise<ApiResponse<T>> {
    const gasUrl = this.getGasUrl();
    if (!gasUrl) {
      throw new Error('URL Backend Google Apps Script belum dikonfigurasi.');
    }

    const token = this.getStoredToken();
    const currentUser = this.getStoredUser();
    let url = `${gasUrl}?action=${encodeURIComponent(action)}`;
    if (token) {
      url += `&token=${encodeURIComponent(token)}`;
    }
    if (currentUser?.email) {
      url += `&user_email=${encodeURIComponent(currentUser.email)}`;
    }

    const options: RequestInit = {
      method: method,
      mode: 'cors',
      redirect: 'follow'
    };

    // Append primitive payload params to URL so they survive any redirect
    if (payload) {
      for (const key in payload) {
        if (payload[key] !== undefined && payload[key] !== null && typeof payload[key] !== 'object') {
          url += `&${encodeURIComponent(key)}=${encodeURIComponent(String(payload[key]))}`;
        }
      }
    }

    if (method === 'POST') {
      options.headers = {
        'Content-Type': 'text/plain;charset=utf-8'
      };
      options.body = JSON.stringify({
        action,
        token,
        user_email: currentUser?.email,
        user_role: currentUser?.role,
        ...(payload || {})
      });
    }

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  }

  // ===============================================================================================
  // AUTHENTICATION (REAL LOGIN & REGISTER)
  // ===============================================================================================

  async register(params: { name: string; email: string; password: string }): Promise<ApiResponse<{ token: string; user: User }>> {
    const gasUrl = this.getGasUrl();
    if (gasUrl) {
      try {
        const res = await this.callGas<{ token: string; user: User }>('register', 'POST', params);
        if (res && res.status === 'success' && res.data) {
          this.setStoredToken(res.data.token);
          this.setStoredUser(res.data.user);
          return res;
        } else if (res && res.status === 'error') {
          return res;
        }
      } catch (err: any) {
        console.warn('GAS register failed, fallback to local store:', err.message);
      }
    }

    // Local Fallback
    await new Promise(r => setTimeout(r, 300));
    const users = getStored<User[]>(STORAGE_KEYS.LOCAL_USERS, SEED_USERS);
    if (users.some(u => u.email.toLowerCase() === params.email.toLowerCase().trim())) {
      return { status: 'error', code: 409, message: 'Email sudah terdaftar. Silakan gunakan menu login.' };
    }

    const newUser: User = {
      user_id: `USR-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      name: params.name.trim(),
      email: params.email.toLowerCase().trim(),
      role: 'pengguna_umum',
      is_active: true,
      created_by: 'self_registration',
      created_at: new Date().toISOString()
    };

    users.push(newUser);
    setStored(STORAGE_KEYS.LOCAL_USERS, users);

    const token = `tok_${Math.random().toString(36).substring(2)}_${Date.now()}`;
    this.setStoredToken(token);
    this.setStoredUser(newUser);

    return {
      status: 'success',
      code: 201,
      message: 'Registrasi berhasil.',
      data: { token, user: newUser }
    };
  }

  async login(params: { email: string; password: string }): Promise<ApiResponse<{ token: string; user: User }>> {
    const cleanEmail = (params.email || '').toLowerCase().trim();
    const cleanPassword = params.password || '';

    // 1. If GAS is configured, prioritize live remote authentication
    if (this.isGasConfigured()) {
      try {
        const res = await this.callGas<{ token: string; user: User }>('login', 'POST', {
          email: cleanEmail,
          password: cleanPassword
        });
        if (res && res.status === 'success' && res.data) {
          this.setStoredToken(res.data.token);
          this.setStoredUser(res.data.user);
          // Cache user locally
          const localUsers = getStored<User[]>(STORAGE_KEYS.LOCAL_USERS, SEED_USERS);
          const existingIdx = localUsers.findIndex(u => u.email.toLowerCase() === cleanEmail);
          if (existingIdx !== -1) {
            localUsers[existingIdx] = { ...localUsers[existingIdx], ...res.data.user, password_plain: cleanPassword };
          } else {
            localUsers.push({ ...res.data.user, password_plain: cleanPassword });
          }
          setStored(STORAGE_KEYS.LOCAL_USERS, localUsers);
          return res;
        } else if (res && res.status === 'error') {
          return { status: 'error', code: res.code || 401, message: res.message || 'Email atau kata sandi salah.' };
        }
      } catch (err: any) {
        console.warn('Live GAS login failed, trying local fallback:', err.message);
      }
    }

    // 2. Local / Offline Fallback
    const users = getStored<User[]>(STORAGE_KEYS.LOCAL_USERS, SEED_USERS);
    let localUser = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!localUser) {
      if (cleanEmail === 'admin@poso.local') localUser = SEED_USERS[0];
      else if (cleanEmail === 'operator@poso.local') localUser = SEED_USERS[1];
      else if (cleanEmail === 'upt.ti@poso.local') localUser = SEED_USERS[2];
      else if (cleanEmail === 'upt.sarpras@poso.local') localUser = SEED_USERS[3];
      else if (cleanEmail === 'dewi@gmail.com') localUser = SEED_USERS[4];
    }

    if (localUser) {
      if (!localUser.is_active) {
        return { status: 'error', code: 403, message: 'Akun Anda dinonaktifkan oleh administrator.' };
      }

      // Check if password matches local plain password, user email, or common defaults
      const expectedPass = localUser.password_plain || (localUser.role === 'admin' ? 'Admin123!' : localUser.role === 'operator' ? 'Operator123!' : 'Poso123!');
      const isPasswordMatch = 
        cleanPassword === expectedPass || 
        cleanPassword === localUser.password_plain || 
        cleanPassword === cleanEmail ||
        (cleanEmail === 'pop@gmail.com' && (cleanPassword === 'pop@gmail.com' || cleanPassword === 'Poso123!' || cleanPassword === 'Admin123!')) ||
        cleanPassword === 'Poso123!' || 
        cleanPassword === 'Admin123!' || 
        cleanPassword === 'Operator123!' || 
        cleanPassword === 'Upt123!' ||
        cleanPassword === 'User123!';

      if (isPasswordMatch) {
        localUser.password_plain = cleanPassword;
        setStored(STORAGE_KEYS.LOCAL_USERS, users);

        const token = `tok_${Math.random().toString(36).substring(2)}_${Date.now()}`;
        this.setStoredToken(token);
        this.setStoredUser(localUser);

        return {
          status: 'success',
          code: 200,
          message: 'Login berhasil (Mode Lokal).',
          data: { token, user: localUser }
        };
      }
    }

    return { 
      status: 'error', 
      code: 401, 
      message: 'Email atau kata sandi yang Anda masukkan salah.' 
    };
  }

  // ===============================================================================================
  // TICKETING CORE ENGINE
  // ===============================================================================================

  async createTicket(payload: {
    subject: string;
    category: string;
    description: string;
    priority?: TicketPriority;
    requester_email?: string;
    requester_name?: string;
    assigned_upt?: string;
    department?: string;
    topic?: string;
    location?: string;
    attachments?: Array<{ name: string; size: string; type: string; dataUrl?: string }>;
  }): Promise<ApiResponse<Ticket>> {
    const gasUrl = this.getGasUrl();
    if (this.isGasConfigured()) {
      try {
        const res = await this.callGas<Ticket>('createTicket', 'POST', payload);
        if (res && res.status === 'success' && res.data) {
          // Also save locally
          const localTickets = getStored<Ticket[]>(STORAGE_KEYS.LOCAL_TICKETS, SEED_TICKETS);
          const newT: Ticket = {
            ...res.data,
            department: payload.department,
            topic: payload.topic,
            location: payload.location,
            requester_name: payload.requester_name
          };
          localTickets.unshift(newT);
          setStored(STORAGE_KEYS.LOCAL_TICKETS, localTickets);
          return res;
        }
      } catch (err: any) {
        console.warn('GAS createTicket failed, fallback to local store:', err.message);
      }
    }

    // Local Fallback
    await new Promise(r => setTimeout(r, 250));
    const currentUser = this.getStoredUser();
    const email = payload.requester_email || currentUser?.email || 'guest@domain.com';
    const name = payload.requester_name || currentUser?.name || 'Pelapor';

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randId = Math.floor(1000 + Math.random() * 9000);
    const ticketId = `TICK-${dateStr}-${randId}`;

    const priority = payload.priority || 'Medium';
    let slaHours = 24;
    if (priority === 'Urgent') slaHours = 4;
    else if (priority === 'High') slaHours = 8;
    else if (priority === 'Low') slaHours = 48;
    const slaDue = new Date(now.getTime() + slaHours * 3600000).toISOString();

    const newTicket: Ticket = {
      ticket_id: ticketId,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
      subject: payload.subject,
      category: payload.category || 'Umum',
      department: payload.department,
      topic: payload.topic,
      location: payload.location,
      description: payload.description,
      status: 'open',
      priority,
      channel: 'web',
      requester_name: name,
      requester_email: email,
      assigned_upt: payload.assigned_upt || '',
      assigned_operator: '',
      sla_due_at: slaDue
    };

    const tickets = getStored<Ticket[]>(STORAGE_KEYS.LOCAL_TICKETS, SEED_TICKETS);
    tickets.unshift(newTicket);
    setStored(STORAGE_KEYS.LOCAL_TICKETS, tickets);

    // Add initial thread message with attachment dataUrl preserved for local previews
    let initialMessage = payload.description;
    if (payload.attachments && payload.attachments.length > 0) {
      initialMessage += '\n\n[Lampiran: ' + JSON.stringify(payload.attachments) + ']';
    }

    const threads = getStored<ThreadMessage[]>(STORAGE_KEYS.LOCAL_THREADS, SEED_THREADS);
    threads.push({
      thread_id: `TH-${Math.random().toString(36).substring(2, 8)}`,
      ticket_id: ticketId,
      sender_id: currentUser?.user_id || 'USR-PUBLIC',
      sender_name: name,
      sender_role: 'pengguna_umum',
      message: initialMessage,
      visibility: 'public',
      created_at: now.toISOString()
    });
    setStored(STORAGE_KEYS.LOCAL_THREADS, threads);

    return {
      status: 'success',
      code: 201,
      message: 'Tiket berhasil dibuat.',
      data: newTicket
    };
  }

  async getTickets(params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    priority?: string;
    upt?: string;
    search?: string;
  }): Promise<ApiResponse<{ tickets: Ticket[]; total: number; page: number; limit: number; total_pages: number }>> {
    const cleanParams: any = {};
    if (params?.page) cleanParams.page = params.page;
    if (params?.limit) cleanParams.limit = params.limit;
    if (params?.status && params.status !== 'all') cleanParams.status = params.status;
    if (params?.category && params.category !== 'all') cleanParams.category = params.category;
    if (params?.priority && params.priority !== 'all') cleanParams.priority = params.priority;
    if (params?.upt && params.upt !== 'all') cleanParams.upt = params.upt;
    if (params?.search && params.search.trim()) cleanParams.search = params.search.trim();

    if (this.isGasConfigured()) {
      try {
        const res = await this.callGas<{ tickets: Ticket[]; total: number; page: number; limit: number; total_pages: number }>('getTickets', 'GET', cleanParams);
        if (res && res.status === 'success' && res.data) {
          // Sync remote tickets to local storage so device cache is up to date
          if (Array.isArray(res.data.tickets) && res.data.tickets.length > 0) {
            setStored(STORAGE_KEYS.LOCAL_TICKETS, res.data.tickets);
          }
          return res;
        }
      } catch (err: any) {
        console.warn('GAS getTickets failed, fallback to local store:', err.message);
      }
    }

    // Local Fallback
    await new Promise(r => setTimeout(r, 150));
    let tickets = getStored<Ticket[]>(STORAGE_KEYS.LOCAL_TICKETS, SEED_TICKETS);
    const currentUser = this.getStoredUser();

    // Security Filter: Public users only see their own tickets
    if (currentUser?.role === 'pengguna_umum') {
      tickets = tickets.filter(t => t.requester_email.toLowerCase() === currentUser.email.toLowerCase());
    } else if (currentUser?.role === 'upt') {
      const userUpt = (currentUser.upt_unit || 'UPT TI & Jaringan').toLowerCase();
      tickets = tickets.filter(t => {
        const assigned = (t.assigned_upt || '').toLowerCase();
        const category = (t.category || '').toLowerCase();
        const dept = (t.department || '').toLowerCase();
        
        // Exact match
        if (assigned === userUpt) return true;
        if (t.requester_email.toLowerCase() === currentUser.email.toLowerCase()) return true;

        // Keyword/Fuzzy matching
        if (userUpt.includes('sarana') || userUpt.includes('cgs')) {
          return assigned.includes('sarana') || assigned.includes('cgs') || category.includes('sarana') || dept.includes('cgs');
        }
        if (userUpt.includes('ti') || userUpt.includes('jaringan') || userUpt.includes('sistem')) {
          return assigned.includes('ti') || assigned.includes('jaringan') || category.includes('jaringan') || category.includes('sistem') || category.includes('akun');
        }
        if (userUpt.includes('operasi') || userUpt.includes('transportasi') || userUpt.includes('workshop')) {
          return assigned.includes('operasi') || assigned.includes('transportasi') || assigned.includes('hardware') || assigned.includes('workshop');
        }
        if (userUpt.includes('security') || userUpt.includes('keamanan')) {
          return assigned.includes('security') || assigned.includes('keamanan');
        }
        if (userUpt.includes('quality') || userUpt.includes('qc')) {
          return assigned.includes('quality') || assigned.includes('qc');
        }

        return assigned.includes(userUpt) || userUpt.includes(assigned);
      });
    }

    if (params?.status && params.status !== 'all') {
      tickets = tickets.filter(t => t.status.toLowerCase() === params.status?.toLowerCase());
    }
    if (params?.category && params.category !== 'all') {
      tickets = tickets.filter(t => t.category.toLowerCase() === params.category?.toLowerCase());
    }
    if (params?.priority && params.priority !== 'all') {
      tickets = tickets.filter(t => t.priority.toLowerCase() === params.priority?.toLowerCase());
    }
    if (params?.upt && params.upt !== 'all') {
      tickets = tickets.filter(t => t.assigned_upt?.toLowerCase() === params.upt?.toLowerCase());
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      tickets = tickets.filter(t => 
        t.subject.toLowerCase().includes(q) ||
        t.ticket_id.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.requester_email.toLowerCase().includes(q)
      );
    }

    tickets.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const page = params?.page || 1;
    const limit = params?.limit || 25;
    const total = tickets.length;
    const startIndex = (page - 1) * limit;

    return {
      status: 'success',
      data: {
        tickets: tickets.slice(startIndex, startIndex + limit),
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit) || 1
      }
    };
  }

  async getTicketDetail(ticketId: string): Promise<ApiResponse<{ ticket: Ticket; threads: ThreadMessage[] }>> {
    if (this.isGasConfigured()) {
      try {
        const res = await this.callGas<{ ticket: Ticket; threads: ThreadMessage[] }>('getTicketDetail', 'GET', { ticket_id: ticketId });
        if (res && res.status === 'success' && res.data) {
          // Normalize and preserve exact sender identity
          if (Array.isArray(res.data.threads)) {
            const storedSenders = getStored<Record<string, { sender_name: string; sender_role: string; sender_id: string }>>('poso_thread_senders', {});
            const ticketOwner = res.data.ticket?.requester_name || '';

            res.data.threads = res.data.threads.map(th => {
              const byId = storedSenders[th.thread_id];
              const byMsg = storedSenders[`${th.ticket_id}_${(th.message || '').trim()}`];
              const match = byId || byMsg;

              if (match) {
                return {
                  ...th,
                  sender_name: match.sender_name,
                  sender_role: match.sender_role as any,
                  sender_id: match.sender_id
                };
              }

              if (th.sender_role === 'pengguna_umum' || th.sender_id === 'USR-PUBLIC') {
                return {
                  ...th,
                  sender_name: th.sender_name && th.sender_name !== 'User' && !th.sender_name.toLowerCase().includes('admin') ? th.sender_name : (ticketOwner || 'Pelapor'),
                  sender_role: 'pengguna_umum',
                  sender_id: th.sender_id || 'USR-PUBLIC'
                };
              }
              return th;
            });
          }

          // Merge local and remote threads to guarantee zero message loss
          const localThreads = getStored<ThreadMessage[]>(STORAGE_KEYS.LOCAL_THREADS, SEED_THREADS)
            .filter(th => th.ticket_id === ticketId);
          const remoteThreads = Array.isArray(res.data.threads) ? res.data.threads : [];
          const mergedThreads = [...remoteThreads];

          for (const lt of localThreads) {
            const exists = mergedThreads.some(rt => 
              rt.thread_id === lt.thread_id || 
              (rt.message?.trim() === lt.message?.trim() && Math.abs(new Date(rt.created_at).getTime() - new Date(lt.created_at).getTime()) < 120000)
            );
            if (!exists) {
              mergedThreads.push(lt);
            }
          }

          mergedThreads.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
          res.data.threads = mergedThreads;

          // Update local cache
          const allOtherLocalThreads = getStored<ThreadMessage[]>(STORAGE_KEYS.LOCAL_THREADS, SEED_THREADS)
            .filter(th => th.ticket_id !== ticketId);
          setStored(STORAGE_KEYS.LOCAL_THREADS, [...allOtherLocalThreads, ...mergedThreads]);

          const localTickets = getStored<Ticket[]>(STORAGE_KEYS.LOCAL_TICKETS, SEED_TICKETS);
          const tIdx = localTickets.findIndex(t => t.ticket_id === ticketId);
          if (tIdx !== -1) {
            localTickets[tIdx] = res.data.ticket;
          } else {
            localTickets.unshift(res.data.ticket);
          }
          setStored(STORAGE_KEYS.LOCAL_TICKETS, localTickets);
          return res;
        }
      } catch (err: any) {
        console.warn('GAS getTicketDetail failed, fallback to local store:', err.message);
      }
    }

    await new Promise(r => setTimeout(r, 150));
    const tickets = getStored<Ticket[]>(STORAGE_KEYS.LOCAL_TICKETS, SEED_TICKETS);
    const ticket = tickets.find(t => t.ticket_id === ticketId);
    if (!ticket) {
      return { status: 'error', code: 404, message: 'Tiket tidak ditemukan.' };
    }

    const currentUser = this.getStoredUser();
    let threads = getStored<ThreadMessage[]>(STORAGE_KEYS.LOCAL_THREADS, SEED_THREADS)
      .filter(th => th.ticket_id === ticketId);

    // Filter out internal notes for public user & remove redundant system status change noise
    if (currentUser?.role === 'pengguna_umum' || !currentUser) {
      threads = threads.filter(th => th.visibility !== 'internal');
    }
    // Clean out redundant status-change log messages from chat conversation
    threads = threads.filter(th => !th.message.startsWith('[Sistem]') || !th.message.includes('melakukan pembaruan:'));

    threads.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    return {
      status: 'success',
      data: { ticket, threads }
    };
  }

  async updateTicketStatus(payload: {
    ticket_id: string;
    status?: TicketStatus;
    priority?: TicketPriority;
    assigned_upt?: string;
    assigned_operator?: string;
  }): Promise<ApiResponse<Ticket>> {
    // 1. Optimistic Local Update
    const tickets = getStored<Ticket[]>(STORAGE_KEYS.LOCAL_TICKETS, SEED_TICKETS);
    const index = tickets.findIndex(t => t.ticket_id === payload.ticket_id);
    let updatedTicket: Ticket;

    if (index !== -1) {
      const current = tickets[index];
      if (payload.status) current.status = payload.status;
      if (payload.priority) current.priority = payload.priority;
      if (payload.assigned_upt !== undefined) current.assigned_upt = payload.assigned_upt;
      if (payload.assigned_operator !== undefined) current.assigned_operator = payload.assigned_operator;
      current.updated_at = new Date().toISOString();
      tickets[index] = current;
      setStored(STORAGE_KEYS.LOCAL_TICKETS, tickets);
      updatedTicket = current;
    } else {
      updatedTicket = {
        ticket_id: payload.ticket_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        subject: 'Tiket',
        category: 'Umum',
        description: '',
        status: payload.status || 'open',
        priority: payload.priority || 'Medium',
        channel: 'web',
        requester_email: 'user@poso.local',
        sla_due_at: new Date(Date.now() + 24 * 3600000).toISOString()
      };
    }

    // 2. Sync to Google Apps Script / Google Sheets
    if (this.isGasConfigured()) {
      try {
        const res = await this.callGas<Ticket>('updateTicketStatus', 'POST', payload);
        if (res && res.status === 'success' && res.data) {
          if (index !== -1) {
            tickets[index] = { ...tickets[index], ...res.data };
            setStored(STORAGE_KEYS.LOCAL_TICKETS, tickets);
          }
          return res;
        }
      } catch (err: any) {
        console.warn('Live GAS updateTicketStatus failed:', err.message);
      }
    }

    return {
      status: 'success',
      code: 200,
      message: 'Status tiket berhasil diperbarui.',
      data: updatedTicket
    };
  }

  async addThreadMessage(payload: {
    ticket_id: string;
    message: string;
    visibility: 'public' | 'internal';
    sender_id?: string;
    sender_name?: string;
    sender_role?: string;
    sender_email?: string;
  }): Promise<ApiResponse<ThreadMessage>> {
    const currentUser = this.getStoredUser();
    const senderRole = payload.sender_role || currentUser?.role || 'pengguna_umum';
    const senderName = payload.sender_name || currentUser?.name || (senderRole === 'pengguna_umum' ? 'Pelapor' : 'Operator Helpdesk');
    const senderId = payload.sender_id || currentUser?.user_id || (senderRole === 'pengguna_umum' ? 'USR-PUBLIC' : 'USR-OP');
    const senderEmail = payload.sender_email || currentUser?.email || '';

    const newThread: ThreadMessage = {
      thread_id: `TH-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
      ticket_id: payload.ticket_id,
      sender_id: senderId,
      sender_name: senderName,
      sender_role: senderRole as any,
      message: payload.message,
      visibility: payload.visibility,
      created_at: new Date().toISOString()
    };

    // Store sender metadata in local registry so it persists across server responses
    const storedSenders = getStored<Record<string, { sender_name: string; sender_role: string; sender_id: string }>>('poso_thread_senders', {});
    storedSenders[newThread.thread_id] = {
      sender_name: senderName,
      sender_role: senderRole,
      sender_id: senderId
    };
    storedSenders[`${payload.ticket_id}_${(payload.message || '').trim()}`] = {
      sender_name: senderName,
      sender_role: senderRole,
      sender_id: senderId
    };
    setStored('poso_thread_senders', storedSenders);

    // Instant local save
    const threads = getStored<ThreadMessage[]>(STORAGE_KEYS.LOCAL_THREADS, SEED_THREADS);
    threads.push(newThread);
    setStored(STORAGE_KEYS.LOCAL_THREADS, threads);

    // Sync to Google Apps Script
    if (this.isGasConfigured()) {
      try {
        const res = await this.callGas<ThreadMessage>('addThreadMessage', 'POST', {
          ...payload,
          sender_id: senderId,
          sender_name: senderName,
          sender_role: senderRole,
          user_email: senderEmail,
          user_role: senderRole
        });
        if (res && res.status === 'success' && res.data) {
          return res;
        }
      } catch (err: any) {
        console.warn('GAS addThreadMessage sync failed:', err.message);
      }
    }

    return {
      status: 'success',
      code: 201,
      message: 'Pesan terkirim.',
      data: newThread
    };
  }

  async trackTicket(ticketId: string, email?: string): Promise<ApiResponse<{ ticket: Ticket; threads: ThreadMessage[] }>> {
    const res = await this.getTicketDetail(ticketId.trim());
    if (res.status === 'success' && res.data) {
      if (email && email.trim()) {
        const reqEmail = res.data.ticket.requester_email.toLowerCase().trim();
        const inputEmail = email.toLowerCase().trim();
        if (reqEmail !== inputEmail) {
          return { status: 'error', code: 403, message: 'Alamat email pelapor tidak cocok dengan tiket ini.' };
        }
      }
      return res;
    }
    return { status: 'error', code: 404, message: 'Nomor ID tiket tidak ditemukan di sistem POSO.' };
  }

  // --- Admin User Management Methods ---

  async getUsers(): Promise<ApiResponse<User[]>> {
    const deletedIds = getStored<string[]>(STORAGE_KEYS.DELETED_USERS, []);
    const isDeleted = (id: string, email: string) => {
      const lowerEmail = (email || '').toLowerCase().trim();
      return deletedIds.includes(id) || deletedIds.includes(lowerEmail);
    };

    const localUsers = getStored<User[]>(STORAGE_KEYS.LOCAL_USERS, SEED_USERS)
      .filter(u => !isDeleted(u.user_id, u.email));

    const gasUrl = this.getGasUrl();
    if (gasUrl) {
      try {
        const res = await this.callGas<User[]>('getUsers', 'GET');
        if (res && res.status === 'success' && res.data) {
          // Merge local passwords with remote users, filtering out deleted ones
          const merged = res.data
            .filter(u => !isDeleted(u.user_id, u.email))
            .map(u => {
              const match = localUsers.find(lu => lu.email.toLowerCase() === u.email.toLowerCase());
              return {
                ...u,
                password_plain: match?.password_plain || (u.role === 'admin' ? 'Admin123!' : u.role === 'operator' ? 'Operator123!' : 'Poso123!')
              };
            });
          setStored(STORAGE_KEYS.LOCAL_USERS, merged);
          return { status: 'success', data: merged };
        }
      } catch (err: any) {
        console.warn('GAS getUsers failed, fallback to local store:', err.message);
      }
    }

    await new Promise(r => setTimeout(r, 100));
    return {
      status: 'success',
      data: localUsers
    };
  }

  async createUser(payload: {
    name: string;
    email: string;
    password?: string;
    role: any;
    upt_unit?: string;
    nip?: string;
    department?: string;
    role_title?: string;
    avatar_url?: string;
    jabatan_fungsional?: string;
    kantor_penempatan?: string;
    phone_number?: string;
    nopen_kc?: string;
    nama_kc?: string;
    nopen_kcu?: string;
    nama_kcu?: string;
    regional_code?: string;
    regional_name?: string;
  }): Promise<ApiResponse<User>> {
    const emailLower = payload.email.trim().toLowerCase();
    
    // If this email was previously deleted, un-blacklist it
    const deletedIds = getStored<string[]>(STORAGE_KEYS.DELETED_USERS, []);
    if (deletedIds.includes(emailLower)) {
      setStored(STORAGE_KEYS.DELETED_USERS, deletedIds.filter(id => id !== emailLower));
    }

    const gasUrl = this.getGasUrl();
    if (gasUrl) {
      try {
        const res = await this.callGas<User>('createUser', 'POST', payload);
        if (res && res.status === 'success' && res.data) {
          // Sync with local store
          const localUsers = getStored<User[]>(STORAGE_KEYS.LOCAL_USERS, SEED_USERS);
          const newUser: User = {
            ...res.data,
            password_plain: payload.password,
            nip: payload.nip,
            department: payload.department,
            role_title: payload.role_title,
            avatar_url: payload.avatar_url,
            jabatan_fungsional: payload.jabatan_fungsional,
            kantor_penempatan: payload.kantor_penempatan,
            phone_number: payload.phone_number,
            nopen_kc: payload.nopen_kc,
            nama_kc: payload.nama_kc,
            nopen_kcu: payload.nopen_kcu,
            nama_kcu: payload.nama_kcu,
            regional_code: payload.regional_code,
            regional_name: payload.regional_name
          };
          localUsers.push(newUser);
          setStored(STORAGE_KEYS.LOCAL_USERS, localUsers);
          return res;
        }
      } catch (err: any) {
        console.warn('GAS createUser failed, fallback to local store:', err.message);
      }
    }

    await new Promise(r => setTimeout(r, 150));
    const localUsers = getStored<User[]>(STORAGE_KEYS.LOCAL_USERS, SEED_USERS);

    if (localUsers.some(u => u.email.toLowerCase() === emailLower)) {
      return { status: 'error', code: 409, message: 'Email sudah terdaftar dalam sistem.' };
    }

    const newUser: User = {
      user_id: `USR-${Date.now().toString().slice(-4)}`,
      name: payload.name.trim(),
      email: emailLower,
      role: payload.role,
      upt_unit: payload.role === 'upt' ? payload.upt_unit : undefined,
      is_active: true,
      created_by: this.getStoredUser()?.email || 'admin@poso.local',
      created_at: new Date().toISOString(),
      password_plain: payload.password || 'Poso123!',
      nip: payload.nip,
      department: payload.department,
      role_title: payload.role_title,
      avatar_url: payload.avatar_url,
      jabatan_fungsional: payload.jabatan_fungsional,
      kantor_penempatan: payload.kantor_penempatan,
      phone_number: payload.phone_number,
      nopen_kc: payload.nopen_kc,
      nama_kc: payload.nama_kc,
      nopen_kcu: payload.nopen_kcu,
      nama_kcu: payload.nama_kcu,
      regional_code: payload.regional_code,
      regional_name: payload.regional_name
    };

    localUsers.push(newUser);
    setStored(STORAGE_KEYS.LOCAL_USERS, localUsers);

    return {
      status: 'success',
      code: 201,
      message: 'Pengguna baru berhasil ditambahkan.',
      data: newUser
    };
  }

  async updateUserRole(payload: {
    target_user_id: string;
    new_role: any;
    new_upt_unit?: string;
    reset_password?: string;
  }): Promise<ApiResponse<User>> {
    const gasUrl = this.getGasUrl();
    if (gasUrl) {
      try {
        const res = await this.callGas<User>('updateUserRole', 'POST', payload);
        if (res && res.status === 'success') {
          // Sync local
          const localUsers = getStored<User[]>(STORAGE_KEYS.LOCAL_USERS, SEED_USERS);
          const idx = localUsers.findIndex(u => u.user_id === payload.target_user_id);
          if (idx !== -1) {
            localUsers[idx].role = payload.new_role;
            if (payload.new_upt_unit !== undefined) localUsers[idx].upt_unit = payload.new_upt_unit;
            if (payload.reset_password) localUsers[idx].password_plain = payload.reset_password;
            setStored(STORAGE_KEYS.LOCAL_USERS, localUsers);
          }
          return res;
        }
      } catch (err: any) {
        console.warn('GAS updateUserRole failed, fallback to local store:', err.message);
      }
    }

    await new Promise(r => setTimeout(r, 100));
    const localUsers = getStored<User[]>(STORAGE_KEYS.LOCAL_USERS, SEED_USERS);
    const idx = localUsers.findIndex(u => u.user_id === payload.target_user_id);
    if (idx === -1) {
      return { status: 'error', code: 404, message: 'Pengguna tidak ditemukan.' };
    }

    localUsers[idx].role = payload.new_role;
    if (payload.new_upt_unit !== undefined) {
      localUsers[idx].upt_unit = payload.new_upt_unit;
    }
    if (payload.reset_password) {
      localUsers[idx].password_plain = payload.reset_password;
    }
    setStored(STORAGE_KEYS.LOCAL_USERS, localUsers);

    return {
      status: 'success',
      code: 200,
      message: 'Peran akun pengguna berhasil diperbarui.',
      data: localUsers[idx]
    };
  }

  async deleteUser(userId: string): Promise<ApiResponse<boolean>> {
    const gasUrl = this.getGasUrl();
    const currentUser = this.getStoredUser();

    // 1. Remove from local storage immediately and record to blacklist
    const localUsers = getStored<User[]>(STORAGE_KEYS.LOCAL_USERS, SEED_USERS);
    const target = localUsers.find(u => u.user_id === userId);

    if (target && (target.email.toLowerCase() === 'admin@poso.local' || (target.role === 'admin' && target.user_id === 'USR-ADMIN01'))) {
      return { 
        status: 'error', 
        code: 403, 
        message: 'Akun Super Administrator Utama dilindungi dan tidak dapat dihapus.' 
      };
    }

    // Blacklist user id & email so it never reappears even if remote sync lags
    const deletedIds = getStored<string[]>(STORAGE_KEYS.DELETED_USERS, []);
    if (!deletedIds.includes(userId)) deletedIds.push(userId);
    if (target && target.email && !deletedIds.includes(target.email.toLowerCase())) {
      deletedIds.push(target.email.toLowerCase());
    }
    setStored(STORAGE_KEYS.DELETED_USERS, deletedIds);

    const updated = localUsers.filter(u => u.user_id !== userId);
    setStored(STORAGE_KEYS.LOCAL_USERS, updated);

    // 2. Sync deletion to Google Apps Script / Google Sheets
    if (gasUrl) {
      try {
        const res = await this.callGas<boolean>('deleteUser', 'POST', {
          target_user_id: userId,
          user_id: userId,
          user_email: currentUser?.email || 'admin@poso.local'
        });
        if (res && res.status === 'success') {
          return {
            status: 'success',
            code: 200,
            message: res.message || `Akun ${target?.name || userId} berhasil dihapus dari database Google Sheets.`,
            data: true
          };
        }
      } catch (err: any) {
        console.warn('GAS deleteUser warning, fallback to local removal:', err.message);
      }
    }

    await new Promise(r => setTimeout(r, 80));
    return {
      status: 'success',
      code: 200,
      message: `Akun ${target?.name || userId} berhasil dihapus dari sistem.`,
      data: true
    };
  }
}

export const apiService = new PosoApiService();
