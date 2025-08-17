// services/apiService.ts
import {
  API_ENDPOINTS,
  STORAGE_KEYS,
  ApiResponse,
  User,
  LocationData,
  LocationPreferences,
  LocationHistoryEntry,
  NearbyUser,
  UserStats,
  ERROR_MESSAGES,
} from "../constants/constants";

class ApiService {
  private getAuthHeaders(
    includeContentType: boolean = true
  ): Record<string, string> {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const headers: Record<string, string> = {};

    if (includeContentType) {
      headers["Content-Type"] = "application/json";
    }

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
      throw new Error("Invalid response from server");
    }

    if (!response.ok) {
      console.error("API Error:", {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        data,
      });

      // Handle specific HTTP status codes
      switch (response.status) {
        case 401:
          // Unauthorized - token expired or invalid
          this.logout();
          throw new Error(ERROR_MESSAGES.api.unauthorized);
        case 403:
          throw new Error(ERROR_MESSAGES.api.forbidden);
        case 404:
          throw new Error(ERROR_MESSAGES.api.notFound);
        case 422:
          throw new Error(ERROR_MESSAGES.api.validationError);
        case 500:
          throw new Error(ERROR_MESSAGES.api.serverError);
        default:
          throw new Error(
            data.message || `HTTP ${response.status}: ${response.statusText}`
          );
      }
    }

    return data;
  }

  private async fetchWithRetry<T>(
    url: string,
    options: RequestInit,
    retries: number = 2
  ): Promise<ApiResponse<T>> {
    for (let i = 0; i <= retries; i++) {
      try {
        const response = await fetch(url, options);
        return await this.handleResponse<T>(response);
      } catch (error) {
        if (i === retries) {
          throw error;
        }

        // Wait before retrying (exponential backoff)
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, i) * 1000)
        );
      }
    }

    throw new Error("Max retries exceeded");
  }

  // Auth API calls
  async register(userData: {
    fullName: string;
    email: string;
    password: string;
  }): Promise<ApiResponse<User>> {
    try {
      console.log("Attempting registration:", {
        ...userData,
        password: "[REDACTED]",
      });

      const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(userData),
      });

      const result = await this.handleResponse<User>(response);

      // Store token and user data if successful
      if (result.success && result.token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, result.token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(result.user));
      }

      return result;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<User>> {
    try {
      console.log("Attempting login:", {
        email: credentials.email,
        password: "[REDACTED]",
      });

      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(credentials),
      });

      const result = await this.handleResponse<User>(response);

      // Store token and user data if successful
      if (result.success && result.token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, result.token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(result.user));
      }

      return result;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  // User Profile API calls
  async getUserProfile(): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(API_ENDPOINTS.USER.PROFILE, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      const result = await this.handleResponse<User>(response);

      // Update stored user data
      if (result.success && result.user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(result.user));
      }

      return result;
    } catch (error) {
      console.error("Get profile error:", error);
      throw error;
    }
  }

  async updateProfile(profileData: {
    fullName?: string;
    phone?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
    preferences?: any;
  }): Promise<ApiResponse<User>> {
    try {
      console.log("Updating profile:", profileData);

      const response = await fetch(API_ENDPOINTS.USER.UPDATE_PROFILE, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(profileData),
      });

      const result = await this.handleResponse<User>(response);

      // Update stored user data
      if (result.success && result.user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(result.user));
      }

      return result;
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  }

  async uploadAvatar(
    file: File
  ): Promise<
    ApiResponse<{ profilePicture: { url: string; publicId: string } }>
  > {
    try {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error(ERROR_MESSAGES.api.fileTooLarge);
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        throw new Error(ERROR_MESSAGES.api.invalidFileType);
      }

      const formData = new FormData();
      formData.append("avatar", file);

      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const response = await fetch(API_ENDPOINTS.USER.UPLOAD_AVATAR, {
        method: "POST",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          // Don't set Content-Type for FormData, let browser set it
        },
        body: formData,
      });

      const result = await this.handleResponse(response);

      // Update stored user data with new avatar
      if (result.success && result.profilePicture) {
        const currentUser = this.getCurrentUser();
        if (currentUser) {
          currentUser.profilePicture = result.profilePicture;
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
        }
      }

      return result;
    } catch (error) {
      console.error("Upload avatar error:", error);
      throw error;
    }
  }

  async deleteAccount(password: string): Promise<ApiResponse> {
    try {
      const response = await fetch(API_ENDPOINTS.USER.DELETE_ACCOUNT, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ password }),
      });

      const result = await this.handleResponse(response);

      // Clear all stored data if successful
      if (result.success) {
        this.logout();
      }

      return result;
    } catch (error) {
      console.error("Delete account error:", error);
      throw error;
    }
  }

  // Location API calls
  async updateLocation(locationData: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    address?: string;
  }): Promise<
    ApiResponse<{ location: LocationData; isSignificantChange?: boolean }>
  > {
    try {
      console.log("Updating user location:", locationData);

      const response = await this.fetchWithRetry(
        API_ENDPOINTS.USER.UPDATE_LOCATION,
        {
          method: "PUT",
          headers: this.getAuthHeaders(),
          body: JSON.stringify(locationData),
        }
      );

      // Update stored user data with new location
      const currentUser = this.getCurrentUser();
      if (currentUser && response.success && response.data?.location) {
        currentUser.location = response.data.location;
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));

        // Also cache location separately
        localStorage.setItem(
          STORAGE_KEYS.LOCATION,
          JSON.stringify(response.data.location)
        );
      }

      return response;
    } catch (error) {
      console.error("Update location error:", error);
      throw error;
    }
  }

  async updateLocationPreferences(preferences: {
    shareLocation?: boolean;
    trackingEnabled?: boolean;
    allowNotifications?: boolean;
    radius?: number;
  }): Promise<ApiResponse<{ preferences: LocationPreferences }>> {
    try {
      console.log("Updating location preferences:", preferences);

      const response = await fetch(API_ENDPOINTS.USER.LOCATION_PREFERENCES, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(preferences),
      });

      const result = await this.handleResponse<{
        preferences: LocationPreferences;
      }>(response);

      // Update stored user data
      if (result.success && result.data?.preferences) {
        const currentUser = this.getCurrentUser();
        if (currentUser) {
          currentUser.locationPreferences = result.data.preferences;
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
        }
      }

      return result;
    } catch (error) {
      console.error("Update location preferences error:", error);
      throw error;
    }
  }

  async getLocationHistory(params?: { limit?: number; page?: number }): Promise<
    ApiResponse<{
      locationHistory: LocationHistoryEntry[];
      pagination: {
        currentPage: number;
        totalEntries: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
        limit: number;
      };
    }>
  > {
    try {
      const queryString = new URLSearchParams({
        limit: (params?.limit || 10).toString(),
        page: (params?.page || 1).toString(),
      }).toString();

      const response = await fetch(
        `${API_ENDPOINTS.USER.LOCATION_HISTORY}?${queryString}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );

      return this.handleResponse(response);
    } catch (error) {
      console.error("Get location history error:", error);
      throw error;
    }
  }

  async getNearbyUsers(params?: { radius?: number; limit?: number }): Promise<
    ApiResponse<{
      nearbyUsers: NearbyUser[];
      count: number;
      searchRadius: number;
      userLocation: { address?: string };
    }>
  > {
    try {
      const queryString = new URLSearchParams({
        radius: (params?.radius || 10).toString(),
        limit: (params?.limit || 20).toString(),
      }).toString();

      const response = await fetch(
        `${API_ENDPOINTS.USER.NEARBY_USERS}?${queryString}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );

      return this.handleResponse(response);
    } catch (error) {
      console.error("Get nearby users error:", error);
      throw error;
    }
  }

  // Stats API calls
  async updateStats(statsData: {
    tripDistance: number;
    transportMode?: string;
    co2Saved?: number;
    moneySaved?: number;
  }): Promise<ApiResponse<{ stats: UserStats }>> {
    try {
      console.log("Updating user stats:", statsData);

      const response = await fetch(API_ENDPOINTS.USER.UPDATE_STATS, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(statsData),
      });

      const result = await this.handleResponse<{ stats: UserStats }>(response);

      // Update stored user data
      if (result.success && result.data?.stats) {
        const currentUser = this.getCurrentUser();
        if (currentUser) {
          currentUser.stats = result.data.stats;
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
        }
      }

      return result;
    } catch (error) {
      console.error("Update stats error:", error);
      throw error;
    }
  }

  // Utility methods
  logout(): void {
    // Clear all stored data
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.LOCATION);
    localStorage.removeItem(STORAGE_KEYS.PREFERENCES);

    console.log("User logged out, cleared all stored data");
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    return !!token;
  }

  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem(STORAGE_KEYS.USER);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Error parsing stored user data:", error);
      localStorage.removeItem(STORAGE_KEYS.USER);
      return null;
    }
  }

  getCurrentLocation(): LocationData | null {
    try {
      const locationStr = localStorage.getItem(STORAGE_KEYS.LOCATION);
      return locationStr ? JSON.parse(locationStr) : null;
    } catch (error) {
      console.error("Error parsing stored location data:", error);
      localStorage.removeItem(STORAGE_KEYS.LOCATION);
      return null;
    }
  }

  hasLocationPermission(): boolean {
    const user = this.getCurrentUser();
    return !!(user?.location?.latitude && user?.location?.longitude);
  }

  hasRecentLocation(maxAgeMinutes: number = 60): boolean {
    const user = this.getCurrentUser();
    if (!user?.location?.lastUpdated) return false;

    const locationAge =
      Date.now() - new Date(user.location.lastUpdated).getTime();
    const maxAge = maxAgeMinutes * 60 * 1000; // Convert minutes to milliseconds

    return locationAge < maxAge;
  }

  async healthCheck(): Promise<ApiResponse> {
    try {
      console.log("Checking server health...");

      const response = await fetch(API_ENDPOINTS.HEALTH, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const result = await this.handleResponse(response);
      console.log("Health check result:", result);

      return result;
    } catch (error) {
      console.error("Health check failed:", error);
      throw error;
    }
  }

  async userHealthCheck(): Promise<ApiResponse> {
    try {
      const response = await fetch(API_ENDPOINTS.USER.HEALTH, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error("User health check failed:", error);
      throw error;
    }
  }

  // Helper method to refresh user data
  async refreshUserData(): Promise<User | null> {
    try {
      const result = await this.getUserProfile();
      return result.success ? result.user || null : null;
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      return null;
    }
  }

  // Helper method to get user's full address
  getUserFullAddress(user?: User): string | null {
    const currentUser = user || this.getCurrentUser();
    if (!currentUser?.address) return null;

    const parts = [
      currentUser.address.street,
      currentUser.address.city,
      currentUser.address.state,
      currentUser.address.zipCode,
      currentUser.address.country,
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(", ") : null;
  }

  // Add these functions to your existing apiService.ts

  // Enhanced location update with better error handling and automatic retries
  async updateLocationWithRetry(locationData, maxRetries = 3) {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(
          `Updating location (attempt ${attempt}/${maxRetries}):`,
          locationData
        );

        const response = await this.fetchWithRetry(
          API_ENDPOINTS.USER.UPDATE_LOCATION,
          {
            method: "PUT",
            headers: this.getAuthHeaders(),
            body: JSON.stringify({
              latitude: locationData.latitude,
              longitude: locationData.longitude,
              accuracy: locationData.accuracy,
              address: locationData.address,
            }),
          },
          1 // Only 1 retry per attempt in fetchWithRetry
        );

        // Update stored user data with new location
        const currentUser = this.getCurrentUser();
        if (currentUser && response.success && response.data?.location) {
          currentUser.location = response.data.location;
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
          // Also cache location separately with timestamp
          localStorage.setItem(
            STORAGE_KEYS.LOCATION,
            JSON.stringify({
              ...response.data.location,
              cachedAt: new Date().toISOString(),
            })
          );
        }

        return response;
      } catch (error) {
        lastError = error;
        console.error(`Location update attempt ${attempt} failed:`, error);

        // If it's the last attempt, throw the error
        if (attempt === maxRetries) {
          throw lastError;
        }

        // Wait before retrying (exponential backoff)
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
      }
    }
  }

  // Check if user needs location prompt
  shouldPromptForLocation() {
    const user = this.getCurrentUser();
    const hasLocation = user?.location?.latitude && user?.location?.longitude;
    const locationPrompted = localStorage.getItem(
      STORAGE_KEYS.LOCATION_PROMPTED
    );

    // Prompt if no location and not prompted in this session
    return !hasLocation && !locationPrompted;
  }

  // Mark location as prompted for this session
  markLocationPrompted() {
    localStorage.setItem(STORAGE_KEYS.LOCATION_PROMPTED, "true");
  }

  // Clear location prompt flag (call this on logout or when user gets location)
  clearLocationPrompted() {
    localStorage.removeItem(STORAGE_KEYS.LOCATION_PROMPTED);
  }

  // Enhanced location preferences with validation
  async updateLocationPreferencesEnhanced(preferences) {
    try {
      console.log("Updating location preferences:", preferences);

      // Validate preferences
      const validPreferences = {};

      if (typeof preferences.shareLocation === "boolean") {
        validPreferences.shareLocation = preferences.shareLocation;
      }

      if (typeof preferences.trackingEnabled === "boolean") {
        validPreferences.trackingEnabled = preferences.trackingEnabled;
      }

      if (typeof preferences.allowNotifications === "boolean") {
        validPreferences.allowNotifications = preferences.allowNotifications;
      }

      if (
        preferences.radius &&
        preferences.radius >= 1 &&
        preferences.radius <= 1000
      ) {
        validPreferences.radius = Number(preferences.radius);
      }

      const response = await fetch(API_ENDPOINTS.USER.LOCATION_PREFERENCES, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(validPreferences),
      });

      const result = await this.handleResponse(response);

      // Update stored user data
      if (result.success && result.preferences) {
        const currentUser = this.getCurrentUser();
        if (currentUser) {
          currentUser.locationPreferences = result.preferences;
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
        }
      }

      return result;
    } catch (error) {
      console.error("Update location preferences error:", error);
      throw error;
    }
  }

  // Get cached location with age check
  getCachedLocation(maxAgeMinutes = 60) {
    try {
      const cachedLocationStr = localStorage.getItem(STORAGE_KEYS.LOCATION);
      if (!cachedLocationStr) return null;

      const cachedLocation = JSON.parse(cachedLocationStr);

      // Check if cache is too old
      if (cachedLocation.cachedAt) {
        const cacheAge =
          Date.now() - new Date(cachedLocation.cachedAt).getTime();
        const maxAge = maxAgeMinutes * 60 * 1000;

        if (cacheAge > maxAge) {
          console.log("Cached location is too old, removing...");
          localStorage.removeItem(STORAGE_KEYS.LOCATION);
          return null;
        }
      }

      return cachedLocation;
    } catch (error) {
      console.error("Error parsing cached location:", error);
      localStorage.removeItem(STORAGE_KEYS.LOCATION);
      return null;
    }
  }

  // Enhanced location validation
  validateLocationData(locationData) {
    const errors = [];

    if (!locationData.latitude || !locationData.longitude) {
      errors.push("Latitude and longitude are required");
    }

    if (locationData.latitude < -90 || locationData.latitude > 90) {
      errors.push("Latitude must be between -90 and 90");
    }

    if (locationData.longitude < -180 || locationData.longitude > 180) {
      errors.push("Longitude must be between -180 and 180");
    }

    if (
      locationData.accuracy &&
      (locationData.accuracy < 0 || locationData.accuracy > 100000)
    ) {
      errors.push("Accuracy must be between 0 and 100000 meters");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Batch update location history (for offline sync)
  async syncLocationHistory(locationHistory) {
    try {
      console.log("Syncing location history:", locationHistory);

      const response = await fetch(
        `${API_ENDPOINTS.USER.LOCATION_HISTORY}/sync`,
        {
          method: "POST",
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ locationHistory }),
        }
      );

      return this.handleResponse(response);
    } catch (error) {
      console.error("Sync location history error:", error);
      throw error;
    }
  }

  // Get location statistics
  async getLocationStats(timeRange = "30d") {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.USER.LOCATION_HISTORY}/stats?range=${timeRange}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );

      return this.handleResponse(response);
    } catch (error) {
      console.error("Get location stats error:", error);
      throw error;
    }
  }

  // Enhanced nearby users with filters
  async getNearbyUsersEnhanced(params = {}) {
    try {
      const {
        radius = 10,
        limit = 20,
        transportModes = [],
        minTrips = 0,
        sortBy = "distance",
      } = params;

      const queryParams = new URLSearchParams({
        radius: radius.toString(),
        limit: limit.toString(),
        sortBy,
      });

      if (transportModes.length > 0) {
        queryParams.append("transportModes", transportModes.join(","));
      }

      if (minTrips > 0) {
        queryParams.append("minTrips", minTrips.toString());
      }

      const response = await fetch(
        `${API_ENDPOINTS.USER.NEARBY_USERS}?${queryParams.toString()}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );

      return this.handleResponse(response);
    } catch (error) {
      console.error("Get enhanced nearby users error:", error);
      throw error;
    }
  }

  // Location-based notifications
  async getLocationBasedNotifications(radius = 50) {
    try {
      const currentLocation =
        this.getCachedLocation() || this.getCurrentUser()?.location;

      if (!currentLocation?.latitude || !currentLocation?.longitude) {
        throw new Error("Location not available for notifications");
      }

      const response = await fetch(
        `${API_ENDPOINTS.NOTIFICATIONS.NEARBY}?` +
          `latitude=${currentLocation.latitude}&` +
          `longitude=${currentLocation.longitude}&` +
          `radius=${radius}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );

      return this.handleResponse(response);
    } catch (error) {
      console.error("Get location-based notifications error:", error);
      throw error;
    }
  }

  // Cleanup old location data
  cleanupLocationData() {
    try {
      const user = this.getCurrentUser();

      // Clean old cached location
      const cachedLocation = this.getCachedLocation(5); // 5 minutes
      if (!cachedLocation) {
        localStorage.removeItem(STORAGE_KEYS.LOCATION);
      }

      // Clean location prompt flag on app restart
      const sessionStart = sessionStorage.getItem("app_session_start");
      if (!sessionStart) {
        this.clearLocationPrompted();
        sessionStorage.setItem("app_session_start", "true");
      }

      console.log("Location data cleanup completed");
    } catch (error) {
      console.error("Error during location cleanup:", error);
    }
  }

  // Enhanced logout with location cleanup
  logoutEnhanced() {
    try {
      // Clear all stored data
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.LOCATION);
      localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
      localStorage.removeItem(STORAGE_KEYS.LOCATION_PROMPTED);

      // Clear session storage
      sessionStorage.clear();

      console.log(
        "Enhanced logout completed, cleared all data including location"
      );
    } catch (error) {
      console.error("Error during enhanced logout:", error);
    }
  }

  // Helper method to calculate distance between two points
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
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
    return R * c; // Distance in km
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
