import React, { useState, useRef, useCallback, Suspense } from 'react';
import './styles/App.css';
import Navbar from './scripts/Navbar';
import HomeSection from './scripts/HomeSection';
import AboutSection from './scripts/AboutSection';
import ErrorBoundary from './scripts/ErrorBoundary';  // Update this line

const EducationSection = React.lazy(() => import('./scripts/EducationSection'));
const ProjectSection = React.lazy(() => import('./scripts/ProjectSection'));
const ContactSection = React.lazy(() => import('./scripts/ContactSection'));

const Portfolio = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const sectionsRef = useRef({});

  const scrollToSection = useCallback((sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMenuOpen(false);
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen text-white overflow-x-hidden">
        <Navbar
          scrollToSection={scrollToSection}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />
        <main className="relative">
          <HomeSection scrollToSection={scrollToSection} />
          <AboutSection id="about" ref={(el) => (sectionsRef.current['about'] = el)} />
          <Suspense fallback={<div>Loading...</div>}>
            <EducationSection id="education" ref={(el) => (sectionsRef.current['education'] = el)} />
            <ProjectSection id="projects" ref={(el) => (sectionsRef.current['projects'] = el)} />
            <ContactSection id="contact" ref={(el) => (sectionsRef.current['contact'] = el)} />
          </Suspense>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default Portfolio;