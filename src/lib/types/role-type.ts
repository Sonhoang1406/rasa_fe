export interface Role {
    _id: string;
    name: string;
    desc: string;
    permissions: string[];
    chatbots: string[];
    deleted: boolean;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface RoleListResponse {
    success: boolean;
    data: Role[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }
  
  export interface CreateRoleRequest {
    name: string;
    desc: string;
    permissions: string[];
    chatbots: string[];
  }
  
  export interface UpdateRoleRequest {
    name: string;
    desc: string;
    permissions: string[];
    chatbots: string[];
  }