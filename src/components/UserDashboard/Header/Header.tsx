import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User as UserIcon,
  LogOut,
  Map,
  Car,
  Bus,
  Bell,
  Train,
  CloudSun,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { STORAGE_KEYS, User } from "../../../constants/constants";
import NotificationBadge from "./NotificationBadge";

interface HeaderProps {
  user: User | null;
}

const menuVariants = {
  hidden: { opacity: 0, y: -5 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    y: -5,
    transition: { duration: 0.2 },
  },
};

const Header = ({ user }: HeaderProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState(window.location.pathname);

  const navigationItems = [
    { name: "Maps", icon: Map, href: "/maps" },
    { name: "Carpooling", icon: Car, href: "/carpooling" },
    { name: "Bus Tracker", icon: Bus, href: "/bus-tracker" },
    { name: "Metro", icon: Train, href: "/metro" },
    { name: "Weather", icon: CloudSun, href: "/weather" },
  ];

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    window.location.href = "/auth";
  };

  const navigateToProfile = () => {
    window.location.href = "/profile";
    setIsDropdownOpen(false);
  };

  const handleNavigation = (href: string) => {
    setActiveRoute(href);
    window.location.href = href;
    setIsMobileMenuOpen(false);
  };

  // If no user, show a minimal header
  if (!user) {
    return (
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-gradient-to-b from-gray-900/95 to-gray-900/85 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0">
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                happYatra
              </h1>
            </motion.div>
            <div className="animate-pulse">
              <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </motion.header>
    );
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-gradient-to-b from-gray-900/95 to-gray-900/85 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0">
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              happYatra
            </h1>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeRoute === item.href;

              return (
                <motion.button
                  key={item.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigation(item.href)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium
                    ${
                      isActive
                        ? "bg-blue-500/20 text-white"
                        : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                    } 
                    transition-all duration-200`}
                >
                  <Icon size={18} className={isActive ? "text-blue-400" : ""} />
                  <span>{item.name}</span>
                </motion.button>
              );
            })}
          </nav>

          {/* Right side - Notifications, User Profile and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="hidden md:block">
              <NotificationBadge />
            </div>

            {/* Mobile menu button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>

            {/* User Profile */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center p-2 rounded-full hover:bg-gray-700/50 transition-all duration-200"
              >
                {user.profilePicture?.url ? (
                  <img
                    src={user.profilePicture.url}
                    alt={user.fullName || "User"}
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-600 hover:border-blue-400 transition-colors"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">
                    <UserIcon size={18} className="text-gray-300" />
                  </div>
                )}
              </motion.button>

              {/* User Dropdown Menu */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black z-40"
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    <motion.div
                      variants={menuVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-0 mt-2 w-56 bg-gray-800/90 backdrop-blur-md border border-gray-700 rounded-lg shadow-lg z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-700">
                        <p className="text-sm font-medium text-white">
                          {user.fullName || "User"}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {user.email || ""}
                        </p>
                      </div>
                      <div className="py-2">
                        <motion.button
                          whileHover={{ x: 5 }}
                          onClick={navigateToProfile}
                          className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 transition-colors flex items-center"
                        >
                          <UserIcon size={16} className="mr-3" />
                          View Profile
                        </motion.button>
                        <motion.button
                          whileHover={{ x: 5 }}
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700/50 transition-colors flex items-center"
                        >
                          <LogOut size={16} className="mr-3" />
                          Sign Out
                        </motion.button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="md:hidden border-t border-gray-800"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeRoute === item.href;

                  return (
                    <motion.button
                      key={item.name}
                      whileHover={{ x: 5 }}
                      onClick={() => handleNavigation(item.href)}
                      className={`flex items-center space-x-3 w-full px-3 py-2 rounded-md text-sm font-medium
                        ${
                          isActive
                            ? "bg-blue-500/20 text-white"
                            : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                        } 
                        transition-all duration-200`}
                    >
                      <Icon
                        size={18}
                        className={isActive ? "text-blue-400" : ""}
                      />
                      <span>{item.name}</span>
                    </motion.button>
                  );
                })}
                <div className="px-3 py-2">
                  <NotificationBadge />
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
