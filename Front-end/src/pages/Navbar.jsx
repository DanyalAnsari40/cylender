import React, { useState, useRef } from 'react';
import { FiMenu, FiBell, FiUser, FiLogOut } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../features/ui/uiSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu on outside click
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <header className="flex items-center justify-between px-4 md:px-8 py-4 bg-white border-b shadow-sm sticky top-0 z-20">
      <div className="flex items-center gap-3 text-gray-500 text-sm">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
          aria-label="Toggle sidebar"
        >
          <FiMenu className="text-xl" />
        </button>
        <span className="text-blue-600 font-bold text-lg tracking-tight">GasCorp</span>
        <span className="text-gray-300 font-bold text-lg">/</span>
        <span className="text-gray-700 font-semibold text-base">Dashboard</span>
      </div>
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200" aria-label="Notifications">
          <FiBell className="text-xl text-blue-600" />
          {/* Notification dot */}
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        {/* User menu */}
        <div className="relative" ref={menuRef}>
          <button
            className="flex items-center gap-2 p-2 rounded-full bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="User menu"
          >
            <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              {user?.name ? user.name[0] : <FiUser className="text-xl" />}
            </span>
            <span className="hidden md:block text-gray-800 font-semibold text-sm">{user?.name || 'User'}</span>
          </button>
          {/* Dropdown menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-lg shadow-lg py-2 z-50 animate-fade-in">
              <div className="px-4 py-2 text-gray-700 text-sm font-semibold border-b">{user?.name || 'User'}</div>
              <button className="w-full flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 text-sm">
                <FiUser /> Profile
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 text-sm">
                <FiLogOut /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;