import { pool } from '../config/db.js';
import { hashPassword } from '../utils/auth.js';

export async function getUsers(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT 
        user_id, name, email, role, upt_unit, is_active,
        nip, department, role_title, avatar_url, jabatan_fungsional,
        kantor_penempatan, phone_number, nopen_kc, nama_kc, nopen_kcu,
        nama_kcu, regional_code, regional_name, created_by, created_at, updated_at
      FROM users 
      ORDER BY created_at DESC`
    );

    const formatted = rows.map(u => ({
      ...u,
      is_active: Boolean(u.is_active)
    }));

    return res.status(200).json({
      status: 'success',
      data: formatted
    });
  } catch (err) {
    console.error('Error in getUsers:', err);
    return res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Gagal memuat daftar pengguna.'
    });
  }
}

export async function createUser(req, res) {
  try {
    const adminUser = req.user;
    const {
      name,
      email,
      password = 'PosoDefault123!',
      role = 'operator',
      upt_unit,
      nip,
      department,
      role_title,
      avatar_url,
      jabatan_fungsional,
      kantor_penempatan,
      phone_number,
      nopen_kc,
      nama_kc,
      nopen_kcu,
      nama_kcu,
      regional_code,
      regional_name
    } = req.body;

    const cleanName = (name || '').trim();
    const cleanEmail = (email || '').toLowerCase().trim();

    if (!cleanName || !cleanEmail) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Nama lengkap dan email wajib diisi.'
      });
    }

    const [existing] = await pool.query('SELECT user_id FROM users WHERE LOWER(email) = ? LIMIT 1', [cleanEmail]);
    if (existing.length > 0) {
      return res.status(409).json({
        status: 'error',
        code: 409,
        message: 'Email sudah terdaftar dalam sistem.'
      });
    }

    const userId = `USR-${Date.now().toString().slice(-4)}${Math.floor(100 + Math.random() * 900)}`;
    const hashedPassword = await hashPassword(password);

    await pool.query(`
      INSERT INTO users (
        user_id, name, email, password_hash, role, upt_unit, is_active,
        nip, department, role_title, avatar_url, jabatan_fungsional,
        kantor_penempatan, phone_number, nopen_kc, nama_kc, nopen_kcu,
        nama_kcu, regional_code, regional_name, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      userId, cleanName, cleanEmail, hashedPassword, role, role === 'upt' ? upt_unit : null,
      nip || null, department || null, role_title || null, avatar_url || null,
      jabatan_fungsional || null, kantor_penempatan || null, phone_number || null,
      nopen_kc || null, nama_kc || null, nopen_kcu || null, nama_kcu || null,
      regional_code || null, regional_name || null, adminUser ? adminUser.email : 'admin@poso.local'
    ]);

    // Audit log
    try {
      await pool.query(`
        INSERT INTO audit_logs (log_id, actor_id, actor_name, actor_role, action, details)
        VALUES (?, ?, ?, ?, 'CREATE_USER', ?)
      `, [
        `LOG-${Date.now().toString().slice(-6)}`, adminUser ? adminUser.user_id : 'ADMIN',
        adminUser ? adminUser.name : 'Administrator', adminUser ? adminUser.role : 'admin',
        `Admin membuat akun ${role} untuk ${cleanEmail}`
      ]);
    } catch (e) {}

    const [newUser] = await pool.query('SELECT * FROM users WHERE user_id = ?', [userId]);

    return res.status(201).json({
      status: 'success',
      code: 201,
      message: 'Pengguna baru berhasil ditambahkan.',
      data: newUser[0]
    });
  } catch (err) {
    console.error('Error in createUser:', err);
    return res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Gagal membuat pengguna baru.'
    });
  }
}

export async function updateUserRole(req, res) {
  try {
    const adminUser = req.user;
    const { id } = req.params;
    const { new_role, new_upt_unit, is_active, reset_password } = req.body;

    const [existing] = await pool.query('SELECT * FROM users WHERE user_id = ? LIMIT 1', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'Pengguna tidak ditemukan.'
      });
    }

    const curr = existing[0];
    const updates = [];
    const params = [];
    const changeLogs = [];

    if (new_role && new_role !== curr.role) {
      updates.push('role = ?');
      params.push(new_role);
      changeLogs.push(`Role: ${curr.role} -> ${new_role}`);
    }

    if (new_upt_unit !== undefined) {
      updates.push('upt_unit = ?');
      params.push(new_upt_unit || null);
      changeLogs.push(`UPT: ${curr.upt_unit || 'None'} -> ${new_upt_unit || 'None'}`);
    }

    if (is_active !== undefined && is_active !== curr.is_active) {
      updates.push('is_active = ?');
      params.push(is_active ? 1 : 0);
      changeLogs.push(`Status aktif: ${is_active}`);
    }

    if (reset_password) {
      const hashedPassword = await hashPassword(reset_password);
      updates.push('password_hash = ?');
      params.push(hashedPassword);
      changeLogs.push('Password di-reset');
    }

    if (updates.length > 0) {
      await pool.query(
        `UPDATE users SET ${updates.join(', ')}, updated_at = NOW() WHERE user_id = ?`,
        [...params, id]
      );

      try {
        await pool.query(`
          INSERT INTO audit_logs (log_id, actor_id, actor_name, actor_role, action, details)
          VALUES (?, ?, ?, ?, 'UPDATE_USER_ROLE', ?)
        `, [
          `LOG-${Date.now().toString().slice(-6)}`, adminUser ? adminUser.user_id : 'ADMIN',
          adminUser ? adminUser.name : 'Administrator', adminUser ? adminUser.role : 'admin',
          `Ubah user ${curr.email}: ${changeLogs.join('; ')}`
        ]);
      } catch (e) {}
    }

    const [updated] = await pool.query('SELECT * FROM users WHERE user_id = ?', [id]);

    return res.status(200).json({
      status: 'success',
      message: 'Data pengguna berhasil diperbarui.',
      data: updated[0]
    });
  } catch (err) {
    console.error('Error in updateUserRole:', err);
    return res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Gagal memperbarui data pengguna.'
    });
  }
}

export async function deleteUser(req, res) {
  try {
    const adminUser = req.user;
    const { id } = req.params;

    const [existing] = await pool.query('SELECT * FROM users WHERE user_id = ? LIMIT 1', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'Pengguna tidak ditemukan.'
      });
    }

    const targetUser = existing[0];

    // Protection for Super Admin
    if (targetUser.email === 'admin@poso.local' || targetUser.user_id === 'USR-ADMIN01') {
      return res.status(403).json({
        status: 'error',
        code: 403,
        message: 'Akun Super Administrator Utama dilindungi dan tidak dapat dihapus.'
      });
    }

    await pool.query('DELETE FROM users WHERE user_id = ?', [id]);

    try {
      await pool.query(`
        INSERT INTO audit_logs (log_id, actor_id, actor_name, actor_role, action, details)
        VALUES (?, ?, ?, ?, 'DELETE_USER', ?)
      `, [
        `LOG-${Date.now().toString().slice(-6)}`, adminUser ? adminUser.user_id : 'ADMIN',
        adminUser ? adminUser.name : 'Administrator', adminUser ? adminUser.role : 'admin',
        `Hapus akun ${targetUser.name} (${targetUser.email})`
      ]);
    } catch (e) {}

    return res.status(200).json({
      status: 'success',
      message: `Akun ${targetUser.name} (${targetUser.email}) berhasil dihapus permanen dari database.`
    });
  } catch (err) {
    console.error('Error in deleteUser:', err);
    return res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Gagal menghapus pengguna.'
    });
  }
}
