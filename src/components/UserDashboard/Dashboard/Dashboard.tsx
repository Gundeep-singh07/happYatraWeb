// src/components/Dashboard/Dashboard.tsx

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
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
  MapPin,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
  Search, // Import the Search icon
} from "lucide-react";
import Header from "../Header/Header";
import LocationTracker from "./LocationTracker/LocationTracker";
import apiService from "../../../services/apiService";
import weatherService from "../../../services/weatherService";
import WeatherWidget from "./WeatherWidget";

const RecentActivity = () => {
  const activities = [
    {
      type: "Trip Completed",
      route: "Home → Office",
      time: "2 hours ago",
      distance: "12.5 km",
    },
    {
      type: "Route Planned",
      route: "Office → Mall",
      time: "5 hours ago",
      distance: "8.2 km",
    },
    {
      type: "Location Updated",
      route: "Current Location",
      time: "1 day ago",
      distance: "0 km",
    },
  ];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6"
    >
      <h3 className="text-xl font-semibold text-white mb-6">Recent Activity</h3>
      <div className="space-y-4 h-[calc(100%-3rem)] overflow-auto">
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{activity.type}</p>
                <p className="text-sm text-gray-400">{activity.route}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">{activity.distance}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <History className="h-3 w-3 mr-1" />
                  {activity.time}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLocationTracker, setShowLocationTracker] = useState(false);
  const [userLocation, setUserLocation] = useState<any>(null);
  const [locationError, setLocationError] = useState("");
  const [authError, setAuthError] = useState("");
  const [serverAvailable, setServerAvailable] = useState<boolean | null>(null);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  useEffect(() => {
    initializeDashboard();
  }, []);

  useEffect(() => {
    const fetchWeatherForLocation = async () => {
      if (userLocation?.latitude && userLocation?.longitude) {
        setWeatherLoading(true);
        setWeatherError(null);
        setWeatherData(null);
        try {
          const result = await weatherService.getWeatherByCoords(
            userLocation.latitude,
            userLocation.longitude
          );
          if (result.success && result.data) setWeatherData(result.data);
          else
            setWeatherError(result.message || "Failed to fetch weather data.");
        } catch (error: any) {
          setWeatherError(
            error.message || "Could not connect to the weather service."
          );
        } finally {
          setWeatherLoading(false);
        }
      }
    };
    fetchWeatherForLocation();
  }, [userLocation]);

  const initializeDashboard = async () => {
    try {
      setIsLoading(true);
      setAuthError("");
      const storedUser = localStorage.getItem("happyatra_user");
      const token = localStorage.getItem("happyatra_token");
      if (storedUser && token) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        if (userData.location?.latitude) setUserLocation(userData.location);
        try {
          await apiService.healthCheck();
          setServerAvailable(true);
          const result = await apiService.getUserProfile();
          if (result.success && result.user) {
            setUser(result.user);
            if (result.user.location?.latitude)
              setUserLocation(result.user.location);
            else setShowLocationTracker(true);
          }
        } catch (serverError) {
          setServerAvailable(false);
          if (!userData.location?.latitude) setShowLocationTracker(true);
        }
      } else {
        setAuthError("Please sign in to access your dashboard");
      }
    } catch (error) {
      setAuthError("Failed to load dashboard. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationUpdate = (location: any) => {
    setUserLocation(location);
    setLocationError("");
    if (user) {
      const updatedUser = { ...user, location };
      setUser(updatedUser);
      localStorage.setItem("happyatra_user", JSON.stringify(updatedUser));
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  if (authError || !user)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center text-center">
        <div className="max-w-md p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-white text-3xl font-bold mb-4">
            Welcome to happYatra
          </h1>
          <p className="text-gray-400 mb-8">{authError}</p>
          <button
            onClick={() => (window.location.href = "/auth")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg rounded-md w-full"
          >
            Sign In
          </button>
        </div>
      </div>
    );

  const quickActions = [
    {
      name: "Maps",
      href: "/maps",
      color: "border-blue-500/30 bg-blue-500/5",
      icon: Map,
      description:
        "Navigate with precision using our advanced GPS tracking system.",
    },
    {
      name: "Carpooling",
      href: "/carpooling",
      color: "border-blue-500/30 bg-blue-500/5",
      icon: Users,
      description: "Connect with fellow commuters and share your journey.",
    },
    // *** THIS IS THE ONLY BUS-RELATED CARD NOW ***
    {
      name: "Bus Tracker",
      href: "/bus-tracker",
      color: "border-purple-500/30 bg-purple-500/5",
      icon: Bus,
      description:
        "Plan your trip using real-time data, find nearby stops, and monitor live bus routes with AI-driven insights.",
    },
    {
      name: "Metro",
      href: "/metro",
      color: "border-blue-500/30 bg-blue-500/5",
      icon: Train,
      description: "Navigate underground rail systems with ease.",
    },
    {
      name: "Weather",
      href: "/weather",
      color: "border-blue-500/30 bg-blue-500/5",
      icon: Cloud,
      description: "Make informed travel decisions with weather forecasting.",
    },
    {
      name: "Notifications",
      href: "/notifications",
      color: "border-blue-500/30 bg-blue-500/5",
      icon: Bell,
      description: "Stay informed with personalized alerts.",
    },
  ];

  const secondaryFeatures = [
    {
      title: "Recent Trips",
      description: "View your travel history and analyze patterns.",
      icon: History,
      color: "border-blue-500/30 bg-blue-500/5",
    },
    {
      title: "Saved Routes",
      description: "Quick access to your frequently used routes.",
      icon: Route,
      color: "border-blue-500/30 bg-blue-500/5",
    },
    {
      title: "Settings",
      description: "Customize your experience with preferences.",
      icon: Settings,
      color: "border-blue-500/30 bg-blue-500/5",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900"
    >
      <Header user={user} />
      {showLocationTracker && (
        <LocationTracker
          onLocationUpdate={handleLocationUpdate}
          onLocationError={setLocationError}
          onClose={() => setShowLocationTracker(false)}
          isRequired={false}
          autoShow={true}
        />
      )}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center backdrop-blur-sm bg-white/5 rounded-2xl p-8 border border-white/10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              {user.fullName.split(" ")[0]}
            </span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-6">
            Your comprehensive transport and navigation dashboard
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            {serverAvailable !== null && (
              <div
                className={`flex items-center space-x-2 ${
                  serverAvailable ? "text-green-400" : "text-yellow-400"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    serverAvailable ? "bg-green-400" : "bg-yellow-400"
                  }`}
                />
                <span>
                  {serverAvailable ? "Server Connected" : "Offline Mode"}
                </span>
              </div>
            )}
            {userLocation ? (
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircle className="h-5 w-5" />
                <span>
                  Location:{" "}
                  {userLocation.address ||
                    `${userLocation.latitude?.toFixed(
                      4
                    )}, ${userLocation.longitude?.toFixed(4)}`}
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-yellow-400">
                <AlertCircle className="h-5 w-5" />
                <span>Location not set</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowLocationTracker(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors mx-auto"
          >
            <MapPin className="h-4 w-4" />
            <span>{userLocation ? "Update Location" : "Enable Location"}</span>
          </button>
          {locationError && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 max-w-md mx-auto">
              <p className="text-red-600 text-sm">{locationError}</p>
            </div>
          )}
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[400px]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <RecentActivity />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <WeatherWidget
              weatherData={weatherData}
              isLoading={weatherLoading}
              error={weatherError}
            />
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {[
            {
              label: "Total Trips",
              value: user.stats?.totalTrips || 0,
              icon: Route,
            },
            {
              label: "Distance Covered",
              value: `${user.stats?.totalDistance || 0} km`,
              icon: Map,
            },
            {
              label: "CO₂ Saved",
              value: `${user.stats?.co2Saved || 0} kg`,
              icon: Cloud,
            },
            {
              label: "Money Saved",
              value: `₹${user.stats?.moneySaved || 0}`,
              icon: Users,
            },
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
                  className={`group relative ${action.color} backdrop-blur-sm border-2 transition-all duration-300 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-blue-500/10 h-[300px] cursor-pointer`}
                  onClick={() => (window.location.href = action.href)}
                >
                  <div className="p-6 h-full flex flex-col">
                    <div className="flex items-center mb-4">
                      <IconComponent className="h-8 w-8 mr-3 text-white" />
                      <h3 className="text-xl font-bold text-white">
                        {action.name}
                      </h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed text-sm flex-grow">
                      {action.description}
                    </p>
                    <div className="mt-auto pt-4">
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors w-full">
                        Explore More
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
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
                  className={`${feature.color} border-2 rounded-lg p-6 hover:shadow-lg transition-all duration-300 cursor-pointer backdrop-blur-sm`}
                >
                  <div className="flex flex-col items-center text-center">
                    <IconComponent className="h-8 w-8 text-white mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setShowLocationTracker(true)}
          className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg z-40"
        >
          <MapPin className="h-6 w-6" />
        </motion.button>
      </main>
    </motion.div>
  );
};

export default Dashboard;
