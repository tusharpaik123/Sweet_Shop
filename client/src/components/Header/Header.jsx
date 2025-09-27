import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  const [lastClicked, setLastClicked] = useState('home'); // Default to home
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const navRef = useRef(null);

  const userAuth = useSelector(selectUserAuth);
  const user = useSelector(selectUser);
  const isAdmin = useSelector(selectIsAdmin);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsMenuOpen(false);
    setLastClicked('home'); // Reset to home when logging out
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Handle navigation clicks
  const handleNavClick = (itemId) => {
    console.log('Clicked nav item:', itemId); // Debug log
    setLastClicked(itemId);
    closeMenu();
  };

  // Handle auth button clicks (login/signup) - reset to home
  const handleAuthClick = () => {
    console.log('Auth button clicked, resetting to home'); // Debug log
    setLastClicked('none'); // Set to 'none' so no nav items are highlighted on auth pages
    closeMenu();
  };

  // Sync with current route on page load/refresh
  useEffect(() => {
    const currentPath = location.pathname;
    console.log('Current path on load:', currentPath); // Debug log
    
    // Set initial active state based on current route
    if (currentPath === '/') {
      setLastClicked('home');
    } else if (currentPath.startsWith('/products')) {
      setLastClicked('products');
    } else if (currentPath.startsWith('/orders')) {
      setLastClicked('orders');
    } else if (currentPath.startsWith('/admin/stats')) {
      setLastClicked('stats');
    } else if (currentPath.startsWith('/admin')) {
      setLastClicked('admin');
    } else if (currentPath === '/login' || currentPath === '/signup') {
      // For login/signup pages, don't highlight any nav items
      setLastClicked('none');
    } else {
      // Default to home for other pages
      setLastClicked('home');
    }
  }, [location.pathname]);

  // All possible navigation items (including auth buttons)
  const allNavItems = [
    { to: '/', icon: <FaHome />, label: 'Home', id: 'home' },
    ...(userAuth && !isAdmin ? [
      { to: `/products`, icon: <FaUser />, label: 'Products', id: 'products' },
      { to: `/orders`, icon: <FaShoppingCart />, label: 'Orders', id: 'orders' },
    ] : []),
    ...(isAdmin ? [
      { to: `/admin`, icon: <FaCog />, label: 'Admin', id: 'admin' },
      { to: `/admin/stats`, icon: <FaChartBar />, label: 'Stats', id: 'stats' },
    ] : []),
    ...(!userAuth ? [
      { to: '/login', label: 'Login', id: 'login' },
      { to: '/signup', label: 'Sign Up', id: 'signup' },
    ] : []),
  ];


  const menuItems = allNavItems.filter(item => !['login', 'signup'].includes(item.id));

  return (
    <header className="bg-chocolate shadow-lg w-full z-50" style={{ backgroundColor: '#4E342E', color: 'white' }}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-cream flex items-center justify-center transition-transform transform hover:scale-110">
            <span className="text-chocolate font-bold text-xl"></span>
          </div>
          <span className="text-2xl font-bold text-saffron">Sweet Shop</span>
        </Link>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button 
            onClick={toggleMenu}
            className="focus:outline-none"
            style={{ color: 'white' }}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className={`
          fixed inset-0 bg-chocolate md:bg-transparent md:static 
          md:flex md:items-center 
          transform transition-transform duration-300 ease-in-out
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          md:translate-x-0
          flex flex-col md:flex-row
          p-6 md:p-0
          space-y-6 md:space-y-0 md:space-x-6
        `}>
          {/* Menu Items */}
          <div className="px-6 pb-6 md:bg-transparent bg-chocolate md:px-0 md:pb-0 flex flex-col md:flex-row md:items-center md:space-x-6">
            {menuItems.map((item, index) => (
              <Link 
                key={index}
                to={item.to}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center space-x-2 p-2 rounded-lg transition-all hover:text-saffron ${
                  lastClicked === item.id
                    ? 'text-saffron border-2 border-saffron bg-saffron/20 shadow-lg' 
                    : 'text-white border-2 border-transparent hover:border-saffron/30'
                }`}
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
                    onClick={handleAuthClick}
                    className="w-full md:w-auto bg-saffron text-white px-4 py-2 rounded-lg text-center transition-all hover:bg-opacity-90"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    onClick={handleAuthClick}
                    className="w-full md:w-auto bg-saffron text-white px-4 py-2 rounded-lg text-center transition-all hover:bg-opacity-90"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
                  <span className="text-sm" style={{ color: 'white' }}>Welcome, {user?.name}</span>
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
