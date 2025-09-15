import { intentService } from "@/features/intents/api/service";
import { useState, useEffect } from "react";
import { Intent, IntentRequest, IntentResponse } from "@/lib/types/intent-type";
export const useIntent = () => {
  const [intentData1, setIntentData1] = useState<Intent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const intents = async (query: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await intentService.getall(query);
      console.log("Intents response:", response); // Debug log
      if (response) {
        setIntentData1(response);
        return response;
      } else {
        throw new Error("Định dạng dữ liệu không hợp lệ từ API");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Không thể lấy danh sách intent";
      setError(errorMessage);
      console.error("Lỗi khi lấy intents:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateIntent = async (
    id: string,
    data: IntentRequest
  ): Promise<IntentResponse | undefined> => {
    try {
      const response = await intentService.updateIntent(id, data);
      console.log("Updated intent:", response); // Debug log
      return response;
    } catch (error) {
      console.error("Lỗi cập nhật intent:", error);
      throw error;
    }
  };

  const createIntent = async (data: IntentRequest): Promise<Intent> => {
    try {
      const response = await intentService.createIntent(data);
      console.log("Create intent", response);
      return response;
    } catch (error) {
      console.error("Lỗi tạo intent", error);
      throw error;
    }
  };

  const deleteIntent = async (id: string): Promise<void> => {
    try {
      await intentService.deleteIntent(id);
      console.log("Deleted intent ID:", id); // Debug log
    } catch (error) {
      console.error("Lỗi xóa intent:", error);
      throw error;
    }
  };

  const restoreIntent = async (id: string): Promise<void> => {
    try {
      await intentService.restoreIntent(id);
      console.log("Restored intent:", id);
    } catch (error) {
      console.error("Lỗi restore intent:", error);
      throw error;
    }
  }

  return {
    intentData1,
    isLoading,
    error,
    intents,
    updateIntent,
    createIntent,
    deleteIntent,
    restoreIntent,
  };
};
