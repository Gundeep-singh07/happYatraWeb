// src/services/metroService.ts

import apiService from "./apiService";
import { API_ENDPOINTS } from "../constants/constants";

interface GetStationsParams {
  page?: number;
  limit?: number;
  search?: string;
  line?: string;
}

class MetroService {
  // Fetch a paginated, searchable, and filterable list of metro stations
  getStations = async (params: GetStationsParams = {}) => {
    // Build query string from params
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.line) queryParams.append("line", params.line);

    const url = `${API_ENDPOINTS.METRO.STATIONS}?${queryParams.toString()}`;

    return apiService.fetchWithRetry(url, {
      method: "GET",
      headers: apiService.getAuthHeaders(),
    });
  };

  // Fetch the list of unique metro lines
  getLines = async () => {
    return apiService.fetchWithRetry(API_ENDPOINTS.METRO.LINES, {
      method: "GET",
      headers: apiService.getAuthHeaders(),
    });
  };
}

const metroService = new MetroService();
export default metroService;
