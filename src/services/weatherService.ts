// src/services/weatherService.ts

import apiService from "./apiService";

const API_BASE_URL = "http://localhost:80/api"; // Ensure this matches your apiService

class WeatherService {
  /**
   * Fetches weather data from the backend using user coordinates.
   * The backend will then call the external WeatherAPI.
   * @param latitude - The user's latitude.
   * @param longitude - The user's longitude.
   * @returns The weather data from the API.
   */
  async getWeatherByCoords(latitude: number, longitude: number) {
    try {
      // Construct the URL to our backend endpoint
      const url = `${API_BASE_URL}/weather?lat=${latitude}&lon=${longitude}`;

      const response = await fetch(url, {
        method: "GET",
        // We reuse the getAuthHeaders method from apiService to ensure the request is authenticated
        headers: apiService.getAuthHeaders(),
      });

      // We reuse the handleResponse method for consistent error handling and JSON parsing
      return await apiService.handleResponse(response);
    } catch (error) {
      console.error("Weather service fetch error:", error);
      // Re-throw the error so the calling component (Dashboard) can handle it
      throw error;
    }
  }
}

// Export a singleton instance of the service
const weatherService = new WeatherService();
export default weatherService;
