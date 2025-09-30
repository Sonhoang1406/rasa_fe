export default {
  AUTH_ENDPOINTS: {
    REFRESH_TOKEN: "/api/v1/auth/washing",
    LOGIN: "/api/v1/auth/login",
    LOGOUT: "/api/v1/auth/logout",
    REGISTER: "/api/v1/auth/register",
    VERIFY: "/api/v1/auth/verify-email",
    ME: "/api/v1/auth/me",
    UPDATE_ME: "/api/v1/auth/me",
  },
  USER_ENDPOINTS: {
    PROFILE: "/api/v1/user/profile",
  },
} as const;
