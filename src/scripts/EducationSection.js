import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, useScroll } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';

const educationData = [
  {
    title: "Degree in Mathematics",
    institution: "Durham University",
    location: "Durham, UK",
    period: "2023 - Present",
    description: "Concentrating on mathematical theory, statistical analysis, and computational techniques. Developed problem-solving skills through advanced calculus, linear algebra, and data analysis. Gained exposure to mathematical modeling and applications in software development.",
    side: "left",
  },  
  {
    title: "A-Levels: Mathematics, Further Mathematics, Physics, Chemistry (and an EPQ)",
    institution: "Sir Graham Balfour",
    location: "Stafford, UK",
    period: "2021 - 2023",
    description: "Studied advanced topics in mathematics, physics, and chemistry, developing strong analytical and problem-solving skills. Wrote my EPQ on theoretical triangular planetary trajectories and coded a simulation to display these. Achieved A*, A*, A*, A*, A.",
    side: "right",
  },  
  {
    title: "CS50: Introduction to Computer Science",
    institution: "Harvard University (edX)",
    location: "Online",
    period: "2024",
    description: "An in-depth introduction to computer science, covering fundamental concepts such as algorithms, data structures, and web development.",
    side: "left",
  },
  {
    title: "Academy for PhD Training in Statistics (APTS)",
    institution: "The University of Warwick",
    location: "Online",
    period: "2025 - Present",
    description: "I am currently studying the Academy for PhD Training in Statistics (APTS) course, which is designed to provide PhD students with knowledge of advanced statistical methods and computational techniques",
    side: "right",
  },
];

const EducationItem = ({ item }) => {
  const ref = useRef(null);
  const { scrollY } = useScroll();
  const [shouldShow, setShouldShow] = useState(true);
  const prevScrollY = useRef(0);
  const [isMobile, setIsMobile] = useState(false);

  const { inView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  
  useEffect(() => {
    const handleScroll = () => {
      const element = ref.current;
      if (element) {
        const { top, bottom } = element.getBoundingClientRect();
        const viewHeight = window.innerHeight;
        const scrollTop = scrollY.get();
        const isScrollingDown = scrollTop > prevScrollY.current;
        prevScrollY.current = scrollTop;

        if (isScrollingDown) {
          // Scrolling down
          if (bottom < 0 || top > viewHeight) {
            setShouldShow(false);
          } else {
            setShouldShow(true);
          }
        } else {
          // Scrolling up
          if (bottom < viewHeight && top > 0) {
            setShouldShow(true);
          } else {
            setShouldShow(false);
          }
        }
      }
    };

    // Set up the scroll listener
    const unsubscribe = scrollY.onChange(handleScroll);

    // Initial check
    handleScroll();

    return () => {
      unsubscribe();
    };
  }, [scrollY, inView]);

  const variants = {
    hidden: { 
      opacity: 0, 
      x: isMobile ? 50 : (item.side === 'left' ? -50 : 50),
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={shouldShow ? "visible" : "hidden"}
      className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg shadow-lg p-3 sm:p-6 hover:shadow-2xl transition-shadow duration-300 border border-blue-500/30"
    >
      <h3 className="text-base sm:text-2xl font-bold mb-1 sm:mb-2 text-blue-300">{item.title}</h3>
      <h4 className="text-sm sm:text-xl text-blue-400 mb-1 sm:mb-2">{item.institution}</h4>
      <div className="flex flex-col sm:flex-row text-xs sm:text-base items-start sm:items-center text-gray-300 mb-2 sm:mb-3">
        <div className="flex items-center mb-1 sm:mb-0 sm:mr-4">
          <Calendar size={12} className="mr-1 sm:mr-2 text-blue-400" />
          <span>{item.period}</span>
        </div>
        <div className="flex items-center">
          <MapPin size={12} className="mr-1 sm:mr-2 text-blue-400" />
          <span>{item.location}</span>
        </div>
      </div>
      <p className="text-xs sm:text-base text-gray-300 leading-relaxed">{item.description}</p>
    </motion.div>
  );
};

const EducationSection = () => {
  return (
    <section className="py-8 sm:py-16 text-white bg-[rgb(6,8,21)]" id="education">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2 
          className="text-4xl sm:text-5xl font-extrabold text-center mb-8 sm:mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          My Education
        </motion.h2>
        <div className="relative">
          <div className="absolute top-0 sm:left-1/2 left-[10%] transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
          {educationData.map((item, index) => (
            <div key={index} className="flex justify-between items-center w-full mb-6 sm:mb-8">
              {item.side === "left" ? (
                <>
                  <div className="w-[85%] sm:w-5/12 ml-auto sm:ml-0 sm:pr-4">
                    <EducationItem item={item} />
                  </div>
                  <div className="z-20 absolute left-[10%] sm:left-1/2 transform -translate-x-1/2 flex items-center justify-center w-4 h-4 sm:w-8 sm:h-8 rounded-full bg-blue-600 border-2 sm:border-4 border-gray-900 shadow-lg">
                    <div className="w-1 h-1 sm:w-2 sm:h-2 rounded-full bg-white"></div>
                  </div>
                  <div className="hidden sm:block w-5/12"></div>
                </>
              ) : (
                <>
                  <div className="hidden sm:block w-5/12"></div>
                  <div className="z-20 absolute left-[10%] sm:left-1/2 transform -translate-x-1/2 flex items-center justify-center w-4 h-4 sm:w-8 sm:h-8 rounded-full bg-purple-600 border-2 sm:border-4 border-gray-900 shadow-lg">
                    <div className="w-1 h-1 sm:w-2 sm:h-2 rounded-full bg-white"></div>
                  </div>
                  <div className="w-[85%] sm:w-5/12 ml-auto sm:ml-0 sm:pl-4">
                    <EducationItem item={item} />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;