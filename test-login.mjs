// Test seed and login flow
const BASE = 'http://localhost:3000';

console.log('=== Step 1: Testing DB seed ===');
try {
  const seedRes = await fetch(`${BASE}/api/seed`, { method: 'POST' });
  const seedData = await seedRes.json();
  console.log('Seed status:', seedRes.status);
  console.log('Seed result:', JSON.stringify(seedData, null, 2));
} catch (e) {
  console.error('Seed error:', e.message);
}

console.log('\n=== Step 2: Testing admin login ===');
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
  console.log('Login status:', loginRes.status);
  console.log('Login result:', JSON.stringify(loginData, null, 2));
} catch (e) {
  console.error('Login error:', e.message);
}
