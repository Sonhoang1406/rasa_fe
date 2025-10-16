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
  modelName: string;
}

export interface RunModelRequest {
  modelName: string;
}

export interface PushActionRequest {
  modelId?: string;
  actionIds?: string[];
}