// src/components/Dashboard/BusTracker/BusTrackerPage.tsx
import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import { motion } from "framer-motion";
import {
  Bus,
  AlertTriangle,
  CheckCircle,
  Users,
  Loader2,
  Map as MapIcon,
  Clock,
  Search,
  ArrowRight,
  UserCog,
  Route,
} from "lucide-react";
import apiService from "../../../../services/apiService";
import Header from "../../Header/Header";
import NearbyStopsWidget from "./NearbyStopsWidget";

// Custom Icons for the map (as before)
const busIcon = (status: string) =>
  new L.Icon({
    iconUrl:
      status === "At Risk"
        ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png"
        : "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    shadowSize: [41, 41],
  });
const stopIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const BusTrackerPage = () => {
  const [activeTab, setActiveTab] = useState("planner"); // 'planner' or 'monitor'

  // State for Monitor
  const [monitorRoutes, setMonitorRoutes] = useState<any[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<any | null>(null);
  const [isMonitorLoading, setIsMonitorLoading] = useState(true);

  // State for Planner
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [tripPlan, setTripPlan] = useState<any[] | null>(null);
  const [isPlanning, setIsPlanning] = useState(false);

  // Shared State
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = apiService.getCurrentUser();
    setUser(currentUser);
    fetchMonitorData();
  }, []);

  const fetchMonitorData = async () => {
    try {
      setIsMonitorLoading(true);
      const result = await apiService.getBusSystemData();
      if (result.success && result.data) {
        setMonitorRoutes(result.data);
        if (result.data.length > 0) {
          setSelectedRoute(
            (prev) =>
              result.data.find((r) => r._id === prev?._id) || result.data[0]
          );
        }
      }
    } catch (err) {
      console.error("Failed to fetch monitor data:", err);
    } finally {
      setIsMonitorLoading(false);
    }
  };

  const handlePlanTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!start || !end) {
      setError("Please provide both start and end locations.");
      return;
    }
    setIsPlanning(true);
    setError(null);
    setTripPlan(null);
    try {
      const result = await apiService.planTrip(start, end);
      if (result.success) setTripPlan(result.data);
      else setError(result.message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsPlanning(false);
    }
  };

  const getItineraryIcon = (type: string) => {
    if (type?.toLowerCase().includes("bus"))
      return <Bus className="h-6 w-6 text-blue-400 flex-shrink-0" />;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Header user={user} />
      <div className="flex-grow flex flex-col lg:flex-row h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <aside className="w-full lg:w-[450px] bg-gray-900/50 border-r border-gray-800 p-4 overflow-y-auto flex flex-col">
          <h1 className="text-2xl font-bold mb-4 flex-shrink-0">
            Bus Services
          </h1>

          <NearbyStopsWidget userLocation={user?.location} />

          {/* Tab Controls */}
          <div className="flex bg-gray-800 rounded-lg p-1 mb-4">
            <button
              onClick={() => setActiveTab("planner")}
              className={`w-1/2 py-2 rounded-md text-sm font-semibold transition ${
                activeTab === "planner"
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              <Search className="inline h-4 w-4 mr-2" />
              Plan a Trip
            </button>
            <button
              onClick={() => setActiveTab("monitor")}
              className={`w-1/2 py-2 rounded-md text-sm font-semibold transition ${
                activeTab === "monitor"
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              <Route className="inline h-4 w-4 mr-2" />
              Live Route Monitor
            </button>
          </div>

          {/* Planner Tab Content */}
          {activeTab === "planner" && (
            <div className="flex-grow flex flex-col">
              <form onSubmit={handlePlanTrip} className="space-y-3 mb-4">
                <input
                  type="text"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  placeholder="Enter starting location"
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white placeholder-gray-500"
                />
                <input
                  type="text"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  placeholder="Enter destination"
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white placeholder-gray-500"
                />
                <button
                  type="submit"
                  disabled={isPlanning}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center disabled:opacity-50"
                >
                  {isPlanning ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    "Find Route"
                  )}
                </button>
              </form>
              <div className="flex-grow overflow-y-auto">
                {error && (
                  <div className="bg-red-900/50 text-red-300 p-3 rounded-md text-sm">
                    <AlertTriangle className="inline h-4 w-4 mr-2" />
                    {error}
                  </div>
                )}
                {tripPlan && (
                  <div className="space-y-3 mt-4">
                    <h3 className="text-lg font-bold">Your Itinerary</h3>
                    {tripPlan.map((segment, index) => (
                      <div
                        key={index}
                        className="bg-gray-800 p-3 rounded-lg flex gap-3"
                      >
                        {getItineraryIcon(segment.routeName)}
                        <div>
                          <p className="font-bold">
                            {segment.routeName || "Walk"}
                          </p>
                          <p className="text-sm text-gray-300">
                            {segment.instructions.join(" ")}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                            <span>
                              <Clock size={12} className="inline mr-1" />~
                              {Math.round(segment.duration / 60)} min
                            </span>
                            <span>
                              {(segment.distance / 1000).toFixed(1)} km
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Monitor Tab Content */}
          {activeTab === "monitor" &&
            (isMonitorLoading ? (
              <div className="flex-grow flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="flex-grow flex flex-col">
                <div className="space-y-2 mb-4">
                  {monitorRoutes.map((route) => (
                    <button
                      key={route._id}
                      onClick={() => setSelectedRoute(route)}
                      className={`w-full text-left p-3 rounded-md transition ${
                        selectedRoute?._id === route._id
                          ? "bg-blue-500/30 ring-1 ring-blue-400"
                          : "bg-gray-800 hover:bg-gray-700"
                      }`}
                    >
                      <p className="font-semibold">{route.routeName}</p>
                      <p className="text-sm text-gray-400">
                        {route.buses.length} Buses Active
                      </p>
                    </button>
                  ))}
                </div>
                {selectedRoute && (
                  <div className="flex-grow overflow-y-auto">
                    <h3 className="text-lg font-bold mb-2">
                      Live Status: {selectedRoute.routeName}
                    </h3>
                    <div className="space-y-3">
                      {selectedRoute.buses.map((bus) => (
                        <motion.div
                          key={bus.busNumber}
                          className="bg-gray-800/80 p-3 rounded-lg border border-gray-700"
                        >
                          <div className="flex items-center justify-between">
                            <p className="font-bold">{bus.busNumber}</p>
                            <div className="flex items-center">
                              <Users size={14} className="mr-1" />
                              {bus.passengerCount}
                            </div>
                          </div>
                          <div
                            className={`text-sm flex items-center ${
                              bus.status === "At Risk"
                                ? "text-yellow-400"
                                : "text-green-400"
                            }`}
                          >
                            {bus.status === "At Risk" ? (
                              <AlertTriangle size={14} className="mr-1" />
                            ) : (
                              <CheckCircle size={14} className="mr-1" />
                            )}
                            {bus.status}
                          </div>
                          {bus.recommendation && (
                            <div className="mt-2 p-2 bg-yellow-900/50 text-yellow-300 text-xs font-medium rounded">
                              AI Rec: {bus.recommendation}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
        </aside>

        {/* Map View */}
        <section className="flex-grow bg-gray-800">
          {activeTab === "monitor" && selectedRoute ? (
            <MapContainer
              center={[
                selectedRoute.stops[0].location.coordinates[1],
                selectedRoute.stops[0].location.coordinates[0],
              ]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
              className="z-0"
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution="&copy; CARTO"
              />
              <Polyline
                positions={selectedRoute.stops.map((s) => [
                  s.location.coordinates[1],
                  s.location.coordinates[0],
                ])}
                color="#555"
                weight={2}
                dashArray="5, 10"
              />
              {selectedRoute.stops.map((stop) => (
                <Marker
                  key={stop._id}
                  position={[
                    stop.location.coordinates[1],
                    stop.location.coordinates[0],
                  ]}
                  icon={stopIcon}
                >
                  <Popup>{stop.name}</Popup>
                </Marker>
              ))}
              {selectedRoute.buses.map((bus) => (
                <Marker
                  key={bus.busNumber}
                  position={[
                    bus.currentLocation.coordinates[1],
                    bus.currentLocation.coordinates[0],
                  ]}
                  icon={busIcon(bus.status)}
                >
                  <Popup>
                    <b>{bus.busNumber}</b>
                    <br />
                    Status: {bus.status}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center text-gray-500 p-8 text-center">
              <MapIcon className="h-16 w-16 mb-4" />
              <h2 className="text-xl font-semibold">Map Area</h2>
              <p>
                Your trip plan or live route tracking will be displayed here.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default BusTrackerPage;
