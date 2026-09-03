import React, { useState } from 'react';
import { FileText, Download, ExternalLink, Eye, X, Image as ImageIcon, ZoomIn, Copy, Check } from 'lucide-react';
import { 
  ParsedAttachment, 
  extractAttachmentsAndCleanText, 
  getDirectImagePreviewUrl, 
  isImageAttachment, 
  getGoogleDriveFileId 
} from '../../utils/ticketFormatter';

export type { ParsedAttachment };

export function parseMessageAttachments(rawText: string): {
  cleanText: string;
  attachments: ParsedAttachment[];
} {
  return extractAttachmentsAndCleanText(rawText);
}

interface AttachmentGalleryProps {
  attachments: ParsedAttachment[];
  className?: string;
  isDarkTheme?: boolean;
}

export const AttachmentGallery: React.FC<AttachmentGalleryProps> = ({ 
  attachments, 
  className = '',
  isDarkTheme = false 
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageTitle, setSelectedImageTitle] = useState<string>('');
  const [selectedOriginalUrl, setSelectedOriginalUrl] = useState<string | null>(null);
  const [imageErrorMap, setImageErrorMap] = useState<Record<number, boolean>>({});
  const [copiedLink, setCopiedLink] = useState(false);

  if (!attachments || attachments.length === 0) return null;

  const handleOpenPreview = (att: ParsedAttachment, idx: number) => {
    const isFailed = imageErrorMap[idx];
    const directPreview = isFailed ? undefined : (att.previewUrl || getDirectImagePreviewUrl(att));
    const fallbackUrl = att.dataUrl || att.url;

    setSelectedImageTitle(att.name || 'Lampiran Berkas Foto');
    setSelectedOriginalUrl(att.url || att.dataUrl || null);

    if (directPreview) {
      setSelectedImage(directPreview);
    } else if (fallbackUrl) {
      if (att.url && !att.dataUrl && !isImageAttachment(att)) {
        window.open(att.url, '_blank', 'noreferrer');
      } else {
        setSelectedImage(fallbackUrl);
      }
    } else {
      setSelectedImage('fallback');
    }
  };

  const handleImageLoadError = (idx: number) => {
    setImageErrorMap(prev => ({ ...prev, [idx]: true }));
  };

  const handleCopyLink = (url: string) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className={`space-y-2 pt-1.5 ${className}`}>
      <div className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
        isDarkTheme ? 'text-slate-300' : 'text-slate-700'
      }`}>
        <ImageIcon className="w-3.5 h-3.5 text-[#0D5C75]" />
        <span>Berkas Foto & Lampiran ({attachments.length}):</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {attachments.map((att, idx) => {
          const isImg = att.isImage ?? isImageAttachment(att);
          const isFailed = imageErrorMap[idx];
          const previewSrc = isFailed ? null : (att.previewUrl || getDirectImagePreviewUrl(att));
          const openUrl = att.url || att.dataUrl;

          return (
            <div
              key={idx}
              className={`rounded-xl p-2.5 border shadow-2xs flex items-center justify-between gap-3 group transition-all ${
                isDarkTheme 
                  ? 'bg-slate-900/80 border-slate-700/80 hover:border-[#199FB1]' 
                  : 'bg-slate-50 border-slate-200 hover:border-[#0D5C75]'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate min-w-0">
                {isImg && previewSrc ? (
                  <div
                    onClick={() => handleOpenPreview(att, idx)}
                    className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-200 border border-slate-300 shrink-0 cursor-pointer group/img"
                    title="Klik untuk memperbesar foto bukti"
                  >
                    <img
                      src={previewSrc}
                      alt={att.name}
                      onError={() => handleImageLoadError(idx)}
                      className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-200"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <ZoomIn className="w-4 h-4" />
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => handleOpenPreview(att, idx)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 cursor-pointer ${
                      isDarkTheme ? 'bg-slate-800 text-cyan-400' : 'bg-[#EAF4F8] text-[#0D5C75]'
                    }`}
                    title="Klik untuk melihat lampiran"
                  >
                    {isImg ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                  </div>
                )}

                <div className="truncate min-w-0">
                  <div 
                    className={`text-xs font-bold truncate cursor-pointer hover:underline ${
                      isDarkTheme ? 'text-slate-100' : 'text-slate-800'
                    }`} 
                    title={att.name}
                    onClick={() => handleOpenPreview(att, idx)}
                  >
                    {att.name}
                  </div>
                  <div className={`text-[10px] flex items-center gap-1 mt-0.5 ${
                    isDarkTheme ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {att.size && <span>{att.size}</span>}
                    {isImg && (
                      <span className={`font-semibold ${isDarkTheme ? 'text-cyan-400' : 'text-[#0D5C75]'}`}>
                        • Berkas Foto
                      </span>
                    )}
                    {att.url && getGoogleDriveFileId(att.url) && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/10 text-amber-600 font-medium">
                        Drive
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0 flex items-center gap-1.5">
                {isImg ? (
                  <button
                    type="button"
                    onClick={() => handleOpenPreview(att, idx)}
                    className={`p-1.5 px-2.5 rounded-lg border text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      isDarkTheme
                        ? 'bg-slate-800 border-slate-700 text-slate-200 hover:text-white hover:bg-slate-700'
                        : 'bg-white border-slate-200 text-slate-700 hover:text-[#0D5C75] hover:border-[#0D5C75]'
                    }`}
                    title="Lihat Pratinjau Foto"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Lihat</span>
                  </button>
                ) : null}

                {openUrl ? (
                  <a
                    href={openUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={`p-1.5 rounded-lg border transition-all flex items-center gap-1 text-[11px] font-bold ${
                      isDarkTheme
                        ? 'bg-slate-800 border-slate-700 text-cyan-400 hover:bg-slate-700'
                        : 'bg-white border-slate-200 text-[#0D5C75] hover:bg-[#EAF4F8]'
                    }`}
                    title="Buka Tautan Asli di Tab Baru"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal (Full-Screen Image Viewer) */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] border border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-3.5 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2 truncate max-w-md">
                <ImageIcon className="w-4 h-4 text-[#199FB1] shrink-0" />
                <span className="font-bold text-xs sm:text-sm truncate">{selectedImageTitle || 'Pratinjau Foto Bukti'}</span>
              </div>
              <div className="flex items-center gap-2">
                {selectedOriginalUrl && (
                  <>
                    {!selectedOriginalUrl.startsWith('data:') ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleCopyLink(selectedOriginalUrl!)}
                          className="px-2.5 py-1 text-slate-300 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Salin Tautan Lampiran"
                        >
                          {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span className="hidden sm:inline">{copiedLink ? 'Tersalin' : 'Salin Link'}</span>
                        </button>
                        <a
                          href={selectedOriginalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 bg-[#0D5C75] hover:bg-[#199FB1] text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors"
                          title="Buka Berkas di Tab Baru / Google Drive"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Buka di Drive/Tab</span>
                        </a>
                      </>
                    ) : (
                      <a
                        href={selectedOriginalUrl}
                        download={selectedImageTitle || 'lampiran-foto-poso.png'}
                        className="px-2.5 py-1 bg-[#0D5C75] hover:bg-[#199FB1] text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors"
                        title="Unduh Berkas Foto"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Unduh Foto</span>
                      </a>
                    )}
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Tutup (ESC)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Image View Area */}
            <div className="p-4 sm:p-6 bg-slate-950/80 flex items-center justify-center flex-1 overflow-auto min-h-[320px]">
              {selectedImage && selectedImage !== 'fallback' ? (
                <div className="relative max-h-[72vh] flex items-center justify-center">
                  <img
                    src={selectedImage}
                    alt={selectedImageTitle}
                    className="max-h-[70vh] max-w-full object-contain rounded-xl shadow-2xl border border-slate-800"
                    onError={() => {
                      if (selectedOriginalUrl && !selectedOriginalUrl.startsWith('data:')) {
                        window.open(selectedOriginalUrl, '_blank');
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="text-center text-slate-400 space-y-3 py-12">
                  <ImageIcon className="w-14 h-14 mx-auto text-slate-600" />
                  <p className="text-sm font-bold text-slate-200">{selectedImageTitle}</p>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Foto tersimpan di Google Drive atau server lampiran POSO.
                  </p>
                  {selectedOriginalUrl && (
                    <a
                      href={selectedOriginalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0D5C75] text-white font-bold text-xs hover:bg-[#199FB1] transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Buka File Lampiran di Google Drive</span>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="text-[11px] truncate">
                {selectedOriginalUrl ? 'Pratinjau Berkas Terenkripsi POSO Cloud' : 'Lampiran Berkas Pelapor'}
              </span>
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
