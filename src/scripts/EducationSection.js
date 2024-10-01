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
    period: "2021",
    description: "An in-depth introduction to computer science, covering fundamental concepts such as algorithms, data structures, and web development.",
    side: "left",
  },
  {
    title: "Data Structures & Algorithms",
    institution: "mycodeschool - YouTube",
    location: "Online",
    period: "2024",
    description: "Covered arrays, linked lists, stacks, queues, trees, graphs, and sorting algorithms through this course. The hands-on exercises helped me learn efficient data organisation and processing, crucial for advanced coding and analysis tasks.",
    side: "right",
  },
];

const EducationItem = ({ item }) => {
  const ref = useRef(null);
  const { scrollY } = useScroll();
  const [shouldShow, setShouldShow] = useState(true);
  const prevScrollY = useRef(0);

  const { inView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

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
      x: item.side === 'left' ? -50 : 50,
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
      className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300 border border-blue-500/30"
    >
      <h3 className="text-2xl font-bold mb-2 text-blue-300">{item.title}</h3>
      <h4 className="text-xl text-blue-400 mb-2">{item.institution}</h4>
      <div className="flex items-center text-gray-300 mb-3">
        <Calendar size={16} className="mr-2 text-blue-400" />
        <span className="mr-4">{item.period}</span>
        <MapPin size={16} className="mr-2 text-blue-400" />
        <span>{item.location}</span>
      </div>
      <p className="text-gray-300 leading-relaxed">{item.description}</p>
    </motion.div>
  );
};

const EducationSection = () => {
  return (
    <section className="py-16 text-white bg-[rgb(6,8,21)]" id="education">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2 
          className="text-5xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          My Education
        </motion.h2>
        <div className="relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
          {educationData.map((item, index) => (
            <div key={index} className="flex justify-between items-center w-full mb-8">
              {item.side === "left" ? (
                <>
                  <div className="w-5/12 pr-4">
                    <EducationItem item={item} />
                  </div>
                  <div className="z-20 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 border-4 border-gray-900 shadow-lg">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                  <div className="w-5/12"></div>
                </>
              ) : (
                <>
                  <div className="w-5/12"></div>
                  <div className="z-20 flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 border-4 border-gray-900 shadow-lg">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                  <div className="w-5/12 pl-4">
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