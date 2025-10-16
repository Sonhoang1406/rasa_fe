export interface ChatBot {
  _id: string;
  name: string;
  ip: string;
  rasaPort: number;
  flaskPort: number;
  roles: (string | { _id: string; name?: string })[];
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  url?: string;
}

export interface ListChatBotResponse {
  success: boolean;
  data: ChatBot[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ChatBotDetailResponse extends ChatBot {}

export interface ModelDetail {
  _id: string;
  name: string;
  url: string;
  description?: string;
  createdAt?: string;
  chatbotId?: string;
}

export interface ModelsListResponse {
  models: string[]; // models in Rasa
  total: number;
  details: ModelDetail[]; // models in MongoDB
}

export interface ActionsListResponse {
  actions: Array<{
    _id: string;
    name: string;
    description?: string;
    code?: string;
    createdAt?: string;
  }>;
  total: number;
}

export interface ServiceStatus {
  error?: string;
  status: "running" | "not_responding" | "offline";
}

export interface HealthCheckResponse {
  success: boolean;
  data: {
    [serviceName: string]: ServiceStatus;
  };
  message: string;
}

export interface SendModelResponse {
  success: boolean;
  message: string;
  data?: Record<string, any>;
}

export interface RunModelResponse {
  success: boolean;
  message: string;
  data?: Record<string, any>;
}

export interface PushActionResponse {
  success: boolean;
  message: string;
  data?: Record<string, any>;
}
export interface RunActionResponse {
  success: boolean;
  message: string;
  data?: any;
}