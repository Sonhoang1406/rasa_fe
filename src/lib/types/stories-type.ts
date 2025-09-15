export interface Story {
  _id: string;
  name: string;
  desc: string;
  steps: Array<{ type: string, intent?: string; action?: string, intents?: string[], slot?: string[] }>;
  tags: string[];
  deleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StoryListResponse {
    success: boolean,
    data: Story[],
    meta: {
        total: number,
        page: number,
        limit: number,
        totalPages: number
    }

}

export interface StoryResponse {
  success: boolean,
  data: Story[],
  message: string
}
export interface StepStory {
  intent?: string,
  action?: string,
  type: "INTENT" | "ACTION" | "OR";
  intents?: string[],
  slots?: Array<{id: string, value: string}>
}

export interface CreateStoryRequest {
  name: string,
  desc: string
  steps: StepStory[],
  tags: string[]
}

export interface UpdateStoryRequest {
  name: string,
  desc: string,
  tags: string[],
  steps: StepStory[],
}