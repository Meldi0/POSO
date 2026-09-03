import { pool } from '../config/db.js';
import { hashPassword, verifyPassword, generateToken } from '../utils/auth.js';

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const cleanEmail = (email || '').toLowerCase().trim();

    if (!cleanEmail || !password) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Email dan kata sandi wajib diisi.'
      });
    }

    const [rows] = await pool.query(
      'SELECT * FROM users WHERE LOWER(email) = ? LIMIT 1',
      [cleanEmail]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        status: 'error',
        code: 401,
        message: 'Kombinasi email atau kata sandi tidak valid.'
      });
    }

    const user = rows[0];

    if (!user.is_active) {
      return res.status(403).json({
        status: 'error',
        code: 403,
        message: 'Akun Anda sedang dinonaktifkan. Silakan hubungi Administrator.'
      });
    }

    const isMatch = await verifyPassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        code: 401,
        message: 'Kombinasi email atau kata sandi tidak valid.'
      });
    }

    const token = generateToken({
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
      upt_unit: user.upt_unit
    });

    const userPayload = {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
      upt_unit: user.upt_unit,
      is_active: Boolean(user.is_active),
      nip: user.nip,
      department: user.department,
      role_title: user.role_title,
      avatar_url: user.avatar_url,
      jabatan_fungsional: user.jabatan_fungsional,
      kantor_penempatan: user.kantor_penempatan,
      phone_number: user.phone_number,
      nopen_kc: user.nopen_kc,
      nama_kc: user.nama_kc,
      nopen_kcu: user.nopen_kcu,
      nama_kcu: user.nama_kcu,
      regional_code: user.regional_code,
      regional_name: user.regional_name
    };

    // Log login
    try {
      await pool.query(
        'INSERT INTO audit_logs (log_id, actor_id, actor_name, actor_role, action, details) VALUES (?, ?, ?, ?, ?, ?)',
        [`LOG-${Date.now().toString().slice(-6)}`, user.user_id, user.name, user.role, 'LOGIN', `Login sukses role ${user.role}`]
      );
    } catch (e) {}

    return res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Login berhasil.',
      data: {
        token,
        user: userPayload
      }
    });
  } catch (err) {
    console.error('Error in login:', err);
    return res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Terjadi kesalahan sistem saat proses masuk.'
    });
  }
}

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    const cleanName = (name || '').trim();
    const cleanEmail = (email || '').toLowerCase().trim();

    if (!cleanName || !cleanEmail || !password) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Nama lengkap, email, dan kata sandi wajib diisi.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Kata sandi minimal 6 karakter.'
      });
    }

    // Check email uniqueness
    const [existing] = await pool.query(
      'SELECT user_id FROM users WHERE LOWER(email) = ? LIMIT 1',
      [cleanEmail]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        status: 'error',
        code: 409,
        message: 'Email sudah terdaftar. Silakan gunakan menu masuk (Sign In).'
      });
    }

    const userId = `USR-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const hashedPassword = await hashPassword(password);
    const enforcedRole = 'pengguna_umum';

    await pool.query(`
      INSERT INTO users (
        user_id, name, email, password_hash, role, is_active, created_by
      ) VALUES (?, ?, ?, ?, ?, 1, 'self_registration')
    `, [userId, cleanName, cleanEmail, hashedPassword, enforcedRole]);

    const userPayload = {
      user_id: userId,
      name: cleanName,
      email: cleanEmail,
      role: enforcedRole,
      is_active: true
    };

    const token = generateToken(userPayload);

    // Log registration
    try {
      await pool.query(
        'INSERT INTO audit_logs (log_id, actor_id, actor_name, actor_role, action, details) VALUES (?, ?, ?, ?, ?, ?)',
        [`LOG-${Date.now().toString().slice(-6)}`, userId, cleanName, enforcedRole, 'REGISTER', `Registrasi mandiri pelapor: ${cleanEmail}`]
      );
    } catch (e) {}

    return res.status(201).json({
      status: 'success',
      code: 201,
      message: 'Pendaftaran akun berhasil.',
      data: {
        token,
        user: userPayload
      }
    });
  } catch (err) {
    console.error('Error in register:', err);
    return res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Terjadi kesalahan sistem saat mendaftarkan akun.'
    });
  }
}

export async function getProfile(req, res) {
  if (!req.user) {
    return res.status(401).json({ status: 'error', code: 401, message: 'Belum login.' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT user_id, name, email, role, upt_unit, is_active, nip, department, role_title, avatar_url, jabatan_fungsional, kantor_penempatan, phone_number, nopen_kc, nama_kc, nopen_kcu, nama_kcu, regional_code, regional_name, created_at FROM users WHERE user_id = ? LIMIT 1',
      [req.user.user_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ status: 'error', code: 404, message: 'User tidak ditemukan.' });
    }

    return res.status(200).json({
      status: 'success',
      data: rows[0]
    });
  } catch (err) {
    console.error('Error in getProfile:', err);
    return res.status(500).json({ status: 'error', code: 500, message: 'Gagal mengambil profil.' });
  }
}
