import 'dotenv/config';
import mongoose from 'mongoose';
import User from './schemas/user.js';
import DbClient from './config/dbClient.js';

async function runTests() {
    console.log("Starting Admin tests...");
    const SERVER = 'http://127.0.0.1:5100';
    
    // Connect to DB directly
    await DbClient.connectDB();
    
    // Register & Login to get token for Admin
    const baseEmail = `admin_${Date.now()}@gym.com`;
    let adminToken = '';
    let adminId = '';

    try {
        const regRes = await fetch(`${SERVER}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Admin User', email: baseEmail, password: '123', telefono: '123' })
        });
        const regData = await regRes.json();
        adminId = regData._id;
        
        // Update user to Admin
        await User.findByIdAndUpdate(adminId, { role: 'admin' });
        
        const loginRes = await fetch(`${SERVER}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: baseEmail, password: '123' })
        });
        const loginData = await loginRes.json();
        adminToken = loginData.token || '';
        console.log("Admin Logged in, token:", adminToken ? "OK" : "FAILED");
    } catch (e) {
        console.log("Auth setup failed:", e.message);
    }

    let clientId = '60d5ecb54cb912001f301abc';
    let clientDni = '99999999';
    let planId = '60d5ecb54cb912001f301abc';

    try {
        const plansRes = await fetch(`${SERVER}/plans/`);
        const plans = await plansRes.json();
        if (Array.isArray(plans) && plans.length > 0) {
            planId = plans[0]._id;
        } else {
            // Create a plan if we are admin
            const newPlanRes = await fetch(`${SERVER}/plans/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
                body: JSON.stringify({ name: 'Test Plan', price: 100 })
            });
            const newPlan = await newPlanRes.json();
            planId = newPlan._id;
        }
    } catch(e) {}

    try {
        const clientsRes = await fetch(`${SERVER}/clients/`);
        const clients = await clientsRes.json();
        if (Array.isArray(clients) && clients.length > 0) {
            clientId = clients[0]._id;
            clientDni = clients[0].dni || '99999999';
        } else {
            const newClientRes = await fetch(`${SERVER}/clients/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
                body: JSON.stringify({ name: 'Test Client', lastName: 'Client', dni: `11${Date.now()}`.slice(0, 8), email: `c_${Date.now()}@c.com`, phone: '123456789' })
            });
            const newClient = await newClientRes.json();
            clientId = newClient._id;
            clientDni = newClient.dni;
        }
    } catch(e) {}


    const endpoints = [
        { method: 'GET', url: '/clients/' },
        { method: 'POST', url: '/clients/', body: { name: 'Test2', lastName: 'Client', dni: `22${Date.now()}`.slice(0, 8), email: `c2_${Date.now()}@c.com`, phone: '123456789' }, auth: adminToken },
        { method: 'GET', url: `/clients/${clientId}` },
        { method: 'PUT', url: `/clients/${clientId}`, body: { name: 'Updated Name Admin' }, auth: adminToken },
        { method: 'PUT', url: `/clients/${clientId}/plan`, body: { planId: planId }, auth: adminToken },
        { method: 'DELETE', url: `/clients/${clientId}`, auth: adminToken },
        { method: 'GET', url: `/clients/status/${clientDni}`, auth: adminToken },
        
        { method: 'GET', url: '/users/profile', auth: adminToken },
        { method: 'PUT', url: `/users/update/${adminId}`, body: { name: 'Update Admin' }, auth: adminToken },
        
        { method: 'GET', url: '/plans/' },
        { method: 'POST', url: '/plans/', body: { name: `Plan ${Date.now()}`, price: 150 }, auth: adminToken },
        { method: 'GET', url: `/plans/${planId}` },
        { method: 'PUT', url: `/plans/${planId}`, body: { price: 250 }, auth: adminToken },
        { method: 'DELETE', url: `/plans/${planId}`, auth: adminToken },
        
        { method: 'POST', url: '/payments/', body: { clientId: clientId, planId: planId, amount: 100 }, auth: adminToken },
        { method: 'GET', url: '/payments/', auth: adminToken },
        { method: 'GET', url: `/payments/client/${clientId}`, auth: adminToken },
        
        { method: 'POST', url: '/checkins/checkin', body: { dni: clientDni }, auth: adminToken },
        { method: 'GET', url: `/checkins/checkin/${clientId}`, auth: adminToken },
        { method: 'GET', url: '/checkins/checkins/today', auth: adminToken },
    ];

    for (const ep of endpoints) {
        const headers = {};
        if (ep.body) headers['Content-Type'] = 'application/json';
        if (ep.auth) headers['Authorization'] = `Bearer ${ep.auth}`;

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
    await DbClient.disconnectDB();
    process.exit(0);
}
runTests();
