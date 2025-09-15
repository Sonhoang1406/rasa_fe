export interface Model {
    _id: string;
    name: string;
    chatbot: string;
    stories: string[];
    rules: string[];
    yaml: string;
    parent: string | null;
    isActive: boolean;
    deleted: boolean;
    deletedAt: string | null;
    deleteAfter: string | null;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface ModelListResponse {
    success: boolean;
    data: Model[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }
  
  export interface LoadModelRequest {
    modelId: string;
  }
  
  export interface TrainModelRequest {
    storyIds: string[];
    ruleIds: string[];
    parentId?: string;
  }