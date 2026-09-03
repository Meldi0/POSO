import http from 'http';
import { pool } from '../config/db.js';
import app from '../server.js';

const TEST_PORT = 5055;

function makeRequest(path, method = 'GET', body = null, token = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const headers = {
      'Accept': 'application/json'
    };
    if (payload) {
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = Buffer.byteLength(payload);
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request({
      hostname: 'localhost',
      port: TEST_PORT,
      path,
      method,
      headers
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runE2ETests() {
  console.log('===============================================================');
  console.log('      RUNNING E2E API & AIVEN MYSQL INTEGRATION TESTS          ');
  console.log('===============================================================');

  const server = app.listen(TEST_PORT);
  await new Promise(r => setTimeout(r, 600));

  try {
    // 1. Health check
    console.log('[TEST 1] Testing GET /api/health...');
    const health = await makeRequest('/api/health');
    console.log(`  -> Status: ${health.status}, DB: ${health.body?.database}, Latency: ${health.body?.latency_ms}ms`);
    if (health.status !== 200 || health.body?.database !== 'defaultdb') {
      throw new Error('Health check failed');
    }

    // 2. Admin Login
    console.log('[TEST 2] Testing POST /api/auth/login (Super Admin)...');
    const adminLogin = await makeRequest('/api/auth/login', 'POST', {
      email: 'admin@poso.local',
      password: 'Admin123!'
    });
    console.log(`  -> Status: ${adminLogin.status}, Role: ${adminLogin.body?.data?.user?.role}`);
    if (adminLogin.status !== 200 || !adminLogin.body?.data?.token) {
      throw new Error('Admin login failed: ' + JSON.stringify(adminLogin.body));
    }
    const adminToken = adminLogin.body.data.token;

    // 3. Operator Login
    console.log('[TEST 3] Testing POST /api/auth/login (Operator)...');
    const opLogin = await makeRequest('/api/auth/login', 'POST', {
      email: 'operator@poso.local',
      password: 'Operator123!'
    });
    console.log(`  -> Status: ${opLogin.status}, Role: ${opLogin.body?.data?.user?.role}`);
    if (opLogin.status !== 200) {
      throw new Error('Operator login failed');
    }
    const opToken = opLogin.body.data.token;

    // 4. Register new general user
    const testEmail = `pelapor_${Date.now()}@example.com`;
    console.log(`[TEST 4] Testing POST /api/auth/register (${testEmail})...`);
    const regRes = await makeRequest('/api/auth/register', 'POST', {
      name: 'Budi Pelapor Pengujian',
      email: testEmail,
      password: 'Pelapor123!'
    });
    console.log(`  -> Status: ${regRes.status}, User ID: ${regRes.body?.data?.user?.user_id}`);
    if (regRes.status !== 201 || !regRes.body?.data?.token) {
      throw new Error('Register user failed');
    }
    const pelaporToken = regRes.body.data.token;

    // 5. Create Ticket
    console.log('[TEST 5] Testing POST /api/tickets (Create Ticket)...');
    const createTicketRes = await makeRequest('/api/tickets', 'POST', {
      subject: 'Uji Integrasi Tiket Aiven MySQL',
      category: 'Infrastruktur',
      description: 'Deskripsi tiket pengujian otomatis langsung ke Aiven MySQL.',
      priority: 'High',
      requester_name: 'Budi Pelapor',
      requester_email: testEmail
    }, pelaporToken);
    console.log(`  -> Status: ${createTicketRes.status}, Ticket ID: ${createTicketRes.body?.data?.ticket_id}`);
    if (createTicketRes.status !== 201) {
      throw new Error('Create ticket failed: ' + JSON.stringify(createTicketRes.body));
    }
    const newTicketId = createTicketRes.body.data.ticket_id;

    // 6. Get Ticket Detail
    console.log(`[TEST 6] Testing GET /api/tickets/${newTicketId}...`);
    const detailRes = await makeRequest(`/api/tickets/${newTicketId}`, 'GET', null, pelaporToken);
    console.log(`  -> Status: ${detailRes.status}, Subject: ${detailRes.body?.data?.ticket?.subject}`);
    if (detailRes.status !== 200) {
      throw new Error('Get ticket detail failed');
    }

    // 7. Update Status (Triage by Operator)
    console.log(`[TEST 7] Testing PATCH /api/tickets/${newTicketId}/status (Operator Triage)...`);
    const updateRes = await makeRequest(`/api/tickets/${newTicketId}/status`, 'PATCH', {
      ticket_id: newTicketId,
      status: 'in_progress',
      assigned_upt: 'UPT TI & Jaringan'
    }, opToken);
    console.log(`  -> Status: ${updateRes.status}, New Status: ${updateRes.body?.data?.status}`);
    if (updateRes.status !== 200 || updateRes.body?.data?.status !== 'in_progress') {
      throw new Error('Update ticket status failed');
    }

    // 8. Add Thread Message
    console.log(`[TEST 8] Testing POST /api/tickets/${newTicketId}/threads...`);
    const threadRes = await makeRequest(`/api/tickets/${newTicketId}/threads`, 'POST', {
      ticket_id: newTicketId,
      message: 'Halo, laporan sedang kami tangani di server Aiven MySQL.',
      visibility: 'public'
    }, opToken);
    console.log(`  -> Status: ${threadRes.status}, Thread ID: ${threadRes.body?.data?.thread_id}`);
    if (threadRes.status !== 201) {
      throw new Error('Add thread message failed');
    }

    // 9. Admin DB Status
    console.log('[TEST 9] Testing GET /api/admin/db-status (Aiven Telemetry)...');
    const dbStatus = await makeRequest('/api/admin/db-status', 'GET', null, adminToken);
    console.log(`  -> Status: ${dbStatus.status}, Engine: ${dbStatus.body?.data?.database_engine}, Latency: ${dbStatus.body?.data?.latency_ms}ms`);
    console.log(`  -> Table Counts:`, dbStatus.body?.data?.table_counts);
    if (dbStatus.status !== 200) {
      throw new Error('DB status check failed');
    }

    // 10. Analytics
    console.log('[TEST 10] Testing GET /api/analytics...');
    const analytics = await makeRequest('/api/analytics', 'GET', null, adminToken);
    console.log(`  -> Status: ${analytics.status}, Total Tickets: ${analytics.body?.data?.total}`);
    if (analytics.status !== 200) {
      throw new Error('Analytics failed');
    }

    console.log('===============================================================');
    console.log('       ALL 10 END-TO-END INTEGRATION TESTS PASSED 100%!        ');
    console.log('===============================================================');
  } finally {
    server.close();
    await pool.end();
  }
}

runE2ETests().catch(err => {
  console.error('TEST SUITE FAILED:', err);
  process.exit(1);
});
