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
    UPDATE: `${API_BASE_URL}/user/update`,
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
};

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: "happyatra_token",
  USER: "happyatra_user",
  PREFERENCES: "happyatra_preferences",
  LOCATION: "happyatra_location",
} as const;

// User Interface
export interface User {
  _id: string;
  id?: string;
  fullName: string;
  email: string;
  role: "admin" | "user" | "moderator";
  avatar?: string;
  phone?: string;
  isVerified?: boolean;
  preferences?: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

// User Preferences
export interface UserPreferences {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  location: {
    shareLocation: boolean;
    radius: number;
  };
  privacy: {
    profileVisibility: "public" | "private" | "friends";
    dataSharing: boolean;
  };
}

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

// Location Interface
export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
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
} as const;

// App Configuration
export const APP_CONFIG = {
  name: "HappYatra",
  version: "1.0.0",
  description: "Smart Travel Notification System",
  author: "HappYatra Team",
  supportEmail: "support@happyatra.com",
  maxFileUploadSize: 10 * 1024 * 1024, // 10MB
  supportedImageTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
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
} as const;

// Export everything as default as well
export default {
  API_BASE_URL,
  API_ENDPOINTS,
  STORAGE_KEYS,
  NOTIFICATION_CONFIG,
  PRIORITY_COLORS,
  STATUS_COLORS,
  THEME_COLORS,
  ANIMATIONS,
  VALIDATION_RULES,
  DEFAULT_VALUES,
  FEATURE_FLAGS,
  APP_CONFIG,
};
