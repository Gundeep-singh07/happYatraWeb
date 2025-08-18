// src/services/apiService.ts

// API Base URL
const API_BASE_URL = "http://localhost:80/api";

// Storage Keys
const STORAGE_KEYS = {
  TOKEN: "happyatra_token",
  USER: "happyatra_user",
  LOCATION: "happyatra_location",
  PREFERENCES: "happyatra_preferences",
};

// API Endpoints
const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
  },
  USER: {
    PROFILE: `${API_BASE_URL}/user/profile`,
    UPDATE_PROFILE: `${API_BASE_URL}/user/profile`,
    UPDATE_LOCATION: `${API_BASE_URL}/user/location`,
    LOCATION_PREFERENCES: `${API_BASE_URL}/user/location/preferences`,
    LOCATION_HISTORY: `${API_BASE_URL}/user/location/history`,
    NEARBY_USERS: `${API_BASE_URL}/user/nearby`,
    UPDATE_STATS: `${API_BASE_URL}/user/stats`,
    UPLOAD_AVATAR: `${API_BASE_URL}/user/upload-avatar`,
    HEALTH: `${API_BASE_URL}/user/health`,
  },
  NOTIFICATIONS: {
    LIST: `${API_BASE_URL}/notifications`,
    UNREAD_COUNT: `${API_BASE_URL}/notifications/unread-count`,
    NEARBY: `${API_BASE_URL}/notifications/nearby`,
  },
  BUS_SYSTEM: {
    DATA: `${API_BASE_URL}/bus-system/data`,
    NEARBY_STOPS: `${API_BASE_URL}/bus-system/nearby-stops`,
  },
  // *** ADDED THIS NEW ENDPOINT SECTION ***
  TRIP_PLANNER: {
    PLAN: `${API_BASE_URL}/trip-planner/plan`,
  },
  // *** END OF ADDITION ***
  HEALTH: `${API_BASE_URL}/health`,
};

// API Service Class
class ApiService {
  getAuthHeaders(includeContentType = true) {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const headers: HeadersInit = {};

    if (includeContentType) {
      headers["Content-Type"] = "application/json";
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  async handleResponse(response: Response) {
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

      switch (response.status) {
        case 401:
          this.logout();
          throw new Error("Session expired. Please sign in again.");
        case 403:
          throw new Error("You don't have permission to perform this action.");
        case 404:
          throw new Error(
            data.message || "The requested resource was not found."
          );
        case 422:
          throw new Error("Please check your input and try again.");
        case 500:
          throw new Error("Server error. Please try again later.");
        default:
          throw new Error(
            data.message || `HTTP ${response.status}: ${response.statusText}`
          );
      }
    }

    return data;
  }

  async fetchWithRetry(
    url: string,
    options: RequestInit,
    retries = 2
  ): Promise<any> {
    for (let i = 0; i <= retries; i++) {
      try {
        const response = await fetch(url, options);
        return await this.handleResponse(response);
      } catch (error) {
        if (i === retries) {
          throw error;
        }
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, i) * 1000)
        );
      }
    }
    throw new Error("Max retries exceeded");
  }

  // Auth methods
  async login(credentials: any) {
    const result = await this.fetchWithRetry(API_ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(credentials),
    });
    if (result.success && result.token) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, result.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(result.user));
    }
    return result;
  }

  async register(userData: any) {
    const result = await this.fetchWithRetry(API_ENDPOINTS.AUTH.REGISTER, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    if (result.success && result.token) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, result.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(result.user));
    }
    return result;
  }

  // User Profile methods
  async getUserProfile() {
    const result = await this.fetchWithRetry(API_ENDPOINTS.USER.PROFILE, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });
    if (result.success && result.user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(result.user));
      if (result.user.location) {
        localStorage.setItem(
          STORAGE_KEYS.LOCATION,
          JSON.stringify({
            ...result.user.location,
            cachedAt: new Date().toISOString(),
          })
        );
      }
    }
    return result;
  }

  async updateLocation(locationData: any) {
    return this.fetchWithRetry(API_ENDPOINTS.USER.UPDATE_LOCATION, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(locationData),
    });
  }

  // Bus System & Trip Planner Methods
  async getBusSystemData() {
    return this.fetchWithRetry(API_ENDPOINTS.BUS_SYSTEM.DATA, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });
  }

  async getNearbyStops(lat: number, lon: number) {
    const url = `${API_ENDPOINTS.BUS_SYSTEM.NEARBY_STOPS}?lat=${lat}&lon=${lon}`;
    return this.fetchWithRetry(url, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });
  }

  // *** ADDED THIS NEW METHOD ***
  async planTrip(start: string, end: string) {
    return this.fetchWithRetry(API_ENDPOINTS.TRIP_PLANNER.PLAN, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ start, end }),
    });
  }
  // *** END OF ADDITION ***

  // Utility methods
  logout() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.LOCATION);
    localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
    window.location.href = "/auth";
  }

  isAuthenticated() {
    return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  getCurrentUser() {
    try {
      const userStr = localStorage.getItem(STORAGE_KEYS.USER);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  }
}

const apiService = new ApiService();
export default apiService;
