import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar } from '../../features/ui/uiSlice';
import { logout } from '../../features/auth/authSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  FiHome,
  FiUsers,
  FiBox,
  FiShoppingCart,
  FiActivity,
  FiTrendingUp,
  FiFileText,
  FiPieChart,
  FiBell,
  FiSettings,
  FiLogOut,
  FiUser,
} from 'react-icons/fi';

const Sidebar = () => {
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);
  const role = useSelector((state) => state.auth.user?.role);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Example notification counts
  const notifications = 3;
  const pendingReports = 2;

  // Hide sidebar if not open (redux state)
  if (!sidebarOpen) return null;

  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-30 bg-black bg-opacity-30 transition-opacity md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
        aria-label="Close sidebar"
        onClick={() => dispatch(toggleSidebar())}
      />
      {/* Sidebar */}
      <aside
        className={`fixed z-40 top-0 left-0 h-full overflow-y-auto bg-gradient-to-b from-blue-700 via-blue-600 to-blue-500 border-r border-blue-800 shadow-2xl flex flex-col transition-all duration-300
          w-80
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:flex md:w-80
        `}
        aria-label="Sidebar"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-blue-800">
          <img src="/vite.svg" alt="Logo" className="w-12 h-12 drop-shadow-lg" />
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-wide">GasCorp</h1>
            <span className="text-sm text-blue-200">Management</span>
          </div>
        </div>
        {/* User Info & Menu */}
        {user && (
          <div className="flex flex-col items-center py-6 border-b border-blue-800 relative">
            <button
              className="w-20 h-20 rounded-full bg-blue-200 flex items-center justify-center text-4xl font-extrabold text-blue-700 mb-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              onClick={() => setUserMenuOpen((prev) => !prev)}
              aria-label="User menu"
            >
              {user.name ? user.name[0] : <FiUser />}
            </button>
            <div className="text-base font-bold text-white">{user.name || 'User'}</div>
            <div className="text-xs text-blue-200">{user.role || 'Role'}</div>
            {/* User Dropdown */}
            {userMenuOpen && (
              <div className="absolute top-24 left-1/2 -translate-x-1/2 w-48 bg-white border border-blue-100 rounded-xl shadow-xl z-50 animate-fade-in">
                <button className="w-full flex items-center gap-2 px-4 py-3 text-blue-700 hover:bg-blue-50 text-sm font-semibold">
                  <FiUser /> Profile
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-3 text-blue-700 hover:bg-blue-50 text-sm font-semibold">
                  <FiSettings /> Settings
                </button>
                <button
                  className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 text-sm font-semibold border-t"
                  onClick={() => {
                    dispatch(logout());
                    toast.success('Logged out successfully!');
                    navigate('/login');
                  }}
                >
                  <FiLogOut /> Logout
                </button>
              </div>
            )}
          </div>
        )}
        {/* Navigation */}
        <nav className="flex-1 mt-6 flex flex-col gap-4 px-3">
          {/* Section: Main */}
          <div className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-1">Main</div>
          <SidebarLink icon={<FiHome />} label="Dashboard" to="/" animate badge={notifications} />
          {/* Section: Management */}
          <div className="text-xs font-bold text-blue-200 uppercase tracking-widest mt-4 mb-1">Management</div>
          {role === 'admin' && (
            <>
              <SidebarLink icon={<FiShoppingCart />} label="Suppliers" to="/suppliers" animate />
              <SidebarLink icon={<FiBox />} label="Purchases" to="/purchases" animate />
              <SidebarLink icon={<FiActivity />} label="Inventory" to="/inventory" animate />
              <SidebarLink icon={<FiUsers />} label="Customers" to="/customers" animate />
              <SidebarLink icon={<FiTrendingUp />} label="Gas Sales" to="/gas-sales" animate />
              <SidebarLink icon={<FiUsers />} label="Employees" to="/employees" animate />
              <SidebarLink icon={<FiBox />} label="Cylinders" to="/cylinders" animate />
              <SidebarLink icon={<FiFileText />} label="Reports" to="/reports" animate badge={pendingReports} />
            </>
          )}
          {['employee'].includes(role) && (
            <>
              <SidebarLink icon={<FiActivity />} label="Inventory" to={role === 'admin' ? '/inventory' : '/inventorysys'} animate />
              <SidebarLink icon={<FiUsers />} label="Employees" to={role === 'admin' ? '/employees' : '/employee-management'} animate />
              <SidebarLink icon={<FiFileText />} label="Reports" to={role === 'admin' ? '/reports' : '/report-sys'} animate badge={pendingReports} />
            </>
          )}
        </nav>
        {/* Footer */}
        <div className="mt-auto py-6 px-3 border-t border-blue-800 text-center text-xs text-blue-200">
          <span>&copy; {new Date().getFullYear()} GasCorp</span>
        </div>
      </aside>
    </>
  );
};

const SidebarLink = ({ icon, label, to, badge, animate }) => {
  const dispatch = useDispatch();
  const handleClick = () => {
    if (window.innerWidth < 768) {
      dispatch(toggleSidebar());
    }
  };
  return (
    <NavLink
      to={to}
      onClick={handleClick}
      className={({ isActive }) =>
        `relative flex items-center gap-3 px-4 py-3 rounded-lg text-base font-semibold transition-all duration-200 group
        ${isActive ? 'bg-white/20 text-white shadow-inner' : 'text-blue-100 hover:bg-white/10 hover:text-white'}
        ${animate ? 'hover:scale-[1.04] active:scale-95' : ''}`
      }
      title={label}
      tabIndex={0}
      aria-label={label}
    >
      <span className={`text-2xl transition-transform duration-200 group-hover:scale-110`}>{icon}</span>
      <span className="flex-1">{label}</span>
      {/* Badge */}
      {badge && badge > 0 && (
        <span className={`ml-auto text-xs font-bold rounded-full px-2 py-0.5 ${isNaN(badge) ? 'bg-red-500' : 'bg-blue-600'} text-white animate-bounce`}>{badge}</span>
      )}
    </NavLink>
  );
};

export default Sidebar;
