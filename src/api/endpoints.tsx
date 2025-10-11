export default {
  AUTH_ENDPOINTS: {
    REFRESH_TOKEN: "/api/v1/auth/washing",
    LOGIN: "/api/v1/auth/login",
    LOGOUT: "/api/v1/auth/logout",
    REGISTER: "/api/v1/auth/register",
    VERIFY: "/api/v1/auth/verify-email",
    FORGOT_PASSWORD: "/api/v1/auth/forgot-password",
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
  },
  ENTITY_ENDPOINTS: {
    GET_ALL_PAGINATED: "/api/v1/entity",
    GET_BY_ID: (id: string) => `/api/v1/entity/${id}`,
    CREATE: "/api/v1/entity",
    UPDATE: (id: string) => `/api/v1/entity/${id}`,
    HARD_DELETE: (id: string) => `/api/v1/entity/${id}/hard`,
    SOFT_DELETE: (id: string) => `/api/v1/entity/${id}/soft`,
    RESTORE: (id: string) => `/api/v1/entity/${id}/restore`,
  },
  INTENT_ENDPOINTS: {
    GET_ALL_PAGINATED: "/api/v1/intent",
    GET_BY_ID: (id: string) => `/api/v1/intent/${id}`,
    CREATE: "/api/v1/intent",
    UPDATE: (id: string) => `/api/v1/intent/${id}`,
    HARD_DELETE: (id: string) => `/api/v1/intent/${id}/hard`,
    SOFT_DELETE: (id: string) => `/api/v1/intent/${id}/soft`,
    RESTORE: (id: string) => `/api/v1/intent/${id}/restore`,
  },
  RESPONSE_ENDPOINTS: {
    GET_ALL_PAGINATED: "/api/v1/my-response",
    GET_BY_ID: (id: string) => `/api/v1/my-response/${id}`,
    CREATE: "/api/v1/my-response",
    UPDATE: (id: string) => `/api/v1/my-response/${id}`,
    HARD_DELETE: (id: string) => `/api/v1/my-response/${id}/hard`,
    SOFT_DELETE: (id: string) => `/api/v1/my-response/${id}/soft`,
    RESTORE: (id: string) => `/api/v1/my-response/${id}/restore`,
  },

} as const;
