export interface CreateSlotRequest {
    desc: string;
    name: string;
    type: string;
    mappings: { type: string; entity: string }[];
    values: string[];
  }

export interface UpdateSlotRequest {
    name: string;
    desc: string
    type: string;
    mappings: { type: string; entity: string }[];
    values: string[]
}

export interface Slot {
  _id: string;
  name: string;
  type: string;
  desc: string;
  mappings: { type: string; entity: string }[];
  values: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  deletedAt: string | null;

}

export interface SlotListResponse {
       success: boolean;
        data: Slot[];
        message?: string;
        meta?: {
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };

}