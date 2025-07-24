import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from './components/Sidebar/Sidebar';
import AppRoutes from './routes/AppRoutes';
import Navbar from './pages/Navbar';

const App = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  return (
    <Router>
      <div className="flex bg-gradient-to-tr from-blue-50 via-white to-blue-100 min-h-screen transition-colors duration-300">
        {isAuthenticated && <Sidebar />}
        <div className="flex-1 flex flex-col min-h-screen">
          {isAuthenticated && <Navbar />}
          <main className="flex-1 p-4 md:p-8 transition-all duration-300">
            <AppRoutes />
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
