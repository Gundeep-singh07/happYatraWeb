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
} from "lucide-react";
import { STORAGE_KEYS, User } from "../../../constants/constants";
import Header from "../Header/Header";

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

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  // Not authenticated state
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-2xl font-bold mb-6">Welcome</h1>
          <p className="text-gray-400 mb-8">
            Please sign in to access your dashboard
          </p>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/auth")}
            className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            Sign In
          </Button>
        </div>
      </div>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header Component */}
      <Header user={user} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome back,{" "}
            <span className="text-blue-400">
              {user.fullName?.split(" ")[0] || "User"}
            </span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto">
            Your comprehensive transport and navigation dashboard - everything
            you need for seamless travel in one place
          </p>
        </div>

        {/* Quick Actions Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <div
                  key={action.name}
                  className={`group relative bg-black ${action.color} border-2 hover:border-opacity-80 transition-all duration-300 rounded-lg overflow-hidden`}
                  style={{ aspectRatio: "1/1" }}
                >
                  <div className="p-6 h-full flex flex-col">
                    <div className="flex items-center mb-4">
                      <IconComponent className="h-8 w-8 mr-3 text-white" />
                      <h3 className="text-xl font-bold text-white">
                        {action.name}
                      </h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed text-sm flex-1">
                      {action.description}
                    </p>
                  </div>
                  {/* Explore More Button */}
                  <div className="absolute bottom-4 right-4 transform translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                    <button
                      onClick={() => (window.location.href = action.href)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium whitespace-nowrap transition-colors"
                    >
                      Explore More
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Secondary Features Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Additional Features
          </h2>
          <div className="space-y-6">
            {secondaryFeatures.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={feature.title}
                  className={`${feature.color} border rounded-lg p-6 hover:bg-opacity-10 transition-all duration-300 cursor-pointer`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      <IconComponent className="h-6 w-6 text-white mt-1" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
