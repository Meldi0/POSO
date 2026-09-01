export type UserRole = 'pengguna_umum' | 'upt' | 'operator' | 'admin';

export type TicketStatus = 'open' | 'in_progress' | 'waiting' | 'closed';

export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type TicketChannel = 'web' | 'email';

export interface User {
  user_id: string;
  name: string;
  email: string;
  role: UserRole;
  upt_unit?: string;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  password_plain?: string;

  // Profil Dinas Lengkap Pos Indonesia (Field Database Terpisah)
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
}

export interface Ticket {
  ticket_id: string;
  created_at: string;
  updated_at: string;
  subject: string;
  category: string;
  
  // Field Database Terpisah (Clean Architecture)
  department?: string;
  topic?: string;
  location?: string;
  
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  channel: TicketChannel;
  requester_name?: string;
  requester_email: string;
  assigned_upt?: string;
  assigned_operator?: string;
  sla_due_at: string;
  attachments?: Array<{ name: string; size: string; type: string; dataUrl?: string }>;
}

export interface ThreadMessage {
  thread_id: string;
  ticket_id: string;
  sender_id: string;
  sender_name?: string;
  sender_role: UserRole | string;
  message: string;
  visibility: 'public' | 'internal';
  created_at: string;
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  code?: number;
  message?: string;
  data?: T;
}
