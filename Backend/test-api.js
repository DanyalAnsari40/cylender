import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
  try {
    console.log('Testing backend API...');
    
    // Test employees endpoint
    console.log('\n1. Testing employees endpoint...');
    const employeesResponse = await axios.get(`${BASE_URL}/employees`);
    console.log('Employees response:', employeesResponse.data);
    
    // Test assigned stock endpoint
    console.log('\n2. Testing assigned stock endpoint...');
    const assignedStockResponse = await axios.get(`${BASE_URL}/employees/assigned-stock`);
    console.log('Assigned stock response:', assignedStockResponse.data);
    
    // Test returned stock endpoint
    console.log('\n3. Testing returned stock endpoint...');
    const returnedStockResponse = await axios.get(`${BASE_URL}/employees/returned-stock`);
    console.log('Returned stock response:', returnedStockResponse.data);
    
    console.log('\n✅ All API endpoints are working!');
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testAPI(); 