export interface ChatBotQuery {
  page?: number;
  limit?: number;
  search?: string;
  deleted?: boolean;
  sort?: string;
  startDate?: string;
  endDate?: string;
}

export default function createChatBotQuery(query: ChatBotQuery): string {
  const params = new URLSearchParams();

  if (query.page !== undefined) params.append("page", query.page.toString());
  if (query.limit !== undefined) params.append("limit", query.limit.toString());
  if (query.search) params.append("search", query.search);
  if (query.deleted !== undefined) params.append("deleted", query.deleted.toString());
  if (query.sort) params.append("sort", query.sort);
  if (query.startDate) params.append("startDate", query.startDate);
  if (query.endDate) params.append("endDate", query.endDate);

  return params.toString();
}

export interface CreateChatBotRequest {
  name: string;
  ip: string;
  rasaPort: number;
  flaskPort: number;
  roles?: string[];
}

export interface UpdateChatBotRequest {
  _id: string;
  name: string;
  ip: string;
  rasaPort: number;
  flaskPort: number;
  roles?: string[];
}

export interface SendModelRequest {
  modelId: string;
}

export interface RunModelRequest {
  modelName: string;
}

export interface PushActionRequest {
  modelId?: string;
  actionIds?: string[];
}

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

export interface ChatBotDetailResponse extends ChatBot {
  // Có thể thêm các trường khác nếu cần
}


// Model detail interface
export interface ModelDetail {
  _id: string;
  name: string;
  url: string;
  description?: string;
  createdAt?: string;
  chatbotId?: string;
}

// UPDATED: Thêm field details
export interface ModelsListResponse {
  models: string[];
  total: number;
  details: ModelDetail[]; 
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

export interface HealthCheckResponse {
  status: string;
  timestamp?: string;
  rasaStatus?: string;
  flaskStatus?: string;
}

export interface SendModelResponse {
  success: boolean;
  message: string;
  data?: {
    modelName?: string;
  };
}

export interface RunModelResponse {
  success: boolean;
  message: string;
  data?: {
    modelName?: string;
  };
}

export interface PushActionResponse {
  success: boolean;
  message: string;
  data?: {
    totalActions?: number;
    actionNames?: string[];
  };
}