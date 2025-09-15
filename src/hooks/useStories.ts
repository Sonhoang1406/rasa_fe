import { StoryListResponse, Story, CreateStoryRequest, StoryResponse, UpdateStoryRequest } from "@/lib/types/stories-type";
import { useState } from "react";
import { storiesService } from "@/lib/api/services/stories-service";
export const useStories = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStories = async (query: string): Promise<StoryListResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await storiesService.getAllStories(query);
      console.log("API response:", response); // Debug log
      if (response.success && Array.isArray(response.data)) {
        setStories(response.data);
        return response;
      } else {
        throw new Error("Định dạng dữ liệu không hợp lệ từ API");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Không thể lấy danh sách story";
      setError(errorMessage);
      console.error("Lỗi khi lấy stories:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createStory = async (data: CreateStoryRequest): Promise<StoryResponse> => {
    try {
      const response = await storiesService.createStory(data);
      console.log("Created story:", response); 
      if (response.success) {
        return response;
      } else {
        throw new Error("Không thể tạo story");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Không thể tạo story";
      console.error("Lỗi tạo story:", error);
      throw new Error(errorMessage);
    }
  };

  const deleteStory = async (id: string): Promise<void> => {
    try {
      await storiesService.deleteStory(id);
      console.log("Deleted story ID:", id); // Debug log
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Không thể xóa story";
      console.error("Lỗi xóa story:", error);
      throw new Error(errorMessage);
    }
  };

  const updateStory = async (id: string, data: UpdateStoryRequest): Promise<StoryResponse> => {
    try {
      const response = await storiesService.updateStory(data, id);
      console.log("Updated story:", response); // Debug log
      if (response.success) {
        return response;
      } else {
        throw new Error("Không thể cập nhật story");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Không thể cập nhật story";
      console.error("Lỗi cập nhật story:", error);
      throw new Error(errorMessage);
    }
  };

  return {
    stories,
    isLoading,
    error,
    fetchStories,
    createStory,
    deleteStory,
    updateStory
  };
};