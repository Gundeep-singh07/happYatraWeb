// services/notificationService.js
import {
  API_ENDPOINTS,
  ApiResponse,
  UserNotification,
  NotificationsResponse,
  NotificationFilters,
  STORAGE_KEYS,
} from "../constants/constants";

class NotificationService {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    let data;
    try {
      const text = await response.text();
      data = text ? JSON.parse(text) : {};
    } catch (error) {
      console.error("Failed to parse response:", error);
      console.error(
        "Response text:",
        await response.text().catch(() => "Could not read response")
      );
      throw new Error("Invalid response from server");
    }

    if (!response.ok) {
      console.error("API Error:", {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        data,
      });

      // Handle specific error cases
      if (response.status === 401) {
        // Clear invalid token
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        throw new Error("Authentication failed. Please login again.");
      }

      throw new Error(
        data.message || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return data;
  }

  // Get active notifications for users
  async getActiveNotifications(
    filters: NotificationFilters = {}
  ): Promise<ApiResponse<NotificationsResponse>> {
    try {
      console.log("=== NotificationService: getActiveNotifications ===");
      console.log("Filters:", filters);

      const queryParams = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          value !== "" &&
          value !== "all"
        ) {
          queryParams.append(key, value.toString());
        }
      });

      const url = `${API_ENDPOINTS.NOTIFICATIONS.LIST}${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      console.log("API URL:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      const result = await this.handleResponse<NotificationsResponse>(response);
      console.log("API Response:", result);

      return result;
    } catch (error) {
      console.error("Get active notifications error:", error);
      throw error;
    }
  }

  // Get notification types with icons and labels
  async getNotificationTypes(): Promise<
    ApiResponse<Array<{ value: string; label: string; icon: string }>>
  > {
    try {
      console.log("=== NotificationService: getNotificationTypes ===");

      const response = await fetch(API_ENDPOINTS.NOTIFICATIONS.TYPES, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error("Get notification types error:", error);
      throw error;
    }
  }

  // Mark notification as read
  async markNotificationAsRead(
    notificationId: string
  ): Promise<ApiResponse<void>> {
    try {
      console.log("=== NotificationService: markNotificationAsRead ===");
      console.log("Notification ID:", notificationId);

      const response = await fetch(
        API_ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId),
        {
          method: "POST",
          headers: this.getAuthHeaders(),
          body: JSON.stringify({}),
        }
      );

      return this.handleResponse<void>(response);
    } catch (error) {
      console.error("Mark notification as read error:", error);
      throw error;
    }
  }

  // Get unread notification count
  async getUnreadCount(): Promise<ApiResponse<{ unreadCount: number }>> {
    try {
      console.log("=== NotificationService: getUnreadCount ===");

      const response = await fetch(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      return this.handleResponse<{ unreadCount: number }>(response);
    } catch (error) {
      console.error("Get unread count error:", error);
      throw error;
    }
  }

  // Get nearby notifications
  async getNearbyNotifications(
    latitude: number,
    longitude: number,
    radius: number = 50
  ): Promise<
    ApiResponse<{ notifications: UserNotification[]; count: number }>
  > {
    try {
      console.log("=== NotificationService: getNearbyNotifications ===");
      console.log("Location:", { latitude, longitude, radius });

      const queryParams = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        radius: radius.toString(),
      });

      const response = await fetch(
        `${API_ENDPOINTS.NOTIFICATIONS.NEARBY}?${queryParams.toString()}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );

      return this.handleResponse(response);
    } catch (error) {
      console.error("Get nearby notifications error:", error);
      throw error;
    }
  }

  // Get user's current location (for location-based notifications)
  async getCurrentLocation(): Promise<{
    latitude: number;
    longitude: number;
  }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      console.log("=== NotificationService: getCurrentLocation ===");

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          console.log("Current location:", location);
          resolve(location);
        },
        (error) => {
          console.error("Geolocation error:", error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }

  // Get location-based notifications
  async getLocationBasedNotifications(
    radius: number = 50
  ): Promise<ApiResponse<NotificationsResponse>> {
    try {
      console.log("=== NotificationService: getLocationBasedNotifications ===");

      const location = await this.getCurrentLocation();
      return this.getActiveNotifications({
        latitude: location.latitude,
        longitude: location.longitude,
        radius,
      });
    } catch (error) {
      console.error("Get location-based notifications error:", error);
      // Fall back to getting all notifications without location filter
      console.log("Falling back to all notifications without location filter");
      return this.getActiveNotifications();
    }
  }

  // Debug method to get all notifications
  async getAllNotificationsDebug(): Promise<ApiResponse<any>> {
    try {
      console.log("=== NotificationService: getAllNotificationsDebug ===");

      const response = await fetch(API_ENDPOINTS.NOTIFICATIONS.DEBUG_ALL, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error("Get debug notifications error:", error);
      throw error;
    }
  }

  // Utility method to check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const user = localStorage.getItem(STORAGE_KEYS.USER);

    console.log("=== NotificationService: isAuthenticated ===");
    console.log("Has token:", !!token);
    console.log("Has user:", !!user);

    return !!(token && user);
  }

  // Utility method to format notification date
  formatNotificationDate(dateString: string): string {
    try {
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
        // 7 days
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
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  }

  // Check if notification is unread by current user
  isNotificationUnread(notification: UserNotification): boolean {
    const currentUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (!currentUser) return true;

    try {
      const user = JSON.parse(currentUser);
      const userId = user._id || user.id;

      if (!userId) {
        console.warn("No user ID found in stored user data");
        return true;
      }

      const isRead = notification.readBy.some(
        (read) => read.user === userId || read.user === userId.toString()
      );

      return !isRead;
    } catch (error) {
      console.error("Error checking read status:", error);
      return true;
    }
  }

  // Calculate distance between two coordinates
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  // Format distance string
  formatDistance(distance: number): string {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m away`;
    } else {
      return `${distance}km away`;
    }
  }

  // Refresh notifications and update cache
  async refreshNotifications(): Promise<ApiResponse<NotificationsResponse>> {
    try {
      console.log("=== NotificationService: refreshNotifications ===");

      // Get fresh data
      const result = await this.getActiveNotifications();

      // You could add caching logic here if needed

      return result;
    } catch (error) {
      console.error("Refresh notifications error:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
export default notificationService;
