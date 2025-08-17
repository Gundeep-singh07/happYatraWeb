// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Map,
//   Users,
//   Bus,
//   Bell,
//   Train,
//   Cloud,
//   History,
//   Route,
//   Settings,
//   Plus,
// } from "lucide-react";
// import { STORAGE_KEYS, User } from "../../../constants/constants";
// import Header from "../Header/Header";
// import { motion } from "framer-motion";
// import { WeatherWidget } from "./WeatherWidget";
// import { RecentActivity } from "./RecentActivity";

// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.1,
//     },
//   },
// };

// const itemVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.5 },
//   },
// };

// const Dashboard = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Load user data from localStorage
//     const userData = localStorage.getItem(STORAGE_KEYS.USER);
//     if (userData) {
//       try {
//         setUser(JSON.parse(userData));
//       } catch (error) {
//         console.error("Error parsing user data:", error);
//       }
//     }
//     setIsLoading(false);
//   }, []);

//   useEffect(() => {
//     const handleKeyPress = (e: KeyboardEvent) => {
//       if (e.ctrlKey || e.metaKey) {
//         switch (e.key) {
//           case "m":
//             window.location.href = "/maps";
//             break;
//           case "b":
//             window.location.href = "/bus-tracker";
//             break;
//           case "n":
//             window.location.href = "/notifications";
//             break;
//         }
//       }
//     };

//     window.addEventListener("keydown", handleKeyPress);
//     return () => window.removeEventListener("keydown", handleKeyPress);
//   }, []);

//   // Loading state
//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
//         <div className="space-y-4 text-center">
//           <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
//           <p className="text-white/60 animate-pulse">
//             Loading your dashboard...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // Not authenticated state
//   if (!user) {
//     return (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center"
//       >
//         <div className="text-center">
//           <motion.h1
//             initial={{ y: -20 }}
//             animate={{ y: 0 }}
//             className="text-white text-3xl font-bold mb-6"
//           >
//             Welcome to happYatra
//           </motion.h1>
//           <motion.p
//             initial={{ y: 20, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ delay: 0.2 }}
//             className="text-gray-400 mb-8"
//           >
//             Please sign in to access your dashboard
//           </motion.p>
//           <motion.div
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             transition={{ delay: 0.4 }}
//           >
//             <Button
//               variant="default"
//               onClick={() => (window.location.href = "/auth")}
//               className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg"
//             >
//               Sign In
//             </Button>
//           </motion.div>
//         </div>
//       </motion.div>
//     );
//   }

//   const quickActions = [
//     {
//       name: "Maps",
//       href: "/maps",
//       color: "border-blue-500/30 bg-blue-500/5",
//       icon: Map,
//       description:
//         "Navigate with precision using our advanced GPS tracking system. Get real-time traffic updates, road closure alerts, and intelligent route optimization. Our maps feature supports multiple transportation modes including walking, cycling, driving, and public transit. Access offline maps for areas with poor connectivity, view satellite imagery, and get turn-by-turn voice navigation. Perfect for daily commutes, long road trips, or exploring new cities with confidence and efficiency.",
//     },
//     {
//       name: "Carpooling",
//       href: "/carpooling",
//       color: "border-blue-500/30 bg-blue-500/5",
//       icon: Users,
//       description:
//         "Connect with fellow commuters and share your journey while reducing costs and environmental impact. Our smart matching algorithm pairs you with compatible travelers based on routes, schedules, and preferences. Features include secure payment processing, rating systems, real-time tracking for safety, and flexible scheduling options. Whether you're offering rides or looking for one, build a community of trusted travel partners while saving money and contributing to a greener planet.",
//     },
//     {
//       name: "Bus Tracker",
//       href: "/bus-tracker",
//       color: "border-blue-500/30 bg-blue-500/5",
//       icon: Bus,
//       description:
//         "Never miss your bus again with live tracking and predictive arrival times. Access comprehensive route information, schedule updates, and service disruptions in real-time. Plan your journey with multi-route options, set custom alerts for your regular buses, and receive notifications about delays or changes. Our system integrates with city transport APIs to provide the most accurate and up-to-date information for efficient public transportation usage.",
//     },
//     {
//       name: "Metro",
//       href: "/metro",
//       color: "border-blue-500/30 bg-blue-500/5",
//       icon: Train,
//       description:
//         "Navigate underground rail systems with ease using detailed metro maps and schedules. Get real-time platform information, service status updates, and optimal transfer points. Plan multi-line journeys with step-by-step directions, check accessibility features for each station, and receive alerts about service disruptions. Our comprehensive metro guide includes fare information, station facilities, and integration with other transportation modes for seamless urban travel.",
//     },
//     {
//       name: "Weather",
//       href: "/weather",
//       color: "border-blue-500/30 bg-blue-500/5",
//       icon: Cloud,
//       description:
//         "Make informed travel decisions with comprehensive weather forecasting and alerts. Get hourly and 7-day forecasts, precipitation probability, wind conditions, and visibility reports. Receive weather-based travel recommendations, severe weather warnings, and seasonal travel tips. Our system integrates weather data with transportation modes to suggest the best travel options based on current and predicted conditions, ensuring your safety and comfort.",
//     },
//     {
//       name: "Notifications",
//       href: "/notifications",
//       color: "border-blue-500/30 bg-blue-500/5",
//       icon: Bell,
//       description:
//         "Stay informed with personalized alerts and real-time updates about your travel ecosystem. Customize notifications for traffic jams, route changes, weather warnings, transportation delays, and emergency situations. Set location-based alerts, schedule reminders for regular trips, and receive proactive suggestions for alternative routes. Our intelligent notification system learns your patterns to deliver only the most relevant and timely information when you need it most.",
//     },
//   ];

//   const secondaryFeatures = [
//     {
//       title: "Recent Trips",
//       description:
//         "View your travel history, analyze patterns, and quickly repeat frequent journeys with saved preferences.",
//       icon: History,
//       color: "border-blue-500/30 bg-blue-500/5",
//     },
//     {
//       title: "Saved Routes",
//       description:
//         "Quick access to your most frequently used routes with customized preferences and alternative path options.",
//       icon: Route,
//       color: "border-blue-500/30 bg-blue-500/5",
//     },
//     {
//       title: "Settings",
//       description:
//         "Customize your experience with preferences for notifications, travel modes, and account management.",
//       icon: Settings,
//       color: "border-blue-500/30 bg-blue-500/5",
//     },
//   ];

//   return (
//     <motion.div
//       initial="hidden"
//       animate="visible"
//       variants={containerVariants}
//       className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900"
//     >
//       <Header user={user} />

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
//         {/* Welcome Section */}
//         <motion.div
//           variants={itemVariants}
//           className="text-center backdrop-blur-sm bg-white/5 rounded-2xl p-8 border border-white/10"
//         >
//           <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
//             Welcome back,{" "}
//             <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
//               {user.fullName.split(" ")[0]}
//             </span>
//           </h1>
//           <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto">
//             Your comprehensive transport and navigation dashboard - everything
//             you need for seamless travel in one place
//           </p>
//         </motion.div>

//         {/* Weather and Recent Activity Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[400px]">
//           <motion.div variants={itemVariants}>
//             <RecentActivity />
//           </motion.div>
//           <motion.div variants={itemVariants}>
//             <WeatherWidget />
//           </motion.div>
//         </div>

//         {/* Quick Stats Section */}
//         <motion.div
//           variants={itemVariants}
//           className="grid grid-cols-1 md:grid-cols-4 gap-6"
//         >
//           {[
//             { label: "Total Trips", value: "124", icon: Route },
//             { label: "Distance Covered", value: "1,234 km", icon: Map },
//             { label: "CO₂ Saved", value: "45 kg", icon: Cloud },
//             { label: "Money Saved", value: "₹2,400", icon: Users },
//           ].map((stat) => (
//             <motion.div
//               key={stat.label}
//               whileHover={{ scale: 1.02 }}
//               className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center"
//             >
//               <stat.icon className="h-6 w-6 text-blue-400 mb-2 mx-auto" />
//               <div className="text-2xl font-bold text-white mb-1">
//                 {stat.value}
//               </div>
//               <div className="text-gray-400 text-sm">{stat.label}</div>
//             </motion.div>
//           ))}
//         </motion.div>

//         {/* Quick Actions Section */}
//         <div className="space-y-8">
//           <h2 className="text-3xl font-bold text-white text-center">
//             Quick Actions
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {quickActions.map((action) => {
//               const IconComponent = action.icon;
//               return (
//                 <motion.div
//                   key={action.name}
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   className={`group relative ${action.color} backdrop-blur-sm
//                   border-2 border-blue-500/30 hover:border-blue-400/50
//                   transition-all duration-300 rounded-lg overflow-hidden
//                   hover:shadow-lg hover:shadow-blue-500/10 h-[300px]`}
//                 >
//                   <div className="p-6 h-full flex flex-col">
//                     <div className="flex items-center mb-4">
//                       <IconComponent className="h-8 w-8 mr-3 text-white" />
//                       <h3 className="text-xl font-bold text-white">
//                         {action.name}
//                       </h3>
//                     </div>
//                     <p className="text-gray-300 leading-relaxed text-sm line-clamp-6">
//                       {action.description}
//                     </p>
//                     <div className="mt-auto pt-4">
//                       <button
//                         onClick={() => (window.location.href = action.href)}
//                         className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors w-full"
//                       >
//                         Explore More
//                       </button>
//                     </div>
//                   </div>
//                 </motion.div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Secondary Features Section */}
//         <div className="space-y-8">
//           <h2 className="text-2xl font-bold text-white text-center">
//             Additional Features
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {secondaryFeatures.map((feature) => {
//               const IconComponent = feature.icon;
//               return (
//                 <motion.div
//                   key={feature.title}
//                   whileHover={{ scale: 1.02 }}
//                   className={`${feature.color} border-2 border-blue-500/30
//     hover:border-blue-400/50 rounded-lg p-6
//     hover:shadow-lg hover:shadow-blue-500/10
//     transition-all duration-300 cursor-pointer backdrop-blur-sm`}
//                 >
//                   <div className="flex flex-col items-center text-center">
//                     <IconComponent className="h-8 w-8 text-white mb-4" />
//                     <h3 className="text-lg font-semibold text-white mb-2">
//                       {feature.title}
//                     </h3>
//                     <p className="text-gray-400 leading-relaxed">
//                       {feature.description}
//                     </p>
//                   </div>
//                 </motion.div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Floating Action Button */}
//         <motion.button
//           initial={{ scale: 0 }}
//           animate={{ scale: 1 }}
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-600
//           text-white rounded-full p-4 shadow-lg z-50"
//         >
//           <Plus className="h-6 w-6" />
//         </motion.button>
//       </main>
//     </motion.div>
//   );
// };

// export default Dashboard;

//! 2.0
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  MapPin,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
  User as UserIcon,
  LogOut,
  Menu,
} from "lucide-react";

// Import the existing Header component
import Header from "../Header/Header"; // Adjust path as needed

// Import your existing components and constants
const API_BASE_URL = "http://localhost:80/api";
const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
  },
  USER: {
    PROFILE: `${API_BASE_URL}/user/profile`,
    UPDATE_PROFILE: `${API_BASE_URL}/user/profile`,
    UPDATE_LOCATION: `${API_BASE_URL}/user/location`,
    LOCATION_PREFERENCES: `${API_BASE_URL}/user/location/preferences`,
    LOCATION_HISTORY: `${API_BASE_URL}/user/location/history`,
    NEARBY_USERS: `${API_BASE_URL}/user/nearby`,
    UPDATE_STATS: `${API_BASE_URL}/user/stats`,
    HEALTH: `${API_BASE_URL}/user/health`,
  },
  NOTIFICATIONS: {
    LIST: `${API_BASE_URL}/notifications`,
    UNREAD_COUNT: `${API_BASE_URL}/notifications/unread-count`,
  },
  HEALTH: `${API_BASE_URL}/health`,
};

const STORAGE_KEYS = {
  TOKEN: "happyatra_token",
  USER: "happyatra_user",
  LOCATION: "happyatra_location",
  PREFERENCES: "happyatra_preferences",
  LOCATION_PROMPTED: "happyatra_location_prompted",
};

// API Service Class
class ApiService {
  getAuthHeaders(includeContentType = true) {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const headers = {};

    if (includeContentType) {
      headers["Content-Type"] = "application/json";
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  async handleResponse(response) {
    let data;

    try {
      const text = await response.text();
      data = text ? JSON.parse(text) : {};
    } catch (error) {
      console.error("Failed to parse response:", error);
      throw new Error("Invalid response from server");
    }

    if (!response.ok) {
      console.error("API Error:", {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        data,
      });

      switch (response.status) {
        case 401:
          this.logout();
          throw new Error("Session expired. Please sign in again.");
        case 403:
          throw new Error("You don't have permission to perform this action.");
        case 404:
          throw new Error("The requested resource was not found.");
        case 422:
          throw new Error("Please check your input and try again.");
        case 500:
          throw new Error("Server error. Please try again later.");
        default:
          throw new Error(
            data.message || `HTTP ${response.status}: ${response.statusText}`
          );
      }
    }

    return data;
  }

  async fetchWithRetry(url, options, retries = 2) {
    for (let i = 0; i <= retries; i++) {
      try {
        const response = await fetch(url, options);
        return await this.handleResponse(response);
      } catch (error) {
        if (i === retries) {
          throw error;
        }
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, i) * 1000)
        );
      }
    }
    throw new Error("Max retries exceeded");
  }

  async getUserProfile() {
    try {
      const response = await fetch(API_ENDPOINTS.USER.PROFILE, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      const result = await this.handleResponse(response);

      if (result.success && result.user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(result.user));
      }

      return result;
    } catch (error) {
      console.error("Get profile error:", error);
      throw error;
    }
  }

  async updateLocation(locationData) {
    try {
      console.log("Updating user location:", locationData);

      const response = await this.fetchWithRetry(
        API_ENDPOINTS.USER.UPDATE_LOCATION,
        {
          method: "PUT",
          headers: this.getAuthHeaders(),
          body: JSON.stringify({
            latitude: locationData.latitude,
            longitude: locationData.longitude,
            accuracy: locationData.accuracy,
            address: locationData.address,
          }),
        }
      );

      // Update stored user data with new location
      const currentUser = this.getCurrentUser();
      if (currentUser && response.success && response.data?.location) {
        currentUser.location = response.data.location;
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
        localStorage.setItem(
          STORAGE_KEYS.LOCATION,
          JSON.stringify({
            ...response.data.location,
            cachedAt: new Date().toISOString(),
          })
        );
      }

      return response;
    } catch (error) {
      console.error("Update location error:", error);
      throw error;
    }
  }

  logout() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.LOCATION);
    localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
    localStorage.removeItem(STORAGE_KEYS.LOCATION_PROMPTED);
    console.log("User logged out, cleared all stored data");
  }

  isAuthenticated() {
    return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  getCurrentUser() {
    try {
      const userStr = localStorage.getItem(STORAGE_KEYS.USER);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Error parsing stored user data:", error);
      localStorage.removeItem(STORAGE_KEYS.USER);
      return null;
    }
  }

  getCurrentLocation() {
    try {
      const locationStr = localStorage.getItem(STORAGE_KEYS.LOCATION);
      return locationStr ? JSON.parse(locationStr) : null;
    } catch (error) {
      console.error("Error parsing stored location data:", error);
      localStorage.removeItem(STORAGE_KEYS.LOCATION);
      return null;
    }
  }

  hasLocationPermission() {
    const user = this.getCurrentUser();
    return !!(user?.location?.latitude && user?.location?.longitude);
  }

  async healthCheck() {
    try {
      console.log("Checking server health...");

      const response = await fetch(API_ENDPOINTS.HEALTH, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const result = await this.handleResponse(response);
      console.log("Health check result:", result);

      return result;
    } catch (error) {
      console.error("Health check failed:", error);
      throw error;
    }
  }
}

const apiService = new ApiService();

// Location Tracker Component
const LocationTracker = ({
  onLocationUpdate,
  onLocationError,
  onClose,
  isRequired = false,
  autoShow = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState("idle");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState("prompt");
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setPermissionStatus("unsupported");
      onLocationError("Geolocation is not supported by this browser");
    }
  }, [onLocationError]);

  useEffect(() => {
    if (autoShow && navigator.geolocation && permissionStatus === "prompt") {
      getCurrentLocation();
    }
  }, [autoShow, permissionStatus]);

  const getReverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            "User-Agent": "HappYatra-App/1.0",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Geocoding service unavailable");
      }
      const data = await response.json();
      if (data && data.display_name) {
        return data.display_name;
      }
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch (error) {
      console.warn("Reverse geocoding failed:", error);
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  const saveLocationToBackend = async (locationData) => {
    try {
      setSaveError(null);
      const result = await apiService.updateLocation(locationData);
      console.log("Location saved successfully:", result);
      return result;
    } catch (error) {
      console.error("Failed to save location to backend:", error);
      setSaveError(error.message);
      throw error;
    }
  };

  const getCurrentLocation = () => {
    setIsLoading(true);
    setLocationStatus("loading");
    setSaveError(null);

    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        try {
          const address = await getReverseGeocode(latitude, longitude);
          const locationData = {
            latitude,
            longitude,
            accuracy,
            address,
            lastUpdated: new Date().toISOString(),
          };

          setCurrentLocation(locationData);
          setLocationStatus("success");
          setPermissionStatus("granted");

          try {
            await saveLocationToBackend(locationData);
            onLocationUpdate(locationData);
          } catch (saveError) {
            // Still call onLocationUpdate even if save fails
            onLocationUpdate(locationData);
          }
        } catch (error) {
          console.error("Location processing error:", error);
          const locationData = {
            latitude,
            longitude,
            accuracy,
            lastUpdated: new Date().toISOString(),
          };
          setCurrentLocation(locationData);
          setLocationStatus("success");
          try {
            await saveLocationToBackend(locationData);
            onLocationUpdate(locationData);
          } catch (saveError) {
            onLocationUpdate(locationData);
          }
        }
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        setLocationStatus("error");
        let errorMessage = "Failed to get your location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location access denied. Please enable location permissions in your browser settings.";
            setPermissionStatus("denied");
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage =
              "Location information unavailable. Please check your GPS settings.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Please try again.";
            break;
          default:
            errorMessage =
              "An unknown error occurred while getting your location.";
            break;
        }
        onLocationError(errorMessage);
      },
      options
    );
  };

  const retryLocation = () => {
    setLocationStatus("idle");
    setPermissionStatus("prompt");
    setSaveError(null);
    getCurrentLocation();
  };

  if (permissionStatus === "unsupported") {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-200 rounded-lg max-w-md mx-auto relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
          <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
          <h3 className="text-xl font-semibold text-red-700 mb-2">
            Location Not Supported
          </h3>
          <p className="text-red-600 text-center text-sm">
            Your browser doesn't support location services. Please use a modern
            browser like Chrome, Firefox, or Safari.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="flex flex-col items-center justify-center p-8 bg-white border border-gray-200 rounded-lg shadow-lg max-w-md mx-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-6">
          <div className="relative mb-4">
            <MapPin className="w-16 h-16 text-blue-500 mx-auto" />
            {locationStatus === "loading" && (
              <div className="absolute -top-1 -right-1">
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              </div>
            )}
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">
            Welcome to happYatra!
          </h3>
          <p className="text-gray-600 text-sm mb-2">
            Enable location services to get personalized travel information,
            nearby services, and real-time updates.
          </p>
        </div>

        {locationStatus === "idle" && (
          <div className="w-full space-y-3">
            <button
              onClick={getCurrentLocation}
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg font-medium w-full rounded-md disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Getting Location...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Enable Location Access
                </div>
              )}
            </button>
            {!isRequired && (
              <button
                onClick={onClose}
                className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 text-sm w-full rounded-md"
              >
                Skip for Now
              </button>
            )}
          </div>
        )}

        {locationStatus === "loading" && (
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
            <p className="text-gray-600 font-medium">
              Getting your precise location...
            </p>
            <p className="text-gray-500 text-sm mt-1">
              This may take a few seconds
            </p>
          </div>
        )}

        {locationStatus === "success" && currentLocation && (
          <div className="text-center w-full">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h4 className="text-lg font-semibold text-green-700 mb-2">
              Location Detected Successfully!
            </h4>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-green-700 mb-1">
                <strong>Address:</strong>
              </p>
              <p className="text-xs text-green-600 break-words">
                {currentLocation.address || "Address not available"}
              </p>
              <p className="text-xs text-green-600 mt-2">
                <strong>Coordinates:</strong>{" "}
                {currentLocation.latitude.toFixed(6)},{" "}
                {currentLocation.longitude.toFixed(6)}
              </p>
              <p className="text-xs text-green-600 mt-1">
                <strong>Accuracy:</strong> ±
                {Math.round(currentLocation.accuracy || 0)}m
              </p>
            </div>
            {saveError && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-yellow-700">
                  <strong>Note:</strong> Location detected but couldn't save to
                  server: {saveError}
                </p>
              </div>
            )}
            <div className="flex flex-col gap-2 w-full">
              <button
                onClick={retryLocation}
                className="border border-blue-500 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md text-sm"
              >
                Update Location
              </button>
              <button
                onClick={onClose}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm"
              >
                Continue to Dashboard
              </button>
            </div>
          </div>
        )}

        {locationStatus === "error" && (
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h4 className="text-lg font-semibold text-red-700 mb-2">
              Location Access Failed
            </h4>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-600 text-sm">
                {permissionStatus === "denied"
                  ? "Please enable location permissions in your browser settings:"
                  : "There was an issue getting your location:"}
              </p>
              {permissionStatus === "denied" && (
                <ol className="text-xs text-red-500 mt-2 text-left list-decimal list-inside space-y-1">
                  <li>Click the location icon in your browser's address bar</li>
                  <li>Select "Allow" for location access</li>
                  <li>Refresh the page and try again</li>
                </ol>
              )}
            </div>
            <div className="flex flex-col gap-2 w-full">
              <button
                onClick={retryLocation}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Try Again
              </button>
              {!isRequired && (
                <button
                  onClick={onClose}
                  className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 text-sm rounded-md"
                >
                  Continue Without Location
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Weather Widget Component
const WeatherWidget = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 h-full"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Cloud className="h-12 w-12 text-blue-400" />
            <div>
              <h3 className="text-3xl font-medium text-white">28°C</h3>
              <p className="text-sm text-gray-400">Clear Sky</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Mumbai, India</p>
            <p className="text-xs text-gray-500">Updated 5 mins ago</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 flex-grow">
          <div className="bg-black/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Cloud className="h-5 w-5 text-blue-400" />
              <span className="text-gray-400 text-sm">Humidity</span>
            </div>
            <p className="text-white text-lg">65%</p>
          </div>
          <div className="bg-black/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Cloud className="h-5 w-5 text-blue-400" />
              <span className="text-gray-400 text-sm">Wind Speed</span>
            </div>
            <p className="text-white text-lg">12 km/h</p>
          </div>
          <div className="bg-black/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Cloud className="h-5 w-5 text-blue-400" />
              <span className="text-gray-400 text-sm">Precipitation</span>
            </div>
            <p className="text-white text-lg">15%</p>
          </div>
          <div className="bg-black/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Cloud className="h-5 w-5 text-blue-400" />
              <span className="text-gray-400 text-sm">Visibility</span>
            </div>
            <p className="text-white text-lg">10 km</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Recent Activity Component
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

// Main Dashboard Component
const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLocationTracker, setShowLocationTracker] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [shouldAutoPromptLocation, setShouldAutoPromptLocation] =
    useState(false);
  const [authError, setAuthError] = useState("");
  const [serverAvailable, setServerAvailable] = useState(null);

  useEffect(() => {
    initializeDashboard();
  }, []);

  const initializeDashboard = async () => {
    try {
      setIsLoading(true);
      setAuthError("");

      // First, try to get user from localStorage (like your Header component)
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

      if (storedUser && token) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          console.log("Loaded user from localStorage:", userData);

          // Check location status from stored user
          checkLocationStatus(userData);

          // Try to check server health and fetch fresh user data
          try {
            console.log("Checking server availability...");
            await apiService.healthCheck();
            setServerAvailable(true);
            console.log("Server is available, fetching fresh user data...");

            // Server is available, try to fetch fresh user data
            const result = await apiService.getUserProfile();
            if (result.success && result.user) {
              setUser(result.user);
              localStorage.setItem(
                STORAGE_KEYS.USER,
                JSON.stringify(result.user)
              );
              checkLocationStatus(result.user);
              console.log("Fresh user data loaded:", result.user);
            }
          } catch (serverError) {
            console.warn(
              "Server not available, using cached data:",
              serverError
            );
            setServerAvailable(false);
            // Continue with cached user data
          }
        } catch (parseError) {
          console.error("Error parsing stored user data:", parseError);
          // Clear corrupted data
          localStorage.removeItem(STORAGE_KEYS.USER);
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          setAuthError("Please sign in to access your dashboard");
        }
      } else {
        // No stored user data, user needs to login
        console.log("No stored user data found");
        setAuthError("Please sign in to access your dashboard");
      }
    } catch (error) {
      console.error("Failed to initialize dashboard:", error);
      setAuthError("Failed to load dashboard. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const checkLocationStatus = (userData) => {
    // Check if user has location data
    const hasLocation =
      userData.location?.latitude && userData.location?.longitude;

    // Check if we've already prompted this session
    const hasBeenPrompted = localStorage.getItem(
      STORAGE_KEYS.LOCATION_PROMPTED
    );

    console.log("Location check:", {
      hasLocation,
      hasBeenPrompted,
      userData: userData.location,
    });

    // Auto-show location tracker if:
    // 1. User doesn't have location AND
    // 2. Haven't prompted in this session
    if (!hasLocation && !hasBeenPrompted) {
      setShouldAutoPromptLocation(true);
      setShowLocationTracker(true);
      // Mark as prompted for this session
      localStorage.setItem(STORAGE_KEYS.LOCATION_PROMPTED, "true");
    } else if (hasLocation) {
      // Set the current location from user data
      setUserLocation(userData.location);
    }
  };

  const handleLocationUpdate = (location) => {
    console.log("Location updated:", location);
    setUserLocation(location);

    // Update user state
    if (user) {
      const updatedUser = {
        ...user,
        location: location,
      };
      setUser(updatedUser);
      // Update stored user data
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    }

    // Clear any error
    setLocationError("");
  };

  const handleLocationError = (error) => {
    console.error("Location error:", error);
    setLocationError(error);
  };

  const handleCloseLocationTracker = () => {
    setShowLocationTracker(false);
    // Mark as prompted so we don't show again this session
    localStorage.setItem(STORAGE_KEYS.LOCATION_PROMPTED, "true");
  };

  const handleLogout = () => {
    apiService.logout();
    setUser(null);
    setUserLocation(null);
    setLocationError("");
    // Redirect to auth page
    window.location.href = "/auth";
  };

  const handleRetryAuth = () => {
    setAuthError("");
    initializeDashboard();
  };

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

  // Authentication error state
  if (authError || !user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center"
      >
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-white text-3xl font-bold mb-4">
            Welcome to happYatra
          </h1>
          <p className="text-gray-400 mb-8">
            {authError || "Please sign in to access your dashboard"}
          </p>
          <div className="space-y-4">
            <button
              onClick={() => {
                window.location.href = "/auth";
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg rounded-md w-full"
            >
              Sign In
            </button>
            {authError && !authError.includes("sign in") && (
              <button
                onClick={handleRetryAuth}
                className="border border-blue-500 text-blue-400 hover:bg-blue-500/10 px-4 py-2 text-sm rounded-md w-full"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  const quickActions = [
    {
      name: "Maps",
      href: "/maps",
      color: "border-blue-500/30 bg-blue-500/5",
      icon: Map,
      description:
        "Navigate with precision using our advanced GPS tracking system. Get real-time traffic updates, road closure alerts, and intelligent route optimization.",
    },
    {
      name: "Carpooling",
      href: "/carpooling",
      color: "border-blue-500/30 bg-blue-500/5",
      icon: Users,
      description:
        "Connect with fellow commuters and share your journey while reducing costs and environmental impact.",
    },
    {
      name: "Bus Tracker",
      href: "/bus-tracker",
      color: "border-blue-500/30 bg-blue-500/5",
      icon: Bus,
      description:
        "Never miss your bus again with live tracking and predictive arrival times.",
    },
    {
      name: "Metro",
      href: "/metro",
      color: "border-blue-500/30 bg-blue-500/5",
      icon: Train,
      description:
        "Navigate underground rail systems with ease using detailed metro maps and schedules.",
    },
    {
      name: "Weather",
      href: "/weather",
      color: "border-blue-500/30 bg-blue-500/5",
      icon: Cloud,
      description:
        "Make informed travel decisions with comprehensive weather forecasting and alerts.",
    },
    {
      name: "Notifications",
      href: "/notifications",
      color: "border-blue-500/30 bg-blue-500/5",
      icon: Bell,
      description:
        "Stay informed with personalized alerts and real-time updates about your travel ecosystem.",
    },
  ];

  const secondaryFeatures = [
    {
      title: "Recent Trips",
      description:
        "View your travel history, analyze patterns, and quickly repeat frequent journeys.",
      icon: History,
      color: "border-blue-500/30 bg-blue-500/5",
    },
    {
      title: "Saved Routes",
      description:
        "Quick access to your most frequently used routes with customized preferences.",
      icon: Route,
      color: "border-blue-500/30 bg-blue-500/5",
    },
    {
      title: "Settings",
      description:
        "Customize your experience with preferences for notifications and travel modes.",
      icon: Settings,
      color: "border-blue-500/30 bg-blue-500/5",
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900"
    >
      {/* Use the imported Header component */}
      <Header user={user} />

      {/* Location Tracker Modal */}
      {showLocationTracker && (
        <LocationTracker
          onLocationUpdate={handleLocationUpdate}
          onLocationError={handleLocationError}
          onClose={handleCloseLocationTracker}
          isRequired={false}
          autoShow={shouldAutoPromptLocation}
        />
      )}

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
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-6">
            Your comprehensive transport and navigation dashboard - everything
            you need for seamless travel in one place
          </p>

          {/* Server Status and Location Status */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            {/* Server Status */}
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
                <span className="text-sm">
                  {serverAvailable ? "Server Connected" : "Offline Mode"}
                </span>
              </div>
            )}

            {/* Location Status */}
            {userLocation || user.location ? (
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">
                  Location:{" "}
                  {userLocation?.address ||
                    user.location?.address ||
                    `${(
                      userLocation?.latitude || user.location?.latitude
                    )?.toFixed(4)}, ${(
                      userLocation?.longitude || user.location?.longitude
                    )?.toFixed(4)}`}
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-yellow-400">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">Location not set</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowLocationTracker(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors mx-auto"
          >
            <MapPin className="h-4 w-4" />
            <span>
              {userLocation || user.location
                ? "Update Location"
                : "Enable Location"}
            </span>
          </button>

          {/* Location Error Display */}
          {locationError && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 max-w-md mx-auto">
              <p className="text-red-600 text-sm">{locationError}</p>
            </div>
          )}
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
                  className={`group relative ${action.color} backdrop-blur-sm
                  border-2 border-blue-500/30 hover:border-blue-400/50 
                  transition-all duration-300 rounded-lg overflow-hidden 
                  hover:shadow-lg hover:shadow-blue-500/10 h-[300px] cursor-pointer`}
                  onClick={() => (window.location.href = action.href)}
                >
                  <div className="p-6 h-full flex flex-col">
                    <div className="flex items-center mb-4">
                      <IconComponent className="h-8 w-8 mr-3 text-white" />
                      <h3 className="text-xl font-bold text-white">
                        {action.name}
                      </h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed text-sm line-clamp-6 flex-grow">
                      {action.description}
                    </p>
                    <div className="mt-auto pt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = action.href;
                        }}
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
                  className={`${feature.color} border-2 border-blue-500/30 
                  hover:border-blue-400/50 rounded-lg p-6 
                  hover:shadow-lg hover:shadow-blue-500/10
                  transition-all duration-300 cursor-pointer backdrop-blur-sm`}
                  onClick={() => alert(`Navigate to ${feature.title}`)}
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
          onClick={() => setShowLocationTracker(true)}
          className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-600 
          text-white rounded-full p-4 shadow-lg z-40"
          title="Update Location"
        >
          <MapPin className="h-6 w-6" />
        </motion.button>
      </main>
    </motion.div>
  );
};

export default Dashboard;
