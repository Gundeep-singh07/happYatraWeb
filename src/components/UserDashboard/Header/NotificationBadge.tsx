import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { notificationService } from "../../../services/notificationService";

interface NotificationBadgeProps {
  className?: string;
  onClick?: () => void;
}

export default function NotificationBadge({
  className = "",
  onClick,
}: NotificationBadgeProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        if (!notificationService.isAuthenticated()) {
          setIsLoading(false);
          return;
        }

        const response = await notificationService.getUnreadCount();
        if (response.success && response.data) {
          setUnreadCount(response.data.unreadCount);
        }
      } catch (error) {
        console.error("Failed to fetch unread count:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUnreadCount();

    // Refresh unread count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default behavior: navigate to notifications page
      window.location.href = "/notifications";
    }
  };

  if (!notificationService.isAuthenticated()) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={`relative p-2 hover:bg-gray-800/50 transition-colors duration-200 ${className}`}
      disabled={isLoading}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="relative"
      >
        <Bell className={`h-5 w-5 ${unreadCount > 0 ? 'text-blue-400' : 'text-gray-300'}`} />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 
              text-xs rounded-full bg-red-500 text-white border-2 border-gray-900"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
        <span className="sr-only">
          {unreadCount > 0
            ? `${unreadCount} unread notifications`
            : "Notifications"}
        </span>
      </motion.div>
    </Button>
  );
}
