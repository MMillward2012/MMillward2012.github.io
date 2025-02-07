import React, { useState, useEffect } from 'react';
import { ChevronDown, Github, Linkedin, Twitter } from 'lucide-react';

const HomeSection = ({ scrollToSection }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const openLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Helper function to create dots
  const createDots = (count, spacing, size = 5) => {
    return Array.from({ length: 2 }).map((_, col) =>
      Array.from({ length: count }).map((_, row) => (
        <circle
          key={`dot-${col}-${row}`}
          cx={col * spacing + 7.5} // Adjusted to match both sides
          cy={row * spacing + 10}
          r={size} // Adjusted size
          fill="#FFFFFF"
          opacity={1 - (row * 0.05)}
        />
      ))
    );
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800"
    >
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <div className="overflow-hidden">
              <h1
                className={`
                  text-6xl md:text-7xl lg:text-8xl font-black tracking-tight 
                  text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600
                  transition-all duration-1000 ease-out-expo
                  ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                `}
              >
                MATTHEW
                <br />
                MILLWARD
              </h1>
            </div>

            <div className="relative">
              <h2
                className={`
                  text-4xl font-bold text-gray-200 
                  border-l-4 border-blue-500 pl-4
                  transition-all duration-1000 delay-300 ease-out-expo
                  ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                `}
              >
                ASPIRING AI & MACHINE
                <br />
                LEARNING ENGINEER
              </h2>
            </div>

            <p
              className={`
                text-xl text-gray-400 max-w-md leading-relaxed
                transition-all duration-1000 delay-500 ease-out-expo
                ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
              `}
            >
              Architecting intelligent solutions at the intersection of cutting-edge technology and transformative innovation.
            </p>

            <div
              className={`
                flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6
                transition-all duration-1000 delay-700 ease-out-expo
                ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
              `}
            >
              <button
                onClick={() => scrollToSection('projects')}
                className="
                  px-10 py-4 text-lg
                  bg-gradient-to-r from-blue-600 to-purple-700 
                  text-white rounded-full 
                  hover:from-blue-700 hover:to-purple-800
                  transition-all duration-300 
                  shadow-2xl hover:shadow-blue-500/50
                  flex items-center group"
              >
                Explore Projects
                <span className="ml-3 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </button>

              <div className="flex space-x-5 mt-4 md:mt-0">
                {[
                  { 
                    Icon: Github, 
                    link: "https://github.com/MMillward2012",
                    color: "hover:text-white hover:bg-blue-600 rounded-full p-2"
                  },
                  { 
                    Icon: Linkedin, 
                    link: "https://www.linkedin.com/in/matthew-millward2012",
                    color: "hover:text-white hover:bg-blue-600 rounded-full p-2"
                  },
                  { 
                    Icon: Twitter, 
                    link: "https://twitter.com",
                    color: "hover:text-white hover:bg-blue-600 rounded-full p-2"
                  }
                ].map(({ Icon, link, color }, index) => (
                  <div
                    key={link}
                    onClick={() => openLink(link)}
                    className={`
                      bg-gray-800 bg-opacity-50 
                      text-gray-400 ${color}
                      p-2 rounded-full
                      hover:scale-110 transition-all 
                      cursor-pointer
                      flex items-center justify-center
                      delay-${700 + (index * 100)}
                      ${isLoaded ? 'opacity-100' : 'opacity-0'}
                    `}
                  >
                    <Icon size={24} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Image Section */}
          <div className="relative w-full flex items-end justify-center">
            {/* Background Square Container */}
            <div className="relative w-4/5 aspect-square">  {/* Adjusted width */}
              <div
                className="absolute inset-0 rounded-[3rem]"
                style={{
                  background: 'linear-gradient(135deg, #3813C2 0%, #FF6FD8 100%)',
                }}
              >
                {/* Top Left Dots */}
                <div className="absolute left-6 top-6">
                  <svg
                    width="40"
                    height="280"
                    viewBox="0 0 40 280"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {createDots(12, 18, 5)} {/* Adjusted size */}
                  </svg>
                </div>

                {/* Bottom Right Dots */}
                <div className="absolute right-6" style={{ bottom: '24px' }}>
                  <svg
                    width="40"
                    height="380" // Increased height to prevent cutting off the dots
                    viewBox="0 0 40 380" // Adjusted viewBox to match the new height
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {Array.from({ length: 2 }).map((_, col) =>
                      Array.from({ length: 12 }).map((_, row) => (
                        <circle
                          key={`dot-right-${col}-${row}`}
                          cx={col * 18 + 7.5} // Same logic as left side for spacing
                          cy={380 - (row * 18 + 10)} // Adjusted `cy` values to fit dots better
                          r="5" // Larger size for the dots
                          fill="#FFFFFF"
                          opacity={1 - (row * 0.04)} // Adjusted opacity decay
                        />
                      ))
                    )}
                  </svg>
                </div>
              </div>

              {/* Profile Image */}
              <div className="absolute inset-0">
                <img
                  className="w-full h-full object-cover object-top transition-all duration-500 ease-in-out rounded-[3rem]"
                  src="/assets/matriculation_pic.png"
                  alt="Profile"
                  style={{
                    transform: 'scale(1.2) translateY(-8%) translateX(-3%)' // Adjusted translation to move the image up
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className={`
          absolute bottom-8 left-1/2 transform -translate-x-1/2 
          text-white/50 hover:text-white cursor-pointer 
          transition-all duration-1000 delay-1000
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
        `}
        onClick={() => scrollToSection('about')}
      >
        <ChevronDown
          size={36}
          className="animate-bounce"
        />
      </div>
    </section>
  );
};

export default HomeSection;
