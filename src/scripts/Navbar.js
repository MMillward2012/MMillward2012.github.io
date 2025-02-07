import React, { useState, useEffect, useMemo } from 'react';
import { Menu, X, Code2 } from 'lucide-react';

const Navbar = ({ scrollToSection, isMenuOpen, setIsMenuOpen }) => {
  const [activePage, setActivePage] = useState('home');

  // Wrap navItems in useMemo to avoid ESLint warning
  const navItems = useMemo(() => [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'education', label: 'Education' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' }
  ], []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.pageYOffset + window.innerHeight / 3;
      let newActivePage = 'home';

      navItems.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            newActivePage = id;
          }
        }
      });

      setActivePage(newActivePage);
    };

    const debouncedScroll = debounce(handleScroll, 30);
    window.addEventListener('scroll', debouncedScroll);
    handleScroll(); 

    return () => window.removeEventListener('scroll', debouncedScroll);
  }, [navItems]);

  return (
    <nav className={`fixed w-full z-50 transition-all font-poppins duration-200 ${isMenuOpen || activePage !== 'home' ? 'bg-[#060815] shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-5">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {/* Using Lucide Settings Icon */}
            <Code2 className="h-8 w-8 mr-6 text-white" />
            <a href="#home" className="text-white font-bold text-xl font-poppins">Matthew's Portfolio</a>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activePage === item.id ? 'text-white bg-gray-700' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-200 ${isMenuOpen ? 'max-h-screen opacity-100 visible' : 'max-h-0 opacity-0 invisible'}`}
        style={{
          transition: 'max-height 0.3s ease, opacity 0.3s ease, visibility 0.3s ease',
        }}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#060815]">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => {
                scrollToSection(item.id);
                setIsMenuOpen(false);
              }}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                activePage === item.id ? 'text-white bg-gray-700' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

// Helper function for debouncing
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default Navbar;
