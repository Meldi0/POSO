export interface ParsedTicketDetails {
  cleanDescription: string;
  location: string;
  departmentAndTopic: string;
  attachments: Array<{
    name: string;
    size: string;
    type: string;
    dataUrl?: string;
  }>;
}

export function parseTicketDetails(rawDescription: string, categoryFallback?: string): ParsedTicketDetails {
  if (!rawDescription) {
    return {
      cleanDescription: '',
      location: '-',
      departmentAndTopic: categoryFallback || '-',
      attachments: []
    };
  }

  let text = rawDescription;
  let location = '';
  let departmentAndTopic = categoryFallback || '';
  let attachments: Array<{ name: string; size: string; type: string; dataUrl?: string }> = [];

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

  // 3. Extract [Lampiran: ...]
  const attMatch = text.match(/\[Lampiran:\s*(\[.*?\])\]/s);
  if (attMatch) {
    try {
      attachments = JSON.parse(attMatch[1]);
      text = text.replace(attMatch[0], '');
    } catch {
      // ignore JSON parse error
    }
  }

  // Clean trailing/leading whitespace and newlines
  const cleanDescription = text.trim();

  return {
    cleanDescription: cleanDescription || rawDescription,
    location: location || 'Gedung Graha Pos Indonesia',
    departmentAndTopic: departmentAndTopic || categoryFallback || 'Operasional Pos',
    attachments
  };
}

export function parseThreadMessage(rawMessage: string) {
  if (!rawMessage) return { cleanText: '', attachments: [] };

  let text = rawMessage;
  let attachments: Array<{ name: string; size: string; type: string; dataUrl?: string }> = [];

  // Clean [Lokasi: ...] & [Unit: ...] if legacy message
  text = text.replace(/\[(?:Lokasi|Lokasi Kerja):\s*([^\]]+)\]/gi, '');
  text = text.replace(/\[(?:Unit|Department):\s*([^\]]+)\]/gi, '');

  // Extract [Lampiran: ...]
  const attMatch = text.match(/\[Lampiran:\s*(\[.*?\])\]/s);
  if (attMatch) {
    try {
      attachments = JSON.parse(attMatch[1]);
      text = text.replace(attMatch[0], '');
    } catch {
      // ignore
    }
  }

  return {
    cleanText: text.trim(),
    attachments
  };
}
