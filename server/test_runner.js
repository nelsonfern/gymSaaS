import 'dotenv/config';

async function runTests() {
    console.log("Starting tests...");
    const SERVER = 'http://127.0.0.1:5100';
    
    // Register & Login to get token
    const baseEmail = `test_${Date.now()}@gym.com`;
    let token = '';
    let userId = '';

    try {
        const regRes = await fetch(`${SERVER}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Test User', email: baseEmail, password: '123', telefono: '123' })
        });
        const regData = await regRes.json();
        userId = regData._id || '60d5ecb54cb912001f301abc';
        
        const loginRes = await fetch(`${SERVER}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: baseEmail, password: '123' })
        });
        const loginData = await loginRes.json();
        token = loginData.token || '';
        console.log("Logged in, token:", token ? "OK" : "FAILED");
    } catch (e) {
        console.log("Auth setup failed:", e.message);
    }

    let clientId = '60d5ecb54cb912001f301abc';
    let clientDni = '99999999';
    let planId = '60d5ecb54cb912001f301abc';

    try {
        const clientsRes = await fetch(`${SERVER}/clients/`);
        const clients = await clientsRes.json();
        if (Array.isArray(clients) && clients.length > 0) {
            clientId = clients[0]._id;
            clientDni = clients[0].dni || '99999999';
        }
    } catch(e) {}

    try {
        const plansRes = await fetch(`${SERVER}/plans/`);
        const plans = await plansRes.json();
        if (Array.isArray(plans) && plans.length > 0) {
            planId = plans[0]._id;
        }
    } catch(e) {}

    const endpoints = [
        { method: 'GET', url: '/clients/' },
        { method: 'POST', url: '/clients/', body: { name: 'Test', lastName: 'Client', dni: `11${Date.now()}`.slice(0, 8), email: `c_${Date.now()}@c.com`, phone: '123' }, auth: true },
        { method: 'GET', url: `/clients/${clientId}` },
        { method: 'PUT', url: `/clients/${clientId}`, body: { name: 'Updated Name' }, auth: true },
        { method: 'PUT', url: `/clients/${clientId}/plan`, body: { plan: planId }, auth: true },
        { method: 'DELETE', url: `/clients/${clientId}`, auth: true },
        { method: 'GET', url: `/clients/status/${clientDni}`, auth: true },
        
        { method: 'POST', url: '/users/register', body: { name: 'Admin', email: `a_${Date.now()}@a.com`, password: '123', telefono: '123' } },
        { method: 'POST', url: '/users/login', body: { email: baseEmail, password: '123' } },
        { method: 'GET', url: '/users/profile', auth: true },
        { method: 'PUT', url: `/users/update/${userId}`, body: { name: 'Update' }, auth: true },
        
        { method: 'GET', url: '/plans/' },
        { method: 'POST', url: '/plans/', body: { name: 'Plan', price: 100 }, auth: true },
        { method: 'GET', url: `/plans/${planId}` },
        { method: 'PUT', url: `/plans/${planId}`, body: { price: 200 }, auth: true },
        { method: 'DELETE', url: `/plans/${planId}`, auth: true },
        
        { method: 'POST', url: '/payments/', body: { clientId: clientId, amount: 100 }, auth: true },
        { method: 'GET', url: '/payments/', auth: true },
        { method: 'GET', url: `/payments/client/${clientId}`, auth: true },
        
        { method: 'POST', url: '/checkins/checkin', body: { dni: clientDni }, auth: true },
        { method: 'GET', url: `/checkins/checkin/${clientId}`, auth: true },
        { method: 'GET', url: '/checkins/checkins/today', auth: true },
    ];

    for (const ep of endpoints) {
        const headers = {};
        if (ep.body) headers['Content-Type'] = 'application/json';
        if (ep.auth && token) headers['Authorization'] = `Bearer ${token}`;

        try {
            const res = await fetch(`${SERVER}${ep.url}`, {
                method: ep.method,
                headers,
                body: ep.body ? JSON.stringify(ep.body) : undefined
            });
            let body = await res.text();
            try { body = JSON.parse(body); } catch(e) {}

            if (!res.ok) {
                console.log(`[FAIL] ${ep.method} ${ep.url} -> ${res.status}: ${JSON.stringify(body)}`);
            } else {
                console.log(`[OK]   ${ep.method} ${ep.url} -> ${res.status}`);
            }
        } catch (e) {
            console.log(`[ERR]  ${ep.method} ${ep.url} -> ${e.message}`);
        }
    }
}
runTests();
