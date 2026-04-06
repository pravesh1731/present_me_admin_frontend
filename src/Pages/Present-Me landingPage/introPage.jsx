import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/image.png";
import {
  GraduationCap,
  Users,
  Shield,
  Zap,
  Globe,
  BarChart3,
  Clock,
  Download,
  Bell,
  Calendar,
  Wifi,
  Hand,
  Smartphone,
  Linkedin,
  Twitter,
  Facebook,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  Sparkles,
  Star,
  ArrowRight,
  Play,
  TrendingUp,
  Award,
  Menu,
  X,
} from "lucide-react";

const IntroPage = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    // Simulate loading or actual data fetching
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
    setIsMobileMenuOpen(false);
  };

  const features = [
    {
      icon: <Users className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Face Detection",
      description:
        "AI-powered facial recognition for secure and contactless attendance marking",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Wifi className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "WiFi/Hotspot",
      description:
        "Location-based attendance through WiFi or hotspot connectivity",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <Hand className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Manual Entry",
      description:
        "Traditional manual attendance marking with modern interface",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: <Clock className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Real-Time Tracking",
      description:
        "Monitor attendance as it happens with live updates and notifications",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: <Download className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "One-Click Download",
      description: "Export attendance reports instantly in multiple formats",
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      icon: <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Assignment Management",
      description: "Create, distribute, and track assignments seamlessly",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: <Bell className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Smart Notices",
      description:
        "Push notifications and announcements to keep everyone informed",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Analytics & Insights",
      description:
        "Comprehensive reports and visualizations for better decision making",
      gradient: "from-purple-500 to-indigo-500",
    },
    {
      icon: <Calendar className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Time Management",
      description:
        "Schedule classes, set reminders, and optimize time allocation",
      gradient: "from-pink-500 to-rose-500",
    },
  ];

  const stats = [
    { value: "10K+", label: "Active Users", icon: <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" /> },
    { value: "500+", label: "Institutions", icon: <Award className="w-3 h-3 sm:w-4 sm:h-4" /> },
    { value: "99.9%", label: "Accuracy", icon: <Star className="w-3 h-3 sm:w-4 sm:h-4" /> },
  ];

  const userTypes = [
    {
      icon: <GraduationCap className="w-10 h-10 sm:w-12 sm:h-12" />,
      title: "For Students",
      features: [
        "Mark attendance via multiple methods",
        "View attendance records instantly",
        "Submit assignments online",
        "Receive study recommendations",
        "Get instant notifications",
      ],
    },
    {
      icon: <Users className="w-10 h-10 sm:w-12 sm:h-12" />,
      title: "For Teachers",
      features: [
        "Create and manage classes",
        "Track attendance in real-time",
        "Generate reports instantly",
        "Assign and grade work",
        "Communicate with students",
      ],
    },
    {
      icon: <Shield className="w-10 h-10 sm:w-12 sm:h-12" />,
      title: "For HOD & Dean",
      features: [
        "Monitor all departments",
        "Access comprehensive analytics",
        "Approve teacher accounts",
        "Generate institutional reports",
        "Manage entire system",
      ],
    },
  ];

  const benefits = [
    {
      icon: <Zap className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Lightning Fast",
      description:
        "Mark attendance for entire class in seconds. Real-time sync across all devices.",
    },
    {
      icon: <Shield className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Secure & Reliable",
      description:
        "Bank-level encryption and 99.9% uptime guarantee for your data security.",
    },
    {
      icon: <Globe className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Access Anywhere",
      description:
        "Cloud-based platform accessible from any device, anywhere, anytime.",
    },
    {
      icon: <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Powerful Analytics",
      description:
        "Deep insights with visual reports, trends, and predictive analytics.",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-[#0A80F5] border-t-transparent rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 overflow-x-hidden">
      {/* Development Banner - Mobile Optimized */}
      <div className="fixed top-16 right-2 sm:top-20 sm:right-6 z-[101]">
        <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-red-600 via-red-500 to-red-400 text-white font-semibold text-xs sm:text-base shadow-xl rounded-lg sm:rounded-xl border border-red-300">
          <svg className="w-3 h-3 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
          </svg>
          <span className="hidden sm:inline">Website is under development.</span>
          <span className="sm:hidden">Dev Mode</span>
        </div>
      </div>

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* Simplified Background Orbs for Mobile */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-50 sm:opacity-100">
        <div className="absolute top-20 left-10 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-r from-[#0BCCEB]/20 to-[#0A80F5]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-full blur-3xl" />
      </div>

      {/* Navigation - Mobile Optimized */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20"
      >
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-2 sm:gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                <img
                  src={logo}
                  alt="Present-Me Logo"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
              <span className="text-lg sm:text-2xl font-bold">
                <span className="bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] bg-clip-text text-transparent">
                  PRESENT-ME
                </span>
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {["features", "how-it-works", "users", "contact"].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className="text-gray-700 hover:text-[#0A80F5] transition-all relative group text-sm lg:text-base"
                >
                  {section === "how-it-works" ? "How it Works" : 
                   section === "users" ? "For Users" :
                   section.charAt(0).toUpperCase() + section.slice(1)}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] group-hover:w-full transition-all duration-300"></span>
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-[#0A80F5] transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center gap-3 lg:gap-4">
              <motion.button
                onClick={() => navigate("/signin")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-700 hover:text-[#0A80F5] transition-colors font-medium text-sm lg:text-base"
              >
                Login
              </motion.button>
              <motion.button
                onClick={() => navigate("/signup")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 lg:px-6 py-2 lg:py-2.5 text-sm lg:text-base bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] text-white rounded-xl font-semibold relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-3 pt-3 border-t border-gray-200"
            >
              <div className="flex flex-col gap-3">
                {["features", "how-it-works", "users", "contact"].map((section) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className="text-left text-gray-700 hover:text-[#0A80F5] transition-colors py-2 text-sm"
                  >
                    {section === "how-it-works" ? "How it Works" : 
                     section === "users" ? "For Users" :
                     section.charAt(0).toUpperCase() + section.slice(1)}
                  </button>
                ))}
                <div className="flex flex-col gap-2 mt-2">
                  <button
                    onClick={() => navigate("/signin")}
                    className="text-left text-gray-700 hover:text-[#0A80F5] transition-colors py-2 font-medium text-sm"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate("/signup")}
                    className="px-4 py-2.5 bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] text-white rounded-xl font-semibold text-sm text-center"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Hero Section - Mobile Optimized */}
      <section className="pt-20 sm:pt-28 md:pt-32 pb-10 sm:pb-16 md:pb-20 px-4 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="inline-block mb-4 sm:mb-6"
            >
              <div className="flex items-center gap-2 px-3 sm:px-6 py-1.5 sm:py-3 bg-white/80 backdrop-blur-xl rounded-full shadow-lg border border-[#0BCCEB]/30">
                <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-[#0A80F5]" />
                <span className="text-xs sm:text-sm text-[#0A80F5] font-semibold">
                  Revolutionizing Education
                </span>
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[#0BCCEB]" />
              </div>
            </motion.div>

            <motion.h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] bg-clip-text text-transparent">
                Smart Attendance,
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#0A80F5] to-[#0BCCEB] bg-clip-text text-transparent">
                Smarter Learning
              </span>
            </motion.h1>

            <motion.p
              className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto mb-6 sm:mb-10 leading-relaxed px-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Present-Me is the complete classroom management solution with{" "}
              <span className="font-semibold text-[#0A80F5]">
                AI-powered attendance tracking
              </span>
              , real-time analytics, and seamless communication.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-6 mb-10 sm:mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base shadow-lg shadow-[#0A80F5]/30"
              >
                <span className="flex items-center gap-2 justify-center">
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                  Download App
                  <ArrowRight className="w-4 h-4" />
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/80 backdrop-blur-xl text-gray-700 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base shadow-lg border border-gray-200"
              >
                <span className="flex items-center gap-2 justify-center">
                  <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                  Watch Demo
                </span>
              </motion.button>
            </motion.div>

            {/* Stats - Mobile Optimized */}
            <div className="relative">
              <div className="flex flex-row flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 bg-white/90 backdrop-blur-2xl rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 max-w-3xl mx-auto border border-white/50">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center px-3 sm:px-4">
                    <div className="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] bg-clip-text text-transparent mb-1">
                      {stat.value}
                    </div>
                    <div className="text-gray-600 font-semibold text-xs sm:text-sm flex items-center gap-1 justify-center">
                      {stat.icon}
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works - Mobile Optimized */}
      <section id="how-it-works" className="py-12 sm:py-16 md:py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <div className="inline-block mb-3 sm:mb-4 px-4 sm:px-6 py-1.5 sm:py-2 bg-gradient-to-r from-[#0BCCEB]/20 to-[#0A80F5]/20 rounded-full">
              <span className="text-[#0A80F5] font-semibold text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                Three Ways to Mark Attendance
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto">
              Choose the method that works best for your institution
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                icon: <Users className="w-8 h-8 sm:w-12 sm:h-12" />,
                title: "Face Detection",
                description: "AI-powered facial recognition technology ensures secure and contactless attendance with 99.9% accuracy.",
                color: "from-blue-500 to-cyan-500",
                lightColor: "from-blue-50 to-cyan-50",
              },
              {
                icon: <Wifi className="w-8 h-8 sm:w-12 sm:h-12" />,
                title: "WiFi/Hotspot",
                description: "Location-based attendance using WiFi or hotspot connectivity, preventing proxy attendance.",
                color: "from-purple-500 to-pink-500",
                lightColor: "from-purple-50 to-pink-50",
              },
              {
                icon: <Hand className="w-8 h-8 sm:w-12 sm:h-12" />,
                title: "Manual Entry",
                description: "Traditional manual attendance marking with modern interface and late entry options.",
                color: "from-orange-500 to-red-500",
                lightColor: "from-orange-50 to-red-50",
              },
            ].map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative"
              >
                <div className={`relative bg-gradient-to-br ${method.lightColor} rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-md hover:shadow-lg transition-all border border-gray-100`}>
                  <div className={`relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br ${method.color} rounded-xl sm:rounded-2xl flex items-center justify-center text-white mb-4 sm:mb-5 shadow-lg`}>
                    {method.icon}
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-900">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    {method.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Mobile Optimized */}
      <section id="features" className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-b from-white/50 to-[#0BCCEB]/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <div className="inline-block mb-3 sm:mb-4 px-4 sm:px-6 py-1.5 sm:py-2 bg-gradient-to-r from-[#0BCCEB]/20 to-[#0A80F5]/20 rounded-full">
              <span className="text-[#0A80F5] font-semibold text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                Complete Solution
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage your educational institution efficiently
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="group relative"
              >
                <div className="relative bg-white backdrop-blur-xl rounded-xl p-5 sm:p-6 shadow-md hover:shadow-lg transition-all border border-gray-100">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br ${feature.gradient} rounded-lg sm:rounded-xl flex items-center justify-center text-white mb-3 sm:mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* For Users Section - Mobile Optimized */}
      <section id="users" className="py-12 sm:py-16 md:py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <div className="inline-block mb-3 sm:mb-4 px-4 sm:px-6 py-1.5 sm:py-2 bg-gradient-to-r from-[#0BCCEB]/20 to-[#0A80F5]/20 rounded-full">
              <span className="text-[#0A80F5] font-semibold text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                For Everyone
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Built for All Users
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto">
              Tailored experiences for students, teachers, and administrators
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">
            {userTypes.map((user, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative"
              >
                <div className="relative bg-gradient-to-br from-white via-white to-indigo-50/30 rounded-xl p-5 sm:p-6 shadow-md hover:shadow-lg transition-all border border-gray-100">
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#0BCCEB] to-[#0A80F5] rounded-xl sm:rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg">
                    {user.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 bg-gradient-to-r from-gray-900 to-[#0A80F5] bg-clip-text text-transparent">
                    {user.title}
                  </h3>
                  <ul className="space-y-2 mb-4 sm:mb-6">
                    {user.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#0A80F5] flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 text-xs sm:text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => navigate(index === 2 ? "/signin" : "/signup")}
                    className="w-full px-4 py-2.5 bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] text-white rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all"
                  >
                    {index === 2 ? "Login to Dashboard" : "Download App"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section - Mobile Optimized */}
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-br from-[#0BCCEB]/10 via-[#0A80F5]/10 to-[#0BCCEB]/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <div className="inline-block mb-3 sm:mb-4 px-4 sm:px-6 py-1.5 sm:py-2 bg-white/80 backdrop-blur-xl rounded-full shadow-lg">
              <span className="bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] bg-clip-text text-transparent font-semibold text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                <Award className="w-3 h-3 sm:w-4 sm:h-4 text-[#0A80F5]" />
                Premium Quality
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Why Choose Present-Me?
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto">
              The most comprehensive attendance and classroom management solution
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -3 }}
                className="group relative"
              >
                <div className="relative flex gap-3 sm:gap-4 bg-white backdrop-blur-xl rounded-xl p-4 sm:p-5 shadow-md hover:shadow-lg transition-all border border-gray-100">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#0BCCEB] to-[#0A80F5] rounded-lg sm:rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-md">
                    {benefit.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base font-semibold mb-1 bg-gradient-to-r from-gray-900 to-[#0A80F5] bg-clip-text text-transparent">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Mobile Optimized */}
      <section className="py-12 sm:py-16 md:py-20 px-4 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative">
          <div className="relative bg-gradient-to-br from-[#0BCCEB] to-[#0A80F5] rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 text-center text-white shadow-xl max-w-4xl mx-auto">
            <div className="relative z-10">
              <div className="inline-block mb-4 sm:mb-6">
                <div className="flex items-center gap-2 px-4 sm:px-6 py-2 bg-white/20 backdrop-blur-xl rounded-full border border-white/30">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-semibold text-xs sm:text-sm">Join 10,000+ Happy Users</span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
                Ready to Get Started?
              </h2>

              <p className="text-sm sm:text-base md:text-lg mb-5 sm:mb-6 md:mb-8 opacity-95 font-medium">
                Join thousands of institutions already using Present-Me
              </p>

              <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3 sm:gap-4 mb-6">
                <button 
                  onClick={() => navigate("/signup")}
                  className="group px-5 sm:px-6 py-2.5 sm:py-3 bg-white/10 backdrop-blur-xl text-white rounded-xl font-semibold text-xs sm:text-sm border border-white/20 hover:bg-white/20 transition-all"
                >
                  <span className="flex items-center gap-2 justify-center">
                    <Smartphone className="w-4 h-4" />
                    Download App
                    <Download className="w-3 h-3" />
                  </span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <span className="opacity-90 font-semibold text-sm sm:text-base">Admin Access:</span>
                <button 
                  onClick={() => navigate("/signin")}
                  className="group px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-[#0A80F5] rounded-xl font-bold text-sm sm:text-base shadow-lg"
                >
                  <span className="flex items-center gap-2 justify-center">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                    HOD/Dean Login
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Mobile Optimized */}
      <footer id="contact" className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white py-8 sm:py-10 px-4 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12 mb-6 sm:mb-8">
            {/* Brand */}
            <div className="sm:col-span-2">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                  <img src={logo} alt="Present-Me Logo" className="w-full h-full object-cover" loading="lazy" />
                </div>
                <span className="text-lg sm:text-xl font-bold">
                  <span className="bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] bg-clip-text text-transparent">
                    PRESENT
                  </span>
                  <span className="text-gray-300">-ME</span>
                </span>
              </div>
              <p className="text-gray-300 text-xs sm:text-sm mb-4 max-w-md leading-relaxed">
                Revolutionizing education management with smart attendance tracking, real-time analytics.
              </p>
              <div className="flex items-center gap-3">
                {[Linkedin, Twitter, Facebook].map((Icon, idx) => (
                  <a key={idx} href="#" className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-lg flex items-center justify-center border border-white/10 hover:bg-white/20 transition-all">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Quick Links
              </h3>
              <ul className="space-y-2">
                {["Features", "How it Works", "For Users", "Download"].map((link, idx) => (
                  <li key={idx}>
                    <button onClick={() => scrollToSection(link.toLowerCase().replace(" ", "-"))} className="text-gray-300 hover:text-white transition-colors text-xs sm:text-sm">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Contact Us
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#0BCCEB]" />
                  <span className="text-gray-300 text-xs sm:text-sm">support@presentme.in</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#0BCCEB]" />
                  <span className="text-gray-300 text-xs sm:text-sm">+91 7007458210</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#0BCCEB]" />
                  <span className="text-gray-300 text-xs sm:text-sm">Gorakhpur, UP, India</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <p className="text-gray-400 text-xs flex items-center gap-2">
                © 2025 Present-Me. All rights reserved.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs">
                <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
                <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                  Cookie Policy
                </Link>
                <Link to="/delete_account" className="text-gray-400 hover:text-white transition-colors">
                  Delete Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default IntroPage;