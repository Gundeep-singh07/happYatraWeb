import { useState } from "react";
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

interface HeaderProps {
  user: User;
}

const Header = ({ user }: HeaderProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    window.location.href = "/auth";
  };

  const navigateToProfile = () => {
    window.location.href = "/profile";
    setIsDropdownOpen(false);
  };

  const navigationItems = [
    { name: "Maps", icon: Map, href: "/maps" },
    { name: "Carpooling", icon: Car, href: "/carpooling" },
    { name: "Bus Tracker", icon: Bus, href: "/bus-tracker" },
    { name: "Notifications", icon: Bell, href: "/notifications" },
    { name: "Metro", icon: Train, href: "/metro" },
    { name: "Weather", icon: CloudSun, href: "/weather" },
  ];

  const handleNavigation = (href: string) => {
    window.location.href = href;
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-white">happYatra</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Right side - User Profile and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center p-2 rounded-full hover:bg-gray-700 transition-colors"
              >
                {user.profilePicture?.url ? (
                  <img
                    src={user.profilePicture.url}
                    alt={user.fullName}
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-600"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    <UserIcon size={18} className="text-gray-300" />
                  </div>
                )}
              </button>

              {/* User Dropdown Menu */}
              {isDropdownOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  {/* Dropdown Content */}
                  <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-sm font-medium text-white">
                        {user.fullName}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                    <div className="py-2">
                      <button
                        onClick={navigateToProfile}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors flex items-center"
                      >
                        <UserIcon size={16} className="mr-3" />
                        View Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors flex items-center"
                      >
                        <LogOut size={16} className="mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.href)}
                    className="flex items-center space-x-3 w-full px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
