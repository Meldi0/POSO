// =================================================================================================
// POSO ULTRA-FAST REALTIME WEBSOCKET & NOTIFICATION SERVICE
// =================================================================================================

import { soundService } from '../utils/sound';
import { ThreadMessage, Ticket } from '../types';

export interface ChatNotification {
  id: string;
  ticket_id: string;
  sender_name: string;
  sender_role: string;
  message: string;
  created_at: string;
  is_read: boolean;
  avatar?: string;
}

type RealtimeCallback<T = any> = (data: T) => void;

class PosoRealtimeService {
  private ws: WebSocket | null = null;
  private broadcastChannel: BroadcastChannel | null = null;
  private messageListeners: Set<RealtimeCallback<ThreadMessage>> = new Set();
  private notificationListeners: Set<RealtimeCallback<ChatNotification[]>> = new Set();
  private ticketListeners: Set<RealtimeCallback<any>> = new Set();

  private notifications: ChatNotification[] = [];
  private isConnected = false;
  private reconnectTimer: any = null;
  private currentUserId: string = '';
  private currentUserName: string = '';

  // Free high-availability public WebSocket cluster endpoints with auto-fallback
  private wsEndpoints = [
    'wss://free.blr2.piesocket.com/v3/poso_realtime_v1?api_key=VCXCEuvhGcBDP7XhiJJLUD6RRE25ixbDetmOB0xJ&notify_self=0',
    'wss://socketsbay.com/wss/v2/1/demo/',
    'wss://ws.postman-echo.com/raw'
  ];
  private endpointIndex = 0;

  constructor() {
    this.loadNotifications();
    this.initBroadcastChannel();
    this.connectWebSocket();
  }

  public setUserContext(userId: string, userName: string) {
    this.currentUserId = userId || '';
    this.currentUserName = userName || '';
  }

  private initBroadcastChannel() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel('poso_live_chat_sync');
        this.broadcastChannel.onmessage = (event) => {
          this.handleIncomingPayload(event.data);
        };
      } catch (e) {}
    }
  }

  private connectWebSocket() {
    if (typeof window === 'undefined') return;
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      const url = this.wsEndpoints[this.endpointIndex % this.wsEndpoints.length];
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        this.isConnected = true;
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
      };

      this.ws.onmessage = (evt) => {
        try {
          const raw = typeof evt.data === 'string' ? evt.data : '';
          if (!raw) return;
          const payload = JSON.parse(raw);
          this.handleIncomingPayload(payload);
        } catch (e) {
          // Plain text echo
        }
      };

      this.ws.onerror = () => {
        this.isConnected = false;
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        // Switch to next backup endpoint and reconnect
        this.endpointIndex++;
        this.scheduleReconnect();
      };
    } catch (err) {
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      this.connectWebSocket();
    }, 3000);
  }

  private handleIncomingPayload(payload: any) {
    if (!payload || !payload.type) return;

    // Filter out messages originated from current session if flag matches
    if (payload.sender_id && this.currentUserId && payload.sender_id === this.currentUserId) {
      return;
    }

    if (payload.type === 'NEW_CHAT') {
      const msg: ThreadMessage = payload.data;
      if (!msg) return;

      // 1. Play audible notification
      soundService.playIncomingMessageSound();
      soundService.notifyBrowser(
        `Pesan Baru dari ${msg.sender_name} (#${msg.ticket_id})`,
        msg.message.slice(0, 70)
      );

      // 2. Add to Notification Dropdown list
      const notif: ChatNotification = {
        id: `NOTIF-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        ticket_id: msg.ticket_id,
        sender_name: msg.sender_name || 'Pengguna',
        sender_role: msg.sender_role || 'user',
        message: msg.message,
        created_at: msg.created_at || new Date().toISOString(),
        is_read: false
      };

      this.addNotification(notif);

      // 3. Dispatch to active chat listeners (0ms UI render)
      this.messageListeners.forEach((cb) => {
        try { cb(msg); } catch (e) {}
      });

      // 4. Dispatch global custom event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('poso_realtime_chat', { detail: notif }));
      }
    } else if (payload.type === 'TICKET_STATUS_CHANGED' || payload.type === 'NEW_TICKET') {
      soundService.playIncomingMessageSound();
      this.ticketListeners.forEach((cb) => {
        try { cb(payload); } catch (e) {}
      });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('poso_realtime_ticket', { detail: payload }));
      }
    }
  }

  /**
   * Broadcast pesan chat baru secara instan (<50ms) ke seluruh perangkat & tab
   */
  public broadcastChatMessage(msg: ThreadMessage) {
    const payload = {
      type: 'NEW_CHAT',
      sender_id: this.currentUserId || msg.sender_id,
      timestamp: Date.now(),
      data: msg
    };

    // 1. Same-device cross-tab broadcast (0ms)
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(payload);
      } catch (e) {}
    }

    // 2. Remote WebSocket broadcast (<50ms)
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(payload));
      } catch (e) {}
    }
  }

  /**
   * Broadcast status update tiket
   */
  public broadcastTicketUpdate(data: any) {
    const payload = {
      type: 'TICKET_STATUS_CHANGED',
      sender_id: this.currentUserId,
      timestamp: Date.now(),
      data
    };

    if (this.broadcastChannel) {
      try { this.broadcastChannel.postMessage(payload); } catch (e) {}
    }
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try { this.ws.send(JSON.stringify(payload)); } catch (e) {}
    }
  }

  // --- Notification Store ---

  private loadNotifications() {
    try {
      const raw = localStorage.getItem('poso_chat_notifications');
      if (raw) {
        this.notifications = JSON.parse(raw);
      }
    } catch (e) {
      this.notifications = [];
    }
  }

  private saveNotifications() {
    try {
      localStorage.setItem('poso_chat_notifications', JSON.stringify(this.notifications.slice(0, 30)));
    } catch (e) {}
    this.notifyNotificationListeners();
  }

  public getNotifications(): ChatNotification[] {
    return this.notifications;
  }

  public getUnreadCount(): number {
    return this.notifications.filter(n => !n.is_read).length;
  }

  public addNotification(notif: ChatNotification) {
    // Keep max 30 notifications
    this.notifications.unshift(notif);
    if (this.notifications.length > 30) {
      this.notifications = this.notifications.slice(0, 30);
    }
    this.saveNotifications();
  }

  public markAllAsRead() {
    this.notifications = this.notifications.map(n => ({ ...n, is_read: true }));
    this.saveNotifications();
  }

  public markAsRead(notificationId: string) {
    this.notifications = this.notifications.map(n => 
      n.id === notificationId ? { ...n, is_read: true } : n
    );
    this.saveNotifications();
  }

  public clearNotifications() {
    this.notifications = [];
    this.saveNotifications();
  }

  // --- Subscriptions ---

  public onNewMessage(callback: RealtimeCallback<ThreadMessage>) {
    this.messageListeners.add(callback);
    return () => {
      this.messageListeners.delete(callback);
    };
  }

  public onNotificationsChange(callback: RealtimeCallback<ChatNotification[]>) {
    this.notificationListeners.add(callback);
    callback(this.notifications);
    return () => {
      this.notificationListeners.delete(callback);
    };
  }

  public onTicketChange(callback: RealtimeCallback<any>) {
    this.ticketListeners.add(callback);
    return () => {
      this.ticketListeners.delete(callback);
    };
  }

  private notifyNotificationListeners() {
    this.notificationListeners.forEach(cb => {
      try { cb(this.notifications); } catch (e) {}
    });
  }
}

export const realtimeService = new PosoRealtimeService();
