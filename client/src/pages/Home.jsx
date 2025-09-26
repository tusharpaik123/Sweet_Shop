import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaArrowRight,
  FaCheckCircle,
  FaUsers,
  FaCookie,
  FaShoppingCart
} from 'react-icons/fa';
import { selectUserAuth } from '../store/authSlice.js';
import { useSelector } from 'react-redux';

const SectionSeparator = ({ title }) => (
  <div className="relative my-16 py-4">
    <div className="absolute inset-0 flex items-center" aria-hidden="true">
      <div className="w-full border-t border-dark-primary/50"></div>
    </div>
    {title && (
      <div className="relative flex justify-center">
        <span className="bg-dark-primary px-4 text-light-blue text-sm uppercase tracking-wider">
          {title}
        </span>
      </div>
    )}
  </div>
);

const Home = () => {
  const userAuth = useSelector(selectUserAuth);

  return (
    <div className="min-h-screen bg-gradient-primary text-white relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-light-blue/10 via-dark-primary/20 to-dark-primary/30 animate-pulse"></div>
      </div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        {/* Hero Section */}
        <section className="text-center mb-20 px-4">
          <div className="inline-block bg-dark-primary/50 rounded-full px-6 py-2 mb-6 text-light-blue text-sm sm:text-base">
            🍭 Sweet Shop Management System
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-light-blue leading-tight">
            Sweet Shop
          </h1>
          <p className="text-base sm:text-lg md:text-2xl max-w-3xl mx-auto text-gray-300 mb-10 leading-relaxed">
            Your one-stop destination for managing and purchasing delicious sweets. 
            Browse our collection, make purchases, and manage inventory with ease.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            {!userAuth ? (
              <>
                <Link 
                  to="/signup" 
                  className="flex items-center justify-center gap-3 px-8 sm:px-10 py-3 sm:py-4 text-lg sm:text-xl bg-light-blue text-dark-primary rounded-xl font-semibold hover:bg-opacity-90 transition-all group"
                >
                  Get Started
                  <FaArrowRight className="transform transition-transform group-hover:translate-x-1" />
                </Link>
                <Link 
                  to="/login" 
                  className="flex items-center justify-center gap-3 px-8 sm:px-10 py-3 sm:py-4 text-lg sm:text-xl border border-light-blue text-light-blue rounded-xl font-semibold hover:bg-light-blue hover:text-dark-primary transition-all group"
                >
                  Login
                </Link>
              </>
            ) : (
              <>
                {/* Role-aware CTA */}
                {useSelector((state) => state.auth.isAdmin) ? (
                  <Link 
                    to="/admin" 
                    className="flex items-center justify-center gap-3 px-8 sm:px-10 py-3 sm:py-4 text-lg sm:text-xl bg-light-blue text-dark-primary rounded-xl font-semibold hover:bg-opacity-90 transition-all group"
                  >
                    Manage Sweets
                    <FaCheckCircle className="transform transition-transform group-hover:scale-110" />
                  </Link>
                ) : (
                  <>
                    <Link 
                      to="/dashboard" 
                      className="flex items-center justify-center gap-3 px-8 sm:px-10 py-3 sm:py-4 text-lg sm:text-xl bg-light-blue text-dark-primary rounded-xl font-semibold hover:bg-opacity-90 transition-all group"
                    >
                      Go to Dashboard
                      <FaCheckCircle className="transform transition-transform group-hover:scale-110" />
                    </Link>
                    <Link 
                      to="/orders" 
                      className="flex items-center justify-center gap-3 px-8 sm:px-10 py-3 sm:py-4 text-lg sm:text-xl border border-light-blue text-light-blue rounded-xl font-semibold hover:bg-light-blue hover:text-dark-primary transition-all group"
                    >
                      My Orders
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </section>

        <SectionSeparator title="Key Features" />

        {/* Features Section */}
        <section className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {[
            {
              icon: FaCookie,
              title: 'Sweet Collection',
              description: 'Browse through our extensive collection of delicious sweets with detailed information and pricing.',
              color: 'text-light-blue',
              bgGradient: 'from-light-blue/10 to-dark-primary'
            },
            {
              icon: FaShoppingCart,
              title: 'Easy Purchasing',
              description: 'Simple and secure purchasing system with real-time inventory tracking and instant updates.',
              color: 'text-emerald-400',
              bgGradient: 'from-emerald-400/10 to-dark-primary'
            },
            {
              icon: FaUsers,
              title: 'Admin Management',
              description: 'Comprehensive admin panel for managing inventory, adding new products, and tracking sales.',
              color: 'text-purple-400',
              bgGradient: 'from-purple-400/10 to-dark-primary'
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className={`
                bg-gradient-to-br ${feature.bgGradient} 
                rounded-xl p-8 text-center 
                transform transition-all 
                hover:scale-105 hover:shadow-2xl 
                border border-dark-primary/30
              `}
            >
              <feature.icon className={`mx-auto text-6xl mb-6 ${feature.color}` } />
              <h2 className="text-2xl font-bold mb-4 text-light-blue">{feature.title}</h2>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </section>

        {/* Call to Action */}
        {!userAuth && (
          <>
            <SectionSeparator title="Join Sweet Shop" />
            <section className="text-center bg-dark-primary rounded-xl p-8 sm:p-16 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-light-blue/10 to-dark-primary/30 opacity-20"></div>
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-light-blue">
                  Start Your Sweet Journey
                </h2>
                <p className="max-w-xl sm:max-w-2xl mx-auto text-gray-300 mb-6 sm:mb-10 text-base sm:text-lg">
                  Join Sweet Shop today and experience the sweetest way to manage and purchase your favorite treats.
                </p>
                <Link 
                  to="/signup"
                  className="
                    inline-flex items-center gap-3 
                    px-8 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl 
                    bg-light-blue text-dark-primary 
                    rounded-xl font-bold 
                    hover:bg-opacity-90 
                    transition-all 
                    group
                  "
                >
                  Sign Up Now
                  <FaArrowRight className="transform transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;