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
      <div className="w-full border-t border-chocolate/30"></div>
    </div>
    {title && (
      <div className="relative flex justify-center">
        <span className="bg-cream px-6 py-2 text-chocolate text-sm uppercase tracking-wider font-semibold rounded-full">
          {title}
        </span>
      </div>
    )}
  </div>
);

const Home = () => {
  const userAuth = useSelector(selectUserAuth);

  return (
    <div className="min-h-screen bg-gradient-primary text-slate-800 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-saffron/10 via-cream/20 to-chocolate/10 animate-pulse"></div>
      </div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        {/* Hero Section */}
        <section className="text-center mb-20 px-4">
          <div className="inline-block bg-chocolate/90 rounded-full px-6 py-2 mb-6 text-cream text-sm sm:text-base shadow-chocolate">
           Sweet Shop Management System
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-chocolate leading-tight">
            Sweet Shop
          </h1>
          <p className="text-base sm:text-lg md:text-2xl max-w-3xl mx-auto text-chocolate/70 mb-10 leading-relaxed">
            Your one-stop destination for managing and purchasing delicious sweets. 
            Browse our collection, make purchases, and manage inventory with ease.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            {!userAuth ? (
              <>
                <Link 
                  to="/signup" 
                  className="btn-primary flex items-center justify-center gap-3 px-8 sm:px-10 py-3 sm:py-4 text-lg sm:text-xl rounded-xl group shadow-warm"
                >
                  🎉 Get Started
                  <FaArrowRight className="transform transition-transform group-hover:translate-x-1" />
                </Link>
                <Link 
                  to="/login" 
                  className="btn-outline flex items-center justify-center gap-3 px-8 sm:px-10 py-3 sm:py-4 text-lg sm:text-xl rounded-xl group"
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
                    className="btn-primary flex items-center justify-center gap-3 px-8 sm:px-10 py-3 sm:py-4 text-lg sm:text-xl rounded-xl group shadow-warm"
                  >
                     Manage Sweets
                    <FaCheckCircle className="transform transition-transform group-hover:scale-110" />
                  </Link>
                ) : (
                  <>
                    <Link 
                      to="/products" 
                      className="btn-primary flex items-center justify-center gap-3 px-8 sm:px-10 py-3 sm:py-4 text-lg sm:text-xl rounded-xl group shadow-warm"
                    >
                      🍰 Browse Products
                      <FaCheckCircle className="transform transition-transform group-hover:scale-110" />
                    </Link>
                    <Link 
                      to="/orders" 
                      className="btn-outline flex items-center justify-center gap-3 px-8 sm:px-10 py-3 sm:py-4 text-lg sm:text-xl rounded-xl group"
                    >
                      📦 My Orders
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
              color: 'text-saffron',
              bgGradient: 'card'
            },
            {
              icon: FaShoppingCart,
              title: 'Easy Purchasing',
              description: 'Simple and secure purchasing system with real-time inventory tracking and instant updates.',
              color: 'text-chocolate',
              bgGradient: 'card'
            },
            {
              icon: FaUsers,
              title: 'Admin Management',
              description: 'Comprehensive admin panel for managing inventory, adding new products, and tracking sales.',
              color: 'text-saffron-dark',
              bgGradient: 'card'
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className={`
                ${feature.bgGradient} p-8 text-center 
                transform transition-all 
                hover:scale-105 hover:shadow-warm 
                animate-slide-up
              `}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <feature.icon className={`mx-auto text-6xl mb-6 ${feature.color}` } />
              <h2 className="text-2xl font-bold mb-4 text-chocolate">{feature.title}</h2>
              <p className="text-chocolate/70">{feature.description}</p>
            </div>
          ))}
        </section>

        {/* Call to Action */}
        {!userAuth && (
          <>
            <SectionSeparator title="Join Sweet Shop" />
            <section className="text-center card p-8 sm:p-16 relative overflow-hidden shadow-chocolate">
              <div className="absolute inset-0 bg-gradient-warm opacity-10 rounded-lg"></div>
              <div className="relative z-10">
                <div className="text-6xl mb-6">🍯</div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-chocolate">
                  Start Your Sweet Journey
                </h2>
                <p className="max-w-xl sm:max-w-2xl mx-auto text-chocolate/70 mb-6 sm:mb-10 text-base sm:text-lg">
                  Join Sweet Shop today and experience the sweetest way to manage and purchase your favorite treats.
                </p>
                <Link 
                  to="/signup"
                  className="btn-primary inline-flex items-center gap-3 px-8 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl rounded-xl group shadow-warm"
                >
                  🎉 Sign Up Now
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