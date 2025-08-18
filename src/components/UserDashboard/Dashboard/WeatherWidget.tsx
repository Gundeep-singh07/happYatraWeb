// src/components/Dashboard/WeatherWidget/WeatherWidget.tsx

import { motion } from "framer-motion";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  Zap,
  Wind,
  Droplets,
  Eye,
  Thermometer,
  MapPin,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useMemo } from "react";

// Helper to select the correct icon based on weather condition text from the API
const getWeatherIcon = (conditionText: string) => {
  const text = conditionText.toLowerCase();
  if (text.includes("sun") || text.includes("clear"))
    return <Sun className="h-12 w-12 text-yellow-400" />;
  if (text.includes("rain") || text.includes("drizzle"))
    return <CloudRain className="h-12 w-12 text-blue-400" />;
  if (text.includes("cloudy") || text.includes("overcast"))
    return <Cloud className="h-12 w-12 text-gray-400" />;
  if (text.includes("snow") || text.includes("sleet") || text.includes("ice"))
    return <CloudSnow className="h-12 w-12 text-white" />;
  if (text.includes("thunder"))
    return <Zap className="h-12 w-12 text-yellow-300" />;
  return <Cloud className="h-12 w-12 text-gray-400" />; // Default icon
};

// Define the expected props structure
interface WeatherWidgetProps {
  weatherData: any | null;
  isLoading: boolean;
  error: string | null;
}

export const WeatherWidget = ({
  weatherData,
  isLoading,
  error,
}: WeatherWidgetProps) => {
  // useMemo ensures this array is only recalculated when weatherData changes
  const details = useMemo(() => {
    if (!weatherData?.current) return [];
    return [
      {
        label: "Humidity",
        value: `${weatherData.current.humidity}%`,
        icon: Droplets,
      },
      {
        label: "Wind",
        value: `${weatherData.current.wind_kph} km/h`,
        icon: Wind,
      },
      {
        label: "Feels Like",
        value: `${weatherData.current.feelslike_c}°C`,
        icon: Thermometer,
      },
      {
        label: "Visibility",
        value: `${weatherData.current.vis_km} km`,
        icon: Eye,
      },
    ];
  }, [weatherData]);

  // Loading State UI
  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 h-full flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 text-white animate-spin mx-auto" />
          <p className="text-gray-400">Fetching local weather...</p>
        </div>
      </div>
    );
  }

  // Error State or No Location State UI
  if (error || !weatherData) {
    return (
      <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 h-full flex items-center justify-center text-center">
        <div className="space-y-3">
          <AlertCircle className="h-8 w-8 text-red-400 mx-auto" />
          <p className="text-red-300 text-sm font-medium">
            Weather Unavailable
          </p>
          <p className="text-gray-400 text-xs px-4">
            {error
              ? error
              : "Please enable or update your location to view weather information."}
          </p>
        </div>
      </div>
    );
  }

  // Success State UI
  const { location, current } = weatherData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 h-full"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {getWeatherIcon(current.condition.text)}
            <div>
              <h3 className="text-3xl font-medium text-white">
                {Math.round(current.temp_c)}°C
              </h3>
              <p className="text-sm text-gray-400">{current.condition.text}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400 flex items-center justify-end gap-1">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{location.name}</span>
            </p>
            <p className="text-xs text-gray-500">
              Updated{" "}
              {new Date(location.localtime_epoch * 1000).toLocaleTimeString(
                [],
                { hour: "2-digit", minute: "2-digit" }
              )}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 flex-grow">
          {details.map((item) => (
            <div key={item.label} className="bg-black/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <item.icon className="h-5 w-5 text-blue-400" />
                <span className="text-gray-400 text-sm">{item.label}</span>
              </div>
              <p className="text-white text-lg">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherWidget;
