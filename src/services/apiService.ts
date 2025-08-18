// // src/services/apiService.ts

// // API Base URL
// const API_BASE_URL = "http://localhost:80/api";

// // Storage Keys
// const STORAGE_KEYS = {
//   TOKEN: "happyatra_token",
//   USER: "happyatra_user",
//   LOCATION: "happyatra_location",
//   PREFERENCES: "happyatra_preferences",
// };

// // API Endpoints
// const API_ENDPOINTS = {
//   AUTH: {
//     LOGIN: `${API_BASE_URL}/auth/login`,
//     REGISTER: `${API_BASE_URL}/auth/register`,
//     LOGOUT: `${API_BASE_URL}/auth/logout`,
//   },
//   USER: {
//     PROFILE: `${API_BASE_URL}/user/profile`,
//     UPDATE_PROFILE: `${API_BASE_URL}/user/profile`,
//     UPDATE_LOCATION: `${API_BASE_URL}/user/location`,
//     LOCATION_PREFERENCES: `${API_BASE_URL}/user/location/preferences`,
//     LOCATION_HISTORY: `${API_BASE_URL}/user/location/history`,
//     NEARBY_USERS: `${API_BASE_URL}/user/nearby`,
//     UPDATE_STATS: `${API_BASE_URL}/user/stats`,
//     UPLOAD_AVATAR: `${API_BASE_URL}/user/upload-avatar`,
//     HEALTH: `${API_BASE_URL}/user/health`,
//   },
//   NOTIFICATIONS: {
//     LIST: `${API_BASE_URL}/notifications`,
//     UNREAD_COUNT: `${API_BASE_URL}/notifications/unread-count`,
//     NEARBY: `${API_BASE_URL}/notifications/nearby`,
//   },
//   // *** ADDED THIS NEW ENDPOINT SECTION ***
//   BUS_SYSTEM: {
//     DATA: `${API_BASE_URL}/bus-system/data`,
//   },
//   // *** END OF ADDITION ***
//   HEALTH: `${API_BASE_URL}/health`,
// };

// // API Service Class
// class ApiService {
//   getAuthHeaders(includeContentType = true) {
//     const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
//     const headers: HeadersInit = {};

//     if (includeContentType) {
//       headers["Content-Type"] = "application/json";
//     }

//     if (token) {
//       headers.Authorization = `Bearer ${token}`;
//     }

//     return headers;
//   }

//   async handleResponse(response: Response) {
//     let data;
//     try {
//       const text = await response.text();
//       data = text ? JSON.parse(text) : {};
//     } catch (error) {
//       console.error("Failed to parse response:", error);
//       throw new Error("Invalid response from server");
//     }

//     if (!response.ok) {
//       console.error("API Error:", {
//         status: response.status,
//         statusText: response.statusText,
//         url: response.url,
//         data,
//       });

//       switch (response.status) {
//         case 401:
//           this.logout();
//           throw new Error("Session expired. Please sign in again.");
//         case 403:
//           throw new Error("You don't have permission to perform this action.");
//         case 404:
//           throw new Error("The requested resource was not found.");
//         case 422:
//           throw new Error("Please check your input and try again.");
//         case 500:
//           throw new Error("Server error. Please try again later.");
//         default:
//           throw new Error(
//             data.message || `HTTP ${response.status}: ${response.statusText}`
//           );
//       }
//     }

//     return data;
//   }

//   async fetchWithRetry(
//     url: string,
//     options: RequestInit,
//     retries = 2
//   ): Promise<any> {
//     for (let i = 0; i <= retries; i++) {
//       try {
//         const response = await fetch(url, options);
//         return await this.handleResponse(response);
//       } catch (error) {
//         if (i === retries) {
//           throw error;
//         }
//         await new Promise((resolve) =>
//           setTimeout(resolve, Math.pow(2, i) * 1000)
//         );
//       }
//     }
//     throw new Error("Max retries exceeded");
//   }

//   // Auth methods
//   async login(credentials: any) {
//     try {
//       const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
//         method: "POST",
//         headers: this.getAuthHeaders(),
//         body: JSON.stringify(credentials),
//       });

//       const result = await this.handleResponse(response);

//       if (result.success && result.token) {
//         localStorage.setItem(STORAGE_KEYS.TOKEN, result.token);
//         localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(result.user));
//       }

//       return result;
//     } catch (error) {
//       console.error("Login error:", error);
//       throw error;
//     }
//   }

//   async register(userData: any) {
//     try {
//       const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
//         method: "POST",
//         headers: this.getAuthHeaders(),
//         body: JSON.stringify(userData),
//       });

//       const result = await this.handleResponse(response);

//       if (result.success && result.token) {
//         localStorage.setItem(STORAGE_KEYS.TOKEN, result.token);
//         localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(result.user));
//       }

//       return result;
//     } catch (error) {
//       console.error("Registration error:", error);
//       throw error;
//     }
//   }

//   // User Profile methods
//   async getUserProfile() {
//     try {
//       const response = await fetch(API_ENDPOINTS.USER.PROFILE, {
//         method: "GET",
//         headers: this.getAuthHeaders(),
//       });

//       const result = await this.handleResponse(response);

//       // Update stored user data
//       if (result.success && result.user) {
//         localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(result.user));

//         // Also update location cache if user has location
//         if (result.user.location) {
//           localStorage.setItem(
//             STORAGE_KEYS.LOCATION,
//             JSON.stringify({
//               ...result.user.location,
//               cachedAt: new Date().toISOString(),
//             })
//           );
//         }
//       }

//       return result;
//     } catch (error) {
//       console.error("Get profile error:", error);
//       throw error;
//     }
//   }

//   async updateProfile(profileData: any) {
//     try {
//       const response = await fetch(API_ENDPOINTS.USER.UPDATE_PROFILE, {
//         method: "PUT",
//         headers: this.getAuthHeaders(),
//         body: JSON.stringify(profileData),
//       });

//       const result = await this.handleResponse(response);

//       if (result.success && result.user) {
//         localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(result.user));
//       }

//       return result;
//     } catch (error) {
//       console.error("Update profile error:", error);
//       throw error;
//     }
//   }

//   // Location methods
//   async updateLocation(locationData: any) {
//     try {
//       console.log("Updating user location:", locationData);

//       const response = await this.fetchWithRetry(
//         API_ENDPOINTS.USER.UPDATE_LOCATION,
//         {
//           method: "PUT",
//           headers: this.getAuthHeaders(),
//           body: JSON.stringify({
//             latitude: locationData.latitude,
//             longitude: locationData.longitude,
//             accuracy: locationData.accuracy,
//             address: locationData.address,
//           }),
//         }
//       );

//       // Update stored user data with new location
//       const currentUser = this.getCurrentUser();
//       if (currentUser && response.success && response.data?.location) {
//         currentUser.location = response.data.location;
//         localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));

//         // Cache location separately with timestamp
//         localStorage.setItem(
//           STORAGE_KEYS.LOCATION,
//           JSON.stringify({
//             ...response.data.location,
//             cachedAt: new Date().toISOString(),
//           })
//         );
//       }

//       return response;
//     } catch (error) {
//       console.error("Update location error:", error);
//       throw error;
//     }
//   }

//   async updateLocationPreferences(preferences: any) {
//     try {
//       const response = await fetch(API_ENDPOINTS.USER.LOCATION_PREFERENCES, {
//         method: "PUT",
//         headers: this.getAuthHeaders(),
//         body: JSON.stringify(preferences),
//       });

//       const result = await this.handleResponse(response);

//       if (result.success && result.preferences) {
//         const currentUser = this.getCurrentUser();
//         if (currentUser) {
//           currentUser.locationPreferences = result.preferences;
//           localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
//         }
//       }

//       return result;
//     } catch (error) {
//       console.error("Update location preferences error:", error);
//       throw error;
//     }
//   }

//   async getLocationHistory(params: any = {}) {
//     try {
//       const queryString = new URLSearchParams({
//         limit: (params.limit || 10).toString(),
//         page: (params.page || 1).toString(),
//       }).toString();

//       const response = await fetch(
//         `${API_ENDPOINTS.USER.LOCATION_HISTORY}?${queryString}`,
//         {
//           method: "GET",
//           headers: this.getAuthHeaders(),
//         }
//       );

//       return this.handleResponse(response);
//     } catch (error) {
//       console.error("Get location history error:", error);
//       throw error;
//     }
//   }

//   async getNearbyUsers(params: any = {}) {
//     try {
//       const queryString = new URLSearchParams({
//         radius: (params.radius || 10).toString(),
//         limit: (params.limit || 20).toString(),
//       }).toString();

//       const response = await fetch(
//         `${API_ENDPOINTS.USER.NEARBY_USERS}?${queryString}`,
//         {
//           method: "GET",
//           headers: this.getAuthHeaders(),
//         }
//       );

//       return this.handleResponse(response);
//     } catch (error) {
//       console.error("Get nearby users error:", error);
//       throw error;
//     }
//   }

//   // Stats methods
//   async updateStats(statsData: any) {
//     try {
//       const response = await fetch(API_ENDPOINTS.USER.UPDATE_STATS, {
//         method: "PUT",
//         headers: this.getAuthHeaders(),
//         body: JSON.stringify(statsData),
//       });

//       const result = await this.handleResponse(response);

//       if (result.success && result.stats) {
//         const currentUser = this.getCurrentUser();
//         if (currentUser) {
//           currentUser.stats = result.stats;
//           localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
//         }
//       }

//       return result;
//     } catch (error) {
//       console.error("Update stats error:", error);
//       throw error;
//     }
//   }

//   // *** ADDED THIS NEW METHOD ***
//   async getBusSystemData() {
//     try {
//       const response = await this.fetchWithRetry(
//         API_ENDPOINTS.BUS_SYSTEM.DATA,
//         {
//           method: "GET",
//           headers: this.getAuthHeaders(),
//         }
//       );
//       return response;
//     } catch (error) {
//       console.error("Get bus system data error:", error);
//       throw error;
//     }
//   }
//   // *** END OF ADDITION ***

//   // Utility methods
//   logout() {
//     localStorage.removeItem(STORAGE_KEYS.TOKEN);
//     localStorage.removeItem(STORAGE_KEYS.USER);
//     localStorage.removeItem(STORAGE_KEYS.LOCATION);
//     localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
//     console.log("User logged out, cleared all stored data");
//   }

//   isAuthenticated() {
//     return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
//   }

//   getCurrentUser() {
//     try {
//       const userStr = localStorage.getItem(STORAGE_KEYS.USER);
//       return userStr ? JSON.parse(userStr) : null;
//     } catch (error) {
//       console.error("Error parsing stored user data:", error);
//       localStorage.removeItem(STORAGE_KEYS.USER);
//       return null;
//     }
//   }

//   getCurrentLocation() {
//     try {
//       const locationStr = localStorage.getItem(STORAGE_KEYS.LOCATION);
//       return locationStr ? JSON.parse(locationStr) : null;
//     } catch (error) {
//       console.error("Error parsing stored location data:", error);
//       localStorage.removeItem(STORAGE_KEYS.LOCATION);
//       return null;
//     }
//   }

//   hasLocationPermission() {
//     const user = this.getCurrentUser();
//     return !!(user?.location?.latitude && user?.location?.longitude);
//   }

//   hasRecentLocation(maxAgeMinutes = 60) {
//     const user = this.getCurrentUser();
//     if (!user?.location?.lastUpdated) return false;

//     const locationAge =
//       Date.now() - new Date(user.location.lastUpdated).getTime();
//     const maxAge = maxAgeMinutes * 60 * 1000;
//     return locationAge < maxAge;
//   }

//   async healthCheck() {
//     try {
//       const response = await fetch(API_ENDPOINTS.HEALTH, {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//       });

//       const result = await this.handleResponse(response);
//       return result;
//     } catch (error) {
//       console.error("Health check failed:", error);
//       throw error;
//     }
//   }

//   // Helper to calculate distance between two points
//   calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
//     const R = 6371; // Radius of Earth in km
//     const dLat = (lat2 - lat1) * (Math.PI / 180);
//     const dLon = (lon2 - lon1) * (Math.PI / 180);
//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos(lat1 * (Math.PI / 180)) *
//         Math.cos(lat2 * (Math.PI / 180)) *
//         Math.sin(dLon / 2) *
//         Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c;
//   }
// }

// // Export singleton instance
// const apiService = new ApiService();
// export default apiService;

//! 2.0

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
