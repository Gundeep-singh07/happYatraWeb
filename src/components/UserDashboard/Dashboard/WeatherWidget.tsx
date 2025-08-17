import { motion } from "framer-motion";
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  Compass 
} from "lucide-react";

export const WeatherWidget = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 h-full"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Sun className="h-12 w-12 text-yellow-500" />
            <div>
              <h3 className="text-3xl font-medium text-white">28°C</h3>
              <p className="text-sm text-gray-400">Clear Sky</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Mumbai, India</p>
            <p className="text-xs text-gray-500">Updated 5 mins ago</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 flex-grow">
          <div className="bg-black/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Droplets className="h-5 w-5 text-blue-400" />
              <span className="text-gray-400 text-sm">Humidity</span>
            </div>
            <p className="text-white text-lg">65%</p>
          </div>

          <div className="bg-black/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Wind className="h-5 w-5 text-blue-400" />
              <span className="text-gray-400 text-sm">Wind Speed</span>
            </div>
            <p className="text-white text-lg">12 km/h</p>
          </div>

          <div className="bg-black/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CloudRain className="h-5 w-5 text-blue-400" />
              <span className="text-gray-400 text-sm">Precipitation</span>
            </div>
            <p className="text-white text-lg">15%</p>
          </div>

          <div className="bg-black/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Eye className="h-5 w-5 text-blue-400" />
              <span className="text-gray-400 text-sm">Visibility</span>
            </div>
            <p className="text-white text-lg">10 km</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};