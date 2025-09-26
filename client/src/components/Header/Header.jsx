import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FaHome, 
  FaUser, 
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaCog,
  FaChartBar,
  FaShoppingCart
} from 'react-icons/fa';
import { logout, selectUserAuth, selectUser, selectIsAdmin } from '../../store/authSlice.js';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userAuth = useSelector(selectUserAuth);
  const user = useSelector(selectUser);
  const isAdmin = useSelector(selectIsAdmin);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const menuItems = [
    { to: '/', icon: <FaHome />, label: 'Home' },
    ...(
      userAuth && !isAdmin 
        ? [
            { to: `/dashboard`, icon: <FaUser />, label: 'Dashboard' },
            { to: `/orders`, icon: <FaShoppingCart />, label: 'Orders' },
          ] 
        : []
    ),
    ...(
      isAdmin 
        ? [
            { to: `/admin`, icon: <FaCog />, label: 'Admin' },
            { to: `/admin/stats`, icon: <FaChartBar />, label: 'Stats' },
          ]
        : []
    ),
  ];

  return (
    <header className="bg-dark-primary/80 backdrop-blur-sm shadow-lg w-full z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-light-blue flex items-center justify-center transition-transform transform hover:scale-110">
            <span className="text-dark-primary font-bold text-xl">🍭</span>
          </div>
          <span className="text-2xl font-bold text-light-blue">Sweet Shop</span>
        </Link>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button 
            onClick={toggleMenu}
            className="text-light-blue focus:outline-none"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className={`
          fixed inset-0 bg-black md:bg-transparent md:static 
          md:flex md:items-center 
          transform transition-transform duration-300 ease-in-out
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          md:translate-x-0
          flex flex-col md:flex-row
          p-6 md:p-0
          space-y-6 md:space-y-0 md:space-x-6
        `}>
          {/* Menu Items */}
          <div className='px-6 pb-6 md:bg-transparent bg-black md:px-0 md:pb-0 flex flex-col md:flex-row md:items-center md:space-x-6'>
            {menuItems.map((item, index) => (
              <Link 
                key={index}
                to={item.to}
                onClick={closeMenu}
                className="text-gray-300 hover:text-light-blue flex items-center space-x-2 p-2 rounded-lg transition-colors"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}

            {/* Authentication Buttons */}
            <div className="flex flex-col md:flex-row items-center space-y-4 pt-2 md:space-y-0 md:space-x-4 w-full">
              {!userAuth ? (
                <>
                  <Link 
                    to="/login" 
                    onClick={closeMenu}
                    className="w-full md:w-auto bg-light-blue text-dark-primary px-4 py-2 rounded-lg hover:bg-opacity-90 text-center transition-all"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    onClick={closeMenu}
                    className="w-full md:w-auto border border-light-blue text-light-blue px-4 py-2 rounded-lg hover:bg-light-blue hover:text-dark-primary text-center transition-all"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
                  <span className="text-gray-300 text-sm">Welcome, {user?.name}</span>
                  <button 
                    onClick={handleLogout}
                    className="w-full md:w-auto bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center justify-center space-x-2 transition-all"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
