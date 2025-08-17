import { motion } from "framer-motion";
import { Clock } from "lucide-react";

export const RecentActivity = () => {
  const activities = [
    {
      type: "Trip Completed",
      route: "Home → Office",
      time: "2 hours ago",
      distance: "12.5 km",
    },
    {
      type: "Route Planned",
      route: "Office → Mall",
      time: "5 hours ago",
      distance: "8.2 km",
    },
    // Add more activities as needed
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6"
    >
      <h3 className="text-xl font-semibold text-white mb-6">Recent Activity</h3>
      <div className="space-y-4 h-[calc(100%-3rem)] overflow-auto">
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{activity.type}</p>
                <p className="text-sm text-gray-400">{activity.route}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">{activity.distance}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {activity.time}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};