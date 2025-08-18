import { Button } from "@/components/ui/button";
import { Bus, Menu, X, Activity, GitGraph } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

const menuVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2 }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2 }
  }
};

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { scrollY } = useScroll();
  const headerBg = useTransform(scrollY, [0, 100], ["rgba(0,0,0,0)", "rgba(0,0,0,0.8)"]);
  const isActive = (path: string) => location.pathname === path;

  // Add floating animation
  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/services", label: "Services" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ backgroundColor: headerBg }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent backdrop-blur-sm">
          {/* Reduced size and opacity of gradient orbs */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute top-20 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse delay-1000" />
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-8 relative w-full max-w-[1400px]">
        <div className="flex items-center justify-between h-20">
          {/* Enhanced Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            animate={floatingAnimation}
            className="relative group"
          >
            <Link to="/" className="flex items-center space-x-3">
              <div className="relative">
                {/* Glowing effect behind logo */}
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-75 group-hover:opacity-100"
                />
                <div className="relative bg-black/50 rounded-full p-3 backdrop-blur-xl border border-white/10">
                  <Bus className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                  happYatra
                </span>
                <span className="text-xs text-gray-400">AI-Powered Transit</span>
              </div>
            </Link>
          </motion.div>

          {/* Live Stats Bar with Animation */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden lg:flex items-center space-x-6 px-6 py-2 rounded-full bg-black/30 backdrop-blur-xl border border-white/10"
          >
            <motion.div 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center space-x-2"
            >
              <Activity className="w-4 h-4 text-green-400 animate-pulse" />
              <span className="text-sm text-gray-300">Routes Optimized: 247</span>
            </motion.div>
            <motion.div 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              className="flex items-center space-x-2"
            >
              <GitGraph className="w-4 h-4 text-blue-400 animate-pulse" />
              <span className="text-sm text-gray-300">AI Predictions Active</span>
            </motion.div>
          </motion.div>

          {/* Sign In Button Only */}
          <div className="hidden md:flex items-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/auth">
                <Button 
                  className="relative px-6 py-2 bg-transparent overflow-hidden rounded-full border border-white/10 backdrop-blur-xl group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/40 to-purple-600/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative text-white">Sign In</span>
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button with Morphing Animation */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="relative md:hidden p-2 rounded-xl overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6 text-gray-300" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6 text-gray-300" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Enhanced Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="md:hidden relative mt-2 rounded-xl overflow-hidden backdrop-blur-xl bg-gradient-to-b from-gray-900/90 to-gray-900/80 border border-white/10"
            >
              <div className="p-4 space-y-3">
                {navLinks.map((link) => (
                  <motion.div
                    key={link.path}
                    whileHover={{ x: 5 }}
                  >
                    <Link
                      to={link.path}
                      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                        ${isActive(link.path)
                          ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white"
                          : "text-gray-300 hover:text-white hover:bg-white/5"}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="pt-3">
                  <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button 
                      className="w-full relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    >
                      <span className="relative font-medium">Sign In</span>
                      <div className="absolute inset-0 rounded-lg border border-white/20" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;