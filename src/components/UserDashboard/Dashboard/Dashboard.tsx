import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  // Not authenticated state
  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header Component */}
      <Header user={user} />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome back,{" "}
            <span className="text-blue-400">{user.fullName.split(" ")[0]}</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Your comprehensive transport and navigation dashboard
          </p>
        </div>

        {/* Quick Stats or Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">
              Recent Trips
            </h3>
            <p className="text-gray-400">View your travel history</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">
              Saved Routes
            </h3>
            <p className="text-gray-400">Quick access to frequent routes</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">
              Notifications
            </h3>
            <p className="text-gray-400">Stay updated with alerts</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-8">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "Maps", href: "/maps", color: "bg-green-600" },
              { name: "Carpooling", href: "/carpooling", color: "bg-blue-600" },
              {
                name: "Bus Tracker",
                href: "/bus-tracker",
                color: "bg-orange-600",
              },
              {
                name: "Notifications",
                href: "/notifications",
                color: "bg-red-600",
              },
              { name: "Metro", href: "/metro", color: "bg-purple-600" },
              { name: "Weather", href: "/weather", color: "bg-cyan-600" },
            ].map((action) => (
              <button
                key={action.name}
                onClick={() => (window.location.href = action.href)}
                className={`${action.color} hover:opacity-80 transition-opacity rounded-lg p-4 text-white font-medium`}
              >
                {action.name}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
