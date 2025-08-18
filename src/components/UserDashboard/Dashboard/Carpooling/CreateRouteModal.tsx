// src/components/Carpooling/CreateRouteModal.tsx

import { FormEvent, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, PlusCircle, Loader2 } from "lucide-react";
import {
  CarpoolRoute,
  NewCarpoolRouteData,
} from "../../../constants/constants";
import apiService from "../../../services/apiService";

interface CreateRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRouteCreated: (newRoute: CarpoolRoute) => void;
}

export const CreateRouteModal = ({
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
