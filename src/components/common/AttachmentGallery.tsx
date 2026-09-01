import React, { useState } from 'react';
import { FileText, Download, ExternalLink, Eye, X, Image as ImageIcon, ZoomIn } from 'lucide-react';

export interface ParsedAttachment {
  name: string;
  size?: string;
  type?: string;
  url?: string;
  dataUrl?: string;
}

export function parseMessageAttachments(rawText: string): {
  cleanText: string;
  attachments: ParsedAttachment[];
} {
  if (!rawText) return { cleanText: '', attachments: [] };

  const attachments: ParsedAttachment[] = [];
  let cleanText = rawText;

  // 1. Detect JSON [Lampiran: [...]] or [Berkas Lampiran Pelapor]: [...]
  const jsonMatch = cleanText.match(/\[(?:Lampiran|Berkas Lampiran Pelapor|Lampiran Berkas):\s*(\[.*?\])\]/s);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[1]);
      if (Array.isArray(parsed)) {
        parsed.forEach(item => {
          attachments.push({
            name: item.name || 'lampiran',
            size: item.size || '',
            type: item.type || '',
            url: item.url || '',
            dataUrl: item.dataUrl || item.data_url || ''
          });
        });
      }
    } catch (e) {
      // Fallback
    }
    cleanText = cleanText.replace(jsonMatch[0], '').trim();
  }

  // 2. Detect text format: [Lampiran Berkas]: • filename.png (2.3 MB) or • name: url
  const textPattern = /(?:\[(?:Lampiran Berkas|Lampiran|Berkas Lampiran Pelapor)\]:?|\n•\s*([^\n\r]+))/g;
  const lines = rawText.split('\n');
  const remainingLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('• ') || trimmed.startsWith('[Lampiran Berkas]:')) {
      const lineContent = trimmed.replace('[Lampiran Berkas]:', '').replace('•', '').trim();
      if (!lineContent) continue;

      // Check if it contains URL: name: https://...
      const urlMatch = lineContent.match(/^([^:]+):\s*(https?:\/\/[^\s]+)/);
      if (urlMatch) {
        attachments.push({
          name: urlMatch[1].trim(),
          url: urlMatch[2].trim()
        });
        continue;
      }

      // Check if it contains name and size: filename.png (2.3 MB)
      const sizeMatch = lineContent.match(/^([^(]+)(?:\s*\(([^)]+)\))?/);
      if (sizeMatch) {
        attachments.push({
          name: sizeMatch[1].trim(),
          size: sizeMatch[2] ? sizeMatch[2].trim() : ''
        });
        continue;
      }
    } else {
      remainingLines.push(line);
    }
  }

  if (attachments.length > 0) {
    cleanText = remainingLines.join('\n').trim();
  }

  return { cleanText, attachments };
}

interface AttachmentGalleryProps {
  attachments: ParsedAttachment[];
}

export const AttachmentGallery: React.FC<AttachmentGalleryProps> = ({ attachments }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageTitle, setSelectedImageTitle] = useState<string>('');

  if (!attachments || attachments.length === 0) return null;

  const isImageFile = (att: ParsedAttachment) => {
    if (att.dataUrl && att.dataUrl.startsWith('data:image/')) return true;
    if (att.type && att.type.startsWith('image/')) return true;
    if (att.name && /\.(png|jpe?g|gif|webp|svg)$/i.test(att.name)) return true;
    return false;
  };

  const handleOpenPreview = (att: ParsedAttachment) => {
    const imgSrc = att.dataUrl || att.url;
    if (imgSrc) {
      setSelectedImage(imgSrc);
      setSelectedImageTitle(att.name);
    } else if (att.url) {
      window.open(att.url, '_blank');
    } else {
      // Create a fallback visual placeholder with title
      setSelectedImageTitle(att.name);
      setSelectedImage('fallback');
    }
  };

  return (
    <div className="space-y-2 pt-2">
      <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
        <ImageIcon className="w-3.5 h-3.5 text-[#0D5C75]" />
        <span>Berkas Foto & Lampiran ({attachments.length}):</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {attachments.map((att, idx) => {
          const isImg = isImageFile(att);
          const imgSrc = att.dataUrl || att.url;

          return (
            <div
              key={idx}
              className="bg-slate-50 rounded-xl p-2.5 border border-slate-200 shadow-xs flex items-center justify-between gap-3 group hover:border-[#0D5C75] transition-all"
            >
              <div className="flex items-center gap-2.5 truncate min-w-0">
                {isImg && imgSrc ? (
                  <div
                    onClick={() => handleOpenPreview(att)}
                    className="relative w-11 h-11 rounded-lg overflow-hidden bg-slate-200 border border-slate-300 shrink-0 cursor-pointer group/img"
                    title="Klik untuk memperbesar gambar"
                  >
                    <img
                      src={imgSrc}
                      alt={att.name}
                      className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <ZoomIn className="w-4 h-4" />
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => handleOpenPreview(att)}
                    className="w-10 h-10 rounded-lg bg-[#EAF4F8] text-[#0D5C75] flex items-center justify-center shrink-0 cursor-pointer"
                    title="Klik untuk pratinjau"
                  >
                    {isImg ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                  </div>
                )}

                <div className="truncate min-w-0">
                  <div className="text-xs font-bold text-slate-800 truncate" title={att.name}>
                    {att.name}
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                    {att.size && <span>{att.size}</span>}
                    {isImg && <span className="font-semibold text-[#0D5C75]">• Berkas Foto</span>}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0 flex items-center gap-1">
                {att.url ? (
                  <a
                    href={att.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-[#0D5C75] hover:border-[#0D5C75] transition-colors flex items-center gap-1 text-[10px] font-bold"
                    title="Buka File di Tab Baru"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Buka</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleOpenPreview(att)}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-[#0D5C75] hover:border-[#0D5C75] transition-colors flex items-center gap-1 text-[10px] font-bold"
                    title="Lihat Pratinjau Foto"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Lihat</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative max-w-3xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
              <span className="font-bold text-xs truncate max-w-md">{selectedImageTitle || 'Pratinjau Foto Bukti'}</span>
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-950 flex items-center justify-center flex-1 overflow-auto min-h-[300px]">
              {selectedImage !== 'fallback' ? (
                <img
                  src={selectedImage}
                  alt={selectedImageTitle}
                  className="max-h-[70vh] max-w-full object-contain rounded-lg shadow-md"
                />
              ) : (
                <div className="text-center text-slate-400 space-y-2 py-10">
                  <ImageIcon className="w-12 h-12 mx-auto text-slate-600" />
                  <p className="text-sm font-bold text-slate-300">{selectedImageTitle}</p>
                  <p className="text-xs text-slate-500">
                    Foto lampiran tercatat di database tiket. Jika tersimpan di Google Drive, buka melalui folder Drive master.
                  </p>
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-100 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition-colors"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
