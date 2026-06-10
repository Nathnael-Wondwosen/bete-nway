const BASE = 'http://localhost:3000';

console.log('=== Step 1: Seed database ===');
try {
  const seedRes = await fetch(`${BASE}/api/seed`, { method: 'POST' });
  const seedData = await seedRes.json();
  console.log('Status:', seedRes.status);
  console.log('Result:', JSON.stringify(seedData, null, 2));
} catch (e) {
  console.error('Seed error:', e.message);
}

console.log('\n=== Step 2: Login ===');
try {
  const loginRes = await fetch(`${BASE}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@orthodoxart.expo',
      password: 'admin123',
    }),
  });
  const loginData = await loginRes.json();
  console.log('Status:', loginRes.status);
  console.log('Result:', JSON.stringify(loginData, null, 2));
  
  // Check for cookie
  const cookies = loginRes.headers.get('set-cookie');
  console.log('Cookie set:', cookies ? 'YES' : 'NO');
  if (cookies) console.log('Cookie:', cookies.substring(0, 80) + '...');
} catch (e) {
  console.error('Login error:', e.message);
}
