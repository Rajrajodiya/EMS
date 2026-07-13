/**
 * Application Configuration
 * Centralized configuration constants for the application.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export const APP_NAME = import.meta.env.VITE_APP_NAME || "Employee Management System";

export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  THEME: "vite-ui-theme",
};

export const ROLES = {
  ADMIN: "Admin",
  EMPLOYEE: "Employee",
};

export const LEAVE_STATUS = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export const LEAVE_TYPES = [
  "Sick Leave",
  "Vacation",
  "Personal Leave",
  "Maternity Leave",
  "Paternity Leave",
  "Bereavement Leave",
  "Other",
];

export const GENDER = {
  MALE: 1,
  FEMALE: 2,
  OTHER: 3,
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/Auth/login",
    PROFILE: "/Auth/user-profile",
    UPDATE_PROFILE: "/Auth/profile-update",
  },
  EMPLOYEES: "/Employee",
  DEPARTMENTS: "/Department",
  LEAVES: {
    ALL: "/leave",
    MY: "/leave/my",
    TYPES: "/leave/types",
    STATUS: (id) => `/leave/${id}/status`,
  },
};
