// src/components/Carpooling/CarpoolingPage.tsx

import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car,
  MapPin,
  Clock,
  Users,
  PlusCircle,
  Loader2,
  AlertCircle,
  UserCheck,
  CheckCircle,
  Ban,
} from "lucide-react";
import Header from "../../Header/Header";
import apiService from "../../../../services/apiService";
import {
  CarpoolRoute,
  User as UserType,
  NewCarpoolRouteData,
} from "../../../../constants/constants";
import { CreateRouteModal } from "./CreateRouteModal"; // We can move the modal to its own file for cleanliness

const CarpoolingPage = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [routes, setRoutes] = useState<CarpoolRoute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const currentUser = apiService.getCurrentUser();
    setUser(currentUser);
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiService.getCarpoolRoutes();
      if (result.success) {
        setRoutes(result.data.routes);
      } else {
        setError(result.message || "Failed to fetch routes.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRouteCreated = (newRoute: CarpoolRoute) => {
    setRoutes((prevRoutes) =>
      [newRoute, ...prevRoutes].sort(
        (a, b) =>
          new Date(a.departureTime).getTime() -
          new Date(b.departureTime).getTime()
      )
    );
  };

  const handleJoinClick = async (routeId: string) => {
    try {
      const result = await apiService.joinCarpoolRoute(routeId);
      if (result.success) {
        alert("Joined successfully!");
        // Replace the old route data with the updated one from the server
        setRoutes(
          routes.map((r) => (r._id === routeId ? result.data.route : r))
        );
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const formatDateTime = (isoString: string) =>
    new Date(isoString).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const isUserInvolved = (route: CarpoolRoute) => {
    if (!user) return false;
    return (
      route.driver._id === user._id ||
      route.passengers.some((p) => p._id === user._id)
    );
  };

  const getSeatsLeft = (route: CarpoolRoute) =>
    route.availableSeats - route.passengers.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <Header user={user} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Carpooling Hub
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg"
            onClick={() => setIsModalOpen(true)}
          >
            <PlusCircle size={20} />
            <span>Post a Route</span>
          </motion.button>
        </motion.div>

        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-lg flex items-center">
            <AlertCircle className="mr-3" />
            {error}
          </div>
        )}
        {!isLoading && !error && routes.length === 0 && (
          <div className="text-center py-16">
            <Car size={64} className="mx-auto text-gray-600" />
            <h2 className="mt-4 text-2xl font-semibold text-gray-400">
              No Active Routes
            </h2>
            <p className="mt-2 text-gray-500">Be the first to post a route!</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route) => {
            const seatsLeft = getSeatsLeft(route);
            const isFull = seatsLeft <= 0;
            const userIsInvolved = isUserInvolved(route);

            return (
              <motion.div
                key={route._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center mb-4">
                    <img
                      src={
                        route.driver.profilePicture?.url ||
                        `https://ui-avatars.com/api/?name=${route.driver.fullName}&background=random`
                      }
                      alt={route.driver.fullName}
                      className="w-10 h-10 rounded-full object-cover mr-3 border-2 border-gray-600"
                    />
                    <div>
                      <p className="font-semibold text-white">
                        {route.driver.fullName}
                      </p>
                      <p className="text-xs text-gray-400">Driver</p>
                    </div>
                  </div>
                  <div className="space-y-3 text-gray-300">
                    <div className="flex items-start space-x-3">
                      <MapPin
                        size={18}
                        className="text-green-400 mt-1 flex-shrink-0"
                      />
                      <p>
                        <span className="font-semibold text-gray-400">
                          From:
                        </span>{" "}
                        {route.origin.address}
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <MapPin
                        size={18}
                        className="text-red-400 mt-1 flex-shrink-0"
                      />
                      <p>
                        <span className="font-semibold text-gray-400">To:</span>{" "}
                        {route.destination.address}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock
                        size={18}
                        className="text-blue-400 flex-shrink-0"
                      />
                      <p>{formatDateTime(route.departureTime)}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users
                        size={18}
                        className="text-purple-400 flex-shrink-0"
                      />
                      <p>{seatsLeft} seats left</p>
                    </div>
                  </div>

                  {/* ++ PASSENGERS DISPLAY ++ */}
                  {route.passengers.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-800">
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">
                        Passengers Joined:
                      </h4>
                      <div className="flex items-center space-x-2">
                        {route.passengers.map((p) => (
                          <img
                            key={p._id}
                            src={
                              p.profilePicture?.url ||
                              `https://ui-avatars.com/api/?name=${p.fullName}&background=random`
                            }
                            alt={p.fullName}
                            title={p.fullName}
                            className="w-8 h-8 rounded-full object-cover border-2 border-gray-600"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  {user?._id === route.driver._id ? (
                    <button
                      disabled
                      className="w-full bg-gray-700 text-gray-400 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 cursor-not-allowed"
                    >
                      <UserCheck size={20} />
                      <span>Your Route</span>
                    </button>
                  ) : userIsInvolved ? (
                    <button
                      disabled
                      className="w-full bg-green-900/50 text-green-400 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 cursor-not-allowed"
                    >
                      <CheckCircle size={20} />
                      <span>You've Joined</span>
                    </button>
                  ) : isFull ? (
                    <button
                      disabled
                      className="w-full bg-red-900/50 text-red-500 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 cursor-not-allowed"
                    >
                      <Ban size={20} />
                      <span>Ride is Full</span>
                    </button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleJoinClick(route._id)}
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold px-4 py-2 rounded-lg shadow-lg flex items-center justify-center space-x-2"
                    >
                      <Car size={20} />
                      <span>Yatra</span>
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* It's better to move the modal to its own file if it gets complex, but this works */}
      {/* <CreateRouteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRouteCreated={handleRouteCreated} /> */}
    </div>
  );
};

export default CarpoolingPage;
