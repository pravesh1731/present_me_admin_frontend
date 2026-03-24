import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";
import axios from "axios";

const IntroPage = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

const checkLoginedUser = async () => {
    try {
      const response = await axios.post(
        BaseUrl + "/admin/login",
        {
          emailId,
          password,
        },
        { withCredentials: true }
      );
     dispatch(addUser(response.data));
     
      // Expecting response.data.status to be 'verified' or 'pending'
      if (response.data.institution.status === "verified") {
        navigate("/admin");
      } else if (response.data.institution.status === "pending") {
        navigate("/pending_verification");
      } else {
        setError("Invalid credentials. Please try again.");
      }
      
    } catch (err) {
      console.log("Error during sign in:", err);
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsVisible(true);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const floatVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Face Detection",
      description:
        "AI-powered facial recognition for secure and contactless attendance marking",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Wifi className="w-8 h-8" />,
      title: "WiFi/Hotspot",
      description:
        "Location-based attendance through WiFi or hotspot connectivity",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <Hand className="w-8 h-8" />,
      title: "Manual Entry",
      description:
        "Traditional manual attendance marking with modern interface",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Real-Time Tracking",
      description:
        "Monitor attendance as it happens with live updates and notifications",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: "One-Click Download",
      description: "Export attendance reports instantly in multiple formats",
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Assignment Management",
      description: "Create, distribute, and track assignments seamlessly",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Smart Notices",
      description:
        "Push notifications and announcements to keep everyone informed",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Analytics & Insights",
      description:
        "Comprehensive reports and visualizations for better decision making",
      gradient: "from-purple-500 to-indigo-500",
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Time Management",
      description:
        "Schedule classes, set reminders, and optimize time allocation",
      gradient: "from-pink-500 to-rose-500",
    },
  ];

  const stats = [
    { value: "10K+", label: "Active Users" },
    { value: "500+", label: "Institutions" },
    { value: "99.9%", label: "Accuracy" },
  ];

  const userTypes = [
    {
      icon: <GraduationCap className="w-12 h-12" />,
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
      icon: <Users className="w-12 h-12" />,
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
      icon: <Shield className="w-12 h-12" />,
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
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description:
        "Mark attendance for entire class in seconds. Real-time sync across all devices.",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Reliable",
      description:
        "Bank-level encryption and 99.9% uptime guarantee for your data security.",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Access Anywhere",
      description:
        "Cloud-based platform accessible from any device, anywhere, anytime.",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Powerful Analytics",
      description:
        "Deep insights with visual reports, trends, and predictive analytics.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 overflow-hidden">
      {/* Development Banner - floating top right */}
      <div className="fixed top-20 right-6 z-[101]">
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 via-red-500 to-red-400 text-white font-semibold text-base shadow-xl rounded-xl border border-red-300 animate-pulse"
          style={{ pointerEvents: "none", maxWidth: "320px" }}>
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
          </svg>
          <span>Website is under development.<br /><span className="text-xs font-normal opacity-80">Some features may not be available.</span></span>
        </div>
      </div>
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-[#0BCCEB]/20 to-[#0A80F5]/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-[#0BCCEB]/20 to-[#0A80F5]/20 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -100, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Cursor Follower */}
      <motion.div
        className="fixed w-6 h-6 border-2 border-[#0A80F5]/50 rounded-full pointer-events-none z-50 hidden lg:block"
        animate={{
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 200,
        }}
      />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl shadow-sm border-b border-white/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg p-0.5 overflow-hidden relative"
                animate={{
                  boxShadow: [
                    "0 10px 15px -3px rgba(11, 204, 235, 0.3)",
                    "0 10px 15px -3px rgba(10, 128, 245, 0.3)",
                    "0 10px 15px -3px rgba(11, 204, 235, 0.3)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <motion.img
                  src={logo}
                  alt="Present-Me Logo"
                  className="w-full h-full object-cover scale-110"
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-[#0BCCEB]/20 to-[#0A80F5]/20"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
              <span className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] bg-clip-text text-transparent">
                  PRESENT-ME
                </span>
                {/* <span className="text-gray-400">-ME</span> */}
              </span>
            </motion.div>
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection("features")}
                className="text-gray-700 hover:text-[#0A80F5] transition-all relative group cursor-pointer"
              >
                Features
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] group-hover:w-full transition-all duration-300"></span>
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-gray-700 hover:text-[#0A80F5] transition-all relative group cursor-pointer"
              >
                How it Works
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] group-hover:w-full transition-all duration-300"></span>
              </button>
              <button
                onClick={() => scrollToSection("users")}
                className="text-gray-700 hover:text-[#0A80F5] transition-all relative group cursor-pointer"
              >
                For Users
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] group-hover:w-full transition-all duration-300"></span>
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-gray-700 hover:text-[#0A80F5] transition-all relative group cursor-pointer"
              >
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] group-hover:w-full transition-all duration-300"></span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-[#0A80F5] transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            <div className="hidden md:flex items-center gap-4">
              <motion.button
                onClick={() => navigate("/signin")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-700 hover:text-[#0A80F5] transition-colors font-medium"
              >
                Login
              </motion.button>
              <motion.button
                onClick={() => navigate("/signup")}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 25px -5px rgba(10, 128, 245, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                className="px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] text-white rounded-xl font-semibold relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#0A80F5] to-[#0BCCEB]"
                  initial={{ x: "100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pb-4 border-t border-gray-200"
            >
              <div className="flex flex-col gap-4 mt-4">
                <button
                  onClick={() => {
                    scrollToSection("features");
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left text-gray-700 hover:text-[#0A80F5] transition-colors py-2"
                >
                  Features
                </button>
                <button
                  onClick={() => {
                    scrollToSection("how-it-works");
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left text-gray-700 hover:text-[#0A80F5] transition-colors py-2"
                >
                  How it Works
                </button>
                <button
                  onClick={() => {
                    scrollToSection("users");
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left text-gray-700 hover:text-[#0A80F5] transition-colors py-2"
                >
                  For Users
                </button>
                <button
                  onClick={() => {
                    scrollToSection("contact");
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left text-gray-700 hover:text-[#0A80F5] transition-colors py-2"
                >
                  Contact
                </button>
                <div className="flex flex-col gap-2 mt-2">
                  <button className="text-left text-gray-700 hover:text-[#0A80F5] transition-colors py-2 font-medium">
                    Login
                  </button>
                  <button
                    onClick={() => navigate("/signup")}
                    className="px-6 py-3 bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] text-white rounded-xl font-semibold text-center"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 relative">
        {/* Floating Elements */}
        <motion.div
          className="hidden lg:block absolute top-40 left-10 text-[#0BCCEB]/30"
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <GraduationCap className="w-12 h-12" />
        </motion.div>
        <motion.div
          className="hidden lg:block absolute top-60 right-20 text-[#0A80F5]/30"
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Users className="w-16 h-16" />
        </motion.div>
        <motion.div
          className="hidden lg:block absolute bottom-20 left-1/4 text-[#0BCCEB]/30"
          animate={{ y: [0, -15, 0], rotate: [0, 15, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <BarChart3 className="w-10 h-10" />
        </motion.div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-6"
            >
              <motion.div
                className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white/80 backdrop-blur-xl rounded-full shadow-lg border border-[#0BCCEB]/30 relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#0BCCEB]/20 to-[#0A80F5]/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <GraduationCap className="w-5 h-5 text-[#0A80F5] relative z-10" />
                <span className="text-[#0A80F5] font-semibold relative z-10">
                  Revolutionizing Education Management
                </span>
                <Sparkles className="w-4 h-4 text-[#0BCCEB] relative z-10" />
              </motion.div>
            </motion.div>

            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <motion.span
                className="bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] bg-clip-text text-transparent inline-block"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: "200% 200%" }}
              >
                Smart Attendance,
              </motion.span>
              <br />
              <motion.span
                className="bg-gradient-to-r from-[#0A80F5] to-[#0BCCEB] bg-clip-text text-transparent inline-block"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                style={{ backgroundSize: "200% 200%" }}
              >
                Smarter Learning
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Present-Me is the complete classroom management solution with{" "}
              <span className="font-semibold text-[#0A80F5]">
                AI-powered attendance tracking
              </span>
              , real-time analytics, and seamless communication for modern
              educational institutions.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12 sm:mb-20 px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group relative w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] text-white rounded-2xl font-bold text-base sm:text-lg shadow-2xl shadow-[#0A80F5]/50 overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#0A80F5] to-[#0BCCEB]"
                  initial={{ x: "100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10 flex items-center gap-3">
                  <Download className="w-6 h-6" />
                  Download App
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-white/80 backdrop-blur-xl text-gray-700 rounded-2xl font-bold text-base sm:text-lg shadow-xl border-2 border-gray-200 hover:border-[#0BCCEB] transition-all relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#0BCCEB]/10 to-[#0A80F5]/10"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10 flex items-center gap-3">
                  <Play className="w-5 h-5" />
                  Watch Demo
                </span>
              </motion.button>
            </motion.div>

            {/* Enhanced Stats */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] rounded-2xl blur-xl opacity-20"></div>
              <div className="relative flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 md:gap-12 bg-white/90 backdrop-blur-2xl rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-8 max-w-3xl mx-4 sm:mx-auto border border-white/50">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.1, y: -10 }}
                    className="text-center relative group cursor-pointer"
                  >
                    <motion.div className="absolute -inset-4 bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />
                    <div className="relative">
                      <motion.div
                        className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] bg-clip-text text-transparent mb-2"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.2,
                        }}
                      >
                        {stat.value}
                      </motion.div>
                      <div className="text-gray-600 font-semibold text-xs sm:text-sm md:text-base flex items-center gap-2 justify-center">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        {stat.label}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 relative"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              className="inline-block mb-4 px-6 py-2 bg-gradient-to-r from-[#0BCCEB]/20 to-[#0A80F5]/20 rounded-full relative"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-[#0A80F5] font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Three Ways to Mark Attendance
              </span>
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose the method that works best for your institution - or use
              all three
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: <Users className="w-12 h-12" />,
                title: "Face Detection",
                description:
                  "AI-powered facial recognition technology ensures secure and contactless attendance. Students simply look at the camera and attendance is marked instantly with 99.9% accuracy.",
                color: "from-blue-500 to-cyan-500",
                lightColor: "from-blue-50 to-cyan-50",
              },
              {
                icon: <Wifi className="w-12 h-12" />,
                title: "WiFi/Hotspot",
                description:
                  "Location-based attendance using WiFi or hotspot connectivity. Students must be within the designated area to mark attendance, preventing proxy attendance.",
                color: "from-purple-500 to-pink-500",
                lightColor: "from-purple-50 to-pink-50",
              },
              {
                icon: <Hand className="w-12 h-12" />,
                title: "Manual Entry",
                description:
                  "Traditional manual attendance marking with modern interface. Teachers can mark attendance with a single tap, with options for late entries and absentee notes.",
                color: "from-orange-500 to-red-500",
                lightColor: "from-orange-50 to-red-50",
              },
            ].map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.2,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative group"
              >
                {/* Glow Effect */}
                <motion.div
                  className={`absolute -inset-1 bg-gradient-to-r ${method.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-25 transition-opacity duration-500`}
                />

                <div
                  className={`relative bg-gradient-to-br ${method.lightColor} rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-lg transition-all border border-gray-100 backdrop-blur-sm overflow-hidden`}
                >
                  {/* Animated Background Pattern */}
                  <motion.div
                    className="absolute top-0 right-0 w-32 h-32 opacity-10"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <div
                      className={`w-full h-full bg-gradient-to-br ${method.color} rounded-full blur-2xl`}
                    />
                  </motion.div>

                  <motion.div
                    className={`relative w-16 h-16 bg-gradient-to-br ${method.color} rounded-2xl flex items-center justify-center text-white mb-5 shadow-lg`}
                    whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-white/20 rounded-2xl"
                    />
                    {method.icon}
                  </motion.div>

                  <h3 className="text-lg font-semibold mb-3 text-gray-900">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-5">
                    {method.description}
                  </p>

                  <motion.button
                    whileHover={{ x: 5 }}
                    className={`flex items-center gap-2 text-transparent bg-gradient-to-r ${method.color} bg-clip-text font-medium text-sm group-hover:gap-3 transition-all`}
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 px-6 bg-gradient-to-b from-white/50 to-[#0BCCEB]/5 relative overflow-hidden"
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#0BCCEB]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#0A80F5]/20 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              className="inline-block mb-4 px-6 py-2 bg-gradient-to-r from-[#0BCCEB]/20 to-[#0A80F5]/20 rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-[#0A80F5] font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Complete Solution
              </span>
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage your educational institution
              efficiently
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative"
              >
                {/* Card Glow */}
                <motion.div
                  className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-2xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-500`}
                />

                <div className="relative bg-white backdrop-blur-xl rounded-xl p-8 shadow-md hover:shadow-xl transition-all border border-gray-100">
                  <motion.div
                    className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center text-white mb-5 relative overflow-hidden`}
                    whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    {feature.icon}
                  </motion.div>

                  <h3 className="text-lg font-semibold mb-3 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover Arrow */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    className="mt-4 flex items-center gap-2 text-[#0A80F5] font-medium text-sm"
                  >
                    Learn more
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* For Users Section */}
      <section id="users" className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              className="inline-block mb-4 px-6 py-2 bg-gradient-to-r from-[#0BCCEB]/20 to-[#0A80F5]/20 rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-[#0A80F5] font-semibold flex items-center gap-2">
                <Users className="w-4 h-4" />
                For Everyone
              </span>
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Built for All Users
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Tailored experiences for students, teachers, and administrators
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {userTypes.map((user, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, rotateX: -20 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.2,
                  type: "spring",
                  stiffness: 80,
                }}
                className="relative group"
              >
                {/* Premium Glow Effect */}
                <motion.div
                  className="absolute -inset-0.5 bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-700"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.5,
                  }}
                />

                <motion.div
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="relative bg-gradient-to-br from-white via-white to-indigo-50/30 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100 backdrop-blur-sm overflow-hidden"
                >
                  {/* Animated Background Pattern */}
                  <motion.div
                    className="absolute top-0 right-0 w-32 h-32"
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 25,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-[#0BCCEB]/20 to-[#0A80F5]/20 rounded-full blur-2xl" />
                  </motion.div>

                  <motion.div
                    className="relative w-16 h-16 bg-gradient-to-br from-[#0BCCEB] to-[#0A80F5] rounded-2xl flex items-center justify-center text-white mb-5 shadow-lg"
                    whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-white/30 rounded-2xl"
                    />
                    {user.icon}
                  </motion.div>

                  <h3 className="relative text-xl font-semibold mb-4 bg-gradient-to-r from-gray-900 to-[#0A80F5] bg-clip-text text-transparent">
                    {user.title}
                  </h3>

                  <ul className="relative space-y-3 mb-6">
                    {user.features.map((feature, idx) => (
                      <motion.li
                        key={idx}
                        className="flex items-start gap-3 group/item"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 + idx * 0.1 }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 360 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CheckCircle2 className="w-5 h-5 text-[#0A80F5] flex-shrink-0 mt-0.5" />
                        </motion.div>
                        <span className="text-gray-600 text-sm group-hover/item:text-gray-900 transition-colors">
                          {feature}
                        </span>
                      </motion.li>
                    ))}
                  </ul>

                  <motion.button
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative w-full px-6 py-3 bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all overflow-hidden group/btn"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[#0A80F5] to-[#0BCCEB]"
                      initial={{ x: "100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {index === 2 ? (
                        <>
                          <Shield className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                          Login to Dashboard
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5 group-hover/btn:translate-y-1 transition-transform" />
                          Download App
                        </>
                      )}
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                  </motion.button>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#0BCCEB]/10 via-[#0A80F5]/10 to-[#0BCCEB]/5 relative overflow-hidden">
        {/* Animated Background Patterns */}
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-[#0BCCEB]/30 to-[#0A80F5]/30 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-[#0A80F5]/30 to-[#0BCCEB]/30 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], x: [0, -40, 0], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              className="inline-block mb-4 px-6 py-2 bg-white/80 backdrop-blur-xl rounded-full shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <span className="bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] bg-clip-text text-transparent font-semibold flex items-center gap-2">
                <Award className="w-4 h-4 text-[#0A80F5]" />
                Premium Quality
              </span>
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Why Choose Present-Me?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The most comprehensive attendance and classroom management
              solution
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  x: index % 2 === 0 ? -50 : 50,
                  rotateY: index % 2 === 0 ? -15 : 15,
                }}
                whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
                className="relative group"
              >
                {/* Card Glow */}
                <motion.div className="absolute -inset-0.5 bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500" />

                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="relative flex flex-col sm:flex-row gap-4 sm:gap-6 bg-white backdrop-blur-xl rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 overflow-hidden"
                >
                  {/* Animated Background Circle */}
                  <motion.div
                    className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-[#0BCCEB]/40 to-[#0A80F5]/40 rounded-full"
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />

                  <motion.div
                    className="w-16 h-16 bg-gradient-to-br from-[#0BCCEB] to-[#0A80F5] rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lg relative overflow-hidden"
                    whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-white/30 rounded-xl"
                    />
                    {benefit.icon}
                  </motion.div>

                  <div className="relative z-10 flex-1">
                    <h3 className="text-lg font-semibold mb-2 bg-gradient-to-r from-gray-900 to-[#0A80F5] bg-clip-text text-transparent">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {benefit.description}
                    </p>

                    <motion.div
                      className="mt-3 flex items-center gap-2 text-[#0A80F5] font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ x: 5 }}
                    >
                      Learn more
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Mega Glow Effect */}
            <motion.div
              className="absolute -inset-3 bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] rounded-2xl blur-2xl opacity-50"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.5, 0.7, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <div className="relative bg-gradient-to-br from-[#0BCCEB] to-[#0A80F5] rounded-xl sm:rounded-2xl p-6 sm:p-10 md:p-12 text-center text-white shadow-xl overflow-hidden max-w-4xl mx-auto">
              {/* Animated Background Patterns */}
              <motion.div
                className="absolute top-0 left-0 w-full h-full opacity-20"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, white 1px, transparent 1px)",
                  backgroundSize: "30px 30px",
                }}
                animate={{ backgroundPosition: ["0px 0px", "30px 30px"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />

              <motion.div
                className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
                animate={{ scale: [1, 1.3, 1], rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"
                animate={{ scale: [1, 1.2, 1], rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity }}
              />

              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="inline-block mb-6"
                >
                  <div className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-xl rounded-full border border-white/30">
                    <Sparkles className="w-5 h-5" />
                    <span className="font-semibold">
                      Join 10,000+ Happy Users
                    </span>
                  </div>
                </motion.div>

                <motion.h2
                  className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  Ready to Get Started?
                </motion.h2>

                <motion.p
                  className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-10 opacity-95 font-medium"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 0.95 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  Join thousands of institutions already using Present-Me
                </motion.p>

                <motion.div
                  className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.08, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-xl text-white rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base border border-white/20 hover:bg-white/20 transition-all shadow-md"
                  >
                    <span className="flex items-center gap-2">
                      <Smartphone className="w-5 h-5" />
                      Download for Android
                      <Download className="w-4 h-4" />
                    </span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.08, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="group px-8 py-4 bg-white/10 backdrop-blur-xl text-white rounded-2xl font-semibold text-base border border-white/20 hover:bg-white/20 transition-all shadow-md"
                  >
                    <span className="flex items-center gap-2">
                      <Smartphone className="w-5 h-5" />
                      Download for iOS
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </motion.button>
                </motion.div>

                <motion.div
                  className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                >
                  <span className="opacity-90 font-semibold text-lg">
                    Admin Access:
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-white text-[#0A80F5] rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg shadow-2xl overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[#0BCCEB]/20 to-[#0A80F5]/20"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    <span className="relative z-10 flex items-center gap-3">
                      <Shield className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                      HOD/Dean Login
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    </span>
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white py-10 px-6 relative overflow-hidden"
      >
        {/* Animated Background Elements */}
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-slate-700/20 to-gray-700/20 rounded-full blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-gray-700/20 to-slate-600/20 rounded-full blur-3xl"
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <motion.div
                className="flex items-center gap-3 mb-4"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg p-0.5 overflow-hidden">
                  <img
                    src={logo}
                    alt="Present-Me Logo"
                    className="w-full h-full object-cover scale-110"
                  />
                </div>
                <span className="text-2xl font-bold">
                  <span className="bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] bg-clip-text text-transparent">
                    PRESENT
                  </span>
                  <span className="text-gray-300">-ME</span>
                </span>
              </motion.div>
              <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                Revolutionizing education management with smart attendance
                tracking, real-time analytics, and seamless classroom management
                for modern institutions.
              </p>
              <div className="flex items-center gap-4">
                {[
                  {
                    icon: <Linkedin className="w-5 h-5" />,
                    color: "from-blue-400 to-blue-600",
                  },
                  {
                    icon: <Twitter className="w-5 h-5" />,
                    color: "from-sky-400 to-blue-500",
                  },
                  {
                    icon: <Facebook className="w-5 h-5" />,
                    color: "from-blue-500 to-indigo-600",
                  },
                ].map((social, idx) => (
                  <motion.a
                    key={idx}
                    href="#"
                    whileHover={{ scale: 1.2, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative group"
                  >
                    <motion.div
                      className={`absolute -inset-2 bg-gradient-to-r ${social.color} rounded-xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity`}
                    />
                    <div className="relative w-12 h-12 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/10 group-hover:bg-white/20 transition-all">
                      {social.icon}
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {["Features", "How it Works", "For Users", "Download"].map(
                  (link, idx) => (
                    <motion.li
                      key={idx}
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <a
                        href={`#${link.toLowerCase().replace(" ", "-")}`}
                        className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"
                      >
                        <motion.div className="w-1.5 h-1.5 bg-indigo-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        {link}
                      </a>
                    </motion.li>
                  )
                )}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Contact Us
              </h3>
              <ul className="space-y-4">
                {[
                  {
                    icon: <Mail className="w-5 h-5" />,
                    text: "support@presentme.in",
                  },
                  {
                    icon: <Phone className="w-5 h-5" />,
                    text: "+91 7007458210",
                  },
                  {
                    icon: <MapPin className="w-5 h-5" />,
                    text: "Gorakhpur, Uttar Pradesh, India",
                  },
                ].map((contact, idx) => (
                  <motion.li
                    key={idx}
                    className="flex items-center gap-3 group"
                    whileHover={{ x: 5 }}
                  >
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.3 }}
                      className="text-[#0BCCEB]"
                    >
                      {contact.icon}
                    </motion.div>
                    <span className="text-gray-300 group-hover:text-white transition-colors">
                      {contact.text}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          <motion.div
            className="border-t border-white/10 pt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <p className="text-gray-400 text-sm flex items-center gap-2">
                © 2025 Present-Me. All rights reserved.
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block w-2 h-2 bg-green-400 rounded-full"
                />
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                  (link, idx) => (
                    <motion.a
                      key={idx}
                      href="#"
                      whileHover={{ scale: 1.05, color: "#ffffff" }}
                      className="text-gray-400 hover:text-white transition-colors relative group"
                    >
                      {link}
                      <motion.span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] group-hover:w-full transition-all duration-300" />
                    </motion.a>
                  )
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default IntroPage;
