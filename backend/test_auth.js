const axios = require('axios');

const testLogin = async () => {
  const baseURL = 'http://localhost:5000/api/auth';
  const testUser = {
    username: 'testuser_' + Date.now(),
    email: 'test' + Date.now() + '@example.com',
    password: 'password123'
  };

  try {
    // 1. Register
    console.log('Registering user...');
    const regRes = await axios.post(`${baseURL}/register`, testUser);
    console.log('Registration successful:', regRes.data.message);

    // 2. Login
    console.log('Logging in...');
    const loginRes = await axios.post(`${baseURL}/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('Login successful:', loginRes.data.message);
    console.log('Token received:', !!loginRes.data.token);

  } catch (error) {
    console.error('Test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
};

testLogin();
