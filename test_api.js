const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🚀 Starting collective API flow tests for Aura CRM...');
  let token = '';
  let clientId = '';
  let consultationId = '';

  const testUser = {
    name: 'Test Astrologer',
    email: `astro_test_${Date.now()}@auracrm.com`,
    password: 'password123',
    specialization: 'Vastu Shastra',
    experience: 8,
    bio: 'Guiding energy alignments.'
  };

  try {
    // 1. Status Check
    console.log('\n🔍 [TEST 1] Checking API Server Status...');
    const statusRes = await fetch(`${BASE_URL}/status`);
    const statusData = await statusRes.json();
    if (statusRes.ok && statusData.success) {
      console.log('✅ Server Status: Running smoothly.');
    } else {
      throw new Error('Server status check failed.');
    }

    // 2. Signup Test
    console.log(`\n🔍 [TEST 2] Registering Test Astrologer (${testUser.email})...`);
    const signupRes = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    const signupData = await signupRes.json();
    if (signupRes.status === 201 && signupData.success) {
      console.log('✅ Signup Successful.');
      token = signupData.data.token;
    } else {
      throw new Error(`Signup failed: ${signupData.message}`);
    }

    // 3. Login Test
    console.log('\n🔍 [TEST 3] Authenticating Login...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email, password: testUser.password })
    });
    const loginData = await loginRes.json();
    if (loginRes.ok && loginData.success) {
      console.log('✅ Login Successful (JWT Token received).');
      token = loginData.data.token;
    } else {
      throw new Error(`Login failed: ${loginData.message}`);
    }

    // 4. Fetch Profile Test
    console.log('\n🔍 [TEST 4] Fetching profile details (Auth Protected)...');
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const meData = await meRes.json();
    if (meRes.ok && meData.success) {
      console.log(`✅ Profile retrieved. Astrologer: ${meData.data.name} (${meData.data.specialization})`);
    } else {
      throw new Error(`Profile fetch failed: ${meData.message}`);
    }

    // 5. Dashboard Stats Test
    console.log('\n🔍 [TEST 5] Fetching Dashboard Metrics & Triggering Auto-Seeder...');
    const statsRes = await fetch(`${BASE_URL}/dashboard/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const statsData = await statsRes.json();
    if (statsRes.ok && statsData.success) {
      console.log('✅ Dashboard Stats:', statsData.data);
    } else {
      throw new Error(`Stats fetch failed: ${statsData.message}`);
    }

    // 6. Dashboard Analytics Test
    console.log('\n🔍 [TEST 6] Fetching Dashboard Analytics Charts Data...');
    const analyticsRes = await fetch(`${BASE_URL}/dashboard/analytics`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const analyticsData = await analyticsRes.json();
    if (analyticsRes.ok && analyticsData.success) {
      console.log(`✅ Dashboard Analytics: Retrieved ${analyticsData.data.length} months trend.`);
    } else {
      throw new Error(`Analytics fetch failed: ${analyticsData.message}`);
    }

    // 7. Client Creation Test
    console.log('\n🔍 [TEST 7] Registering a new Client...');
    const clientPayload = {
      name: 'Rohan Deshmukh',
      email: `rohan_${Date.now()}@example.com`,
      phone: '+91 95555 12345',
      dateOfBirth: '1995-10-15',
      timeOfBirth: '08:45',
      placeOfBirth: 'Pune, India'
    };
    const createClientRes = await fetch(`${BASE_URL}/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(clientPayload)
    });
    const createClientData = await createClientRes.json();
    if (createClientRes.status === 201 && createClientData.success) {
      console.log(`✅ Client registered successfully: ${createClientData.data.name}`);
      clientId = createClientData.data._id;
    } else {
      throw new Error(`Client creation failed: ${createClientData.message}`);
    }

    // 8. Clients Query Test
    console.log('\n🔍 [TEST 8] Fetching Clients List (with Search Filter)...');
    const queryClientsRes = await fetch(`${BASE_URL}/clients?search=Rohan`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const queryClientsData = await queryClientsRes.json();
    if (queryClientsRes.ok && queryClientsData.success) {
      console.log(`✅ Search result returned ${queryClientsData.data.length} records. Pagination:`, queryClientsData.pagination);
    } else {
      throw new Error(`Clients query failed: ${queryClientsData.message}`);
    }

    // 9. Book Consultation Test
    console.log('\n🔍 [TEST 9] Booking a new Consultation Session...');
    const consultationPayload = {
      client: clientId,
      date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      duration: 45,
      notes: 'Astrological compatibility matching session.',
      fee: 150
    };
    const createConsultationRes = await fetch(`${BASE_URL}/consultations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(consultationPayload)
    });
    const createConsultationData = await createConsultationRes.json();
    if (createConsultationRes.status === 201 && createConsultationData.success) {
      console.log(`✅ Consultation booked successfully. Client name: ${createConsultationData.data.client.name}`);
      consultationId = createConsultationData.data._id;
    } else {
      throw new Error(`Consultation booking failed: ${createConsultationData.message}`);
    }

    // 10. Update Status Test
    console.log('\n🔍 [TEST 10] Modifying Consultation status...');
    const updateStatusRes = await fetch(`${BASE_URL}/consultations/${consultationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: 'Completed' })
    });
    const updateStatusData = await updateStatusRes.json();
    if (updateStatusRes.ok && updateStatusData.success) {
      console.log(`✅ Consultation status updated to: ${updateStatusData.data.status}`);
    } else {
      throw new Error(`Status update failed: ${updateStatusData.message}`);
    }

    // 11. Cleanup records
    console.log('\n🧹 Cleaning up test database records...');
    const delConsultationRes = await fetch(`${BASE_URL}/consultations/${consultationId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const delClientRes = await fetch(`${BASE_URL}/clients/${clientId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (delConsultationRes.ok && delClientRes.ok) {
      console.log('✅ Test records cleaned up successfully.');
    } else {
      console.warn('⚠️ Warning: Database cleanup might have left orphaned records.');
    }

    console.log('\n🎉 ALL collective phase verification tests completed successfully!');

  } catch (error) {
    console.error('\n❌ Test execution encountered an error:', error.message);
  }
}

runTests();
