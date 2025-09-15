
export interface Entity {
    _id: string;
    name: string;
    type: string;
    examples: string[];
    regexPattern: string | null;
    createdAt: string;
    updatedAt: string;
    deleted: boolean;
    deletedAt: string | null;
  }
  

export interface EntitiesRequest  {
    name: string;
    type: string;
    examples: string[];
    regexPattern: string | null;
}

export interface EntitiesResponse {
    success: boolean;
    data: Entity[];
    message?: string;
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }

