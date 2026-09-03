export interface ParsedAttachment {
  id?: string;
  name: string;
  size?: string;
  type?: string;
  url?: string;
  dataUrl?: string;
  previewUrl?: string;
  isImage?: boolean;
}

export interface ParsedTicketDetails {
  cleanDescription: string;
  location: string;
  departmentAndTopic: string;
  attachments: ParsedAttachment[];
}

/**
 * Ekstrak Google Drive File ID dan dapatkan direct image preview URL
 */
export function getGoogleDriveFileId(url?: string): string | null {
  if (!url) return null;
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch && fileMatch[1]) return fileMatch[1];
  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) return idMatch[1];
  return null;
}

export function getDirectImagePreviewUrl(att: { url?: string; dataUrl?: string; name?: string; type?: string }): string | undefined {
  if (att.dataUrl && att.dataUrl.startsWith('data:image/')) {
    return att.dataUrl;
  }
  if (att.url) {
    const driveId = getGoogleDriveFileId(att.url);
    if (driveId) {
      // Direct high-res Google CDN thumbnail
      return `https://lh3.googleusercontent.com/d/${driveId}`;
    }
    // Direct URL if it's already an image URL
    return att.url;
  }
  return undefined;
}

export function isImageAttachment(att: { name?: string; type?: string; dataUrl?: string; url?: string }): boolean {
  if (att.dataUrl && att.dataUrl.startsWith('data:image/')) return true;
  if (att.type && att.type.startsWith('image/')) return true;
  if (att.name && /\.(png|jpe?g|gif|webp|svg|bmp|ico)$/i.test(att.name)) return true;
  if (att.url && /\.(png|jpe?g|gif|webp|svg|bmp|ico)(\?.*)?$/i.test(att.url)) return true;
  if (att.url && getGoogleDriveFileId(att.url)) {
    // If it's a drive file with an image-like name or default photo
    if (!att.name || /\.(png|jpe?g|gif|webp|svg|bmp|ico)$/i.test(att.name) || att.name.toLowerCase().includes('foto') || att.name.toLowerCase().includes('image') || att.name.toLowerCase().includes('download')) {
      return true;
    }
  }
  return false;
}

/**
 * Ekstrak lampiran berkas dari string teks mentah dan kembalikan teks yang sudah bersih
 */
export function extractAttachmentsAndCleanText(rawText: string): {
  cleanText: string;
  attachments: ParsedAttachment[];
} {
  if (!rawText) return { cleanText: '', attachments: [] };

  const attachments: ParsedAttachment[] = [];
  let text = rawText;

  // 1. Ekstrak format JSON: [Lampiran: [...] atau [Berkas Lampiran Pelapor: [...]] atau [Lampiran Berkas: [...]]
  const jsonMatch = text.match(/\[(?:Lampiran|Berkas Lampiran Pelapor|Lampiran Berkas):\s*(\[.*?\])\]/s);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[1]);
      if (Array.isArray(parsed)) {
        parsed.forEach(item => {
          const isImg = isImageAttachment(item);
          const preview = getDirectImagePreviewUrl(item);
          attachments.push({
            name: item.name || 'Lampiran Berkas',
            size: item.size || '',
            type: item.type || (isImg ? 'image/jpeg' : ''),
            url: item.url || '',
            dataUrl: item.dataUrl || item.data_url || '',
            previewUrl: preview,
            isImage: isImg
          });
        });
      }
    } catch {
      // Abaikan jika bukan JSON valid
    }
    text = text.replace(jsonMatch[0], '');
  }

  // 2. Ekstrak format teks baris: [Lampiran Berkas]: \n • nama: url atau • nama (size)
  const lines = text.split('\n');
  const remainingLines: string[] = [];
  let insideAttachmentBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (
      trimmed === '[Lampiran Berkas]:' ||
      trimmed === '[Lampiran]:' ||
      trimmed === '[Berkas Lampiran]:' ||
      trimmed === '[Berkas Lampiran Pelapor]:' ||
      trimmed.startsWith('[Lampiran Berkas]:')
    ) {
      insideAttachmentBlock = true;
      const restOfLine = trimmed.replace(/\[(?:Lampiran Berkas|Lampiran|Berkas Lampiran|Berkas Lampiran Pelapor)\]:?/, '').trim();
      if (restOfLine) {
        parseAttachmentLine(restOfLine, attachments);
      }
      continue;
    }

    if (trimmed.startsWith('• ') || (insideAttachmentBlock && (trimmed.startsWith('- ') || trimmed.startsWith('* ')))) {
      const lineContent = trimmed.replace(/^[•\-\*]\s*/, '').trim();
      if (lineContent) {
        parseAttachmentLine(lineContent, attachments);
        continue;
      }
    }

    // Check if line is a standalone Google Drive link or image link directly following an attachment block or raw in text
    const driveMatch = trimmed.match(/^(https?:\/\/drive\.google\.com\/[^\s]+)/);
    if (driveMatch) {
      const driveUrl = driveMatch[1];
      const driveId = getGoogleDriveFileId(driveUrl);
      attachments.push({
        name: 'Foto Bukti Lampiran',
        url: driveUrl,
        previewUrl: driveId ? `https://lh3.googleusercontent.com/d/${driveId}` : driveUrl,
        isImage: true
      });
      continue;
    }

    // Non-attachment line
    if (insideAttachmentBlock && trimmed === '') {
      // Empty line within attachment block might just be spacing
      continue;
    } else if (insideAttachmentBlock && !trimmed.startsWith('•') && !trimmed.startsWith('-')) {
      insideAttachmentBlock = false;
    }

    remainingLines.push(line);
  }

  let cleanText = remainingLines.join('\n').trim();

  return { cleanText, attachments };
}

function parseAttachmentLine(lineContent: string, attachments: ParsedAttachment[]) {
  // Format 1: nama.jpg: https://drive.google.com/...
  const urlMatch = lineContent.match(/^([^:]+):\s*(https?:\/\/[^\s]+)/);
  if (urlMatch) {
    const fileName = urlMatch[1].trim();
    const fileUrl = urlMatch[2].trim();
    const isImg = isImageAttachment({ name: fileName, url: fileUrl });
    const preview = getDirectImagePreviewUrl({ name: fileName, url: fileUrl });
    attachments.push({
      name: fileName,
      url: fileUrl,
      previewUrl: preview,
      isImage: isImg
    });
    return;
  }

  // Format 2: Direct URL without name prefix: https://drive.google.com/...
  const directUrlMatch = lineContent.match(/^(https?:\/\/[^\s]+)/);
  if (directUrlMatch) {
    const fileUrl = directUrlMatch[1].trim();
    const driveId = getGoogleDriveFileId(fileUrl);
    attachments.push({
      name: driveId ? 'Foto Lampiran (Google Drive)' : 'Lampiran Tautan',
      url: fileUrl,
      previewUrl: driveId ? `https://lh3.googleusercontent.com/d/${driveId}` : fileUrl,
      isImage: Boolean(driveId) || isImageAttachment({ url: fileUrl })
    });
    return;
  }

  // Format 3: nama.png (2.4 MB)
  const sizeMatch = lineContent.match(/^([^(]+)(?:\s*\(([^)]+)\))?/);
  if (sizeMatch) {
    const fileName = sizeMatch[1].trim();
    const size = sizeMatch[2] ? sizeMatch[2].trim() : '';
    const isImg = isImageAttachment({ name: fileName });
    attachments.push({
      name: fileName,
      size,
      isImage: isImg
    });
    return;
  }
}

export function parseTicketDetails(rawDescription: string, categoryFallback?: string, directAttachments?: any[]): ParsedTicketDetails {
  if (!rawDescription) {
    const direct: ParsedAttachment[] = [];
    if (Array.isArray(directAttachments)) {
      directAttachments.forEach(item => {
        const isImg = isImageAttachment(item);
        direct.push({
          name: item.name || 'Lampiran Berkas',
          size: item.size || '',
          type: item.type || (isImg ? 'image/jpeg' : ''),
          url: item.url || '',
          dataUrl: item.dataUrl || item.data_url || '',
          previewUrl: getDirectImagePreviewUrl(item),
          isImage: isImg
        });
      });
    }
    return {
      cleanDescription: '',
      location: 'Gedung Graha Pos Indonesia',
      departmentAndTopic: categoryFallback || 'Operasional Pos',
      attachments: direct
    };
  }

  let text = rawDescription;
  let location = '';
  let departmentAndTopic = categoryFallback || '';

  // 1. Extract [Lokasi: ...]
  const locMatch = text.match(/\[(?:Lokasi|Lokasi Kerja):\s*([^\]]+)\]/i);
  if (locMatch) {
    location = locMatch[1].trim();
    text = text.replace(locMatch[0], '');
  }

  // 2. Extract [Unit: ...]
  const unitMatch = text.match(/\[(?:Unit|Department):\s*([^\]]+)\]/i);
  if (unitMatch) {
    departmentAndTopic = unitMatch[1].trim();
    text = text.replace(unitMatch[0], '');
  }

  // 3. Extract all attachments & clean remaining text
  const { cleanText, attachments } = extractAttachmentsAndCleanText(text);

  // 4. Merge directAttachments if provided and not already present
  if (Array.isArray(directAttachments) && directAttachments.length > 0) {
    directAttachments.forEach(item => {
      const isImg = isImageAttachment(item);
      const url = item.url || item.dataUrl || item.data_url || '';
      if (!attachments.some(a => (a.url && a.url === url) || (a.dataUrl && a.dataUrl === url) || (a.name === item.name && a.size === item.size))) {
        attachments.push({
          name: item.name || 'Lampiran Berkas',
          size: item.size || '',
          type: item.type || (isImg ? 'image/jpeg' : ''),
          url: item.url || '',
          dataUrl: item.dataUrl || item.data_url || '',
          previewUrl: getDirectImagePreviewUrl(item),
          isImage: isImg
        });
      }
    });
  }

  return {
    cleanDescription: cleanText || rawDescription,
    location: location || 'Gedung Graha Pos Indonesia',
    departmentAndTopic: departmentAndTopic || categoryFallback || 'Operasional Pos',
    attachments
  };
}

export function parseThreadMessage(rawMessage: string): { cleanText: string; attachments: ParsedAttachment[] } {
  if (!rawMessage) return { cleanText: '', attachments: [] };

  let text = rawMessage;

  // Clean [Lokasi: ...] & [Unit: ...] if present
  text = text.replace(/\[(?:Lokasi|Lokasi Kerja):\s*([^\]]+)\]/gi, '');
  text = text.replace(/\[(?:Unit|Department):\s*([^\]]+)\]/gi, '');

  // Extract all attachments & clean text
  const { cleanText, attachments } = extractAttachmentsAndCleanText(text);

  return {
    cleanText,
    attachments
  };
}
