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
  Send,
  X,
  ArrowRight,
} from "lucide-react";
import Header from "../../Header/Header";
import apiService from "../../../../services/apiService";
import {
  CarpoolRoute,
  User as UserType,
  NewCarpoolRouteData,
} from "../../../../constants/constants";

// Modal Component for Creating a Route
interface CreateRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRouteCreated: (newRoute: CarpoolRoute) => void; // ++ MODIFIED PROP
}

const CreateRouteModal = ({
  isOpen,
  onClose,
  onRouteCreated,
}: CreateRouteModalProps) => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [availableSeats, setAvailableSeats] = useState("2");
  const [vehicleDetails, setVehicleDetails] = useState("");
  const [fare, setFare] = useState("0");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!origin || !destination || !departureTime || !availableSeats) {
      setFormError("Please fill in Origin, Destination, Time, and Seats.");
      return;
    }
    setIsSubmitting(true);
    setFormError(null);

    const payload: NewCarpoolRouteData = {
      origin: { address: origin, latitude: 28.6139, longitude: 77.209 }, // Placeholder
      destination: {
        address: destination,
        latitude: 28.7041,
        longitude: 77.1025,
      }, // Placeholder
      departureTime: new Date(departureTime).toISOString(),
      availableSeats: parseInt(availableSeats, 10),
      vehicleDetails,
      fare: parseFloat(fare),
    };

    try {
      const result = await apiService.createCarpoolRoute(payload);
      if (result.success) {
        // ++ USE THE POPULATED ROUTE FROM THE API RESPONSE ++
        onRouteCreated(result.data.route);
        onClose();
      } else {
        setFormError(result.message || "An unexpected error occurred.");
      }
    } catch (err: any) {
      setFormError(err.message || "Failed to connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-lg p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-white mb-6">
              Post a New Route
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  placeholder="Origin Address"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full bg-gray-800 text-white rounded-md px-3 py-2 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <ArrowRight className="text-blue-400" />
                <input
                  type="text"
                  placeholder="Destination Address"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-gray-800 text-white rounded-md px-3 py-2 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">
                  Departure Time
                </label>
                <input
                  type="datetime-local"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="w-full bg-gray-800 text-white rounded-md px-3 py-2 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">
                    Available Seats
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={availableSeats}
                    onChange={(e) => setAvailableSeats(e.target.value)}
                    className="w-full bg-gray-800 text-white rounded-md px-3 py-2 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">
                    Fare (per person, optional)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={fare}
                    onChange={(e) => setFare(e.target.value)}
                    className="w-full bg-gray-800 text-white rounded-md px-3 py-2 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">
                  Vehicle Details (e.g., White Swift Dzire, optional)
                </label>
                <input
                  type="text"
                  placeholder="Car model, color, etc."
                  value={vehicleDetails}
                  onChange={(e) => setVehicleDetails(e.target.value)}
                  className="w-full bg-gray-800 text-white rounded-md px-3 py-2 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              {formError && (
                <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-md text-sm">
                  {formError}
                </div>
              )}

              <div className="flex justify-end pt-4">
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <PlusCircle size={20} />
                  )}
                  <span>{isSubmitting ? "Posting..." : "Post Route"}</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

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

  // ++ THIS FUNCTION IS NOW MUCH FASTER ++
  // It adds the new route to the state directly without a full refresh.
  const handleRouteCreated = (newRoute: CarpoolRoute) => {
    setRoutes((prevRoutes) => [newRoute, ...prevRoutes]);
  };

  const handleYatraClick = async (routeId: string) => {
    try {
      const result = await apiService.requestToJoinCarpool(routeId);
      if (result.success) {
        alert("Request sent successfully!");
        setRoutes(
          routes.map((route) => {
            if (route._id === routeId && user) {
              return {
                ...route,
                yatraRequests: [
                  ...route.yatraRequests,
                  {
                    _id: user._id,
                    fullName: user.fullName,
                    profilePicture: user.profilePicture,
                  },
                ],
              };
            }
            return route;
          })
        );
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const hasRequested = (route: CarpoolRoute) => {
    if (!user) return false;
    return (
      route.yatraRequests.some((req) => req._id === user._id) ||
      route.passengers.some((p) => p._id === user._id)
    );
  };

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
            <p className="mt-2 text-gray-500">
              Be the first to post a route and get your journey started!
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route) => (
            <motion.div
              key={route._id}
              layout // Add layout prop for smooth animation when list changes
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
                      <span className="font-semibold text-gray-400">From:</span>{" "}
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
                    <Clock size={18} className="text-blue-400 flex-shrink-0" />
                    <p>{formatDateTime(route.departureTime)}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users
                      size={18}
                      className="text-purple-400 flex-shrink-0"
                    />
                    <p>
                      {route.availableSeats - route.passengers.length} seats
                      available
                    </p>
                  </div>
                </div>
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
                ) : hasRequested(route) ? (
                  <button
                    disabled
                    className="w-full bg-green-900/50 text-green-400 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 cursor-not-allowed"
                  >
                    <Send size={20} />
                    <span>Request Sent</span>
                  </button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleYatraClick(route._id)}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold px-4 py-2 rounded-lg shadow-lg flex items-center justify-center space-x-2"
                  >
                    <Car size={20} />
                    <span>Yatra</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <CreateRouteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRouteCreated={handleRouteCreated}
      />
    </div>
  );
};

export default CarpoolingPage;
