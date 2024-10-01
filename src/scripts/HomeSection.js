import React from 'react';
import { ChevronDown, Github, Linkedin, Twitter } from 'lucide-react';

const HomeSection = ({ scrollToSection }) => (
  <section
    id="home"
    className="min-h-screen flex flex-col justify-center items-center text-center relative overflow-hidden bg-cover bg-center"
    style={{ backgroundImage: 'url(./assets/background.png)' }}
  >
    {/* Content */}
    <div className="relative z-10 max-w-4xl mx-auto px-4">
      <h1 className="text-6xl font-bold mb-6 animate-fade-in text-white">Matthew Millward</h1>
      <h2 className="text-4xl font-semibold mb-4 animate-fade-in animation-delay-300 text-white">
        Aspiring AI & Machine Learning Engineer
      </h2>
      <p className="text-xl mb-8 animate-fade-in animation-delay-600 text-white">
        Searching for an Internship and Placement in Data Science,<br />
        Software Engineering or another related field
      </p>
      <button
        onClick={() => scrollToSection('projects')}
        className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors duration-300 animate-fade-in animation-delay-900"
      >
        View My Work
      </button>
    </div>

    {/* Chevron for scrolling to the About section */}
    <ChevronDown
      size={48}
      className="absolute bottom-20 animate-bounce text-white" // Adjusted bottom position
      style={{ zIndex: 20 }} // Increased z-index to ensure it’s clickable
      onClick={() => {
        console.log("Chevron clicked!"); // For debugging
        scrollToSection('about');
      }}
    />

    {/* Social Media Icons */}
    <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-6">
      <a
        href="https://github.com/MMillward2012/Projects"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-white"
      >
        <Github size={24} />
      </a>
      <a
        href="https://www.linkedin.com/in/your-profile"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-white"
      >
        <Linkedin size={24} />
      </a>
      <a
        href="https://twitter.com/your-profile"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-white"
      >
        <Twitter size={24} />
      </a>
    </div>
  </section>
);

export default HomeSection;
