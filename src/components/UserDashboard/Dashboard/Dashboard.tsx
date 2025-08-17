import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Map,
  Users,
  Bus,
  Bell,
  Train,
  Cloud,
  History,
  Route,
  Settings,
  Plus,
} from "lucide-react";
import { STORAGE_KEYS, User } from "../../../constants/constants";
import Header from "../Header/Header";
import { motion } from "framer-motion";
import { WeatherWidget } from "./WeatherWidget";
import { RecentActivity } from "./RecentActivity";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
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

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "m":
            window.location.href = "/maps";
            break;
          case "b":
            window.location.href = "/bus-tracker";
            break;
          case "n":
            window.location.href = "/notifications";
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-white/60 animate-pulse">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated state
  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center"
      >
        <div className="text-center">
          <motion.h1
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-white text-3xl font-bold mb-6"
          >
            Welcome to happYatra
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 mb-8"
          >
            Please sign in to access your dashboard
          </motion.p>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              variant="default"
              onClick={() => (window.location.href = "/auth")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg"
            >
              Sign In
            </Button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  const quickActions = [
    {
      name: "Maps",
      href: "/maps",
      color: "border-green-500/30",
      icon: Map,
      description:
        "Navigate with precision using our advanced GPS tracking system. Get real-time traffic updates, road closure alerts, and intelligent route optimization. Our maps feature supports multiple transportation modes including walking, cycling, driving, and public transit. Access offline maps for areas with poor connectivity, view satellite imagery, and get turn-by-turn voice navigation. Perfect for daily commutes, long road trips, or exploring new cities with confidence and efficiency.",
    },
    {
      name: "Carpooling",
      href: "/carpooling",
      color: "border-blue-500/30",
      icon: Users,
      description:
        "Connect with fellow commuters and share your journey while reducing costs and environmental impact. Our smart matching algorithm pairs you with compatible travelers based on routes, schedules, and preferences. Features include secure payment processing, rating systems, real-time tracking for safety, and flexible scheduling options. Whether you're offering rides or looking for one, build a community of trusted travel partners while saving money and contributing to a greener planet.",
    },
    {
      name: "Bus Tracker",
      href: "/bus-tracker",
      color: "border-orange-500/30",
      icon: Bus,
      description:
        "Never miss your bus again with live tracking and predictive arrival times. Access comprehensive route information, schedule updates, and service disruptions in real-time. Plan your journey with multi-route options, set custom alerts for your regular buses, and receive notifications about delays or changes. Our system integrates with city transport APIs to provide the most accurate and up-to-date information for efficient public transportation usage.",
    },
    {
      name: "Metro",
      href: "/metro",
      color: "border-purple-500/30",
      icon: Train,
      description:
        "Navigate underground rail systems with ease using detailed metro maps and schedules. Get real-time platform information, service status updates, and optimal transfer points. Plan multi-line journeys with step-by-step directions, check accessibility features for each station, and receive alerts about service disruptions. Our comprehensive metro guide includes fare information, station facilities, and integration with other transportation modes for seamless urban travel.",
    },
    {
      name: "Weather",
      href: "/weather",
      color: "border-cyan-500/30",
      icon: Cloud,
      description:
        "Make informed travel decisions with comprehensive weather forecasting and alerts. Get hourly and 7-day forecasts, precipitation probability, wind conditions, and visibility reports. Receive weather-based travel recommendations, severe weather warnings, and seasonal travel tips. Our system integrates weather data with transportation modes to suggest the best travel options based on current and predicted conditions, ensuring your safety and comfort.",
    },
    {
      name: "Notifications",
      href: "/notifications",
      color: "border-red-500/30",
      icon: Bell,
      description:
        "Stay informed with personalized alerts and real-time updates about your travel ecosystem. Customize notifications for traffic jams, route changes, weather warnings, transportation delays, and emergency situations. Set location-based alerts, schedule reminders for regular trips, and receive proactive suggestions for alternative routes. Our intelligent notification system learns your patterns to deliver only the most relevant and timely information when you need it most.",
    },
  ];

  const secondaryFeatures = [
    {
      title: "Recent Trips",
      description:
        "View your travel history, analyze patterns, and quickly repeat frequent journeys with saved preferences.",
      icon: History,
      color: "border-green-500/30 bg-green-500/5",
    },
    {
      title: "Saved Routes",
      description:
        "Quick access to your most frequently used routes with customized preferences and alternative path options.",
      icon: Route,
      color: "border-blue-500/30 bg-blue-500/5",
    },
    {
      title: "Settings",
      description:
        "Customize your experience with preferences for notifications, travel modes, and account management.",
      icon: Settings,
      color: "border-purple-500/30 bg-purple-500/5",
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900"
    >
      <Header user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Welcome Section */}
        <motion.div
          variants={itemVariants}
          className="text-center backdrop-blur-sm bg-white/5 rounded-2xl p-8 border border-white/10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              {user.fullName.split(" ")[0]}
            </span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto">
            Your comprehensive transport and navigation dashboard - everything
            you need for seamless travel in one place
          </p>
        </motion.div>

        {/* Weather and Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[400px]">
          <motion.div variants={itemVariants}>
            <RecentActivity />
          </motion.div>
          <motion.div variants={itemVariants}>
            <WeatherWidget />
          </motion.div>
        </div>

        {/* Quick Stats Section */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {[
            { label: "Total Trips", value: "124", icon: Route },
            { label: "Distance Covered", value: "1,234 km", icon: Map },
            { label: "CO₂ Saved", value: "45 kg", icon: Cloud },
            { label: "Money Saved", value: "₹2,400", icon: Users },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.02 }}
              className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center"
            >
              <stat.icon className="h-6 w-6 text-blue-400 mb-2 mx-auto" />
              <div className="text-2xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions Section */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-white text-center">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <motion.div
                  key={action.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`group relative bg-black/40 backdrop-blur-sm ${action.color} 
                  border-2 hover:border-opacity-80 transition-all duration-300 
                  rounded-lg overflow-hidden hover:shadow-lg h-[300px]`}
                >
                  <div className="p-6 h-full flex flex-col">
                    <div className="flex items-center mb-4">
                      <IconComponent className="h-8 w-8 mr-3 text-white" />
                      <h3 className="text-xl font-bold text-white">
                        {action.name}
                      </h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed text-sm line-clamp-6">
                      {action.description}
                    </p>
                    <div className="mt-auto pt-4">
                      <button
                        onClick={() => (window.location.href = action.href)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors w-full"
                      >
                        Explore More
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Secondary Features Section */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-white text-center">
            Additional Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {secondaryFeatures.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  whileHover={{ scale: 1.02 }}
                  className={`${feature.color} border rounded-lg p-6 hover:bg-opacity-10 
                  transition-all duration-300 cursor-pointer backdrop-blur-sm`}
                >
                  <div className="flex flex-col items-center text-center">
                    <IconComponent className="h-8 w-8 text-white mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Floating Action Button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-600 
          text-white rounded-full p-4 shadow-lg z-50"
        >
          <Plus className="h-6 w-6" />
        </motion.button>
      </main>
    </motion.div>
  );
};

export default Dashboard;
