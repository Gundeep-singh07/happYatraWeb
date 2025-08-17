import {
  API_ENDPOINTS,
  STORAGE_KEYS,
  ApiResponse,
  User,
} from "../constants/constants";

class ApiService {
  private getAuthHeaders(includeContentType: boolean = true) {
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
        data,
      });

      throw new Error(
        data.message || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return data;
  }

  // Auth API calls
  async register(userData: {
    fullName: string;
    email: string;
    password: string;
  }): Promise<ApiResponse<User>> {
    try {
      console.log("Attempting registration:", { ...userData, password: "***" });

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
        password: "***",
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

  // User API calls
  async getUserProfile(): Promise<ApiResponse<User>> {
    const response = await fetch(API_ENDPOINTS.USER.PROFILE, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<User>(response);
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
  }): Promise<ApiResponse<User>> {
    const response = await fetch(API_ENDPOINTS.USER.UPDATE_PROFILE, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(profileData),
    });
    return this.handleResponse<User>(response);
  }

  async uploadAvatar(
    file: File
  ): Promise<
    ApiResponse<{ profilePicture: { url: string; publicId: string } }>
  > {
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

    return this.handleResponse(response);
  }

  // Utility methods
  logout() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  }

  async healthCheck(): Promise<ApiResponse> {
    try {
      console.log("Checking server health...");
      const response = await fetch(API_ENDPOINTS.HEALTH);
      const result = await this.handleResponse(response);
      console.log("Health check result:", result);
      return result;
    } catch (error) {
      console.error("Health check failed:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
