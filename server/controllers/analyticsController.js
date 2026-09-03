import { pool } from '../config/db.js';

export async function getAnalytics(req, res) {
  try {
    const user = req.user;
    let baseWhere = '1=1';
    let params = [];

    if (user && user.role === 'upt' && user.upt_unit) {
      baseWhere = 'LOWER(assigned_upt) = ?';
      params.push(user.upt_unit.toLowerCase().trim());
    }

    // 1. By Status
    const [statusRows] = await pool.query(
      `SELECT status, COUNT(*) AS count FROM tickets WHERE ${baseWhere} GROUP BY status`,
      params
    );
    const by_status = { open: 0, in_progress: 0, waiting: 0, closed: 0 };
    statusRows.forEach(r => {
      if (by_status[r.status] !== undefined) by_status[r.status] = Number(r.count);
    });

    // 2. By Priority
    const [priorityRows] = await pool.query(
      `SELECT priority, COUNT(*) AS count FROM tickets WHERE ${baseWhere} GROUP BY priority`,
      params
    );
    const by_priority = { Low: 0, Medium: 0, High: 0, Urgent: 0 };
    priorityRows.forEach(r => {
      if (by_priority[r.priority] !== undefined) by_priority[r.priority] = Number(r.count);
    });

    // 3. By Category
    const [categoryRows] = await pool.query(
      `SELECT category, COUNT(*) AS count FROM tickets WHERE ${baseWhere} GROUP BY category`,
      params
    );
    const by_category = {};
    categoryRows.forEach(r => {
      by_category[r.category] = Number(r.count);
    });

    // 4. By UPT
    const [uptRows] = await pool.query(
      `SELECT COALESCE(assigned_upt, 'Belum Di-assign') AS upt, COUNT(*) AS count FROM tickets WHERE ${baseWhere} GROUP BY assigned_upt`,
      params
    );
    const by_upt = {};
    uptRows.forEach(r => {
      by_upt[r.upt] = Number(r.count);
    });

    // 5. Total Tickets
    const [totalRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM tickets WHERE ${baseWhere}`,
      params
    );
    const total = totalRows[0].total;

    // 6. SLA Breached
    const [slaRows] = await pool.query(
      `SELECT COUNT(*) AS breached FROM tickets WHERE ${baseWhere} AND status != 'closed' AND sla_due_at < NOW()`,
      params
    );
    const sla_breached = Number(slaRows[0]?.breached || 0);

    // 7. Average Resolution Hours
    const [avgRows] = await pool.query(
      `SELECT AVG(TIMESTAMPDIFF(HOUR, created_at, closed_at)) AS avg_hours 
       FROM tickets 
       WHERE ${baseWhere} AND status = 'closed' AND closed_at IS NOT NULL`,
      params
    );
    const avg_resolution_hours = parseFloat(Number(avgRows[0]?.avg_hours || 0).toFixed(1));

    return res.status(200).json({
      status: 'success',
      data: {
        total,
        by_status,
        by_priority,
        by_category,
        by_upt,
        sla_breached,
        avg_resolution_hours
      }
    });
  } catch (err) {
    console.error('Error in getAnalytics:', err);
    return res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Gagal memuat analitik tiket.'
    });
  }
}

export async function getAuditLogs(req, res) {
  try {
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '50', 10)));
    const [rows] = await pool.query(
      'SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT ?',
      [limit]
    );

    return res.status(200).json({
      status: 'success',
      data: rows
    });
  } catch (err) {
    console.error('Error in getAuditLogs:', err);
    return res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Gagal memuat audit log.'
    });
  }
}

export async function getFeatureFlags(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT config_value FROM system_config WHERE config_key = 'FEATURE_FLAGS' LIMIT 1"
    );

    if (rows.length === 0) {
      return res.status(200).json({ status: 'success', data: {} });
    }

    const value = typeof rows[0].config_value === 'string'
      ? JSON.parse(rows[0].config_value)
      : rows[0].config_value;

    return res.status(200).json({
      status: 'success',
      data: value
    });
  } catch (err) {
    console.error('Error in getFeatureFlags:', err);
    return res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Gagal memuat feature flags.'
    });
  }
}

export async function updateFeatureFlags(req, res) {
  try {
    const { feature_flags } = req.body;
    if (!feature_flags) {
      return res.status(400).json({ status: 'error', code: 400, message: 'feature_flags wajib dikirim.' });
    }

    await pool.query(`
      INSERT INTO system_config (config_key, config_value, description)
      VALUES ('FEATURE_FLAGS', ?, 'Matriks hak akses fitur per role RBAC')
      ON DUPLICATE KEY UPDATE config_value = VALUES(config_value)
    `, [JSON.stringify(feature_flags)]);

    return res.status(200).json({
      status: 'success',
      message: 'Feature flags berhasil diperbarui.',
      data: feature_flags
    });
  } catch (err) {
    console.error('Error in updateFeatureFlags:', err);
    return res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Gagal memperbarui feature flags.'
    });
  }
}

export async function getDbStatus(req, res) {
  const start = Date.now();
  try {
    const connection = await pool.getConnection();
    let version = '';
    let dbName = '';
    let tableCounts = {};

    try {
      const [verRows] = await connection.query('SELECT VERSION() AS ver, DATABASE() AS current_db');
      version = verRows[0].ver;
      dbName = verRows[0].current_db;

      const [uRows] = await connection.query('SELECT COUNT(*) AS c FROM users');
      const [tRows] = await connection.query('SELECT COUNT(*) AS c FROM tickets');
      const [thRows] = await connection.query('SELECT COUNT(*) AS c FROM threads');
      const [aRows] = await connection.query('SELECT COUNT(*) AS c FROM audit_logs');

      tableCounts = {
        users: uRows[0].c,
        tickets: tRows[0].c,
        threads: thRows[0].c,
        audit_logs: aRows[0].c
      };
    } finally {
      connection.release();
    }

    const latency = Date.now() - start;

    return res.status(200).json({
      status: 'success',
      data: {
        database_engine: 'Aiven for MySQL',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 21970,
        database_name: dbName,
        ssl_mode: 'REQUIRED',
        ssl_active: true,
        latency_ms: latency,
        mysql_version: version,
        table_counts: tableCounts,
        connection_pool: {
          connection_limit: 10,
          status: 'HEALTHY'
        }
      }
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      code: 500,
      message: `Database error: ${err.message}`,
      latency_ms: Date.now() - start
    });
  }
}
