export interface UQuestion {
    _id: string;
    title: string;
    deleted: boolean;
    deletedAt: string | null;
    deleteAfter: string | null;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface UQuestionListResponse {
    success: boolean;
    data: UQuestion[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }
  
  export interface CreateUQuestionRequest {
    title: string;
  }
  
  export interface UpdateUQuestionRequest {
    title: string;
  }