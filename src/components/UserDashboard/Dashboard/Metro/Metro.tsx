// src/components/Metro/Metro.tsx

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Train,
  MapPin,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import Header from "../../Header/Header";
import apiService from "../../../../services/apiService";
import metroService from "../../../../services/metroService";

// Define the type for a single station
interface MetroStation {
  _id: string;
  metro_station_name: string;
  metro_line: string;
  distance_from_first: number;
  layout: string;
  opened_year: string;
  latitude: number;
  longitude: number;
}

const Metro = () => {
  const [user, setUser] = useState<any>(null);
  const [stations, setStations] = useState<MetroStation[]>([]);
  const [lines, setLines] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for filtering and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLine, setSelectedLine] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const currentUser = apiService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    } else {
      // Redirect if not authenticated
      window.location.href = "/auth";
    }
  }, []);

  // Fetch metro lines on component mount
  useEffect(() => {
    const fetchLines = async () => {
      try {
        const result = await metroService.getLines();
        if (result.success && result.data) {
          setLines(result.data);
        }
      } catch (err) {
        console.error("Failed to fetch metro lines:", err);
      }
    };
    fetchLines();
  }, []);

  // Fetch stations when filters or page changes
  useEffect(() => {
    const fetchStations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = {
          page: currentPage,
          limit: 15,
          search: searchTerm,
          line: selectedLine,
        };
        const result = await metroService.getStations(params);
        if (result.success && result.data) {
          setStations(result.data.stations);
          setTotalPages(result.data.totalPages);
        } else {
          setError(result.message || "Failed to fetch station data.");
        }
      } catch (err: any) {
        setError(err.message || "Could not connect to the server.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStations();
  }, [searchTerm, selectedLine, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedLine("");
    setCurrentPage(1);
  };

  const hasActiveFilters = useMemo(
    () => searchTerm || selectedLine,
    [searchTerm, selectedLine]
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white"
    >
      <Header user={user} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Delhi Metro Stations
          </h1>
          <p className="text-gray-400 text-lg">
            Search, filter, and explore the metro network.
          </p>
        </motion.div>

        {/* Filters Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-4 mb-8 flex flex-col md:flex-row gap-4 items-center"
        >
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by station name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset page on new search
              }}
              className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="relative w-full md:w-auto">
            <Train className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={selectedLine}
              onChange={(e) => {
                setSelectedLine(e.target.value);
                setCurrentPage(1); // Reset page on filter change
              }}
              className="w-full appearance-none bg-black/40 border border-white/10 rounded-lg pl-10 pr-8 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">All Lines</option>
              {lines.map((line) => (
                <option key={line} value={line}>
                  {line}
                </option>
              ))}
            </select>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          )}
        </motion.div>

        {/* Content Area */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg p-6 text-center">
            <AlertCircle className="h-10 w-10 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">An Error Occurred</h3>
            <p>{error}</p>
          </div>
        ) : stations.length > 0 ? (
          <>
            <div className="overflow-x-auto bg-black/20 backdrop-blur-sm rounded-xl border border-white/10">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-black/40">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Station Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Line
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden md:table-cell">
                      Layout
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                      Opened
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Map
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {stations.map((station, index) => (
                    <motion.tr
                      key={station._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-800/50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {station.metro_station_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {station.metro_line}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 hidden md:table-cell">
                        {station.layout}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 hidden sm:table-cell">
                        {station.opened_year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${station.latitude},${station.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                        >
                          <MapPin className="h-4 w-4" /> View
                        </a>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>
              <span className="text-sm text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6 text-center">
            <Search className="h-10 w-10 mx-auto mb-4 text-gray-500" />
            <h3 className="text-xl font-semibold mb-2">No Stations Found</h3>
            <p className="text-gray-400">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </main>
    </motion.div>
  );
};

export default Metro;
