export interface ChatBotQuery {
  page?: number;
  limit?: number;
  search?: string;
  deleted?: boolean;
  sort?: string;
  startDate?: string;
  endDate?: string;
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
  modelId: string;  // ID của model trong MongoDB
}

export interface RunModelRequest {
  modelName: string;  // Tên file model từ Rasa
}

export interface PushActionRequest {
  modelId?: string;      // Optional: ID của model trong MongoDB
  actionIds?: string[];  // Optional: Danh sách action IDs cần push
}