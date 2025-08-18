import { useState, useEffect, useRef } from "react";
import {
  Bell,
  Search,
  RefreshCw,
  Info,
  AlertTriangle,
  CheckCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NotificationsResponse {
  notifications: Notification[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalNotifications: number;
    hasNext: boolean;
    hasPrev: boolean;
    limit: number;
  };
}

const API_BASE_URL = "http://localhost:80/api";

export default function UserNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<
    Notification[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const { toast } = useToast();

  // Fetch notifications
  const fetchNotifications = async (page = 1) => {
    try {
      setIsLoading(true);
      console.log(`Fetching notifications for page ${page}...`);

      const response = await fetch(
        `${API_BASE_URL}/notifications?page=${page}&limit=10`
      );
      const result = await response.json();

      console.log("API Response:", result);

      if (result.success && result.data) {
        setNotifications(result.data.notifications || []);
        setTotalPages(result.data.pagination.totalPages);
        setHasNextPage(result.data.pagination.hasNext);
        setHasPrevPage(result.data.pagination.hasPrev);
        setTotalNotifications(result.data.pagination.totalNotifications);
        console.log(`Loaded ${result.data.notifications.length} notifications`);
      } else {
        console.warn("No data in response:", result);
        toast({
          title: "Info",
          description: result.message || "No notifications found",
        });
      }
    } catch (error) {
      console.error("Fetch notifications error:", error);
      toast({
        title: "Error",
        description: "Failed to fetch notifications",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(currentPage);
  }, [currentPage]);

  // Filter notifications based on search
  useEffect(() => {
    let filtered = notifications;

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (notification) =>
          notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          notification.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredNotifications(filtered);
  }, [notifications, searchTerm]);

  // Refresh notifications
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchNotifications(currentPage);
      toast({
        title: "Success",
        description: "Notifications refreshed successfully",
      });
    } catch (error) {
      console.error("Refresh error:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Get notification icon
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case "error":
        return <X className="h-6 w-6 text-red-500" />;
      default:
        return <Info className="h-6 w-6 text-blue-500" />;
    }
  };

  // Get notification badge variant
  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "error":
        return "destructive";
      case "warning":
        return "secondary";
      case "success":
        return "default";
      default:
        return "outline";
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${Math.max(1, diffInMinutes)} min${
        diffInMinutes !== 1 ? "s" : ""
      } ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else if (diffInHours < 168) {
      const days = Math.floor(diffInHours / 24);
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
  };

  // Loading state
  if (isLoading && notifications.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading notifications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Notifications
            </h1>
            <p className="text-gray-400">
              {totalNotifications > 0
                ? `${totalNotifications} notification${
                    totalNotifications > 1 ? "s" : ""
                  } available`
                : "No notifications available"}
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
            />
          </div>
          {searchTerm && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearSearch}
              className="px-3 h-10 border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card className="bg-gray-800 border-gray-700 text-center py-12">
              <CardContent>
                <Bell className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-2">
                  {notifications.length === 0
                    ? "No notifications available"
                    : "No notifications match your search"}
                </p>
                <p className="text-gray-500 text-sm">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "Check back later for new notifications"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card
                key={notification._id}
                className="bg-gray-800 border-gray-700 transition-all duration-300 hover:shadow-lg hover:bg-gray-750"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <CardTitle className="text-lg text-white">
                          {notification.title}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant={getBadgeVariant(notification.type)}>
                            {notification.type}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {formatDate(notification.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {notification.message}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8">
            <div className="text-sm text-gray-400">
              Page {currentPage} of {totalPages} • Showing{" "}
              {filteredNotifications.length} of {totalNotifications}{" "}
              notifications
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={!hasPrevPage || isLoading}
                className="border-gray-600 text-gray-300 hover:bg-gray-800 disabled:opacity-50"
              >
                Previous
              </Button>

              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                if (pageNum < 1 || pageNum > totalPages) return null;

                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    disabled={isLoading}
                    className={
                      pageNum === currentPage
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "border-gray-600 text-gray-300 hover:bg-gray-800"
                    }
                  >
                    {pageNum}
                  </Button>
                );
              })}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={!hasNextPage || isLoading}
                className="border-gray-600 text-gray-300 hover:bg-gray-800 disabled:opacity-50"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
