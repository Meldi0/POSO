import React from 'react';
import { 
  LayoutGrid, 
  Users, 
  HardDrive, 
  FileText, 
  Globe, 
  LogOut, 
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface PolytroxSidebarProps {
  activeTab: 'tickets' | 'users' | 'datasource' | 'audit';
  onTabChange: (tab: 'tickets' | 'users' | 'datasource' | 'audit') => void;
  onOpenPublicPortal: () => void;
}

export const PolytroxSidebar: React.FC<PolytroxSidebarProps> = ({
  activeTab,
  onTabChange,
  onOpenPublicPortal
}) => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <aside className="w-16 sm:w-20 lg:w-22 bg-gradient-to-b from-[#E75A38] to-[#D84623] rounded-3xl sm:rounded-[32px] p-3 sm:p-4 flex flex-col items-center justify-between text-white shadow-terracotta shrink-0 self-stretch min-h-[calc(100vh-2rem)] sticky top-3 sm:top-4">
      {/* Top Profile Avatar */}
      <div className="flex flex-col items-center gap-5 pt-1">
        <div className="relative group cursor-pointer" title={`${user?.name} (${user?.role})`}>
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-white/70 p-0.5 bg-white/15 shadow-xs flex items-center justify-center font-black text-xs sm:text-sm text-white overflow-hidden">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#E75A38] rounded-full" />
        </div>

        {/* Navigation Icons */}
        <nav className="flex flex-col items-center gap-3">
          {/* Tickets Main Tab */}
          <button
            type="button"
            onClick={() => onTabChange('tickets')}
            title="Antrean Tiket"
            className={`relative p-2.5 sm:p-3 rounded-2xl transition-all ${
              activeTab === 'tickets'
                ? 'bg-white text-[#E75A38] shadow-md scale-105'
                : 'text-white/80 hover:text-white hover:bg-white/15'
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
            {activeTab === 'tickets' && (
              <span className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white rounded-r-full" />
            )}
          </button>

          {/* Admin: Users */}
          {isAdmin && (
            <button
              type="button"
              onClick={() => onTabChange('users')}
              title="Manajemen Pengguna & Staf"
              className={`relative p-2.5 sm:p-3 rounded-2xl transition-all ${
                activeTab === 'users'
                  ? 'bg-white text-[#E75A38] shadow-md scale-105'
                  : 'text-white/80 hover:text-white hover:bg-white/15'
              }`}
            >
              <Users className="w-5 h-5" />
              {activeTab === 'users' && (
                <span className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white rounded-r-full" />
              )}
            </button>
          )}

          {/* Admin: Google Drive Data Source */}
          {isAdmin && (
            <button
              type="button"
              onClick={() => onTabChange('datasource')}
              title="Sumber Data Google Drive"
              className={`relative p-2.5 sm:p-3 rounded-2xl transition-all ${
                activeTab === 'datasource'
                  ? 'bg-white text-[#E75A38] shadow-md scale-105'
                  : 'text-white/80 hover:text-white hover:bg-white/15'
              }`}
            >
              <HardDrive className="w-5 h-5" />
              {activeTab === 'datasource' && (
                <span className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white rounded-r-full" />
              )}
            </button>
          )}

          {/* Admin: Audit Logs */}
          {isAdmin && (
            <button
              type="button"
              onClick={() => onTabChange('audit')}
              title="Log Audit Sistem"
              className={`relative p-2.5 sm:p-3 rounded-2xl transition-all ${
                activeTab === 'audit'
                  ? 'bg-white text-[#E75A38] shadow-md scale-105'
                  : 'text-white/80 hover:text-white hover:bg-white/15'
              }`}
            >
              <FileText className="w-5 h-5" />
              {activeTab === 'audit' && (
                <span className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white rounded-r-full" />
              )}
            </button>
          )}

          {/* Portal Publik */}
          <button
            type="button"
            onClick={onOpenPublicPortal}
            title="Buka Portal Publik"
            className="p-2.5 sm:p-3 rounded-2xl text-white/80 hover:text-white hover:bg-white/15 transition-all"
          >
            <Globe className="w-5 h-5" />
          </button>
        </nav>
      </div>

      {/* Bottom Actions: Chat Notification & Logout */}
      <div className="flex flex-col items-center gap-2.5 pt-6 pb-1">
        <div className="relative p-2 rounded-2xl bg-white/15 text-white cursor-pointer hover:bg-white/25 transition-all">
          <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-300 rounded-full ring-2 ring-[#D84623]" />
        </div>

        <button
          type="button"
          onClick={logout}
          title="Keluar"
          className="p-2 rounded-2xl text-white/70 hover:text-white hover:bg-white/15 transition-all"
        >
          <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </aside>
  );
};
