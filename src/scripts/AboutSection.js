import React from 'react';
import { ReactTyped } from 'react-typed';
import MLNodeGraph from './MLNodeGraph';

const AboutSection = () => {
  return (
    <section
      id="about"
      className="relative pt-12 pb-12 md:pt-24 md:pb-24"
      style={{
        backgroundColor: 'rgb(6, 8, 21)',
        color: 'white',
        minHeight: '100vh',
        fontFamily: "'Chivo', sans-serif",
      }}
    >
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left Text Section */}
        <div className="md:w-1/2 text-left">
          <h2 className="text-3xl md:text-4xl font-semibold mb-2">About Me</h2>
          <h1 className="text-4xl md:text-6xl font-bold mb-2 leading-tight uppercase tracking-widest">
            I AM A
          </h1>
          <h1 className="text-4xl md:text-6xl font-bold mb-2">
            <span className="text-purple-500">
              <ReactTyped strings={['MATHEMATICS', 'STATISTICS']} typeSpeed={80} backSpeed={60} loop />
            </span>
          </h1>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">STUDENT</h1>
          <h1 className="text-2xl font-semibold text-white mb-8">AT DURHAM UNIVERSITY</h1>
          <p
            className="text-lg md:text-xl mb-6 leading-relaxed"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            I'm in my second year of university and excited to dive deeper into data science, statistical
            modelling, and machine learning in the semesters ahead. I'm actively looking for a summer internship
            to gain hands-on experience and put my skills into practice.
          </p>
          <p
            className="text-lg md:text-xl leading-relaxed"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            Outside of my studies, I'm passionate about fitness and enjoy hitting the gym to stay active.
            I'm also looking forward to trying something a bit more adventurous in the future—skydiving, gliding,
            and scuba diving are next on my list!
          </p>
        </div>

        {/* Right Section - Now just MLNodeGraph */}
        <div className="md:w-1/2">
          <div className="bg-opacity-20 bg-gray-800 backdrop-filter backdrop-blur-sm p-6 rounded-xl border border-gray-700 shadow-lg">
            <MLNodeGraph />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;