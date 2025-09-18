export const AUTH_ENDPOINTS = {
  LOGIN: "api/v1/auth/login",
  REGISTER: "/users/register",
  FORGOT_PASSWORD: "/users/forgot-password",
  RESET_PASSWORD: "/users/reset-password",
  VERIFY: "/users/verify",
  LOGOUT: "/users/logout",
  REFRESH_TOKEN: "/users/refresh-token",
};

export const USER_ENDPOINTS = {
  PROFILE: "v1/auth/me",
  CHANGE_PASSWORD: "/users/password",
  UPDATE_AVATAR: "/users/avatar",
  UPDATE_PASSWORD: "/users/password",
};

export const ADMIN_ENDPOINTS = {
  GET_ALL_USERS: (query: string) => `/admin/users${query}`,
  BAN_USER: (id: string) => `/admin/users/${id}/ban`,
  UNBAN_USER: (id: string) => `/admin/users/${id}/unban`,
  GET_USER_DEVICES: (id: string) => `/admin/users/${id}/devices`,
  LOGOUT_USER_DEVICES: (id: string) => `/admin/users/${id}/devices`,
};

export const INTENT_ENPOINTS = {
  GET_ALL_INTENTS: (query: string) => `/intents${query}`,
  CREATE_INTENT: "/intents",
  UPDATE_INTENT: (id: string) => `/intents/${id}`,
  DELETE_INTENT: (id: string) => `/intents/${id}`,
  RESTORE_INTENT: (id: string) => `/intents/${id}/restore`,
};

export const ACTION_ENPOINTS = {
  GET_ALL_ACTIONS: (query: string) => `/actions${query}`,
  CREATE_ACTIONS: "/actions",
  UPDATE_ACTIONS: (id: string) => `/actions/${id}`,
  DELETE_ACTIONS: (id: string) => `/actions/${id}`,
};

export const SLOT_ENDPOINTS = {
  GET_ALL_SLOT: (query: string) => `/slots${query}`,
  CREATE_SLOT: "/slots",
  UPDATE_SLOT: (id: string) => `/slots/${id}`,
  DELETE_SLOT: (id: string) => `/slots/${id}`,
};

export const ENTITIES_ENDPOINTS = {
  GET_ALL_ENTITIES: (query: string) => `/entities${query}`,
  CREATE_ENTITIES: "/entities",
  UPDATE_ENTITIES: (id: string) => `/entities/${id}`,
  DELETE_ENTITIES: (id: string) => `/entities/${id}`,
  RESTORE_ENTITIES: (id: string) => `/entities/${id}/restore`,
};

export const STORIES_ENDPOINTS = {
  GET_ALL_STORIES: (query: string) => `/stories${query}`,
  CREATE_STORIES: "/stories",
  UPDATE_STORIES: (id: string) => `/stories/${id}`,
  DELETE_STORIES: (id: string) => `/stories/${id}`,
};

export const RESPONSE_ENPOINTS = {
  GET_ALL_RESPONSES: (query: string) => `/responses${query}`,
  CREATE_RESPONSE: "/responses",
  UPDATE_RESPONSE: (id: string) => `/responses/${id}`,
  DELETE_RESPONSE: (id: string) => `/responses/${id}`,
};

export const CHATBOT_ENDPOINTS = {
  GET_ALL_CHATBOT: (query: string) => `/chatbots${query}`,
  CREATE_CHATBOT: "/chatbots",
  UPDATE_CHATBOT: (id: string) => `/chatbots/${id}`,
  DELETE_CHATBOT: (id: string) => `/chatbots/${id}`,
};

export const RULE_ENDPOINTS = {
  GET_ALL_RULE: (query: string) => `/rules${query}`,
  CREATE_RULE: "/rules",
  UPDATE_RULE: (id: string) => `/rules/${id}`,
  DELETE_RULE: (id: string) => `/rules/${id}`,
};

export const PERMISSION_ENDPOINTS = {
  GET_ALL_PERMISSION: (query: string) => `/permissions${query}`,
  CREATE_PERMISSION: "/permissions",
  UPDATE_PERMISSION: (id: string) => `/permissions/${id}`,
  DELETE_PERMISSION: (id: string) => `/permissions/${id}`,
};

export const ROLE_ENDPOINTS = {
  GET_ALL_ROLES: (query: string) => `/roles${query}`,
  CREATE_ROLE: "/roles",
  UPDATE_ROLE: (id: string) => `/roles/${id}`,
  DELETE_ROLE: (id: string) => `/roles/${id}`,
};

export const UQUESTION_ENDPOINTS = {
  GET_ALL_UQUESTIONS: (query: string) => `/uquestions${query}`,
  CREATE_UQUESTION: "/uquestions",
  UPDATE_UQUESTION: (id: string) => `/uquestions/${id}`,
  DELETE_UQUESTION: (id: string) => `/uquestions/${id}`,
};

export const MODEL_ENDPOINTS = {
  GET_ALL_MODELS: (query: string) => `/models${query}`,
  LOAD_MODEL: (chatbotId: string) => `/models/${chatbotId}/load`,
  TRAIN_MODEL: (chatbotId: string) => `/models/${chatbotId}/train`,
  DELETE_MODEL: (id: string) => `/models/${id}`,
};
