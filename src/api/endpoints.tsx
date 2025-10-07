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
  ROLE_ENDPOINTS: {
    GET_ALL: "/api/v1/role/all",
    GET_ALL_PAGINATED: "/api/v1/role",
    UPDATE_ROLE: "/api/v1/role",
    CREATE_ROLE: "/api/v1/role",
    DELETE_ROLE: (id: string) => `/api/v1/role/${id}/hard`,
  },
  PERMISSION_ENDPOINTS: {
    GET_ALL: "/api/v1/permission/all",
    GET_ALL_PAGINATED: "/api/v1/permission",
    UPDATE_PERMISSION: "/api/v1/permission",
    CREATE_PERMISSION: "/api/v1/permission",
    DELETE_PERMISSION: (id: string) => `/api/v1/permission/${id}/hard`,
  },
  ACTION_ENDPOINTS: {
    GET_ALL_PAGINATED: "/api/v1/action",
    GET_BY_ID: (id: string) => `/api/v1/action/${id}`,
    CREATE: "/api/v1/action",
    UPDATE: (id: string) => `/api/v1/action/${id}`,
    HARD_DELETE: (id: string) => `/api/v1/action/${id}/hard`,
    SOFT_DELETE: (id: string) => `/api/v1/action/${id}/soft`,
    RESTORE: (id: string) => `/api/v1/action/${id}/restore`,
  },
} as const;
