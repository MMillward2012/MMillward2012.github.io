import React from 'react';
import { ReactTyped } from 'react-typed';


const AboutSection = () => {
  return (
    <section
      className="relative"
      id="about"
      style={{
        backgroundColor: 'rgb(6, 8, 21)',
        color: 'white',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        fontFamily: "'Chivo', sans-serif",
        position: 'relative',
      }}
    >
      <div className="container mx-auto px-4 pb-6 pt-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left Text Section */}
        <div className="text-center md:text-left md:w-1/2 mb-8 md:mb-0">
          <h2 className="text-3xl md:text-4xl font-semibold mb-1">About Me</h2>

          <h1
            className="text-4xl md:text-6xl font-bold mb-3 leading-tight"
            style={{
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            I AM A
          </h1>
          <h1 className="text-4xl md:text-6xl font-bold mb-3 leading-tight">
            <span className="text-purple-500">
              <ReactTyped
                strings={['MATHEMATICS', 'DATA SCIENCE', 'ML AND AI']}
                typeSpeed={80}
                backSpeed={60}
                loop
              />
            </span>
          </h1>
          <h1 className="text-4xl md:text-6xl font-bold mb-3">STUDENT</h1>
          <h1 className="text-3xl font-semibold text-white mb-6">AT DURHAM UNIVERSITY</h1>

          <p className="text-lg md:text-xl mb-5 leading-relaxed" style={{ fontWeight: 350, fontFamily: "'Open Sans', sans-serif" }}>
            I’m in my second year of university and excited to dive deeper into data science, statistical modelling and machine learning in the semesters ahead. 
            I'm actively looking for a summer internship and a placement year to gain hands-on experience and put my skills into practice in real-world settings.
          </p>
          <p className="text-lg md:text-xl mb-5 leading-relaxed" style={{ fontWeight: 350, fontFamily: "'Open Sans', sans-serif" }}>
            Outside of my studies, I'm passionate about fitness and enjoy hitting the gym to stay active.
            I’m also looking forward to trying something a bit more adventurous in the future - skydiving, gliding and scuba diving are next on my list!
          </p>
        </div>

        {/* Right Image Container with Gradient Background and Dots */}
        <div className="relative md:w-1/2 flex items-end justify-center">
          <div
            className="relative"
            style={{
              width: '35vw',
              paddingTop: '35vw',
              background: 'linear-gradient(135deg, #3813C2 0%, #FF6FD8 100%)',
              borderRadius: '40px',
              overflow: 'hidden',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <svg
              className="absolute top-6 left-2 z-2"
              width="40"
              height="280"
              viewBox="0 0 40 280"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {Array.from({ length: 2 }).map((_, col) =>
                Array.from({ length: 10 }).map((_, row) => (
                  <circle
                    key={`tl-inner-${col}-${row}`}
                    cx={col * 12 + 7.5}
                    cy={row * 12 + 10}
                    r="3"
                    fill="#FFFFFF"
                  />
                ))
              )}
            </svg>

            <svg
              className="absolute -bottom-40 -right-2 z-8"
              width="40"
              height="300"
              viewBox="0 0 40 300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {Array.from({ length: 2 }).map((_, col) =>
                Array.from({ length: 10 }).map((_, row) => (
                  <circle
                    key={`br-inner-${col}-${row}`}
                    cx={col * 12 + 7.5}
                    cy={row * 12 + 10}
                    r="3"
                    fill="#FFFFFF"
                  />
                ))
              )}
            </svg>
          </div>

          {/* Positioned image for overlap effect */}
          <div
            className="absolute"
            style={{
              width: '38vw',
              height: '38vw',
              bottom: '0%',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 3,
              overflow: 'visible',
            }}
          >
            <img
              className="absolute transition-all duration-500 ease-in-out"
              src="assets/matriculation_pic.png"
              alt="Profile"
              style={{
                width: '100%',
                height: '110%',
                objectFit: 'cover',
                objectPosition: 'center top',
                bottom: '0',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
