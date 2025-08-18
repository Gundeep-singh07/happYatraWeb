// src/components/Dashboard/BusTracker/NearbyStopsWidget.tsx

import { useState, useEffect, useRef } from "react";
import { MapPin, Loader2, AlertTriangle, Bus } from "lucide-react";
import apiService from "../../../../services/apiService";

// This component no longer needs props for location
const NearbyStopsWidget = () => {
  const [stops, setStops] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNearbyStops = async () => {
      setIsLoading(true);
      setError(null);

      // *** THIS IS THE FIX ***
      // Instead of relying on props, we get the most recent user data directly.
      // This solves the problem of the parent component having stale data.
      const currentUser = apiService.getCurrentUser();
      const userLocation = currentUser?.location;

      if (!userLocation?.latitude || !userLocation?.longitude) {
        // We don't set an error, we just indicate that location is missing.
        setIsLoading(false);
        return;
      }

      try {
        const result = await apiService.getNearbyStops(
          userLocation.latitude,
          userLocation.longitude
        );
        if (result.success) {
          setStops(result.data);
        } else {
          setError(result.message || "Failed to fetch nearby stops.");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNearbyStops();

    // Optional: Add an interval to re-check if the location gets updated in storage
    const interval = setInterval(fetchNearbyStops, 15000); // Re-check every 15 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []); // The dependency array is now empty, it runs once on mount and then relies on the interval

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Finding stops near you...
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex items-center text-red-400">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      );
    }
    const currentUser = apiService.getCurrentUser();
    if (!currentUser?.location?.latitude) {
      return (
        <div className="text-sm text-gray-400 text-center">
          Enable location to see nearby stops.
        </div>
      );
    }
    if (stops.length === 0) {
      return (
        <div className="text-sm text-gray-400 text-center">
          No stops found within 2km of your location.
        </div>
      );
    }
    return (
      <div className="space-y-3 max-h-[200px] overflow-y-auto">
        {stops.map((stop) => (
          <div key={stop._id} className="bg-gray-700/50 p-3 rounded-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-white">{stop.name}</p>
                <p className="text-xs text-gray-400 flex items-center">
                  <Bus size={12} className="mr-1.5" />
                  {stop.routeName}
                </p>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <p className="text-lg font-semibold text-blue-300">
                  {stop.walkingTime}
                  <span className="text-xs font-normal"> min</span>
                </p>
                <p className="text-xs text-gray-400 flex items-center justify-end">
                  <Walk size={12} className="mr-1" />
                  walk
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700 flex-shrink-0">
      <h2 className="text-lg font-semibold text-white mb-3 flex items-center">
        <MapPin className="h-5 w-5 mr-2 text-blue-400" />
        Nearby Bus Stops
      </h2>
      {renderContent()}
    </div>
  );
};

export default NearbyStopsWidget;
