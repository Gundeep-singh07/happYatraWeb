// API Configuration
export const API_BASE_URL = "http://localhost:80/api";

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
  },

  // User endpoints
  USER: {
    PROFILE: `${API_BASE_URL}/user/profile`,
    UPDATE_PROFILE: `${API_BASE_URL}/user/profile`,
    UPLOAD_AVATAR: `${API_BASE_URL}/user/upload-avatar`,
  },

  // Health check
  HEALTH: `${API_BASE_URL}/health`,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: "happyatra_token",
  USER: "happyatra_user",
  THEME: "happyatra_theme",
};

// App Configuration
export const APP_CONFIG = {
  APP_NAME: "happYatra",
  VERSION: "1.0.0",
  DESCRIPTION: "Intelligent Transportation Platform",
};

// File Upload Configuration
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_IMAGE_TYPES: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
};

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  token?: string;
  user?: any;
}

// User Types
export interface User {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  profilePicture?: {
    url: string;
    publicId: string;
  };
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  createdAt: string;
  updatedAt: string;
}
