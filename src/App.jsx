import './styles/index.css'
import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'framer-motion'
import Lenis from 'lenis'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility for tailwind class merging
function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// --- Components ---

function SmoothScroll({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Expo ease out - snappy
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.5, // Much faster response
      touchMultiplier: 2.5,
      syncTouch: true,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => lenis.destroy()
  }, [])

  return <>{children}</>
}

function Magnetic({ children }) {
  const ref = useRef(null)
  const position = { x: useMotionValue(0), y: useMotionValue(0) }

  const handleMouse = (e) => {
    const { clientX, clientY } = e
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    const x = clientX - (left + width / 2)
    const y = clientY - (top + height / 2)
    position.x.set(x * 0.35)
    position.y.set(y * 0.35)
  }

  const reset = () => {
    position.x.set(0)
    position.y.set(0)
  }

  const { x, y } = position
  
  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  )
}

function BackgroundGrid() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{ 
          backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', 
          backgroundSize: '60px 60px' 
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]" />
    </div>
  )
}

function ProjectItem({ project, index, isOpen, onClick }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      onClick={onClick}
      className="group border-t border-white/10 cursor-pointer transition-colors hover:bg-white/5"
    >
      <div className="container mx-auto px-6 md:px-12 py-12 md:py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="text-3xl md:text-5xl font-light tracking-tight group-hover:translate-x-4 transition-transform duration-500 ease-out">
            {project.title}
          </h3>
          <div className="flex items-center gap-8 md:gap-16 text-sm md:text-base text-white/40 group-hover:text-white/70 transition-colors">
            <span>{project.role}</span>
            <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 4v16m8-8H4" />
              </svg>
            </span>
          </div>
        </div>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-8 md:pt-12 grid md:grid-cols-2 gap-12">
                <div>
                  <p className="text-lg text-white/60 leading-relaxed mb-6">
                    {project.description}
                  </p>
                  <div className="flex gap-4 text-sm text-[#d4a853]">
                    {project.stack.split(', ').map((tech) => (
                      <span key={tech} className="border border-[#d4a853]/30 px-3 py-1 rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col justify-end items-start md:items-end">
                  <span className="text-xs uppercase tracking-widest text-white/40 mb-2">Year</span>
                  <span className="text-xl">{project.year}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function App() {
  const containerRef = useRef(null)
  const heroWrapperRef = useRef(null)
  const [expandedProject, setExpandedProject] = useState(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Hero + About Animation Control
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroWrapperRef,
    offset: ["start start", "end end"]
  })

  // 1. Hero text splits and fades out
  const matthewX = useTransform(heroProgress, [0, 0.15], ["0%", "-110%"])
  const millwardX = useTransform(heroProgress, [0, 0.15], ["0%", "110%"])
  const textOpacity = useTransform(heroProgress, [0, 0.12], [1, 0])
  
  // Particles rise up from bottom as hero splits
  const particlesY = useTransform(heroProgress, [0, 0.2], ["100vh", "0vh"])
  const bgOpacity = useTransform(heroProgress, [0.08, 0.18, 0.85, 0.95], [0, 1, 1, 0])
  
  // Parallax movement for decorative elements - move UP as user scrolls down
  const parallaxSlow = useTransform(heroProgress, [0.2, 1], [0, -150])
  const parallaxMed = useTransform(heroProgress, [0.2, 1], [0, -250])
  const parallaxFast = useTransform(heroProgress, [0.2, 1], [0, -350])
  
  // 2. Apple-style sequential reveals (adjusted for 4 reveals)
  // First: Main intro text
  const intro1Opacity = useTransform(heroProgress, [0.12, 0.2, 0.3, 0.38], [0, 1, 1, 0])
  const intro1Y = useTransform(heroProgress, [0.12, 0.2], [30, 0])
  
  // Second: Credentials badges  
  const intro2Opacity = useTransform(heroProgress, [0.35, 0.43, 0.53, 0.61], [0, 1, 1, 0])
  const intro2Y = useTransform(heroProgress, [0.35, 0.43], [30, 0])
  
  // Third: Philosophy/focus statement
  const intro3Opacity = useTransform(heroProgress, [0.58, 0.66, 0.76, 0.84], [0, 1, 1, 0])
  const intro3Y = useTransform(heroProgress, [0.58, 0.66], [30, 0])
  
  // Fourth: Selected Works title
  const intro4Opacity = useTransform(heroProgress, [0.81, 0.89, 0.98, 1], [0, 1, 1, 1])
  const intro4Y = useTransform(heroProgress, [0.81, 0.89], [30, 0])

  const projects = [
    {
      title: "Options Pricing Engine",
      role: "Research Lead",
      year: "2024",
      description: "High-performance Monte Carlo simulation engine capable of pricing exotic derivatives with real-time Greeks. Built with CUDA for massive parallelism.",
      stack: "C++, CUDA, Python"
    },
    {
      title: "NLP Trading Signals",
      role: "Deep Learning",
      year: "2024",
      description: "Transformer-based sentiment analysis pipeline processing financial news in real-time to generate alpha signals with sub-millisecond latency.",
      stack: "PyTorch, TensorRT, Kafka"
    },
    {
      title: "Market Making Agent",
      role: "Reinforcement Learning",
      year: "2023",
      description: "Deep Q-Network agent trained to optimize spread capture in limit order books while managing inventory risk.",
      stack: "Python, OpenAI Gym, Ray"
    },
    {
      title: "Flight Delay Prediction",
      role: "Data Science",
      year: "2023",
      description: "Ensemble machine learning model predicting flight delays with 89% accuracy using weather and air traffic data.",
      stack: "Scikit-learn, Pandas, XGBoost"
    }
  ]

  return (
    <SmoothScroll>
      <div className="bg-[#0a0a0a] min-h-screen text-[#e1e1e1] selection:bg-[#d4a853] selection:text-black">
        <div className="bg-noise" />
        
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-8 flex justify-between items-start mix-blend-difference">
          <div className="flex flex-col">
            <span className="text-sm font-medium tracking-widest uppercase opacity-60">Matthew Millward</span>
            <span className="text-sm tracking-widest uppercase opacity-40 mt-1">Folio '25</span>
          </div>
          <div className="flex gap-10">
            <Magnetic>
              <a href="#about" className="text-sm font-medium tracking-widest uppercase hover:opacity-60 transition-opacity">About</a>
            </Magnetic>
            <Magnetic>
              <a href="#work" className="text-sm font-medium tracking-widest uppercase hover:opacity-60 transition-opacity">Work</a>
            </Magnetic>
            <Magnetic>
              <a href="#contact" className="text-sm font-medium tracking-widest uppercase hover:opacity-60 transition-opacity">Contact</a>
            </Magnetic>
          </div>
        </nav>

        <main ref={containerRef}>
          
          {/* Hero + About Wrapper - extended for 4 reveals */}
          <div ref={heroWrapperRef} className="relative h-[450vh]">
            <div className="sticky top-0 h-screen overflow-hidden bg-[#0a0a0a]">
              
              {/* Floating Particles - rise up from bottom */}
              <motion.div 
                style={{ y: particlesY, opacity: bgOpacity }}
                className="absolute inset-0 z-[15] pointer-events-none overflow-visible">
                {/* Particles container with parallax */}
                <motion.div className="absolute inset-0">
                  {/* Left side particles */}
                  <motion.div 
                    style={{ y: parallaxSlow }}
                    className="absolute top-[25%] left-[6%] w-2 h-2 bg-[#d4a853]/50 rounded-full"
                  />
                  <motion.div 
                    style={{ y: parallaxFast }}
                    className="absolute top-[55%] left-[3%] w-1 h-1 bg-white/40 rounded-full"
                  />
                  <motion.div 
                    style={{ y: parallaxMed }}
                    className="absolute top-[75%] left-[8%] w-1.5 h-1.5 bg-white/30 rounded-full"
                  />
                  <motion.div 
                    style={{ y: parallaxSlow }}
                    className="absolute top-[40%] left-[4%] w-1 h-1 bg-[#d4a853]/40 rounded-full"
                  />
                  <motion.div 
                    style={{ y: parallaxFast }}
                    className="absolute top-[90%] left-[10%] w-1.5 h-1.5 bg-white/25 rounded-full"
                  />
                  
                  {/* Right side particles */}
                  <motion.div 
                    style={{ y: parallaxMed }}
                    className="absolute top-[20%] right-[8%] w-1 h-1 bg-white/35 rounded-full"
                  />
                  <motion.div 
                    style={{ y: parallaxSlow }}
                    className="absolute top-[45%] right-[4%] w-2 h-2 bg-[#d4a853]/35 rounded-full"
                  />
                  <motion.div 
                    style={{ y: parallaxFast }}
                    className="absolute top-[70%] right-[10%] w-1 h-1 bg-white/30 rounded-full"
                  />
                  <motion.div 
                    style={{ y: parallaxMed }}
                    className="absolute top-[35%] right-[6%] w-1.5 h-1.5 bg-[#d4a853]/30 rounded-full"
                  />
                  <motion.div 
                    style={{ y: parallaxSlow }}
                    className="absolute top-[85%] right-[3%] w-1 h-1 bg-white/40 rounded-full"
                  />
                  <motion.div 
                    style={{ y: parallaxFast }}
                    className="absolute top-[60%] right-[12%] w-1 h-1 bg-[#d4a853]/25 rounded-full"
                  />
                  
                  {/* Extra small accent dots */}
                  <motion.div 
                    style={{ y: parallaxMed }}
                    className="absolute top-[30%] left-[15%] w-[3px] h-[3px] bg-white/20 rounded-full"
                  />
                  <motion.div 
                    style={{ y: parallaxFast }}
                    className="absolute top-[50%] right-[18%] w-[3px] h-[3px] bg-[#d4a853]/30 rounded-full"
                  />
                  <motion.div 
                    style={{ y: parallaxSlow }}
                    className="absolute top-[65%] left-[12%] w-[3px] h-[3px] bg-[#d4a853]/25 rounded-full"
                  />
                  <motion.div 
                    style={{ y: parallaxMed }}
                    className="absolute top-[80%] right-[15%] w-[3px] h-[3px] bg-white/25 rounded-full"
                  />
                  
                  {/* Rotating circle outlines */}
                  <motion.div 
                    style={{ y: parallaxSlow }}
                    className="absolute top-[28%] right-[7%]"
                  >
                    <motion.div 
                      className="w-20 h-20 border border-[#d4a853]/25 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    />
                  </motion.div>
                  <motion.div 
                    style={{ y: parallaxMed }}
                    className="absolute top-[72%] left-[5%]"
                  >
                    <motion.div 
                      className="w-16 h-16 border border-white/15 rounded-full"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
              
              {/* About Section - Apple-style sequential reveals */}
              <div className="absolute inset-0 z-20 flex items-center justify-center px-6 md:px-12 lg:px-24">
                
                {/* Reveal 1: Main intro */}
                <motion.div 
                  style={{ opacity: intro1Opacity, y: intro1Y }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="max-w-4xl text-center">
                    <p className="text-[clamp(2rem,4vw,4rem)] leading-[1.2] font-light text-white/90">
                      Third Year Mathematics student at <span className="text-white font-normal">Durham University</span>
                    </p>
                  </div>
                </motion.div>
                
                {/* Reveal 2: Credentials */}
                <motion.div 
                  style={{ opacity: intro2Opacity, y: intro2Y }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="max-w-6xl text-center">
                    <div className="flex flex-wrap justify-center gap-x-28 gap-y-12">
                      <div className="flex flex-col items-center gap-3">
                        <span className="text-4xl md:text-5xl text-white font-light">Google DeepMind</span>
                        <span className="text-lg md:text-xl text-[#d4a853]">Research Intern '25</span>
                      </div>
                      <div className="flex flex-col items-center gap-3">
                        <span className="text-4xl md:text-5xl text-white font-light">TAROS '24</span>
                        <span className="text-lg md:text-xl text-[#d4a853]">Best Paper Award</span>
                      </div>
                      <div className="flex flex-col items-center gap-3">
                        <span className="text-4xl md:text-5xl text-white font-light">BMO</span>
                        <span className="text-lg md:text-xl text-[#d4a853]">Gold Medalist</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Reveal 3: Focus areas */}
                <motion.div 
                  style={{ opacity: intro3Opacity, y: intro3Y }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="max-w-4xl text-center">
                    <p className="text-[clamp(1.75rem,3.5vw,3.5rem)] leading-[1.3] font-light text-white/90">
                      Upcoming Quantitative Researcher · Deep Learning · Algorithmic Trading
                    </p>
                  </div>
                </motion.div>
                
                {/* Reveal 4: Selected Works */}
                <motion.div 
                  style={{ opacity: intro4Opacity, y: intro4Y }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="text-center">
                    <motion.div className="flex flex-col items-center gap-6">
                      <div className="flex items-center gap-4">
                        <span className="h-[1px] w-12 bg-[#d4a853]"></span>
                        <span className="text-sm font-medium uppercase tracking-widest text-[#d4a853]">Portfolio</span>
                        <span className="h-[1px] w-12 bg-[#d4a853]"></span>
                      </div>
                      <h2 className="text-5xl md:text-8xl font-light tracking-tight text-white/90">
                        Selected Works
                      </h2>
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              {/* 2. Hero Text (Top Layer - Splits) */}
              <motion.div 
                style={{ opacity: textOpacity }}
                className="absolute inset-0 z-30 flex flex-col justify-center px-6 md:px-12 pointer-events-none bg-[#0a0a0a]"
              >
                <div className="w-full max-w-[90vw] mx-auto relative">
                  <div className="overflow-hidden">
                    <motion.h1 
                      style={{ x: matthewX }}
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
                      className="text-[clamp(4rem,13vw,16rem)] leading-[0.85] font-medium tracking-tighter text-[#e1e1e1]"
                    >
                      MATTHEW
                    </motion.h1>
                  </div>
                  <div className="overflow-hidden flex justify-end">
                    <motion.h1 
                      style={{ x: millwardX }}
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.3 }}
                      className="text-[clamp(4rem,13vw,16rem)] leading-[0.85] font-medium tracking-tighter text-[#666]"
                    >
                      MILLWARD
                    </motion.h1>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Work Section - Projects */}
          <section id="work" className="relative z-20 bg-[#0a0a0a] overflow-hidden pt-24 pb-32">
            <div className="absolute inset-0 opacity-50 pointer-events-none">
               <BackgroundGrid />
            </div>
            
            <div className="w-full">
              {projects.map((project, index) => (
                <ProjectItem 
                  key={index}
                  project={project}
                  index={index}
                  isOpen={expandedProject === index}
                  onClick={() => setExpandedProject(expandedProject === index ? null : index)}
                />
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="min-h-screen flex items-center justify-center py-32 px-6 md:px-12 bg-[#0a0a0a] relative z-20 overflow-hidden">
            <div className="max-w-6xl w-full mx-auto">
              <div className="text-center mb-16">
                <div className="flex items-center justify-center gap-4 mb-8">
                  <span className="h-[1px] w-12 bg-[#d4a853]"></span>
                  <span className="text-sm font-medium uppercase tracking-widest text-[#d4a853]">Contact</span>
                  <span className="h-[1px] w-12 bg-[#d4a853]"></span>
                </div>
                <h2 className="text-[clamp(3rem,8vw,8rem)] leading-[0.9] font-medium tracking-tighter mb-4">
                  LET'S WORK <br />
                  <span className="text-[#666]">TOGETHER</span>
                </h2>
              </div>
              
              <div className="max-w-3xl mx-auto">
                <form 
                  action="https://formspree.io/f/YOUR_FORM_ID" 
                  method="POST"
                  className="space-y-6 mb-16"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <input 
                      type="text" 
                      name="name"
                      placeholder="What's your name?" 
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-6 py-5 text-lg focus:outline-none focus:border-[#d4a853] focus:bg-white/10 transition-all placeholder:text-white/20"
                      required
                    />
                    <input 
                      type="email" 
                      name="email"
                      placeholder="What's your email?" 
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-6 py-5 text-lg focus:outline-none focus:border-[#d4a853] focus:bg-white/10 transition-all placeholder:text-white/20"
                      required
                    />
                  </div>
                  <textarea 
                    name="message"
                    rows="5"
                    placeholder="Tell me about your project..." 
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-6 py-5 text-lg focus:outline-none focus:border-[#d4a853] focus:bg-white/10 transition-all placeholder:text-white/20 resize-none"
                    required
                  ></textarea>
                  <div className="flex justify-center">
                    <Magnetic>
                      <button type="submit" className="px-12 py-5 bg-white text-black rounded-full hover:bg-[#d4a853] transition-colors duration-300 text-sm font-medium uppercase tracking-widest">
                        Send Message
                      </button>
                    </Magnetic>
                  </div>
                </form>
                
                <div className="border-t border-white/10 pt-12">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <span className="text-base text-white/40">© 2025 Matthew Millward</span>
                    <div className="flex items-center gap-10">
                      <a href="#" className="text-base text-white/40 hover:text-[#d4a853] transition-colors uppercase tracking-widest">LinkedIn</a>
                      <a href="#" className="text-base text-white/40 hover:text-[#d4a853] transition-colors uppercase tracking-widest">GitHub</a>
                      <a href="#" className="text-base text-white/40 hover:text-[#d4a853] transition-colors uppercase tracking-widest">Twitter</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <BackgroundGrid />
      </div>
    </SmoothScroll>
  )
}

export default App
