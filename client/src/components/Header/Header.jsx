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
  const [activeIndicator, setActiveIndicator] = useState({ left: 0, width: 0 });
  const [isIndicatorReady, setIsIndicatorReady] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const navRef = useRef(null);

  const userAuth = useSelector(selectUserAuth);
  const user = useSelector(selectUser);
  const isAdmin = useSelector(selectIsAdmin);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

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

  // Update indicator position based on active route
  const updateIndicator = () => {
    if (!navRef.current) return;
    
    const currentPath = location.pathname;
    console.log('🔍 Current path:', currentPath);
    
    // Find active element directly by checking all nav items
    const allNavElements = navRef.current.querySelectorAll('[data-nav-id]');
    let activeElement = null;
    
    allNavElements.forEach(element => {
      const navId = element.getAttribute('data-nav-id');
      const href = element.getAttribute('href');
      
      if (href === currentPath || (href !== '/' && currentPath.startsWith(href))) {
        activeElement = element;
        console.log('✅ Found active element:', navId, href);
      }
    });

    if (activeElement) {
      const rect = activeElement.getBoundingClientRect();
      const navRect = navRef.current.getBoundingClientRect();
      const newIndicator = {
        left: rect.left - navRect.left,
        width: rect.width
      };
      console.log('📍 Setting indicator:', newIndicator);
      setActiveIndicator(newIndicator);
      setIsIndicatorReady(true);
    } else {
      console.log('❌ No active element found');
      setIsIndicatorReady(false);
    }
  };

  useEffect(() => {
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [location.pathname, userAuth, isAdmin]);

  // Additional effect to handle initial load and navigation changes
  useEffect(() => {
    const timer = setTimeout(() => {
      updateIndicator();
    }, 200);
    return () => clearTimeout(timer);
  }, [location.pathname]);

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
          <div 
            ref={navRef}
            className="px-6 pb-6 md:bg-transparent bg-chocolate md:px-0 md:pb-0 flex flex-col md:flex-row md:items-center md:space-x-6 relative"
          >
            {/* Sliding Indicator - Only visible on desktop */}
            <div 
              className="hidden md:block absolute bottom-0 h-1 bg-saffron transition-all duration-300 ease-out rounded-full z-10"
              style={{
                left: `${activeIndicator.left}px`,
                width: `${activeIndicator.width}px`,
                transform: 'translateY(4px)',
                opacity: isIndicatorReady ? 1 : 0,
              }}
            />
            
            {menuItems.map((item, index) => (
              <Link 
                key={index}
                to={item.to}
                onClick={closeMenu}
                data-nav-id={item.id}
                className={`flex items-center space-x-2 p-2 rounded-lg transition-colors hover:text-saffron relative ${
                  location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to))
                    ? 'text-saffron' 
                    : 'text-white'
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
                    onClick={closeMenu}
                    data-nav-id="login"
                    className={`w-full md:w-auto px-4 py-2 rounded-lg text-center transition-all ${
                      location.pathname === '/login'
                        ? 'bg-saffron text-white'
                        : 'bg-saffron text-white hover:bg-opacity-90'
                    }`}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    onClick={closeMenu}
                    data-nav-id="signup"
                    className={`w-full md:w-auto border border-saffron px-4 py-2 rounded-lg text-center transition-all ${
                      location.pathname === '/signup'
                        ? 'bg-saffron text-white'
                        : 'text-saffron hover:bg-saffron hover:text-white'
                    }`}
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
