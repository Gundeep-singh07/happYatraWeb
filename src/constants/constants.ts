// // constants/constants.ts

// // API Base URL - Update this to match your backend URL
// export const API_BASE_URL = "http://localhost:80/api";

// // API Endpoints
// export const API_ENDPOINTS = {
//   AUTH: {
//     LOGIN: `${API_BASE_URL}/auth/login`,
//     REGISTER: `${API_BASE_URL}/auth/register`,
//     LOGOUT: `${API_BASE_URL}/auth/logout`,
//     REFRESH: `${API_BASE_URL}/auth/refresh`,
//     VERIFY: `${API_BASE_URL}/auth/verify`,
//   },
//   USER: {
//     PROFILE: `${API_BASE_URL}/user/profile`,
//     UPDATE_PROFILE: `${API_BASE_URL}/user/profile`,
//     UPLOAD_AVATAR: `${API_BASE_URL}/user/upload-avatar`,
//     DELETE_ACCOUNT: `${API_BASE_URL}/user/account`,
//     HEALTH: `${API_BASE_URL}/user/health`,
//     // Location endpoints
//     UPDATE_LOCATION: `${API_BASE_URL}/user/location`,
//     LOCATION_PREFERENCES: `${API_BASE_URL}/user/location/preferences`,
//     LOCATION_HISTORY: `${API_BASE_URL}/user/location/history`,
//     NEARBY_USERS: `${API_BASE_URL}/user/nearby`,
//     UPDATE_STATS: `${API_BASE_URL}/user/stats`,
//     // ++ NEW: Friends endpoints ++
//     FRIENDS: {
//       CONNECTIONS: `${API_BASE_URL}/user/friends/connections`,
//       SEARCH: (query: string) =>
//         `${API_BASE_URL}/user/friends/search?q=${query}`,
//       SEND_REQUEST: (userId: string) =>
//         `${API_BASE_URL}/user/friends/request/${userId}`,
//       ACCEPT_REQUEST: (userId: string) =>
//         `${API_BASE_URL}/user/friends/accept/${userId}`,
//       DECLINE_REQUEST: (userId: string) =>
//         `${API_BASE_URL}/user/friends/decline/${userId}`,
//       REMOVE_FRIEND: (userId: string) =>
//         `${API_BASE_URL}/user/friends/remove/${userId}`,
//     },
//   },
//   NOTIFICATIONS: {
//     LIST: `${API_BASE_URL}/notifications`,
//     TYPES: `${API_BASE_URL}/notifications/types`,
//     UNREAD_COUNT: `${API_BASE_URL}/notifications/unread-count`,
//     NEARBY: `${API_BASE_URL}/notifications/nearby`,
//     DEBUG_ALL: `${API_BASE_URL}/notifications/debug/all`,
//     MARK_READ: (id: string) => `${API_BASE_URL}/notifications/${id}/read`,
//   },
//   ADMIN: {
//     NOTIFICATIONS: {
//       LIST: `${API_BASE_URL}/admin/notifications`,
//       CREATE: `${API_BASE_URL}/admin/notifications`,
//       UPDATE: (id: string) => `${API_BASE_URL}/admin/notifications/${id}`,
//       DELETE: (id: string) => `${API_BASE_URL}/admin/notifications/${id}`,
//       SEND: (id: string) => `${API_BASE_URL}/admin/notifications/${id}/send`,
//       DEACTIVATE: (id: string) =>
//         `${API_BASE_URL}/admin/notifications/${id}/deactivate`,
//       STATS: `${API_BASE_URL}/admin/notifications/stats`,
//       BULK_UPDATE: `${API_BASE_URL}/admin/notifications/bulk-update`,
//     },
//   },
//   HEALTH: `${API_BASE_URL}/health`,
//   TEST: `${API_BASE_URL}/test`,
// };

// // Storage Keys
// export const STORAGE_KEYS = {
//   TOKEN: "happyatra_token",
//   USER: "happyatra_user",
//   PREFERENCES: "happyatra_preferences",
//   LOCATION: "happyatra_location",
//   THEME: "happyatra_theme",
//   LANGUAGE: "happyatra_language",
// } as const;

// // Location Interfaces
// export interface LocationData {
//   latitude: number;
//   longitude: number;
//   accuracy?: number;
//   address?: string;
//   lastUpdated?: string;
// }

// export interface LocationPreferences {
//   shareLocation: boolean;
//   trackingEnabled: boolean;
//   allowNotifications: boolean;
//   radius: number;
// }

// export interface LocationHistoryEntry {
//   latitude: number;
//   longitude: number;
//   accuracy?: number;
//   address?: string;
//   timestamp: string;
// }

// // User Stats Interface
// export interface UserStats {
//   totalTrips: number;
//   totalDistance: number;
//   co2Saved: number;
//   moneySaved: number;
//   lastActive: string;
// }

// // User Preferences Interface
// export interface UserPreferences {
//   theme: "light" | "dark" | "system";
//   language: string;
//   notifications: {
//     email: boolean;
//     push: boolean;
//     sms: boolean;
//   };
//   transportation: {
//     preferredModes: string[];
//     defaultRadius: number;
//   };
// }

// // ++ NEW: A simplified user reference for friend lists ++
// export interface FriendReference {
//   _id: string;
//   fullName: string;
//   profilePicture?: {
//     url: string;
//     publicId: string;
//   };
// }

// // User Interface (Updated)
// export interface User {
//   _id: string;
//   id?: string;
//   fullName: string;
//   email: string;
//   role: "admin" | "user" | "moderator";
//   profilePicture?: {
//     url: string;
//     publicId: string;
//   };
//   phone?: string;
//   isVerified?: boolean;
//   isActive?: boolean;
//   address?: {
//     street?: string;
//     city?: string;
//     state?: string;
//     zipCode?: string;
//     country?: string;
//   };
//   location?: LocationData;
//   locationHistory?: LocationHistoryEntry[];
//   locationPreferences?: LocationPreferences;
//   preferences?: UserPreferences;
//   stats?: UserStats;
//   createdAt: string;
//   updatedAt: string;
//   // ++ NEW: Fields for the friends system ++
//   friends?: FriendReference[];
//   friendRequestsSent?: FriendReference[];
//   friendRequestsReceived?: FriendReference[];
// }

// // Nearby User Interface
// export interface NearbyUser {
//   _id: string;
//   fullName: string;
//   profilePicture?: {
//     url: string;
//     publicId: string;
//   };
//   location: {
//     address?: string;
//     latitude: number;
//     longitude: number;
//   };
//   stats: {
//     totalTrips: number;
//   };
//   distance: number;
//   memberSince: string;
// }

// // Notification Interfaces
// export interface NotificationLocation {
//   latitude: number;
//   longitude: number;
//   address?: string;
// }

// export interface NotificationReadBy {
//   user: string;
//   readAt: string;
// }

// export interface UserNotification {
//   _id: string;
//   title: string;
//   message: string;
//   type: NotificationType;
//   status: NotificationStatus;
//   priority: NotificationPriority;
//   location?: NotificationLocation;
//   recipients: number;
//   expiresAt?: string;
//   isActive: boolean;
//   createdBy: {
//     _id: string;
//     fullName: string;
//     email?: string;
//   };
//   sentAt?: string;
//   readBy: NotificationReadBy[];
//   tags?: string[];
//   attachments?: NotificationAttachment[];
//   createdAt: string;
//   updatedAt: string;
// }

// export interface NotificationAttachment {
//   url: string;
//   type: string;
//   name: string;
// }

// // Notification Types
// export type NotificationType =
//   | "traffic_jam"
//   | "road_closure"
//   | "construction"
//   | "accident"
//   | "weather_warning"
//   | "flooding"
//   | "landslide"
//   | "bridge_closure"
//   | "detour"
//   | "maintenance"
//   | "emergency"
//   | "event"
//   | "info"
//   | "warning"
//   | "success";

// export type NotificationStatus = "draft" | "active" | "inactive" | "expired";
// export type NotificationPriority = "low" | "medium" | "high" | "urgent";

// // Transportation Types
// export type TransportationType =
//   | "bus"
//   | "metro"
//   | "taxi"
//   | "walking"
//   | "cycling"
//   | "carpooling"
//   | "train"
//   | "auto";

// // Notification Configuration
// export const NOTIFICATION_CONFIG = {
//   traffic_jam: {
//     icon: "🚗",
//     label: "Traffic Jam",
//     color: "border-orange-500 bg-orange-500/10",
//   },
//   road_closure: {
//     icon: "🚧",
//     label: "Road Closure",
//     color: "border-red-500 bg-red-500/10",
//   },
//   construction: {
//     icon: "🏗️",
//     label: "Construction",
//     color: "border-yellow-500 bg-yellow-500/10",
//   },
//   accident: {
//     icon: "⚠️",
//     label: "Accident",
//     color: "border-red-600 bg-red-600/10",
//   },
//   weather_warning: {
//     icon: "🌧️",
//     label: "Weather Warning",
//     color: "border-blue-500 bg-blue-500/10",
//   },
//   flooding: {
//     icon: "🌊",
//     label: "Flooding",
//     color: "border-blue-600 bg-blue-600/10",
//   },
//   landslide: {
//     icon: "🏔️",
//     label: "Landslide",
//     color: "border-gray-600 bg-gray-600/10",
//   },
//   bridge_closure: {
//     icon: "🌉",
//     label: "Bridge Closure",
//     color: "border-purple-500 bg-purple-500/10",
//   },
//   detour: {
//     icon: "↩️",
//     label: "Detour",
//     color: "border-indigo-500 bg-indigo-500/10",
//   },
//   maintenance: {
//     icon: "🔧",
//     label: "Maintenance",
//     color: "border-gray-500 bg-gray-500/10",
//   },
//   emergency: {
//     icon: "🚨",
//     label: "Emergency",
//     color: "border-red-700 bg-red-700/10",
//   },
//   event: {
//     icon: "📅",
//     label: "Event",
//     color: "border-green-500 bg-green-500/10",
//   },
//   info: {
//     icon: "ℹ️",
//     label: "Information",
//     color: "border-blue-400 bg-blue-400/10",
//   },
//   warning: {
//     icon: "⚠️",
//     label: "Warning",
//     color: "border-yellow-600 bg-yellow-600/10",
//   },
//   success: {
//     icon: "✅",
//     label: "Success",
//     color: "border-green-600 bg-green-600/10",
//   },
// } as const;

// // Transportation Mode Configuration
// export const TRANSPORT_CONFIG = {
//   bus: {
//     icon: "🚌",
//     label: "Bus",
//     color: "bg-blue-500",
//   },
//   metro: {
//     icon: "🚇",
//     label: "Metro",
//     color: "bg-green-500",
//   },
//   taxi: {
//     icon: "🚖",
//     label: "Taxi",
//     color: "bg-yellow-500",
//   },
//   walking: {
//     icon: "🚶",
//     label: "Walking",
//     color: "bg-gray-500",
//   },
//   cycling: {
//     icon: "🚴",
//     label: "Cycling",
//     color: "bg-emerald-500",
//   },
//   carpooling: {
//     icon: "🚗",
//     label: "Carpooling",
//     color: "bg-purple-500",
//   },
//   train: {
//     icon: "🚂",
//     label: "Train",
//     color: "bg-indigo-500",
//   },
//   auto: {
//     icon: "🛺",
//     label: "Auto",
//     color: "bg-orange-500",
//   },
// } as const;

// // Priority Colors
// export const PRIORITY_COLORS = {
//   low: "text-green-400",
//   medium: "text-yellow-400",
//   high: "text-orange-400",
//   urgent: "text-red-400",
// } as const;

// // Status Colors
// export const STATUS_COLORS = {
//   draft: "text-gray-400 bg-gray-400/10",
//   active: "text-green-400 bg-green-400/10",
//   inactive: "text-yellow-400 bg-yellow-400/10",
//   expired: "text-red-400 bg-red-400/10",
// } as const;

// // API Response Interface
// export interface ApiResponse<T = any> {
//   success: boolean;
//   data?: T;
//   message: string;
//   error?: string;
//   token?: string;
//   user?: User;
// }

// // Notifications Response
// export interface NotificationsResponse {
//   notifications: UserNotification[];
//   pagination: {
//     currentPage: number;
//     totalPages: number;
//     totalNotifications: number;
//     hasNext: boolean;
//     hasPrev: boolean;
//     limit: number;
//   };
// }

// // Notification Filters
// export interface NotificationFilters {
//   page?: number;
//   limit?: number;
//   type?: string;
//   priority?: string;
//   status?: string;
//   search?: string;
//   latitude?: number;
//   longitude?: number;
//   radius?: number;
//   sortBy?: string;
//   sortOrder?: "asc" | "desc";
// }

// // Admin Notification Creation
// export interface CreateNotificationData {
//   title: string;
//   message: string;
//   type: NotificationType;
//   priority: NotificationPriority;
//   location?: NotificationLocation;
//   expiresAt?: string;
//   tags?: string[];
//   attachments?: NotificationAttachment[];
// }

// // Admin Notification Update
// export interface UpdateNotificationData
//   extends Partial<CreateNotificationData> {
//   status?: NotificationStatus;
//   isActive?: boolean;
// }

// // Admin Statistics
// export interface NotificationStats {
//   statusStats: Array<{ _id: NotificationStatus; count: number }>;
//   typeStats: Array<{ _id: NotificationType; count: number }>;
//   priorityStats: Array<{ _id: NotificationPriority; count: number }>;
//   totalRecipients: number;
//   recentNotifications: UserNotification[];
//   activeNotificationsCount: number;
//   totalNotifications: number;
// }

// // Error Interface
// export interface AppError {
//   code: string;
//   message: string;
//   details?: any;
// }

// // Theme Constants
// export const THEME_COLORS = {
//   primary: {
//     50: "#eff6ff",
//     100: "#dbeafe",
//     200: "#bfdbfe",
//     300: "#93c5fd",
//     400: "#60a5fa",
//     500: "#3b82f6",
//     600: "#2563eb",
//     700: "#1d4ed8",
//     800: "#1e40af",
//     900: "#1e3a8a",
//   },
//   gray: {
//     50: "#f9fafb",
//     100: "#f3f4f6",
//     200: "#e5e7eb",
//     300: "#d1d5db",
//     400: "#9ca3af",
//     500: "#6b7280",
//     600: "#4b5563",
//     700: "#374151",
//     800: "#1f2937",
//     900: "#111827",
//   },
// } as const;

// // Animation Constants
// export const ANIMATIONS = {
//   fadeIn: "animate-fadeIn",
//   fadeOut: "animate-fadeOut",
//   slideUp: "animate-slideUp",
//   slideDown: "animate-slideDown",
//   bounce: "animate-bounce",
//   pulse: "animate-pulse",
//   spin: "animate-spin",
// } as const;

// // Validation Rules
// export const VALIDATION_RULES = {
//   user: {
//     fullName: {
//       minLength: 2,
//       maxLength: 50,
//       required: true,
//     },
//     email: {
//       required: true,
//       pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//     },
//     phone: {
//       pattern: /^[+]?[\d\s\-\(\)]{10,15}$/,
//     },
//   },
//   notification: {
//     title: {
//       minLength: 3,
//       maxLength: 200,
//       required: true,
//     },
//     message: {
//       minLength: 10,
//       maxLength: 1000,
//       required: true,
//     },
//     type: {
//       required: true,
//       enum: [
//         "traffic_jam",
//         "road_closure",
//         "construction",
//         "accident",
//         "weather_warning",
//         "flooding",
//         "landslide",
//         "bridge_closure",
//         "detour",
//         "maintenance",
//         "emergency",
//         "event",
//         "info",
//         "warning",
//         "success",
//       ],
//     },
//     priority: {
//       required: true,
//       enum: ["low", "medium", "high", "urgent"],
//       default: "medium",
//     },
//   },
//   location: {
//     latitude: {
//       min: -90,
//       max: 90,
//       required: false,
//     },
//     longitude: {
//       min: -180,
//       max: 180,
//       required: false,
//     },
//     radius: {
//       min: 1,
//       max: 1000,
//       default: 50,
//     },
//     accuracy: {
//       min: 0,
//       max: 100000,
//     },
//   },
//   pagination: {
//     page: {
//       min: 1,
//       default: 1,
//     },
//     limit: {
//       min: 1,
//       max: 100,
//       default: 20,
//     },
//   },
// } as const;

// // Default Values
// export const DEFAULT_VALUES = {
//   user: {
//     theme: "system" as const,
//     language: "en",
//     notifications: {
//       email: true,
//       push: true,
//       sms: false,
//     },
//     transportation: {
//       preferredModes: [] as TransportationType[],
//       defaultRadius: 5,
//     },
//     locationPreferences: {
//       shareLocation: true,
//       trackingEnabled: false,
//       allowNotifications: true,
//       radius: 50,
//     },
//     stats: {
//       totalTrips: 0,
//       totalDistance: 0,
//       co2Saved: 0,
//       moneySaved: 0,
//     },
//   },
//   notification: {
//     priority: "medium" as NotificationPriority,
//     type: "info" as NotificationType,
//     status: "draft" as NotificationStatus,
//     isActive: true,
//     recipients: 0,
//   },
//   pagination: {
//     page: 1,
//     limit: 20,
//   },
//   location: {
//     radius: 50, // km
//     accuracy: 10, // meters
//   },
//   filters: {
//     type: "all",
//     priority: "all",
//     status: "all",
//   },
// } as const;

// // Feature Flags
// export const FEATURE_FLAGS = {
//   locationBasedNotifications: true,
//   pushNotifications: true,
//   emailNotifications: true,
//   smsNotifications: false,
//   realTimeUpdates: true,
//   advancedFiltering: true,
//   bulkOperations: true,
//   exportData: true,
//   analytics: true,
//   darkMode: true,
//   carpooling: true,
//   liveTracking: true,
//   nearbyUsers: true,
//   weatherIntegration: true,
//   routeOptimization: true,
// } as const;

// // App Configuration
// export const APP_CONFIG = {
//   name: "HappYatra",
//   version: "1.0.0",
//   description: "Smart Travel Notification System",
//   author: "HappYatra Team",
//   supportEmail: "support@happyatra.com",
//   maxFileUploadSize: 5 * 1024 * 1024, // 5MB
//   supportedImageTypes: [
//     "image/jpeg",
//     "image/jpg",
//     "image/png",
//     "image/gif",
//     "image/webp",
//   ],
//   supportedDocumentTypes: [
//     "application/pdf",
//     "application/msword",
//     "text/plain",
//   ],
//   defaultLanguage: "en",
//   supportedLanguages: ["en", "hi", "es", "fr"],
//   timezone: "Asia/Kolkata",
//   dateFormat: "DD/MM/YYYY",
//   timeFormat: "HH:mm",
//   currency: "INR",
//   map: {
//     defaultZoom: 15,
//     maxZoom: 20,
//     minZoom: 5,
//     defaultCenter: {
//       latitude: 28.6139, // New Delhi
//       longitude: 77.209,
//     },
//   },
//   location: {
//     updateInterval: 30000, // 30 seconds for live tracking
//     significantDistance: 50, // meters - minimum distance to trigger update
//     maxLocationAge: 300000, // 5 minutes - max age of cached location
//     highAccuracyTimeout: 15000, // 15 seconds timeout for high accuracy
//     lowAccuracyTimeout: 30000, // 30 seconds timeout for low accuracy
//   },
// } as const;

// // Error Messages
// export const ERROR_MESSAGES = {
//   location: {
//     notSupported: "Location services are not supported by your browser",
//     permissionDenied:
//       "Location access denied. Please enable location permissions.",
//     positionUnavailable:
//       "Unable to retrieve your location. Please check your GPS settings.",
//     timeout: "Location request timed out. Please try again.",
//     networkError:
//       "Network error while getting location. Please check your connection.",
//     unknownError: "An unknown error occurred while getting your location.",
//   },
//   api: {
//     networkError: "Network error. Please check your internet connection.",
//     serverError: "Server error. Please try again later.",
//     unauthorized: "Session expired. Please log in again.",
//     forbidden: "You don't have permission to perform this action.",
//     notFound: "The requested resource was not found.",
//     validationError: "Please check your input and try again.",
//     uploadError: "File upload failed. Please try again.",
//     fileTooLarge: "File is too large. Maximum size is 5MB.",
//     invalidFileType: "Invalid file type. Only images are allowed.",
//   },
//   user: {
//     profileUpdateFailed: "Failed to update profile. Please try again.",
//     locationUpdateFailed: "Failed to update location. Please try again.",
//     statsUpdateFailed: "Failed to update statistics. Please try again.",
//     accountDeleteFailed: "Failed to delete account. Please try again.",
//   },
// } as const;

// // Success Messages
// export const SUCCESS_MESSAGES = {
//   user: {
//     profileUpdated: "Profile updated successfully!",
//     locationUpdated: "Location updated successfully!",
//     preferencesUpdated: "Preferences updated successfully!",
//     statsUpdated: "Statistics updated successfully!",
//     avatarUploaded: "Profile picture updated successfully!",
//     accountDeleted: "Account deleted successfully!",
//   },
//   location: {
//     detected: "Location detected successfully!",
//     trackingEnabled: "Live tracking enabled!",
//     trackingDisabled: "Live tracking disabled!",
//     updated: "Location updated!",
//   },
// } as const;

// // Loading Messages
// export const LOADING_MESSAGES = {
//   location: {
//     detecting: "Detecting your location...",
//     updating: "Updating your location...",
//     tracking: "Tracking your location...",
//   },
//   user: {
//     loading: "Loading your profile...",
//     updating: "Updating your profile...",
//     uploading: "Uploading image...",
//     deleting: "Deleting account...",
//   },
//   api: {
//     connecting: "Connecting to server...",
//     processing: "Processing your request...",
//   },
// } as const;

// // Time Constants
// export const TIME_CONSTANTS = {
//   SECOND: 1000,
//   MINUTE: 60 * 1000,
//   HOUR: 60 * 60 * 1000,
//   DAY: 24 * 60 * 60 * 1000,
//   WEEK: 7 * 24 * 60 * 60 * 1000,
//   MONTH: 30 * 24 * 60 * 60 * 1000,
// } as const;

// // Distance Constants (in meters)
// export const DISTANCE_CONSTANTS = {
//   METER: 1,
//   KILOMETER: 1000,
//   MILE: 1609.34,
//   SIGNIFICANT_MOVE: 50, // meters
//   NEARBY_RADIUS: 5000, // 5km
//   MAX_SEARCH_RADIUS: 100000, // 100km
// } as const;

// // Local Storage Keys for different data types
// export const CACHE_KEYS = {
//   LOCATION_CACHE: "location_cache",
//   USER_PREFERENCES_CACHE: "user_preferences_cache",
//   NOTIFICATION_CACHE: "notification_cache",
//   ROUTE_CACHE: "route_cache",
//   WEATHER_CACHE: "weather_cache",
// } as const;

// // Export everything as default as well for convenience
// export default {
//   API_BASE_URL,
//   API_ENDPOINTS,
//   STORAGE_KEYS,
//   NOTIFICATION_CONFIG,
//   TRANSPORT_CONFIG,
//   PRIORITY_COLORS,
//   STATUS_COLORS,
//   THEME_COLORS,
//   ANIMATIONS,
//   VALIDATION_RULES,
//   DEFAULT_VALUES,
//   FEATURE_FLAGS,
//   APP_CONFIG,
//   ERROR_MESSAGES,
//   SUCCESS_MESSAGES,
//   LOADING_MESSAGES,
//   TIME_CONSTANTS,
//   DISTANCE_CONSTANTS,
//   CACHE_KEYS,
// };

//! 2.0

// constants/constants.ts

// API Base URL - Update this to match your backend URL
export const API_BASE_URL = "http://localhost:80/api";

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
    VERIFY: `${API_BASE_URL}/auth/verify`,
  },
  USER: {
    PROFILE: `${API_BASE_URL}/user/profile`,
    UPDATE_PROFILE: `${API_BASE_URL}/user/profile`,
    UPLOAD_AVATAR: `${API_BASE_URL}/user/upload-avatar`,
    DELETE_ACCOUNT: `${API_BASE_URL}/user/account`,
    HEALTH: `${API_BASE_URL}/user/health`,
    // Location endpoints
    UPDATE_LOCATION: `${API_BASE_URL}/user/location`,
    LOCATION_PREFERENCES: `${API_BASE_URL}/user/location/preferences`,
    LOCATION_HISTORY: `${API_BASE_URL}/user/location/history`,
    NEARBY_USERS: `${API_BASE_URL}/user/nearby`,
    UPDATE_STATS: `${API_BASE_URL}/user/stats`,
    // Friends endpoints
    FRIENDS: {
      CONNECTIONS: `${API_BASE_URL}/user/friends/connections`,
      SEARCH: (query: string) =>
        `${API_BASE_URL}/user/friends/search?q=${query}`,
      SEND_REQUEST: (userId: string) =>
        `${API_BASE_URL}/user/friends/request/${userId}`,
      ACCEPT_REQUEST: (userId: string) =>
        `${API_BASE_URL}/user/friends/accept/${userId}`,
      DECLINE_REQUEST: (userId: string) =>
        `${API_BASE_URL}/user/friends/decline/${userId}`,
      REMOVE_FRIEND: (userId: string) =>
        `${API_BASE_URL}/user/friends/remove/${userId}`,
    },
  },
  NOTIFICATIONS: {
    LIST: `${API_BASE_URL}/notifications`,
    TYPES: `${API_BASE_URL}/notifications/types`,
    UNREAD_COUNT: `${API_BASE_URL}/notifications/unread-count`,
    NEARBY: `${API_BASE_URL}/notifications/nearby`,
    DEBUG_ALL: `${API_BASE_URL}/notifications/debug/all`,
    MARK_READ: (id: string) => `${API_BASE_URL}/notifications/${id}/read`,
  },
  ADMIN: {
    NOTIFICATIONS: {
      LIST: `${API_BASE_URL}/admin/notifications`,
      CREATE: `${API_BASE_URL}/admin/notifications`,
      UPDATE: (id: string) => `${API_BASE_URL}/admin/notifications/${id}`,
      DELETE: (id: string) => `${API_BASE_URL}/admin/notifications/${id}`,
      SEND: (id: string) => `${API_BASE_URL}/admin/notifications/${id}/send`,
      DEACTIVATE: (id: string) =>
        `${API_BASE_URL}/admin/notifications/${id}/deactivate`,
      STATS: `${API_BASE_URL}/admin/notifications/stats`,
      BULK_UPDATE: `${API_BASE_URL}/admin/notifications/bulk-update`,
    },
  },
  // ++ NEW: CARPOOLING ENDPOINTS ++
  CARPOOLING: {
    ROUTES: `${API_BASE_URL}/carpooling/routes`,
    REQUEST_YATRA: (routeId: string) =>
      `${API_BASE_URL}/carpooling/routes/${routeId}/yatra`,
  },
  HEALTH: `${API_BASE_URL}/health`,
  TEST: `${API_BASE_URL}/test`,
};

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: "happyatra_token",
  USER: "happyatra_user",
  PREFERENCES: "happyatra_preferences",
  LOCATION: "happyatra_location",
  THEME: "happyatra_theme",
  LANGUAGE: "happyatra_language",
} as const;

// Location Interfaces
export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: string;
  lastUpdated?: string;
}

export interface LocationPreferences {
  shareLocation: boolean;
  trackingEnabled: boolean;
  allowNotifications: boolean;
  radius: number;
}

export interface LocationHistoryEntry {
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: string;
  timestamp: string;
}

// User Stats Interface
export interface UserStats {
  totalTrips: number;
  totalDistance: number;
  co2Saved: number;
  moneySaved: number;
  lastActive: string;
}

// User Preferences Interface
export interface UserPreferences {
  theme: "light" | "dark" | "system";
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  transportation: {
    preferredModes: string[];
    defaultRadius: number;
  };
}

// A simplified user reference for friend lists
export interface FriendReference {
  _id: string;
  fullName: string;
  profilePicture?: {
    url: string;
    publicId: string;
  };
}

// User Interface (Updated)
export interface User {
  _id: string;
  id?: string;
  fullName: string;
  email: string;
  role: "admin" | "user" | "moderator";
  profilePicture?: {
    url: string;
    publicId: string;
  };
  phone?: string;
  isVerified?: boolean;
  isActive?: boolean;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  location?: LocationData;
  locationHistory?: LocationHistoryEntry[];
  locationPreferences?: LocationPreferences;
  preferences?: UserPreferences;
  stats?: UserStats;
  createdAt: string;
  updatedAt: string;
  // Fields for the friends system
  friends?: FriendReference[];
  friendRequestsSent?: FriendReference[];
  friendRequestsReceived?: FriendReference[];
}

// Nearby User Interface
export interface NearbyUser {
  _id: string;
  fullName: string;
  profilePicture?: {
    url: string;
    publicId: string;
  };
  location: {
    address?: string;
    latitude: number;
    longitude: number;
  };
  stats: {
    totalTrips: number;
  };
  distance: number;
  memberSince: string;
}

// ++ NEW: CARPOOLING INTERFACES ++
export interface CarpoolRoute {
  _id: string;
  driver: FriendReference;
  origin: {
    address: string;
    latitude: number;
    longitude: number;
  };
  destination: {
    address: string;
    latitude: number;
    longitude: number;
  };
  departureTime: string;
  availableSeats: number;
  vehicleDetails?: string;
  fare?: number;
  yatraRequests: FriendReference[];
  passengers: FriendReference[];
  status: "active" | "full" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface NewCarpoolRouteData {
  origin: { address: string; latitude: number; longitude: number };
  destination: { address: string; latitude: number; longitude: number };
  departureTime: string; // ISO string
  availableSeats: number;
  vehicleDetails?: string;
  fare?: number;
}
// -- END OF NEW INTERFACES --

// Notification Interfaces
export interface NotificationLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface NotificationReadBy {
  user: string;
  readAt: string;
}

export interface UserNotification {
  _id: string;
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  priority: NotificationPriority;
  location?: NotificationLocation;
  recipients: number;
  expiresAt?: string;
  isActive: boolean;
  createdBy: {
    _id: string;
    fullName: string;
    email?: string;
  };
  sentAt?: string;
  readBy: NotificationReadBy[];
  tags?: string[];
  attachments?: NotificationAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface NotificationAttachment {
  url: string;
  type: string;
  name: string;
}

// Notification Types
export type NotificationType =
  | "traffic_jam"
  | "road_closure"
  | "construction"
  | "accident"
  | "weather_warning"
  | "flooding"
  | "landslide"
  | "bridge_closure"
  | "detour"
  | "maintenance"
  | "emergency"
  | "event"
  | "info"
  | "warning"
  | "success";

export type NotificationStatus = "draft" | "active" | "inactive" | "expired";
export type NotificationPriority = "low" | "medium" | "high" | "urgent";

// Transportation Types
export type TransportationType =
  | "bus"
  | "metro"
  | "taxi"
  | "walking"
  | "cycling"
  | "carpooling"
  | "train"
  | "auto";

// Notification Configuration
export const NOTIFICATION_CONFIG = {
  traffic_jam: {
    icon: "🚗",
    label: "Traffic Jam",
    color: "border-orange-500 bg-orange-500/10",
  },
  road_closure: {
    icon: "🚧",
    label: "Road Closure",
    color: "border-red-500 bg-red-500/10",
  },
  construction: {
    icon: "🏗️",
    label: "Construction",
    color: "border-yellow-500 bg-yellow-500/10",
  },
  accident: {
    icon: "⚠️",
    label: "Accident",
    color: "border-red-600 bg-red-600/10",
  },
  weather_warning: {
    icon: "🌧️",
    label: "Weather Warning",
    color: "border-blue-500 bg-blue-500/10",
  },
  flooding: {
    icon: "🌊",
    label: "Flooding",
    color: "border-blue-600 bg-blue-600/10",
  },
  landslide: {
    icon: "🏔️",
    label: "Landslide",
    color: "border-gray-600 bg-gray-600/10",
  },
  bridge_closure: {
    icon: "🌉",
    label: "Bridge Closure",
    color: "border-purple-500 bg-purple-500/10",
  },
  detour: {
    icon: "↩️",
    label: "Detour",
    color: "border-indigo-500 bg-indigo-500/10",
  },
  maintenance: {
    icon: "🔧",
    label: "Maintenance",
    color: "border-gray-500 bg-gray-500/10",
  },
  emergency: {
    icon: "🚨",
    label: "Emergency",
    color: "border-red-700 bg-red-700/10",
  },
  event: {
    icon: "📅",
    label: "Event",
    color: "border-green-500 bg-green-500/10",
  },
  info: {
    icon: "ℹ️",
    label: "Information",
    color: "border-blue-400 bg-blue-400/10",
  },
  warning: {
    icon: "⚠️",
    label: "Warning",
    color: "border-yellow-600 bg-yellow-600/10",
  },
  success: {
    icon: "✅",
    label: "Success",
    color: "border-green-600 bg-green-600/10",
  },
} as const;

// Transportation Mode Configuration
export const TRANSPORT_CONFIG = {
  bus: {
    icon: "🚌",
    label: "Bus",
    color: "bg-blue-500",
  },
  metro: {
    icon: "🚇",
    label: "Metro",
    color: "bg-green-500",
  },
  taxi: {
    icon: "🚖",
    label: "Taxi",
    color: "bg-yellow-500",
  },
  walking: {
    icon: "🚶",
    label: "Walking",
    color: "bg-gray-500",
  },
  cycling: {
    icon: "🚴",
    label: "Cycling",
    color: "bg-emerald-500",
  },
  carpooling: {
    icon: "🚗",
    label: "Carpooling",
    color: "bg-purple-500",
  },
  train: {
    icon: "🚂",
    label: "Train",
    color: "bg-indigo-500",
  },
  auto: {
    icon: "🛺",
    label: "Auto",
    color: "bg-orange-500",
  },
} as const;

// Priority Colors
export const PRIORITY_COLORS = {
  low: "text-green-400",
  medium: "text-yellow-400",
  high: "text-orange-400",
  urgent: "text-red-400",
} as const;

// Status Colors
export const STATUS_COLORS = {
  draft: "text-gray-400 bg-gray-400/10",
  active: "text-green-400 bg-green-400/10",
  inactive: "text-yellow-400 bg-yellow-400/10",
  expired: "text-red-400 bg-red-400/10",
} as const;

// API Response Interface
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
  token?: string;
  user?: User;
}

// Notifications Response
export interface NotificationsResponse {
  notifications: UserNotification[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalNotifications: number;
    hasNext: boolean;
    hasPrev: boolean;
    limit: number;
  };
}

// Notification Filters
export interface NotificationFilters {
  page?: number;
  limit?: number;
  type?: string;
  priority?: string;
  status?: string;
  search?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Admin Notification Creation
export interface CreateNotificationData {
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  location?: NotificationLocation;
  expiresAt?: string;
  tags?: string[];
  attachments?: NotificationAttachment[];
}

// Admin Notification Update
export interface UpdateNotificationData
  extends Partial<CreateNotificationData> {
  status?: NotificationStatus;
  isActive?: boolean;
}

// Admin Statistics
export interface NotificationStats {
  statusStats: Array<{ _id: NotificationStatus; count: number }>;
  typeStats: Array<{ _id: NotificationType; count: number }>;
  priorityStats: Array<{ _id: NotificationPriority; count: number }>;
  totalRecipients: number;
  recentNotifications: UserNotification[];
  activeNotificationsCount: number;
  totalNotifications: number;
}

// Error Interface
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// Theme Constants
export const THEME_COLORS = {
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
  },
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },
} as const;

// Animation Constants
export const ANIMATIONS = {
  fadeIn: "animate-fadeIn",
  fadeOut: "animate-fadeOut",
  slideUp: "animate-slideUp",
  slideDown: "animate-slideDown",
  bounce: "animate-bounce",
  pulse: "animate-pulse",
  spin: "animate-spin",
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  user: {
    fullName: {
      minLength: 2,
      maxLength: 50,
      required: true,
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    phone: {
      pattern: /^[+]?[\d\s\-\(\)]{10,15}$/,
    },
  },
  notification: {
    title: {
      minLength: 3,
      maxLength: 200,
      required: true,
    },
    message: {
      minLength: 10,
      maxLength: 1000,
      required: true,
    },
    type: {
      required: true,
      enum: [
        "traffic_jam",
        "road_closure",
        "construction",
        "accident",
        "weather_warning",
        "flooding",
        "landslide",
        "bridge_closure",
        "detour",
        "maintenance",
        "emergency",
        "event",
        "info",
        "warning",
        "success",
      ],
    },
    priority: {
      required: true,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
  },
  location: {
    latitude: {
      min: -90,
      max: 90,
      required: false,
    },
    longitude: {
      min: -180,
      max: 180,
      required: false,
    },
    radius: {
      min: 1,
      max: 1000,
      default: 50,
    },
    accuracy: {
      min: 0,
      max: 100000,
    },
  },
  pagination: {
    page: {
      min: 1,
      default: 1,
    },
    limit: {
      min: 1,
      max: 100,
      default: 20,
    },
  },
} as const;

// Default Values
export const DEFAULT_VALUES = {
  user: {
    theme: "system" as const,
    language: "en",
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    transportation: {
      preferredModes: [] as TransportationType[],
      defaultRadius: 5,
    },
    locationPreferences: {
      shareLocation: true,
      trackingEnabled: false,
      allowNotifications: true,
      radius: 50,
    },
    stats: {
      totalTrips: 0,
      totalDistance: 0,
      co2Saved: 0,
      moneySaved: 0,
    },
  },
  notification: {
    priority: "medium" as NotificationPriority,
    type: "info" as NotificationType,
    status: "draft" as NotificationStatus,
    isActive: true,
    recipients: 0,
  },
  pagination: {
    page: 1,
    limit: 20,
  },
  location: {
    radius: 50, // km
    accuracy: 10, // meters
  },
  filters: {
    type: "all",
    priority: "all",
    status: "all",
  },
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  locationBasedNotifications: true,
  pushNotifications: true,
  emailNotifications: true,
  smsNotifications: false,
  realTimeUpdates: true,
  advancedFiltering: true,
  bulkOperations: true,
  exportData: true,
  analytics: true,
  darkMode: true,
  carpooling: true,
  liveTracking: true,
  nearbyUsers: true,
  weatherIntegration: true,
  routeOptimization: true,
} as const;

// App Configuration
export const APP_CONFIG = {
  name: "HappYatra",
  version: "1.0.0",
  description: "Smart Travel Notification System",
  author: "HappYatra Team",
  supportEmail: "support@happyatra.com",
  maxFileUploadSize: 5 * 1024 * 1024, // 5MB
  supportedImageTypes: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ],
  supportedDocumentTypes: [
    "application/pdf",
    "application/msword",
    "text/plain",
  ],
  defaultLanguage: "en",
  supportedLanguages: ["en", "hi", "es", "fr"],
  timezone: "Asia/Kolkata",
  dateFormat: "DD/MM/YYYY",
  timeFormat: "HH:mm",
  currency: "INR",
  map: {
    defaultZoom: 15,
    maxZoom: 20,
    minZoom: 5,
    defaultCenter: {
      latitude: 28.6139, // New Delhi
      longitude: 77.209,
    },
  },
  location: {
    updateInterval: 30000, // 30 seconds for live tracking
    significantDistance: 50, // meters - minimum distance to trigger update
    maxLocationAge: 300000, // 5 minutes - max age of cached location
    highAccuracyTimeout: 15000, // 15 seconds timeout for high accuracy
    lowAccuracyTimeout: 30000, // 30 seconds timeout for low accuracy
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  location: {
    notSupported: "Location services are not supported by your browser",
    permissionDenied:
      "Location access denied. Please enable location permissions.",
    positionUnavailable:
      "Unable to retrieve your location. Please check your GPS settings.",
    timeout: "Location request timed out. Please try again.",
    networkError:
      "Network error while getting location. Please check your connection.",
    unknownError: "An unknown error occurred while getting your location.",
  },
  api: {
    networkError: "Network error. Please check your internet connection.",
    serverError: "Server error. Please try again later.",
    unauthorized: "Session expired. Please log in again.",
    forbidden: "You don't have permission to perform this action.",
    notFound: "The requested resource was not found.",
    validationError: "Please check your input and try again.",
    uploadError: "File upload failed. Please try again.",
    fileTooLarge: "File is too large. Maximum size is 5MB.",
    invalidFileType: "Invalid file type. Only images are allowed.",
  },
  user: {
    profileUpdateFailed: "Failed to update profile. Please try again.",
    locationUpdateFailed: "Failed to update location. Please try again.",
    statsUpdateFailed: "Failed to update statistics. Please try again.",
    accountDeleteFailed: "Failed to delete account. Please try again.",
  },
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  user: {
    profileUpdated: "Profile updated successfully!",
    locationUpdated: "Location updated successfully!",
    preferencesUpdated: "Preferences updated successfully!",
    statsUpdated: "Statistics updated successfully!",
    avatarUploaded: "Profile picture updated successfully!",
    accountDeleted: "Account deleted successfully!",
  },
  location: {
    detected: "Location detected successfully!",
    trackingEnabled: "Live tracking enabled!",
    trackingDisabled: "Live tracking disabled!",
    updated: "Location updated!",
  },
} as const;

// Loading Messages
export const LOADING_MESSAGES = {
  location: {
    detecting: "Detecting your location...",
    updating: "Updating your location...",
    tracking: "Tracking your location...",
  },
  user: {
    loading: "Loading your profile...",
    updating: "Updating your profile...",
    uploading: "Uploading image...",
    deleting: "Deleting account...",
  },
  api: {
    connecting: "Connecting to server...",
    processing: "Processing your request...",
  },
} as const;

// Time Constants
export const TIME_CONSTANTS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
} as const;

// Distance Constants (in meters)
export const DISTANCE_CONSTANTS = {
  METER: 1,
  KILOMETER: 1000,
  MILE: 1609.34,
  SIGNIFICANT_MOVE: 50, // meters
  NEARBY_RADIUS: 5000, // 5km
  MAX_SEARCH_RADIUS: 100000, // 100km
} as const;

// Local Storage Keys for different data types
export const CACHE_KEYS = {
  LOCATION_CACHE: "location_cache",
  USER_PREFERENCES_CACHE: "user_preferences_cache",
  NOTIFICATION_CACHE: "notification_cache",
  ROUTE_CACHE: "route_cache",
  WEATHER_CACHE: "weather_cache",
} as const;

// Export everything as default as well for convenience
export default {
  API_BASE_URL,
  API_ENDPOINTS,
  STORAGE_KEYS,
  NOTIFICATION_CONFIG,
  TRANSPORT_CONFIG,
  PRIORITY_COLORS,
  STATUS_COLORS,
  THEME_COLORS,
  ANIMATIONS,
  VALIDATION_RULES,
  DEFAULT_VALUES,
  FEATURE_FLAGS,
  APP_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  LOADING_MESSAGES,
  TIME_CONSTANTS,
  DISTANCE_CONSTANTS,
  CACHE_KEYS,
};
