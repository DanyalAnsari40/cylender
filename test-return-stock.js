// Test script to verify return stock functionality
// This will help us debug the issue

console.log('=== Testing Return Stock Functionality ===\n');

// Test data
const testData = {
  employeeId: '6887c2e783d7fcf90a6d23b3', // Replace with actual employee ID
  type: 'cylinder',
  qty: 5
};

console.log('Test Data:', testData);

// Simulate the return stock process
console.log('\n1. Employee returns stock...');
console.log(`   Employee ID: ${testData.employeeId}`);
console.log(`   Stock Type: ${testData.type}`);
console.log(`   Quantity: ${testData.qty}`);

console.log('\n2. Backend should save this to employee.returned array');
console.log('   Expected: employee.returned = [{ type: "cylinder", qty: 5 }]');

console.log('\n3. Admin fetches returned stock data...');
console.log('   API: GET /api/employees/returned-stock');
console.log('   Expected response: [{ employeeId: "...", returned: [{ type: "cylinder", qty: 5 }] }]');

console.log('\n4. Frontend displays returned stock...');
console.log('   Expected: "5 Cylinder" in "Returned Stock from Employee" column');

console.log('\n=== Debugging Steps ===');
console.log('1. Check browser console for frontend logs');
console.log('2. Check backend console for server logs');
console.log('3. Verify database has the returned stock data');
console.log('4. Ensure frontend refreshes data after return operation');

console.log('\n=== To Test ===');
console.log('1. Login as employee');
console.log('2. Go to Stock page');
console.log('3. Click "Return to Admin" on any stock item');
console.log('4. Fill the form and submit');
console.log('5. Login as admin');
console.log('6. Go to Employees → Assign Stock');
console.log('7. Check "Returned Stock from Employee" column'); 