import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ProjectSection = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const sectionInView = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  const projects = [
    {
      title: "Atmospheric Carbon Monitoring and Prediction Model",
      description: "Developed a MATLAB-based advection-diffusion model to predict black carbon concentrations from the 2020 Australian wildfires using MERRA2 data.",
      tech: ["MATLAB", "Data Handling"],
      image: "/assets/merra.png",
    },
    {
      title: "Truss Structure Analysis",
      description: "Optimised truss structures to support various loads while meeting constraints on deflection and cross-sectional area, and compared the effectiveness of MATLAB's fmincon and simulannealbnd optimisers.",
      tech: ["MATLAB", "Optimisation", "Structural Analysis"],
      image: "/assets/matlab_truss.png",
    },
    {
      title: "Handwritten Number Recognition",
      description: "Used neural networks in python to classify handwritten digits, starting with an 8x8 pixel dataset and expanding to any user input, achieving a classification accuracy of over 96%.",
      tech: ["Python", "Sklearn", "Neural Networks"],
      image: "/assets/handwritten_number.png",
    },
    {
      title: "iOS Calculator App",
      description: "An introduction to mobile app development using SwiftUI",
      tech: ["SwiftUI", "iOS", "Mobile Development"],
      image: "/assets/calculator.png",
    },
  ];
  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative"
      style={{
        backgroundColor: 'rgb(6, 8, 21)',
        height: `${(projects.length + 1.5) * 100}vh`
      }}
    >
      <motion.div
        className="fixed top-0 left-0 w-full h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{
          opacity: sectionInView,
        }}
      >
        <motion.h2 
          className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-8 text-center z-10"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        >
          Latest Work
        </motion.h2>
        <div className="relative w-full max-w-4xl h-[calc(100vh-200px)] overflow-visible flex items-center justify-center">
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              project={project}
              index={index}
              totalProjects={projects.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

const ProjectCard = ({ project, index, totalProjects, scrollYProgress }) => {
  const threshold = index / totalProjects;
  
  const visibility = useTransform(
    scrollYProgress,
    [threshold - 0.15, threshold - 0.1],
    [0, 1]
  );

  const y = useTransform(
    scrollYProgress,
    [threshold - 0.15, threshold - 0.1, threshold],
    ['calc(100% + 60vh)', 'calc(100% + 60vh)', '0%']
  );

  const zIndex = useTransform(
    scrollYProgress,
    [threshold - 0.15, threshold],
    [index, index + 1]
  );

  return (
    <motion.div
      className="absolute w-2/3"
      style={{
        y,
        zIndex,
        visibility: useTransform(visibility, v => v === 0 ? 'hidden' : 'visible'),
      }}
    >
      <motion.div 
        className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:scale-105 h-[60vh]"
      >
        <div className="p-6">
          <h3 className="text-2xl font-bold text-white mb-2 leading-tight">{project.title}</h3>
          <p className="text-base text-gray-300 mb-4 leading-relaxed">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech, techIndex) => (
              <span
                key={techIndex}
                className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium transition-colors duration-300 hover:bg-blue-700"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-64 object-cover object-center"
        />
      </motion.div>
    </motion.div>
  );
};

export default ProjectSection;