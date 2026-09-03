import { pool } from '../config/db.js';

export function isUptUnitMatch(userUnit, ticketUnit) {
  if (!userUnit || !ticketUnit) return false;
  const u = userUnit.toLowerCase().trim();
  const t = ticketUnit.toLowerCase().trim();
  if (u === t) return true;
  if ((u.includes('ti') || u.includes('it') || u.includes('jaringan') || u.includes('sistem')) &&
      (t.includes('ti') || t.includes('it') || t.includes('jaringan') || t.includes('sistem'))) {
    return true;
  }
  if ((u.includes('sarpras') || u.includes('sarana') || u.includes('cgs')) &&
      (t.includes('sarpras') || t.includes('sarana') || t.includes('cgs'))) {
    return true;
  }
  if ((u.includes('sec') || u.includes('keamanan') || u.includes('security')) &&
      (t.includes('sec') || t.includes('keamanan') || t.includes('security'))) {
    return true;
  }
  if ((u.includes('qc') || u.includes('quality')) &&
      (t.includes('qc') || t.includes('quality'))) {
    return true;
  }
  return u.includes(t) || t.includes(u);
}

export async function getTickets(req, res) {
  try {
    const user = req.user;
    const {
      status,
      priority,
      category,
      assigned_upt,
      search,
      page = 1,
      limit = 50,
      requester_email
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const offset = (pageNum - 1) * limitNum;

    let conditions = ['1=1'];
    let params = [];

    // RBAC Permissions Filter
    if (user) {
      if (user.role === 'pengguna_umum') {
        conditions.push('LOWER(requester_email) = ?');
        params.push(user.email.toLowerCase().trim());
      } else if (user.role === 'upt' && user.upt_unit) {
        const unit = user.upt_unit.toLowerCase().trim();
        if (unit.includes('ti') || unit.includes('it') || unit.includes('jaringan') || unit.includes('sistem')) {
          conditions.push('(LOWER(assigned_upt) LIKE ? OR LOWER(assigned_upt) LIKE ? OR LOWER(assigned_upt) LIKE ? OR LOWER(requester_email) = ?)');
          params.push('%ti%', '%jaringan%', '%sistem%', user.email.toLowerCase().trim());
        } else if (unit.includes('sarpras') || unit.includes('sarana') || unit.includes('cgs')) {
          conditions.push('(LOWER(assigned_upt) LIKE ? OR LOWER(assigned_upt) LIKE ? OR LOWER(assigned_upt) LIKE ? OR LOWER(requester_email) = ?)');
          params.push('%sarana%', '%sarpras%', '%cgs%', user.email.toLowerCase().trim());
        } else if (unit.includes('sec') || unit.includes('keamanan') || unit.includes('security')) {
          conditions.push('(LOWER(assigned_upt) LIKE ? OR LOWER(assigned_upt) LIKE ? OR LOWER(requester_email) = ?)');
          params.push('%security%', '%keamanan%', user.email.toLowerCase().trim());
        } else if (unit.includes('qc') || unit.includes('quality')) {
          conditions.push('(LOWER(assigned_upt) LIKE ? OR LOWER(assigned_upt) LIKE ? OR LOWER(requester_email) = ?)');
          params.push('%quality%', '%qc%', user.email.toLowerCase().trim());
        } else {
          conditions.push('(LOWER(assigned_upt) = ? OR LOWER(assigned_upt) LIKE ? OR LOWER(requester_email) = ?)');
          params.push(unit, `%${unit}%`, user.email.toLowerCase().trim());
        }
      }
    } else if (requester_email) {
      conditions.push('LOWER(requester_email) = ?');
      params.push(requester_email.toLowerCase().trim());
    }

    // Query Filters
    if (status && status !== 'all') {
      conditions.push('LOWER(status) = ?');
      params.push(status.toLowerCase().trim());
    }
    if (priority && priority !== 'all') {
      conditions.push('LOWER(priority) = ?');
      params.push(priority.toLowerCase().trim());
    }
    if (category && category !== 'all') {
      conditions.push('LOWER(category) = ?');
      params.push(category.toLowerCase().trim());
    }
    if (assigned_upt && assigned_upt !== 'all') {
      conditions.push('LOWER(assigned_upt) = ?');
      params.push(assigned_upt.toLowerCase().trim());
    }
    if (search && search.trim()) {
      const q = `%${search.trim().toLowerCase()}%`;
      conditions.push('(LOWER(ticket_id) LIKE ? OR LOWER(subject) LIKE ? OR LOWER(description) LIKE ? OR LOWER(requester_email) LIKE ? OR LOWER(requester_name) LIKE ?)');
      params.push(q, q, q, q, q);
    }

    const whereClause = conditions.join(' AND ');

    // Count Total
    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM tickets WHERE ${whereClause}`,
      params
    );
    const total = countRows[0].total;

    // Fetch Paginated Records
    const [rows] = await pool.query(
      `SELECT * FROM tickets WHERE ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limitNum, offset]
    );

    const formattedRows = rows.map(t => ({
      ...t,
      is_archived: Boolean(t.is_archived)
    }));

    return res.status(200).json({
      status: 'success',
      data: {
        tickets: formattedRows,
        total,
        page: pageNum,
        limit: limitNum,
        total_pages: Math.ceil(total / limitNum)
      }
    });
  } catch (err) {
    console.error('Error in getTickets:', err);
    return res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Gagal memuat daftar tiket.'
    });
  }
}

export async function getTicketDetail(req, res) {
  try {
    const { id } = req.params;
    const user = req.user;

    const [ticketRows] = await pool.query(
      'SELECT * FROM tickets WHERE ticket_id = ? LIMIT 1',
      [id]
    );

    if (ticketRows.length === 0) {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'Tiket tidak ditemukan di sistem POSO.'
      });
    }

    const ticket = ticketRows[0];

    // RBAC Access Check
    if (user && user.role === 'pengguna_umum') {
      if (ticket.requester_email.toLowerCase() !== user.email.toLowerCase()) {
        return res.status(403).json({
          status: 'error',
          code: 403,
          message: 'Anda tidak memiliki wewenang untuk mengakses tiket ini.'
        });
      }
    }

    // Fetch threads
    const isStaff = user && (user.role === 'operator' || user.role === 'upt' || user.role === 'admin');
    let threadQuery = 'SELECT * FROM threads WHERE ticket_id = ?';
    const threadParams = [id];

    if (!isStaff) {
      threadQuery += " AND visibility = 'public'";
    }
    threadQuery += ' ORDER BY created_at ASC';

    const [threadRows] = await pool.query(threadQuery, threadParams);

    return res.status(200).json({
      status: 'success',
      data: {
        ticket,
        threads: threadRows
      }
    });
  } catch (err) {
    console.error('Error in getTicketDetail:', err);
    return res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Gagal memuat rincian tiket.'
    });
  }
}

export async function trackTicket(req, res) {
  try {
    const { id } = req.params;
    const { email } = req.query;

    const [ticketRows] = await pool.query(
      'SELECT * FROM tickets WHERE ticket_id = ? LIMIT 1',
      [id.trim()]
    );

    if (ticketRows.length === 0) {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'Nomor ID tiket tidak ditemukan di sistem POSO.'
      });
    }

    const ticket = ticketRows[0];

    if (email && email.trim()) {
      if (ticket.requester_email.toLowerCase().trim() !== email.toLowerCase().trim()) {
        return res.status(403).json({
          status: 'error',
          code: 403,
          message: 'Alamat email pelapor tidak cocok dengan tiket ini.'
        });
      }
    }

    // Only public threads for tracker
    const [threadRows] = await pool.query(
      "SELECT * FROM threads WHERE ticket_id = ? AND visibility = 'public' ORDER BY created_at ASC",
      [id.trim()]
    );

    return res.status(200).json({
      status: 'success',
      data: {
        ticket,
        threads: threadRows
      }
    });
  } catch (err) {
    console.error('Error in trackTicket:', err);
    return res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Terjadi kesalahan saat melacak tiket.'
    });
  }
}

export async function createTicket(req, res) {
  const connection = await pool.getConnection();
  try {
    const user = req.user;
    const {
      subject,
      category,
      department,
      topic,
      location,
      description,
      priority = 'Medium',
      channel = 'web',
      requester_name,
      requester_email,
      requester_phone,
      assigned_upt,
      assigned_operator,
      attachments = []
    } = req.body;

    const cleanSubject = (subject || '').trim();
    const cleanDesc = (description || '').trim();
    const cleanCategory = (category || 'Umum').trim();
    const emailToUse = user ? user.email : (requester_email || '').toLowerCase().trim();
    const nameToUse = user ? user.name : (requester_name || 'Pelapor').trim();

    if (!cleanSubject || !cleanDesc || !emailToUse) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Subjek, deskripsi, dan email pelapor wajib diisi.'
      });
    }

    // SLA Calculation
    const now = new Date();
    let slaHours = 24;
    const prioLower = priority.toLowerCase();
    if (prioLower === 'urgent') slaHours = 2;
    else if (prioLower === 'high') slaHours = 8;
    else if (prioLower === 'low') slaHours = 72;
    const slaDueDate = new Date(now.getTime() + slaHours * 3600000);

    const datePrefix = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const ticketId = `TICK-${datePrefix}-${randomSuffix}`;
    const threadId = `TH-${Date.now().toString().slice(-6)}`;

    await connection.beginTransaction();

    // 1. Insert into tickets
    await connection.query(`
      INSERT INTO tickets (
        ticket_id, subject, category, department, topic, location, description,
        priority, status, channel, requester_name, requester_email, requester_phone,
        assigned_upt, assigned_operator, sla_due_at, attachments
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'open', ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      ticketId, cleanSubject, cleanCategory, department || null, topic || null, location || null,
      cleanDesc, priority, channel, nameToUse, emailToUse, requester_phone || null,
      assigned_upt || null, assigned_operator || null, slaDueDate, JSON.stringify(attachments)
    ]);

    // 2. Insert initial thread message
    let initialMessage = cleanDesc;
    if (attachments && attachments.length > 0) {
      const attLines = attachments.map(a => `• ${a.name || 'lampiran'}: ${a.url || a.dataUrl || ''}`).join('\n');
      initialMessage += `\n\n[Lampiran Berkas]:\n${attLines}`;
    }

    await connection.query(`
      INSERT INTO threads (
        thread_id, ticket_id, sender_id, sender_name, sender_role, message, visibility
      ) VALUES (?, ?, ?, ?, ?, ?, 'public')
    `, [
      threadId, ticketId, user ? user.user_id : 'USR-PUBLIC', nameToUse,
      user ? user.role : 'pengguna_umum', initialMessage
    ]);

    // 3. Log to audit_logs
    await connection.query(`
      INSERT INTO audit_logs (
        log_id, ticket_id, actor_id, actor_name, actor_role, action, details
      ) VALUES (?, ?, ?, ?, ?, 'CREATE_TICKET', ?)
    `, [
      `LOG-${Date.now().toString().slice(-6)}`, ticketId, user ? user.user_id : 'USR-PUBLIC',
      nameToUse, user ? user.role : 'pengguna_umum', `Tiket dibuat oleh ${emailToUse}: ${cleanSubject}`
    ]);

    await connection.commit();

    const [newTicket] = await connection.query('SELECT * FROM tickets WHERE ticket_id = ?', [ticketId]);

    return res.status(201).json({
      status: 'success',
      code: 201,
      message: 'Tiket berhasil dibuat dan tersimpan di database.',
      data: newTicket[0]
    });
  } catch (err) {
    await connection.rollback();
    console.error('Error in createTicket:', err);
    return res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Gagal membuat tiket baru.'
    });
  } finally {
    connection.release();
  }
}

export async function updateTicketStatus(req, res) {
  const connection = await pool.getConnection();
  try {
    const user = req.user;
    const { id } = req.params;
    const { status, priority, assigned_upt, assigned_operator, is_archived } = req.body;

    if (user && user.role === 'pengguna_umum') {
      return res.status(403).json({
        status: 'error',
        code: 403,
        message: 'Pelapor tidak berwenang mengubah status atau disposisi tiket.'
      });
    }

    const [existing] = await connection.query('SELECT * FROM tickets WHERE ticket_id = ? LIMIT 1', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'Tiket tidak ditemukan.'
      });
    }

    const curr = existing[0];

    // UPT restriction: can only process their assigned tickets
    if (user && user.role === 'upt') {
      if (user.upt_unit && curr.assigned_upt && !isUptUnitMatch(user.upt_unit, curr.assigned_upt)) {
        return res.status(403).json({
          status: 'error',
          code: 403,
          message: 'UPT hanya berwenang memproses tiket yang didelegasikan ke unitnya.'
        });
      }
    }

    const updates = [];
    const params = [];
    const changeLogs = [];

    if (status && status !== curr.status) {
      updates.push('status = ?');
      params.push(status);
      changeLogs.push(`Status: ${curr.status} -> ${status}`);
      if (status === 'closed') {
        updates.push('closed_at = NOW()');
      }
    }

    if (priority && priority !== curr.priority) {
      updates.push('priority = ?');
      params.push(priority);
      changeLogs.push(`Prioritas: ${curr.priority} -> ${priority}`);
    }

    if (assigned_upt !== undefined && assigned_upt !== curr.assigned_upt) {
      updates.push('assigned_upt = ?');
      params.push(assigned_upt || null);
      changeLogs.push(`UPT: ${curr.assigned_upt || 'None'} -> ${assigned_upt || 'None'}`);
    }

    if (assigned_operator !== undefined && assigned_operator !== curr.assigned_operator) {
      updates.push('assigned_operator = ?');
      params.push(assigned_operator || null);
      changeLogs.push(`Operator: ${curr.assigned_operator || 'None'} -> ${assigned_operator || 'None'}`);
    }

    if (is_archived !== undefined) {
      const archVal = is_archived ? 1 : 0;
      updates.push('is_archived = ?');
      params.push(archVal);
      changeLogs.push(archVal ? 'Tiket dipindahkan ke arsip' : 'Tiket dipulihkan dari arsip');
    }

    if (updates.length === 0) {
      return res.status(200).json({
        status: 'success',
        message: 'Tidak ada perubahan data.',
        data: curr
      });
    }

    await connection.beginTransaction();

    await connection.query(`
      UPDATE tickets SET ${updates.join(', ')}, updated_at = NOW() WHERE ticket_id = ?
    `, [...params, id]);

    // Audit log
    await connection.query(`
      INSERT INTO audit_logs (
        log_id, ticket_id, actor_id, actor_name, actor_role, action, details
      ) VALUES (?, ?, ?, ?, ?, 'UPDATE_TICKET', ?)
    `, [
      `LOG-${Date.now().toString().slice(-6)}`, id, user ? user.user_id : 'STAFF',
      user ? user.name : 'Staff Helpdesk', user ? user.role : 'operator', changeLogs.join('; ')
    ]);

    await connection.commit();

    const [updated] = await connection.query('SELECT * FROM tickets WHERE ticket_id = ?', [id]);

    return res.status(200).json({
      status: 'success',
      message: 'Status tiket berhasil diperbarui.',
      data: updated[0]
    });
  } catch (err) {
    await connection.rollback();
    console.error('Error in updateTicketStatus:', err);
    return res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Gagal memperbarui status tiket.'
    });
  } finally {
    connection.release();
  }
}

export async function addThreadMessage(req, res) {
  try {
    const user = req.user;
    const { id } = req.params;
    const {
      message,
      visibility = 'public',
      sender_name,
      sender_id,
      sender_role
    } = req.body;

    const cleanMsg = (message || '').trim();
    if (!cleanMsg) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Pesan obrolan tidak boleh kosong.'
      });
    }

    const [ticketRows] = await pool.query('SELECT * FROM tickets WHERE ticket_id = ? LIMIT 1', [id]);
    if (ticketRows.length === 0) {
      return res.status(404).json({ status: 'error', code: 404, message: 'Tiket tidak ditemukan.' });
    }

    const isCustomer = (user && user.role === 'pengguna_umum') || sender_role === 'pengguna_umum' || !user;
    let finalVisibility = visibility.toLowerCase() === 'internal' ? 'internal' : 'public';

    // General user cannot post internal notes
    if (isCustomer) {
      finalVisibility = 'public';
    }

    const finalSenderId = user ? user.user_id : (sender_id || 'USR-PUBLIC');
    const finalSenderName = user ? user.name : (sender_name || 'Pelapor');
    const finalSenderRole = user ? user.role : 'pengguna_umum';

    // Deduplication check: check if identical message was posted in the last 5 seconds
    const [recent] = await pool.query(
      'SELECT thread_id FROM threads WHERE ticket_id = ? AND sender_id = ? AND message = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 5 SECOND) LIMIT 1',
      [id, finalSenderId, cleanMsg]
    );

    if (recent.length > 0) {
      const [existingMsg] = await pool.query('SELECT * FROM threads WHERE thread_id = ?', [recent[0].thread_id]);
      return res.status(200).json({
        status: 'success',
        message: 'Pesan sudah terkirim (idempotent).',
        data: existingMsg[0]
      });
    }

    const threadId = `TH-${Date.now().toString().slice(-6)}`;

    await pool.query(`
      INSERT INTO threads (
        thread_id, ticket_id, sender_id, sender_name, sender_role, message, visibility
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      threadId, id, finalSenderId, finalSenderName, finalSenderRole, cleanMsg, finalVisibility
    ]);

    await pool.query('UPDATE tickets SET updated_at = NOW() WHERE ticket_id = ?', [id]);

    const [createdThread] = await pool.query('SELECT * FROM threads WHERE thread_id = ?', [threadId]);

    return res.status(201).json({
      status: 'success',
      message: 'Pesan berhasil dikirim.',
      data: createdThread[0]
    });
  } catch (err) {
    console.error('Error in addThreadMessage:', err);
    return res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Gagal mengirim pesan obrolan.'
    });
  }
}
