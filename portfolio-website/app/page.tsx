"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  Menu, 
  X, 
  ChevronDown,
  Code,
  Database,
  Globe,
  Smartphone,
  Server,
  Users,
  ArrowRight,
  Star,
  GitFork,
  Download,
  MapPin,
  Calendar,
  Coffee
} from "lucide-react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse movement for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // GitHub projects data
  const projects = [
    {
      title: "Sentiment Analysis App",
      description: "A comprehensive sentiment analysis application with machine learning capabilities for analyzing text emotions and sentiments using natural language processing.",
      tech: ["Python", "Machine Learning", "NLP", "Flask", "Scikit-learn"],
      github: "https://github.com/ayush1298/Sentiment-Analysis-App",
      demo: "#",
      stars: 12,
      forks: 4,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Django Projects Collection", 
      description: "A comprehensive collection of Django web applications showcasing various features, best practices, and real-world implementations in Django development.",
      tech: ["Django", "Python", "PostgreSQL", "HTML/CSS", "Bootstrap"],
      github: "https://github.com/ayush1298/Django-Projects",
      demo: "#",
      stars: 8,
      forks: 3,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Neural Network Implementation",
      description: "Custom neural network implementations from scratch, demonstrating deep understanding of machine learning algorithms and mathematical foundations.",
      tech: ["Python", "NumPy", "Machine Learning", "Deep Learning", "TensorFlow"],
      github: "https://github.com/ayush1298/Neural-Networks",
      demo: "#",
      stars: 15,
      forks: 6,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Portfolio Website",
      description: "Modern, responsive portfolio website built with Next.js, featuring beautiful animations, dark mode support, and optimized performance.",
      tech: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
      github: "https://github.com/ayush1298/portfolio-website",
      demo: "#",
      stars: 5,
      forks: 2,
      color: "from-orange-500 to-red-500"
    }
  ];

  const skills = [
    { 
      category: "Frontend", 
      icon: Globe, 
      items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML5", "CSS3"],
      color: "from-blue-500 to-cyan-500"
    },
    { 
      category: "Backend", 
      icon: Server, 
      items: ["Python", "Django", "Flask", "Node.js", "PostgreSQL", "MongoDB"],
      color: "from-green-500 to-emerald-500"
    },
    { 
      category: "Mobile", 
      icon: Smartphone, 
      items: ["React Native", "Flutter", "iOS", "Android", "Progressive Web Apps"],
      color: "from-purple-500 to-pink-500"
    },
    { 
      category: "Data & ML", 
      icon: Database, 
      items: ["Machine Learning", "TensorFlow", "PyTorch", "NumPy", "Pandas", "Scikit-learn"],
      color: "from-orange-500 to-red-500"
    },
    { 
      category: "Tools", 
      icon: Code, 
      items: ["Git", "Docker", "AWS", "Vercel", "VS Code", "Linux"],
      color: "from-indigo-500 to-purple-500"
    },
    { 
      category: "Soft Skills", 
      icon: Users, 
      items: ["Problem Solving", "Team Leadership", "Communication", "Project Management"],
      color: "from-pink-500 to-rose-500"
    }
  ];

  // Improved scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "skills", "projects", "contact"];
      const scrollPosition = window.scrollY + 150;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Improved smooth scroll function
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
    setIsMenuOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: mousePosition.x / 50,
            y: mousePosition.y / 50,
          }}
          transition={{ type: "spring", damping: 30, stiffness: 100 }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: -mousePosition.x / 30,
            y: -mousePosition.y / 30,
          }}
          transition={{ type: "spring", damping: 30, stiffness: 100 }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl"
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg z-50 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold"
            >
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Ayush
              </span>
              <span className="text-slate-800 dark:text-slate-200 ml-1">
                Munot
              </span>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              {["Home", "About", "Skills", "Projects", "Contact"].map((item) => (
                <motion.button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className={`relative transition-colors duration-200 px-3 py-2 rounded-lg ${
                    activeSection === item.toLowerCase()
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                  }`}
                  whileHover={{ y: -1 }}
                  whileTap={{ y: 0 }}
                >
                  {item}
                  {activeSection === item.toLowerCase() && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute -bottom-1 left-3 right-3 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                      initial={false}
                      transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden mt-4 space-y-2 pb-4"
              >
                {["Home", "About", "Skills", "Projects", "Contact"].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className={`block w-full text-left py-3 px-4 rounded-lg transition-colors ${
                      activeSection === item.toLowerCase()
                        ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                        : "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-16 min-h-screen flex items-center relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 text-center lg:text-left"
            >
              {/* Status Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-6"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium border border-green-200 dark:border-green-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Available for new opportunities
                </div>
              </motion.div>
              
              {/* Main Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-5xl lg:text-7xl font-bold mb-6 leading-tight"
              >
                Hi, I&apos;m{" "}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  Ayush
                </span>
              </motion.h1>
              
              {/* Subtitle */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-2xl lg:text-3xl text-slate-600 dark:text-slate-300 mb-6 font-medium"
              >
                Full-Stack Developer &{" "}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  ML Engineer
                </span>
              </motion.h2>
              
              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="text-lg text-slate-500 dark:text-slate-400 mb-8 max-w-2xl leading-relaxed"
              >
                I build exceptional digital experiences that combine cutting-edge technology 
                with intuitive design. Specializing in modern web development and machine learning solutions.
              </motion.p>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex flex-wrap gap-6 mb-8 text-sm text-slate-600 dark:text-slate-400"
              >
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-blue-600" />
                  <span>Based in India</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-purple-600" />
                  <span>3+ Years Experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <Coffee size={16} className="text-orange-600" />
                  <span>Coffee Enthusiast</span>
                </div>
              </motion.div>
              
              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
              >
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection("projects")}
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  View My Work
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-8 py-4 rounded-2xl font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Download CV
                </motion.button>
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="flex gap-4 justify-center lg:justify-start"
              >
                {[
                  { icon: Github, href: "https://github.com/ayush1298", label: "GitHub", color: "hover:text-gray-900 dark:hover:text-white" },
                  { icon: Linkedin, href: "https://www.linkedin.com/in/ayush-munot-5b4963223/", label: "LinkedIn", color: "hover:text-blue-600" },
                  { icon: Mail, href: "mailto:munotayush6@gmail.com", label: "Email", color: "hover:text-red-500" }
                ].map((social, index) => (
                  <motion.a
                    key={social.label}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    href={social.href}
                    target={social.href.startsWith('http') ? '_blank' : undefined}
                    rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={`p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl text-slate-600 dark:text-slate-400 ${social.color} transition-all duration-300 border border-slate-200 dark:border-slate-700`}
                    aria-label={social.label}
                  >
                    <social.icon size={24} />
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>

            {/* Profile Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:w-1/2"
            >
              <div className="relative">
                <div className="relative w-96 h-96 mx-auto">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-2 border-dashed border-blue-300 dark:border-blue-700"
                  />
                  
                  <div className="absolute inset-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 p-1">
                    <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 flex items-center justify-center relative overflow-hidden">
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
                        <div className="text-6xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          AM
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Icons */}
                  {[
                    { icon: Code, position: "top-4 right-8", delay: 0, color: "text-blue-600" },
                    { icon: Database, position: "bottom-8 left-4", delay: 0.5, color: "text-purple-600" },
                    { icon: Globe, position: "top-8 left-4", delay: 1, color: "text-green-600" },
                    { icon: Server, position: "bottom-4 right-8", delay: 1.5, color: "text-orange-600" }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: 1, 
                        scale: 1,
                        y: [-5, 5, -5]
                      }}
                      transition={{ 
                        opacity: { delay: item.delay, duration: 0.5 },
                        scale: { delay: item.delay, duration: 0.5 },
                        y: { delay: item.delay + 1, duration: 2, repeat: Infinity, ease: "easeInOut" }
                      }}
                      className={`absolute ${item.position} p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700`}
                    >
                      <item.icon className={`${item.color}`} size={20} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="text-center mt-16"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="cursor-pointer"
              onClick={() => scrollToSection("about")}
            >
              <ChevronDown size={32} className="mx-auto text-slate-400 hover:text-blue-600 transition-colors" />
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Scroll to explore</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              About Me
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto"></div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl lg:text-3xl font-semibold mb-6 text-slate-800 dark:text-slate-200">
                Passionate Developer & Problem Solver
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                I&apos;m a dedicated software engineer with a strong foundation in both frontend and backend development. 
                My journey in technology started with a curiosity about how things work, which led me to explore 
                various programming languages and frameworks.
              </p>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                I specialize in creating efficient, scalable solutions using modern technologies like React, Next.js, 
                Python, and Django. My experience spans from building machine learning models to developing 
                full-stack web applications that solve real-world problems.
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                When I&apos;m not coding, I enjoy staying up-to-date with the latest tech trends, contributing to 
                open-source projects, and sharing knowledge with the developer community.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              {[
                { label: "Experience", value: "3+ Years", icon: "💼", color: "from-blue-500 to-cyan-500" },
                { label: "Projects", value: "20+ Completed", icon: "🚀", color: "from-purple-500 to-pink-500" },
                { label: "Technologies", value: "15+ Mastered", icon: "⚡", color: "from-green-500 to-emerald-500" },
                { label: "Coffee Cups", value: "1000+ ☕", icon: "☕", color: "from-orange-500 to-red-500" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`bg-gradient-to-br ${stat.color} p-6 rounded-xl text-white relative overflow-hidden`}
                >
                  <div className="relative z-10">
                    <div className="text-2xl mb-2">{stat.icon}</div>
                    <h4 className="font-semibold text-lg mb-2">{stat.label}</h4>
                    <p className="text-white/90 font-bold">{stat.value}</p>
                  </div>
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Skills & Expertise
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Here are the technologies and tools I work with to bring ideas to life.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((skillCategory, index) => {
              const IconComponent = skillCategory.icon;
              return (
                <motion.div
                  key={skillCategory.category}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600"
                >
                  <div className="flex items-center mb-4">
                    <div className={`p-3 bg-gradient-to-br ${skillCategory.color} rounded-lg mr-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="text-white" size={24} />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                      {skillCategory.category}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skillCategory.items.map((skill, skillIndex) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: (index * 0.1) + (skillIndex * 0.05) }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-sm font-medium hover:scale-105 transition-transform cursor-default"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Featured Projects
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Here are some of my recent projects that showcase my skills and passion for development.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-700 dark:to-slate-600 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-600"
              >
                <div className={`h-48 bg-gradient-to-br ${project.color} flex items-center justify-center relative overflow-hidden`}>
                  <div className="text-white text-6xl font-bold opacity-20">
                    {project.title.split(' ').map(word => word[0]).join('')}
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 text-white text-xs">
                      <Star size={12} />
                      {project.stars}
                    </div>
                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 text-white text-xs">
                      <GitFork size={12} />
                      {project.forks}
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-4">
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-slate-900 dark:bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors"
                    >
                      <Github size={16} />
                      Code
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={project.demo}
                      className="flex items-center gap-2 border-2 border-blue-600 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-colors"
                    >
                      <ExternalLink size={16} />
                      Demo
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://github.com/ayush1298"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Github size={20} />
              View All Projects on GitHub
              <ArrowRight size={20} />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Get In Touch
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              I&apos;m always open to discussing new opportunities, interesting projects, or just having a chat about technology.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-semibold mb-6 text-slate-800 dark:text-slate-200">
                  Let&apos;s Connect
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                  Whether you have a project in mind, want to collaborate, or just want to say hello, 
                  I&apos;d love to hear from you. Feel free to reach out through any of the channels below.
                </p>

                <div className="space-y-6">
                  {[
                    { 
                      icon: Mail, 
                      label: "Email", 
                      value: "ayushmunot@example.com", 
                      href: "mailto:ayushmunot@example.com",
                      color: "from-blue-500 to-purple-600"
                    },
                    { 
                      icon: Github, 
                      label: "GitHub", 
                      value: "github.com/ayush1298", 
                      href: "https://github.com/ayush1298",
                      color: "from-slate-700 to-slate-900"
                    },
                    { 
                      icon: Linkedin, 
                      label: "LinkedIn", 
                      value: "linkedin.com/in/ayush-munot-5b4963223/", 
                      href: "https://www.linkedin.com/in/ayush-munot-5b4963223/",
                      color: "from-blue-600 to-blue-800"
                    }
                  ].map((contact, index) => {
                    const IconComponent = contact.icon;
                    return (
                      <motion.a
                        key={contact.label}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        href={contact.href}
                        target={contact.href.startsWith('http') ? '_blank' : undefined}
                        rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700"
                      >
                        <div className={`p-3 bg-gradient-to-br ${contact.color} rounded-lg`}>
                          <IconComponent className="text-white" size={24} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-800 dark:text-slate-200">{contact.label}</h4>
                          <p className="text-slate-600 dark:text-slate-400">{contact.value}</p>
                        </div>
                      </motion.a>
                    );
                  })}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 border border-slate-200 dark:border-slate-700"
              >
                <h3 className="text-2xl font-semibold mb-6 text-slate-800 dark:text-slate-200">
                  Send a Message
                </h3>
                <form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                      placeholder="Your message..."
                    ></textarea>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Send Message
                  </motion.button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Ayush Munot
            </div>
            <p className="text-slate-400 mb-6">
              Building the future, one line of code at a time.
            </p>
            <div className="flex justify-center gap-6 mb-8">
              {[
                { icon: Github, href: "https://github.com/ayush1298" },
                { icon: Linkedin, href: "https://www.linkedin.com/in/ayush-munot-5b4963223/" },
                { icon: Mail, href: "mailto:ayushmunot@example.com" }
              ].map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <motion.a
                    key={index}
                    whileHover={{ scale: 1.1, y: -2 }}
                    href={social.href}
                    target={social.href.startsWith('http') ? '_blank' : undefined}
                    rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    <IconComponent size={24} />
                  </motion.a>
                );
              })}
            </div>
            <div className="border-t border-slate-800 pt-6">
              <p className="text-slate-500 text-sm">
                © 2024 Ayush Munot. All rights reserved. Built with Next.js and Tailwind CSS.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
