import { useState, useEffect } from "react";
import { MapPin, Loader2, AlertCircle, CheckCircle, X } from "lucide-react";

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: string;
  lastUpdated?: string;
}

interface LocationTrackerProps {
  onLocationUpdate: (location: LocationData) => void;
  onLocationError: (error: string) => void;
  onClose: () => void;
  isRequired?: boolean;
  autoShow?: boolean;
}

const LocationTracker = ({
  onLocationUpdate,
  onLocationError,
  onClose,
  isRequired = true,
  autoShow = false,
}: LocationTrackerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(
    null
  );
  const [permissionStatus, setPermissionStatus] = useState<
    "prompt" | "granted" | "denied" | "unsupported"
  >("prompt");
  const [watchId, setWatchId] = useState<number | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Check if geolocation is supported
  useEffect(() => {
    if (!navigator.geolocation) {
      setPermissionStatus("unsupported");
      onLocationError("Geolocation is not supported by this browser");
    }
  }, [onLocationError]);

  // Clean up watch position on unmount
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  // Auto-get location if autoShow is true
  useEffect(() => {
    if (autoShow && navigator.geolocation && permissionStatus === "prompt") {
      getCurrentLocation();
    }
  }, [autoShow, permissionStatus]);

  // Get reverse geocoding address using OpenStreetMap Nominatim
  const getReverseGeocode = async (
    lat: number,
    lng: number
  ): Promise<string> => {
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

  // Save location to backend
  const saveLocationToBackend = async (locationData: LocationData) => {
    try {
      setSaveError(null);
      const token = localStorage.getItem("happyatra_token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("http://localhost:80/api/user/location", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          accuracy: locationData.accuracy,
          address: locationData.address,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save location");
      }

      const result = await response.json();
      console.log("Location saved successfully:", result);

      // Update user data in localStorage
      const userData = localStorage.getItem("happyatra_user");
      if (userData) {
        const user = JSON.parse(userData);
        user.location = result.data.location;
        localStorage.setItem("happyatra_user", JSON.stringify(user));
      }

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

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        try {
          const address = await getReverseGeocode(latitude, longitude);
          const locationData: LocationData = {
            latitude,
            longitude,
            accuracy,
            address,
            lastUpdated: new Date().toISOString(),
          };

          setCurrentLocation(locationData);
          setLocationStatus("success");
          setPermissionStatus("granted");

          // Save to backend
          try {
            await saveLocationToBackend(locationData);
            onLocationUpdate(locationData);
          } catch (saveError) {
            // Still update UI even if backend save fails
            onLocationUpdate(locationData);
          }
        } catch (error) {
          console.error("Location processing error:", error);
          const locationData: LocationData = {
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
            errorMessage = "An unknown error occurred while getting location.";
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

  // Calculate distance between two coordinates (in km)
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Watch position for continuous tracking
  const startWatchingLocation = async () => {
    if (!navigator.geolocation || !currentLocation) return;

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000,
    };

    const id = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        if (currentLocation) {
          const distance = calculateDistance(
            currentLocation.latitude,
            currentLocation.longitude,
            latitude,
            longitude
          );

          // Only update if moved more than 50 meters
          if (distance > 0.05) {
            const address = await getReverseGeocode(latitude, longitude);
            const locationData: LocationData = {
              latitude,
              longitude,
              accuracy,
              address,
              lastUpdated: new Date().toISOString(),
            };

            setCurrentLocation(locationData);

            try {
              await saveLocationToBackend(locationData);
              onLocationUpdate(locationData);
            } catch (error) {
              console.error("Failed to save location update:", error);
              onLocationUpdate(locationData);
            }
          }
        }
      },
      (error) => {
        console.warn("Watch position error:", error);
      },
      options
    );

    setWatchId(id);
  };

  const stopWatchingLocation = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
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
            Enable Location Services
          </h3>
          <p className="text-gray-600 text-sm">
            We need your location to provide personalized travel information and
            nearby services.
          </p>
          {isRequired && (
            <p className="text-sm text-orange-600 mt-2 font-medium">
              * Location access is required to proceed
            </p>
          )}
        </div>

        {locationStatus === "idle" && (
          <button
            onClick={getCurrentLocation}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg font-medium min-w-[200px] rounded-md disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Getting Location...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <MapPin className="w-5 h-5 mr-2" />
                Allow Location Access
              </div>
            )}
          </button>
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
              {!watchId ? (
                <button
                  onClick={startWatchingLocation}
                  className="border border-green-500 text-green-600 hover:bg-green-50 px-4 py-2 rounded-md text-sm"
                >
                  Enable Live Tracking
                </button>
              ) : (
                <button
                  onClick={stopWatchingLocation}
                  className="border border-orange-500 text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-md text-sm"
                >
                  Stop Live Tracking
                </button>
              )}
              <button
                onClick={retryLocation}
                className="border border-blue-500 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md text-sm"
              >
                Update Location
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
            <button
              onClick={retryLocation}
              className="bg-red-500 hover:bg-red-600 text-white min-w-[150px] px-4 py-2 rounded-md"
            >
              Try Again
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 max-w-xs">
            🔒 Your location data is encrypted and secure. We use it only to
            enhance your travel experience and provide relevant nearby services.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LocationTracker;
