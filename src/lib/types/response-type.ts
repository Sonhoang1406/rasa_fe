export interface Response {
  _id: string;
  name: string;
  examples: string[];
  deleted: boolean;
  deletedAt: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ResponseRequest  {
  name: string
  examples: string[]
}

export interface ResponseResponse {
  success: boolean;
  data: Response[];
  message?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
