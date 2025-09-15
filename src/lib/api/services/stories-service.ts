import { StoryListResponse, CreateStoryRequest, StoryResponse, UpdateStoryRequest } from "@/lib/types/stories-type";
import axiosInstance from "../axios"
import { STORIES_ENDPOINTS } from "../endpoints"

export const storiesService  = {

    getAllStories: async (query: string): Promise<StoryListResponse> => {
        const response = await axiosInstance.get(STORIES_ENDPOINTS.GET_ALL_STORIES(query));
        return response.data
    },

    createStory: async (data: CreateStoryRequest): Promise<StoryResponse> => {
        const response = await axiosInstance.post(STORIES_ENDPOINTS.CREATE_STORIES, data);
        return response.data;
      },

    deleteStory: async (id: string): Promise<void> => {
        await axiosInstance.delete(STORIES_ENDPOINTS.DELETE_STORIES(id));
      },
    
    updateStory: async (data: UpdateStoryRequest,id: string): Promise <StoryResponse> => {
      const response = await axiosInstance.patch(STORIES_ENDPOINTS.UPDATE_STORIES(id), data)
      return response.data
    }
    
}