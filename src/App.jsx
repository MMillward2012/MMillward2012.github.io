import './styles/index.css'
import { useEffect, useRef, useState, useMemo } from 'react'
import { motion, useScroll, useTransform, useMotionValue, AnimatePresence } from 'framer-motion'
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
    // Disable Lenis on mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768
    
    if (isMobile) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
      syncTouch: true,
      lerp: 0.08,
    })

    // Adjust scroll speed based on section
    lenis.on('scroll', ({ scroll }) => {
      const workSection = document.getElementById('work')
      if (workSection) {
        const rect = workSection.getBoundingClientRect()
        const isInWorkSection = rect.top < window.innerHeight && rect.bottom > 0
        
        if (isInWorkSection) {
          lenis.options.wheelMultiplier = 0.5
          lenis.options.touchMultiplier = 1.0
        } else {
          lenis.options.wheelMultiplier = 0.8
          lenis.options.touchMultiplier = 1.5
        }
      }
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

// UPDATED: Large amplitude random movement
function FloatingParticle({ className, delay = 0 }) {
  const randomValues = useMemo(() => ({
    // Much larger movement range so it's visible
    y: Math.random() * 100 - 50, // +/- 50px
    x: Math.random() * 80 - 40,  // +/- 40px
    duration: Math.random() * 15 + 10, // Slow drift (10-25s)
  }), [])

  return (
    <motion.div
      className={className}
      animate={{ 
        y: [0, randomValues.y, 0], 
        x: [0, randomValues.x, 0],
      }}
      transition={{ 
        y: {
            duration: randomValues.duration, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: delay 
        },
        x: {
            duration: randomValues.duration * 1.2,
            repeat: Infinity, 
            ease: "easeInOut",
            delay: delay 
        }
      }}
    />
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

function AnimatedMetric({ value, label, delay = 0 }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="text-center"
    >
      <div className="text-2xl md:text-3xl font-light text-[#d4a853] mb-1">{value}</div>
      <div className="text-xs uppercase tracking-widest text-white/40">{label}</div>
    </motion.div>
  )
}

function ProjectItem({ project, index, isOpen, onClick }) {
  const isFeatured = project.featured
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
      onClick={onClick}
      className="group border-t border-white/10 cursor-pointer transition-colors hover:bg-white/5 relative z-10"
    >
      {/* Gradient border glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4a853]/50 to-transparent" />
      </div>
      
      <div className="container mx-auto px-6 md:px-12 py-12 md:py-16">
        {/* Featured badge & Award */}
        {(isFeatured || project.award) && (
          <div className="flex items-center gap-3 mb-4">
            {isFeatured && (
              <span className="text-xs uppercase tracking-widest text-[#d4a853] bg-[#d4a853]/10 px-3 py-1 rounded-full border border-[#d4a853]/20">
                Featured
              </span>
            )}
            {project.award && (
              <span className="text-xs uppercase tracking-widest text-white/60 bg-white/5 px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-[#d4a853]">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                {project.award}
              </span>
            )}
          </div>
        )}
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className={`text-3xl md:text-5xl font-light tracking-tight transition-colors duration-500 ease-out ${
              isFeatured ? 'bg-gradient-to-r from-white to-white/80 bg-clip-text' : ''
            } group-hover:text-white`}>
              {project.title}
            </h3>
            {/* Category tags */}
            <div className="flex flex-wrap gap-2 mt-3">
              {project.categories?.map((cat) => (
                <span key={cat} className="text-sm text-white/40 bg-white/5 px-3 py-1 rounded">
                  {cat}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 text-base md:text-lg text-white/40 group-hover:text-white/70 transition-colors">
            <span>{project.role}</span>
            <span className="text-white/30">{project.year}</span>
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
              <div className="pt-8 md:pt-12">
                {/* Metrics row */}
                {project.metrics && (
                  <div className="flex justify-start gap-12 md:gap-16 mb-8">
                    {project.metrics.map((metric, i) => (
                      <AnimatedMetric key={metric.label} value={metric.value} label={metric.label} delay={i * 0.1} />
                    ))}
                  </div>
                )}
                
                <div className="grid md:grid-cols-5 gap-12">
                  <div className="md:col-span-4">
                    <p className="text-lg text-white/60 leading-relaxed mb-6">
                      {project.description}
                    </p>
                    {/* Tech stack pills */}
                    <div className="flex flex-wrap gap-2">
                      {project.stack.split(', ').map((tech) => (
                        <span key={tech} className="text-sm text-[#d4a853] border border-[#d4a853]/30 bg-[#d4a853]/5 px-3 py-1.5 rounded-full hover:bg-[#d4a853]/10 transition-colors">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-1 flex flex-col justify-end items-start md:items-end">
                    {/* GitHub link */}
                    {project.github && (
                      <a 
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="group/link flex items-center gap-3 text-white/60 hover:text-[#d4a853] transition-colors"
                      >
                        <span className="text-sm uppercase tracking-widest">View on GitHub</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="group-hover/link:translate-x-1 transition-transform">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </a>
                    )}
                  </div>
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
  const [activeSection, setActiveSection] = useState('about')
  const [formStatus, setFormStatus] = useState('idle')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormStatus('submitting')
    
    const form = e.target
    const data = new FormData(form)
    
    try {
      // Ensure loading state shows for at least 1 second
      const minDelay = new Promise(resolve => setTimeout(resolve, 1000))
      
      const [response] = await Promise.all([
        fetch('https://formspree.io/f/xyyrjedq', {
          method: 'POST',
          body: data,
          headers: {
            'Accept': 'application/json'
          }
        }),
        minDelay
      ])
      
      if (response.ok) {
        setFormStatus('success')
        form.reset()
        setTimeout(() => setFormStatus('idle'), 5000)
      } else {
        setFormStatus('error')
        setTimeout(() => setFormStatus('idle'), 5000)
      }
    } catch (error) {
      setFormStatus('error')
      setTimeout(() => setFormStatus('idle'), 5000)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const workSection = document.getElementById('work')
      const contactSection = document.getElementById('contact')
      
      if (!workSection || !contactSection) return
      
      // Trigger point: 1/3 down the screen
      const scrollPosition = window.scrollY + window.innerHeight / 3
      
      if (scrollPosition >= contactSection.offsetTop) {
        setActiveSection('contact')
      } else if (scrollPosition >= workSection.offsetTop) {
        setActiveSection('work')
      } else {
        setActiveSection('about')
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // Hero + About Animation Control
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroWrapperRef,
    offset: ["start start", "end end"]
  })

  // 1. Hero text splits and fades out
  const matthewX = useTransform(heroProgress, [0, 0.15], ["0%", "-110%"])
  const millwardX = useTransform(heroProgress, [0, 0.15], ["0%", "110%"])
  const textOpacity = useTransform(heroProgress, [0, 0.12], [1, 0])
  
  // 2. PARTICLE LOGIC (Revised for Dynamic Appearance)
  
  // Entry: Gentle rise
  const particlesEntryY = useTransform(heroProgress, [0, 0.2], ["20vh", "0vh"])
  
  // --- VISIBILITY TRACKS ---
  // Track 1: Base (Fades in, stays until end)
  const opacityBase = useTransform(heroProgress, [0.02, 0.15, 0.85, 0.95], [0, 1, 1, 0])
  
  // Track 2: Early Risers (Appears at 10%, Disappears at 50%)
  const opacityEarly = useTransform(heroProgress, [0.1, 0.2, 0.5, 0.6], [0, 1, 1, 0])
  
  // Track 3: Late Bloomers (Appears at 40%, Disappears at end)
  const opacityLate = useTransform(heroProgress, [0.35, 0.45, 0.85, 0.95], [0, 1, 1, 0])
  
  // Track 4: The Toggle (Flashes on/off/on/off)
  const opacityToggle = useTransform(heroProgress, [0.05, 0.15, 0.35, 0.45, 0.65, 0.75, 0.85, 0.95], [0, 1, 1, 0, 0, 1, 1, 0])

  // Parallax Layers (Kept subtle to keep composition intact)
  const layerBack = useTransform(heroProgress, [0, 1], ["0%", "-5%"]) 
  const layerMid = useTransform(heroProgress, [0, 1], ["0%", "-10%"])
  const layerFront = useTransform(heroProgress, [0, 1], ["0%", "-15%"])
  
  // 3. Sequential Reveals
  const intro1Opacity = useTransform(heroProgress, [0.15, 0.20, 0.30, 0.35], [0, 1, 1, 0])
  const intro1Y = useTransform(heroProgress, [0.15, 0.20], [30, 0])
  
  const intro2Opacity = useTransform(heroProgress, [0.35, 0.40, 0.50, 0.55], [0, 1, 1, 0])
  const intro2Y = useTransform(heroProgress, [0.35, 0.40], [30, 0])
  
  const intro3Opacity = useTransform(heroProgress, [0.55, 0.60, 0.70, 0.75], [0, 1, 1, 0])
  const intro3Y = useTransform(heroProgress, [0.55, 0.60], [30, 0])
  
  const intro4Opacity = useTransform(heroProgress, [0.75, 0.85], [0, 1])
  const intro4Y = useTransform(heroProgress, [0.75, 0.85], [30, 0])

  const projects = [
    {
      title: "Real-Time Financial NLP",
      role: "Google DeepMind",
      year: "2025",
      description: "Built a production-ready NLP pipeline for real-time financial sentiment analysis during my internship at DeepMind. Optimised several different transformer architectures for low-latency inference, integrating explainability frameworks to prioritise misclassified and uncertain predictions. Designed automated benchmarking across CPU/GPU/TensorRT configurations, along with explainability enhanced performance fine tuning.",
      stack: "PyTorch, TensorRT, CUDA, FP16",
      metrics: [{ value: "1.5ms", label: "Latency" }, { value: "89%", label: "F1 Score" }, { value: "2,040+", label: "Samples/sec" }],
      categories: ["Deep Learning", "NLP", "Finance"],
      github: "https://github.com/MMillward2012/DeepMind-FinNLP",
      featured: true,
      award: "Best Research @ TAROS 2025"
    },
    {
      title: "Options Analytics Platform",
      role: "Quantitative Research",
      year: "2025",
      description: "I built a high-performance derivatives pricing and backtesting engine using JIT-compiled Monte Carlo simulation, with delta-hedging path simulations, put–call parity violation detection, and multi-year SPY options backtests using discrete rebalancing. The system applies theoretical pricing and hedging frameworks to real market data, modelling execution frictions, liquidity constraints, and realistic fill logic. Across five years of SPY options, it showed that put–call parity violations were rare, around 0.5–2% of contracts, and that only about 60% of these opportunities were actually executable once spreads and market depth were considered.",
      stack: "Python, NumPy, Numba, JIT",
      metrics: [{ value: "200M+", label: "Sims/sec" }, { value: "99.99%", label: "Accuracy" }, { value: "1.2 - 2.0", label: "Realised Sharpe" }],
      categories: ["Quantitative Finance", "HPC", "Derivatives Pricing"],
      github: "https://github.com/MMillward2012/options-pricing-monte-carlo"
    },
    {
      title: "Flight Price Prediction",
      role: "Temporal Deep Learning",
      year: "2025",
      description: "End-to-end flight price forecasting system using a temporal fusion transformer boosted with an XGBoost residual model incorporating additional volatility features. The ensemble constrains variance to 0.92 of the TFT’s output to reduce mean reversion and includes rolling Z-scores, price spreads, and realised variance estimates. Trained on ~12k US and India flights from 2019 and 2022, the system improved MAE on extreme prices and produced more stable forecasts in high-volatility periods, with backtests showing average savings of around $70 per booking compared with purchasing on the day the prediction is run.. A Streamlit dashboard visualises pricing and risk, confidence-interval forecasts, and allows retrospective analysis of historical flights, including regret and model performance.",
      stack: "PyTorch, Temporal Fusion, XGBoost",
      metrics: [{ value: "$70", label: "Average Savings" }, { value: "61%", label: "Accuracy" }, { value: "±2 days", label: "Error" }],
      categories: ["Deep Learning", "Time Series", "Forecasting"],
      github: "https://github.com/MMillward2012"
    },
    {
      title: "Shark Attack Risk Model",
      role: "DurHack × G-Research",
      year: "2025",
      description: "Participated in G-Research's 'Predict the Future' challenge at DurHack. Engineered 6 features including coastal population, shark density, and ocean temperature data. Built an interactive React globe with spatiotemporal probability surfaces and temporal slider for visualising risk across future months.",
      stack: "XGBoost, React, Three.js",
      metrics: [{ value: "96%", label: "Validation Accuracy" }, { value: "24hr", label: "Hackathon" }, { value: "1,200", label: "Incidents" }],
      categories: ["Deep Learning", "Visualisation", "Hackathon"],
      github: "https://github.com/MMillward2012/Durhack-2025"
    }
  ]

  return (
    <SmoothScroll>
      <div className="bg-[#0a0a0a] min-h-screen text-[#e1e1e1] selection:bg-[#d4a853] selection:text-black">
        <div className="bg-noise" />
        
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-8 flex justify-between items-start mix-blend-difference">
          <a href="#" className="flex flex-col hover:opacity-70 transition-opacity">
            <span className="text-base font-medium tracking-widest uppercase opacity-60">Matthew Millward</span>
            <span className="text-base tracking-widest uppercase opacity-40 mt-1 hidden md:block">Folio '25</span>
          </a>
          <div className="flex gap-4 md:gap-10 items-center">
            <a 
              href="#about" 
              className={cn(
                "text-xs md:text-base font-medium tracking-widest uppercase transition-colors duration-300",
                activeSection === 'about' ? "text-white opacity-100" : "text-white/60 hover:text-white hover:opacity-100"
              )}
            >
              About
            </a>
            <a 
              href="#work" 
              className={cn(
                "text-xs md:text-base font-medium tracking-widest uppercase transition-colors duration-300",
                activeSection === 'work' ? "text-white opacity-100" : "text-white/60 hover:text-white hover:opacity-100"
              )}
            >
              Work
            </a>
            <a 
              href="#contact" 
              className={cn(
                "text-xs md:text-base font-medium tracking-widest uppercase transition-colors duration-300",
                activeSection === 'contact' ? "text-white opacity-100" : "text-white/60 hover:text-white hover:opacity-100"
              )}
            >
              Contact
            </a>
            <a href="/Matthew_Millward_Resume.pdf" download className="flex items-center gap-2 text-xs md:text-base font-medium tracking-widest uppercase text-[#d4a853] hover:opacity-60 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="hidden md:inline">Resume</span>
            </a>
          </div>
        </nav>

        <main ref={containerRef}>
          
          {/* About anchor point - positioned to show Durham intro */}
          <div id="about" className="absolute top-[50vh]" />
          
          {/* Hero + About Wrapper */}
          <div ref={heroWrapperRef} className="relative h-[350vh] z-10">
            <div className="sticky top-0 h-screen overflow-hidden bg-[#0a0a0a]">
              
              {/* PARTICLE SYSTEM */}
              <motion.div 
                style={{ y: particlesEntryY }} 
                className="absolute inset-0 z-[15] pointer-events-none overflow-visible will-change-transform"
              >
                <div className="absolute inset-0">
                  
                  {/* GROUP 1: BASE LAYER (Always visible after entry) */}
                  <motion.div style={{ opacity: opacityBase, y: layerBack }} className="absolute inset-0">
                      <FloatingParticle delay={0} className="absolute top-[20%] left-[20%] w-2 h-2 bg-[#d4a853]/60 rounded-full" />
                      <FloatingParticle delay={1} className="absolute top-[40%] left-[50%] w-1 h-1 bg-[#d4a853]/50 rounded-full" />
                      <FloatingParticle delay={2} className="absolute top-[80%] right-[35%] w-[3px] h-[3px] bg-white/30 rounded-full" />
                      
                      {/* Ring */}
                      <div className="absolute top-[50%] right-[10%] opacity-40">
                        <motion.div 
                          className="w-24 h-24 border border-white/50 rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                        />
                      </div>
                  </motion.div>

                  {/* GROUP 2: TOGGLE LAYER (Flashes On/Off multiple times) */}
                  <motion.div style={{ opacity: opacityToggle, y: layerMid }} className="absolute inset-0">
                      <FloatingParticle delay={0.5} className="absolute top-[30%] right-[30%] w-1.5 h-1.5 bg-white/70 rounded-full" />
                      <FloatingParticle delay={1.5} className="absolute top-[15%] left-[40%] w-[3px] h-[3px] bg-white/80 rounded-full" />
                      <FloatingParticle delay={0.2} className="absolute top-[60%] left-[10%] w-1 h-1 bg-[#d4a853]/60 rounded-full" />
                      <FloatingParticle delay={2.5} className="absolute top-[90%] right-[20%] w-1.5 h-1.5 bg-white/50 rounded-full" />
                      <FloatingParticle delay={1} className="absolute top-[10%] right-[5%] w-1 h-1 bg-[#d4a853]/50 rounded-full" />
                  </motion.div>

                  {/* GROUP 3: EARLY RISERS (Visible early, then gone) */}
                  <motion.div style={{ opacity: opacityEarly, y: layerFront }} className="absolute inset-0">
                      <FloatingParticle delay={0} className="absolute top-[25%] left-[10%] w-1 h-1 bg-white/70 rounded-full" />
                      <FloatingParticle delay={2} className="absolute top-[65%] right-[10%] w-1 h-1 bg-[#d4a853]/70 rounded-full" />
                      <FloatingParticle delay={1} className="absolute top-[45%] left-[5%] w-1.5 h-1.5 bg-white/40 rounded-full" />
                      
                      {/* Ring */}
                      <div className="absolute top-[30%] left-[15%] opacity-50">
                        <motion.div 
                          className="w-16 h-16 border border-[#d4a853]/60 rounded-full"
                          animate={{ rotate: -360 }}
                          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        />
                      </div>
                  </motion.div>
                  
                  {/* GROUP 4: LATE BLOOMERS (Appears later in the scroll) */}
                  <motion.div style={{ opacity: opacityLate, y: layerMid }} className="absolute inset-0">
                      <FloatingParticle delay={3} className="absolute top-[75%] left-[30%] w-2 h-2 bg-[#d4a853]/60 rounded-full" />
                      <FloatingParticle delay={4} className="absolute top-[85%] left-[45%] w-1.5 h-1.5 bg-white/60 rounded-full" />
                      <FloatingParticle delay={0.5} className="absolute top-[55%] right-[5%] w-1 h-1 bg-white/70 rounded-full" />
                      <FloatingParticle delay={1} className="absolute top-[35%] left-[15%] w-1 h-1 bg-[#d4a853]/40 rounded-full" />
                  </motion.div>
                  
                </div>
              </motion.div>
              
              {/* Text Reveals */}
              <div className="absolute inset-0 z-20 flex items-center justify-center px-6 md:px-12 lg:px-24 pointer-events-none">
                
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
                        <span className="text-4xl md:text-5xl text-white font-light">First Class</span>
                        <span className="text-lg md:text-xl text-[#d4a853]">85% Average</span>
                      </div>
                      <div className="flex flex-col items-center gap-3">
                        <span className="text-4xl md:text-5xl text-white font-light">Google DeepMind</span>
                        <span className="text-lg md:text-xl text-[#d4a853]">Research Intern '25</span>
                      </div>
                      <div className="flex flex-col items-center gap-3">
                        <span className="text-4xl md:text-5xl text-white font-light">TAROS '25</span>
                        <span className="text-lg md:text-xl text-[#d4a853]">Best Research Award</span>
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
                      Currently looking for Quantitative Research and Trading internships
                    </p>
                  </div>
                </motion.div>

                {/* Reveal 4: Selected Works Header */}
                <motion.div 
                  style={{ opacity: intro4Opacity, y: intro4Y }} 
                  className="absolute inset-0 flex flex-col items-center justify-center"
                >
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <span className="h-[1px] w-12 bg-[#d4a853]"></span>
                    <span className="text-sm font-medium uppercase tracking-widest text-[#d4a853]">Portfolio</span>
                    <span className="h-[1px] w-12 bg-[#d4a853]"></span>
                  </div>
                  <h2 className="text-5xl md:text-7xl font-light tracking-tight text-white/90">
                    Selected Works
                  </h2>
                </motion.div>
              </div>

              {/* Hero Title (Top Layer) */}
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
                      className="text-[clamp(3.2rem,10.5vw,13rem)] leading-[0.85] font-medium tracking-tighter text-[#e1e1e1]"
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
                      className="text-[clamp(3.2rem,10.5vw,13rem)] leading-[0.85] font-medium tracking-tighter text-[#666]"
                    >
                      MILLWARD
                    </motion.h1>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Work Section - Projects List Only */}
          <section id="work" className="relative z-10 bg-[#0a0a0a] pb-32 -mt-[35vh]">
            <div className="absolute inset-0 opacity-50 pointer-events-none">
               <BackgroundGrid />
            </div>
            
            <div className="w-full relative z-10">
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
          <section id="contact" className="pb-32 px-6 md:px-12 bg-[#0a0a0a] relative z-20 overflow-hidden">
            <div className="w-[85%] max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <div className="flex items-center justify-center gap-4 mb-8">
                  <span className="h-[1px] w-12 bg-[#d4a853]"></span>
                  <span className="text-sm font-medium uppercase tracking-widest text-[#d4a853]">Contact</span>
                  <span className="h-[1px] w-12 bg-[#d4a853]"></span>
                </div>
                <h2 className="text-[clamp(3rem,8vw,8rem)] leading-[0.9] font-medium tracking-tighter mb-4">
                  GET IN <br />
                  <span className="text-[#666] block mt-2">TOUCH</span>
                </h2>
              </div>
              
              <div className="w-full">
                <form 
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <input 
                      type="text" 
                      name="name"
                      placeholder="Your name" 
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-8 py-6 text-xl focus:outline-none focus:border-[#d4a853]/50 focus:bg-white/[0.06] transition-all duration-300 placeholder:text-white/40"
                      required
                    />
                    <input 
                      type="email" 
                      name="email"
                      placeholder="Your email" 
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-8 py-6 text-xl focus:outline-none focus:border-[#d4a853]/50 focus:bg-white/[0.06] transition-all duration-300 placeholder:text-white/40"
                      required
                    />
                  </div>
                  <div className="relative">
                    <textarea 
                      name="message"
                      rows="10"
                      placeholder="Your message..." 
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-8 py-6 text-xl focus:outline-none focus:border-[#d4a853]/50 focus:bg-white/[0.06] transition-all duration-300 placeholder:text-white/40 resize-none"
                      required
                    ></textarea>
                    <div className="absolute bottom-6 right-6">
                      <button 
                        type="submit" 
                        disabled={formStatus === 'submitting' || formStatus === 'success'}
                        className={cn(
                          "px-6 py-2.5 rounded-md transition-all duration-300 text-xs font-medium uppercase tracking-[0.15em]",
                          formStatus === 'success' 
                            ? "bg-[#d4a853] text-black border border-[#d4a853]" 
                            : formStatus === 'error'
                            ? "bg-red-500/10 text-red-400 border border-red-500/50"
                            : "bg-transparent border border-[#d4a853] text-[#d4a853] hover:bg-[#d4a853]/10"
                        )}
                      >
                        {formStatus === 'submitting' ? 'Sending...' : 
                         formStatus === 'success' ? 'Sent!' : 
                         formStatus === 'error' ? 'Error' : 'Send'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </main>
        
        {/* Footer */}
        <footer className="relative z-20 bg-[#0a0a0a] border-t border-white/[0.08] py-8 px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            <span className="text-lg text-white/60 tracking-wide">© 2025 Matthew Millward</span>
            <div className="flex items-center gap-8">
              <a href="https://www.linkedin.com/in/matthew-millward2012" className="text-lg text-white/60 hover:text-[#d4a853] transition-colors uppercase tracking-wider">LinkedIn</a>
              <a href="https://github.com/MMillward2012" className="text-lg text-white/60 hover:text-[#d4a853] transition-colors uppercase tracking-wider">GitHub</a>
            </div>
          </div>
        </footer>
      </div>
    </SmoothScroll>
  )
}

export default App