import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bus,
  UserCog,
  Clock,
  Loader2,
  AlertTriangle,
  Search,
} from "lucide-react";
import Header from "../../Header/Header";
import apiService from "../../../../services/apiService";

const TripPlannerPage = () => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [tripPlan, setTripPlan] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = apiService.getCurrentUser();

  const handlePlanTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!start || !end) {
      setError("Please enter both a starting and ending location.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setTripPlan(null);

    try {
      const result = await apiService.planTrip(start, end);
      if (result.success) {
        setTripPlan(result.data);
      } else {
        setError(result.message || "Failed to find a route.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = (type: string) => {
    if (type.toLowerCase().includes("bus"))
      return <Bus className="h-6 w-6 text-blue-400 flex-shrink-0" />;
    return <Walking className="h-6 w-6 text-green-400 flex-shrink-0" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <Header user={user} />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-center mb-2">
            Plan Your Trip
          </h1>
          <p className="text-center text-gray-400 mb-8">
            Find the best public transport route to your destination.
          </p>

          <form
            onSubmit={handlePlanTrip}
            className="flex flex-col md:flex-row items-center gap-4 mb-8"
          >
            <input
              type="text"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              placeholder="Enter starting location"
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <ArrowRight className="text-gray-500 hidden md:block" />
            <input
              type="text"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              placeholder="Enter destination"
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md flex items-center justify-center disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
              <span className="ml-2">Find Route</span>
            </button>
          </form>
        </motion.div>

        <div className="mt-8">
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-md flex items-center">
              <AlertTriangle className="mr-3" /> {error}
            </div>
          )}
          {tripPlan && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold">Your Itinerary</h2>
              {tripPlan.map((segment, index) => (
                <div
                  key={index}
                  className="bg-gray-800/70 p-4 rounded-lg border border-gray-700 flex gap-4"
                >
                  {getIcon(segment.routeName || "walk")}
                  <div>
                    <p className="font-bold text-lg">
                      {segment.routeName || "Walk"}
                    </p>
                    <ul className="list-disc list-inside text-gray-300 mt-1">
                      {segment.instructions.map((inst, i) => (
                        <li key={i}>{inst}</li>
                      ))}
                    </ul>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mt-2">
                      <span className="flex items-center">
                        <Clock size={14} className="mr-1.5" />~
                        {Math.round(segment.duration / 60)} min
                      </span>
                      <span>{(segment.distance / 1000).toFixed(1)} km</span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TripPlannerPage;
