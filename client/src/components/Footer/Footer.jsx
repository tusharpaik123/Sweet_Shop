import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaTwitter, FaHeart } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-chocolate mt-10" style={{ backgroundColor: '#4E342E', color: 'white' }}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-cream flex items-center justify-center">
                <span className="text-chocolate font-bold text-lg"></span>
              </div>
              <span className="text-xl font-bold text-saffron">Sweet Shop</span>
            </div>
            <p className="text-white/80 mb-4 max-w-md">
              Your one-stop destination for managing and purchasing delicious sweets. 
              Built with modern technology for the best user experience.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/tusharpaik123" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/70 hover:text-saffron transition-colors"
              >
                <FaGithub size={20} />
              </a>
              <a 
                href="https://www.linkedin.com/in/tushar-paik-659067292/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/70 hover:text-saffron transition-colors"
              >
                <FaLinkedin size={20} />
              </a>
              {/* <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/70 hover:text-saffron transition-colors"
              >
                <FaTwitter size={20} />
              </a> */}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/70 hover:text-saffron transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-white/70 hover:text-saffron transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-white/70 hover:text-saffron transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-white/70 hover:text-saffron transition-colors">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white/70 hover:text-saffron transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-saffron transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-saffron transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-saffron transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/30 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/70 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Sweet Shop. All rights reserved.
          </p>
          <p className="text-white/70 text-sm flex items-center">
            Made with <FaHeart className="text-red-500 mx-1" size={12} /> by Sweet Shop Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
