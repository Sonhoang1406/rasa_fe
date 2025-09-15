export interface Intent {
    _id: string;
    name: string;
    examples: string[];
    deleted: boolean;
    deletedAt: string | null;
    createdAt?: string;
    updatedAt?: string;
  }

export interface IntentRequest  {
    name: string
    examples: string[]
}

export interface IntentResponse {
    success: boolean;
    data: Intent[];
    message?: string;
    meta?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
}
