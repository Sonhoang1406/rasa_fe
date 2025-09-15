import { useState } from "react";
import { modelService } from "../lib/api/services/model-service";
import { ModelListResponse, LoadModelRequest, TrainModelRequest } from "@/lib/types/model-type";

export const useModels = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchModels = async (query: string): Promise<ModelListResponse> => {
    setIsLoading(true);
    try {
      const response = await modelService.getAllModels(query);
      setError(null);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch models";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadModel = async (chatbotId: string, data: LoadModelRequest) => {
    setIsLoading(true);
    try {
      await modelService.loadModel(chatbotId, data);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load model";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const trainModel = async (chatbotId: string, data: TrainModelRequest) => {
    setIsLoading(true);
    try {
      await modelService.trainModel(chatbotId, data);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to train model";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

 const deleteModel = async (id: string) => {
  setIsLoading(true);
  try {
    await modelService.deleteModel(id);
    setError(null);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete model";
    setError(message);
    throw new Error(message);
  } finally {
    setIsLoading(false);
  }
};

  return { fetchModels, loadModel, trainModel,deleteModel, isLoading, error };
};