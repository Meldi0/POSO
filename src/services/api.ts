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
  AUTH_USER: 'poso_auth_user'
};

const API_BASE = '/api';

class PosoApiService {
  // In-flight mutex to avoid duplicate thread messages
  private inFlightThreads: Map<string, Promise<ApiResponse<ThreadMessage>>> = new Map();

  constructor() {}

  // -----------------------------------------------------------------------------------------------
  // AUTH TOKEN & SESSION MANAGEMENT
  // -----------------------------------------------------------------------------------------------

  public getStoredToken(): string {
    return sessionStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || '';
  }

  public setStoredToken(token: string | null) {
    if (token) {
      sessionStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    }
  }

  public getStoredUser(): User | null {
    const raw = sessionStorage.getItem(STORAGE_KEYS.AUTH_USER) || localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {}
    }
    return null;
  }

  public setStoredUser(user: User | null) {
    if (user) {
      const json = JSON.stringify(user);
      sessionStorage.setItem(STORAGE_KEYS.AUTH_USER, json);
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, json);
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.AUTH_USER);
      sessionStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    }
  }

  // -----------------------------------------------------------------------------------------------
  // HTTP CLIENT HELPER
  // -----------------------------------------------------------------------------------------------

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const token = this.getStoredToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          status: 'error',
          code: response.status,
          message: data.message || `Request failed with status ${response.status}`,
          data: data.data
        };
      }

      return data;
    } catch (err: any) {
      console.error(`API Error [${endpoint}]:`, err);
      return {
        status: 'error',
        code: 500,
        message: err.message || 'Gagal terhubung ke backend server POSO.'
      };
    }
  }

  // -----------------------------------------------------------------------------------------------
  // SYSTEM & DATABASE STATUS
  // -----------------------------------------------------------------------------------------------

  public async ping(): Promise<{ success: boolean; latency: number; message: string; timestamp?: string }> {
    const start = Date.now();
    try {
      const res = await this.request<{ database: string; latency_ms: number; timestamp: string }>('/health', {
        method: 'GET'
      });

      const latency = Date.now() - start;

      if (res && res.status === 'success') {
        return {
          success: true,
          latency: res.data?.latency_ms || latency,
          message: 'Koneksi Backend POSO & Aiven MySQL Aktif!',
          timestamp: res.data?.timestamp || new Date().toISOString()
        };
      }

      return {
        success: false,
        latency,
        message: res.message || 'Database Aiven MySQL tidak merespons.'
      };
    } catch (err: any) {
      return {
        success: false,
        latency: Date.now() - start,
        message: err.message || 'Gagal terhubung ke server backend.'
      };
    }
  }

  public async getDbStatus(): Promise<ApiResponse<{
    database_engine: string;
    host: string;
    port: number;
    database_name: string;
    ssl_mode: string;
    ssl_active: boolean;
    latency_ms: number;
    mysql_version: string;
    table_counts: Record<string, number>;
    connection_pool: { connection_limit: number; status: string };
  }>> {
    return this.request('/admin/db-status', { method: 'GET' });
  }

  // -----------------------------------------------------------------------------------------------
  // AUTHENTICATION
  // -----------------------------------------------------------------------------------------------

  async login(params: { email: string; password: string }): Promise<ApiResponse<{ token: string; user: User }>> {
    const res = await this.request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(params)
    });

    if (res.status === 'success' && res.data) {
      this.setStoredToken(res.data.token);
      this.setStoredUser(res.data.user);
    }

    return res;
  }

  async register(params: { name: string; email: string; password: string }): Promise<ApiResponse<{ token: string; user: User }>> {
    const res = await this.request<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(params)
    });

    if (res.status === 'success' && res.data) {
      this.setStoredToken(res.data.token);
      this.setStoredUser(res.data.user);
    }

    return res;
  }

  async getProfile(): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/me', { method: 'GET' });
  }

  // -----------------------------------------------------------------------------------------------
  // TICKETS
  // -----------------------------------------------------------------------------------------------

  async getTickets(params?: {
    status?: TicketStatus | 'all';
    priority?: TicketPriority | 'all';
    category?: string;
    assigned_upt?: string;
    search?: string;
    page?: number;
    limit?: number;
    requester_email?: string;
  }): Promise<ApiResponse<{ tickets: Ticket[]; total: number; page: number; limit: number; total_pages: number }>> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          query.set(k, String(v));
        }
      });
    }

    const endpoint = `/tickets${query.toString() ? `?${query.toString()}` : ''}`;
    return this.request(endpoint, { method: 'GET' });
  }

  async getTicketDetail(ticketId: string): Promise<ApiResponse<{ ticket: Ticket; threads: ThreadMessage[] }>> {
    return this.request<{ ticket: Ticket; threads: ThreadMessage[] }>(`/tickets/${encodeURIComponent(ticketId)}`, {
      method: 'GET'
    });
  }

  async trackTicket(ticketId: string, email?: string): Promise<ApiResponse<{ ticket: Ticket; threads: ThreadMessage[] }>> {
    const query = email ? `?email=${encodeURIComponent(email.trim())}` : '';
    return this.request<{ ticket: Ticket; threads: ThreadMessage[] }>(
      `/tickets/track/${encodeURIComponent(ticketId.trim())}${query}`,
      { method: 'GET' }
    );
  }

  async createTicket(payload: {
    subject: string;
    category: string;
    department?: string;
    topic?: string;
    location?: string;
    description: string;
    priority?: TicketPriority;
    channel?: 'web' | 'email';
    requester_name?: string;
    requester_email?: string;
    requester_phone?: string;
    assigned_upt?: string;
    assigned_operator?: string;
    attachments?: Array<{ name: string; size?: string; type?: string; dataUrl?: string; url?: string }>;
  }): Promise<ApiResponse<Ticket>> {
    return this.request<Ticket>('/tickets', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async updateTicketStatus(payload: {
    ticket_id: string;
    status?: TicketStatus;
    priority?: TicketPriority;
    assigned_upt?: string;
    assigned_operator?: string;
    is_archived?: boolean | number;
  }): Promise<ApiResponse<Ticket>> {
    return this.request<Ticket>(`/tickets/${encodeURIComponent(payload.ticket_id)}/status`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
  }

  async archiveTicket(ticketId: string, archive = true): Promise<ApiResponse<Ticket>> {
    return this.updateTicketStatus({
      ticket_id: ticketId,
      is_archived: archive ? 1 : 0,
      ...(archive ? { status: 'closed' } : { status: 'in_progress' })
    });
  }

  async addThreadMessage(payload: {
    ticket_id: string;
    message: string;
    visibility?: 'public' | 'internal';
    sender_name?: string;
    sender_id?: string;
    sender_role?: string;
    sender_email?: string;
  }): Promise<ApiResponse<ThreadMessage>> {
    const mutexKey = `${payload.ticket_id}:${payload.message.trim()}`;
    if (this.inFlightThreads.has(mutexKey)) {
      return this.inFlightThreads.get(mutexKey)!;
    }

    const promise = (async () => {
      try {
        const res = await this.request<ThreadMessage>(`/tickets/${encodeURIComponent(payload.ticket_id)}/threads`, {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        return res;
      } finally {
        setTimeout(() => this.inFlightThreads.delete(mutexKey), 4000);
      }
    })();

    this.inFlightThreads.set(mutexKey, promise);
    return promise;
  }

  // -----------------------------------------------------------------------------------------------
  // ADMIN USER MANAGEMENT
  // -----------------------------------------------------------------------------------------------

  async getUsers(): Promise<ApiResponse<User[]>> {
    return this.request<User[]>('/admin/users', { method: 'GET' });
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
    return this.request<User>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async updateUserRole(payload: {
    target_user_id: string;
    new_role?: any;
    new_upt_unit?: string;
    is_active?: boolean;
    reset_password?: string;
  }): Promise<ApiResponse<User>> {
    return this.request<User>(`/admin/users/${encodeURIComponent(payload.target_user_id)}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
  }

  async deleteUser(userId: string): Promise<ApiResponse<boolean>> {
    const res = await this.request(`/admin/users/${encodeURIComponent(userId)}`, {
      method: 'DELETE'
    });
    return {
      status: res.status,
      code: res.code,
      message: res.message,
      data: res.status === 'success'
    };
  }

  // -----------------------------------------------------------------------------------------------
  // ADMIN FEATURES & AUDIT
  // -----------------------------------------------------------------------------------------------

  async getAuditLog(params?: { limit?: number }): Promise<ApiResponse<any[]>> {
    const query = params?.limit ? `?limit=${params.limit}` : '';
    return this.request<any[]>(`/admin/audit-logs${query}`, { method: 'GET' });
  }

  async getFeatureFlags(): Promise<ApiResponse<any>> {
    return this.request('/admin/features', { method: 'GET' });
  }

  async updateFeatureFlags(feature_flags: any): Promise<ApiResponse<any>> {
    return this.request('/admin/features', {
      method: 'PUT',
      body: JSON.stringify({ feature_flags })
    });
  }

  // -----------------------------------------------------------------------------------------------
  // ANALYTICS
  // -----------------------------------------------------------------------------------------------

  async getAnalytics(): Promise<ApiResponse<any>> {
    return this.request('/analytics', { method: 'GET' });
  }
}

export const apiService = new PosoApiService();
export default apiService;
