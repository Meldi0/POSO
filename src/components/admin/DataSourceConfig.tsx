import React from 'react';
import { HardDrive, CheckCircle2, ExternalLink } from 'lucide-react';

export const DataSourceConfig: React.FC = () => {
  const SPREADSHEET_ID = '1IBoq8tUdVC1ki2omEqvgek6LEHhE6aVOSEfDuiO0byE';
  const FOLDER_ID = '1RqlknF3O-0gXcTeX0JfO9FzyBESq-hwR';

  return (
    <div className="space-y-6 text-[#0D2833]">
      <div>
        <h2 className="text-xl font-extrabold text-[#0D5C75]">Konfigurasi Sumber Data Google Drive</h2>
        <p className="text-xs text-[#5C7782]">Status koneksi penyimpanan database Google Sheets dan berkas Google Drive</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Spreadsheet Card */}
        <div className="p-5 rounded-3xl bg-[#F8FAFC] border border-[#A5D1E1]/40 space-y-3 shadow-xs">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-[#0D5C75] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Master Spreadsheet (Online)</span>
            </span>
            <a
              href={`https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-[#199FB1] hover:underline flex items-center gap-1"
            >
              <span>Buka Sheets</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="font-mono text-xs bg-white p-3 rounded-2xl border border-[#A5D1E1]/40 break-all text-[#0D5C75] font-bold">
            ID: {SPREADSHEET_ID}
          </div>
          <p className="text-[11px] text-[#5C7782]">
            Menyimpan tabel master: <code className="bg-[#EAF4F8] px-1 py-0.5 rounded text-[#0D5C75]">Tickets</code>, <code className="bg-[#EAF4F8] px-1 py-0.5 rounded text-[#0D5C75]">Ticket_Threads</code>, <code className="bg-[#EAF4F8] px-1 py-0.5 rounded text-[#0D5C75]">Users</code>, <code className="bg-[#EAF4F8] px-1 py-0.5 rounded text-[#0D5C75]">Audit_Logs</code>.
          </p>
        </div>

        {/* Drive Folder Card */}
        <div className="p-5 rounded-3xl bg-[#F8FAFC] border border-[#A5D1E1]/40 space-y-3 shadow-xs">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-[#0D5C75] flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-[#199FB1]" />
              <span>Folder Google Drive Utama</span>
            </span>
            <a
              href={`https://drive.google.com/drive/folders/${FOLDER_ID}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-[#199FB1] hover:underline flex items-center gap-1"
            >
              <span>Buka Drive</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="font-mono text-xs bg-white p-3 rounded-2xl border border-[#A5D1E1]/40 break-all text-[#0D5C75] font-bold">
            ID: {FOLDER_ID}
          </div>
          <p className="text-[11px] text-[#5C7782]">
            Semua foto screenshot dan berkas lampiran pelapor langsung otomatis tersimpan di folder ini.
          </p>
        </div>
      </div>
    </div>
  );
};
