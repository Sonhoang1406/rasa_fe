export interface Permission {
    _id: string;
    method: string;
    endPoint: string;
    desc: string;
    module: string;
    isPublic: boolean;
    deleted: boolean;
    deletedAt: string | null;
    deleteAfter: string | null;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface PermissionListResponse {
    success: boolean;
    data: Permission[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }
  
  export interface CreatePermissionRequest {
    method: string;
    endPoint: string;
    desc: string;
    module: string;
    isPublic: boolean;
  }
  
  export interface UpdatePermissionRequest {
    method: string;
    endPoint: string;
    desc: string;
    module: string;
    isPublic: boolean;
  }