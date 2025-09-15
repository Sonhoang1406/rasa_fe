export interface ChatBot {
    _id: string;
    name: string;
    desc: string;
    url: string;
    isTraining: boolean;
    deleted: boolean;
    deletedAt: string | null;
    deleteAfter: string | null;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface ChatBotListResponse {
    success: boolean;
    data: ChatBot[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }
  
  export interface CreateChatBotRequest {
    name: string;
    desc: string;
    url: string;
  }
  
  export interface UpdateChatBotRequest {
    name: string;
    desc: string;
    url: string;
  }