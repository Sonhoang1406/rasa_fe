import axiosInstance from "../axios";
import { MODEL_ENDPOINTS } from "../endpoints";
import { ModelListResponse, LoadModelRequest, TrainModelRequest } from "@/lib/types/model-type";

export const modelService = {
  getAllModels: async (query: string): Promise<ModelListResponse> => {
    const response = await axiosInstance.get(MODEL_ENDPOINTS.GET_ALL_MODELS(query));
    return response.data;
  },

  loadModel: async (chatbotId: string, data: LoadModelRequest): Promise<void> => {
    await axiosInstance.post(MODEL_ENDPOINTS.LOAD_MODEL(chatbotId), data);
  },

  trainModel: async (chatbotId: string, data: TrainModelRequest): Promise<void> => {
    await axiosInstance.post(MODEL_ENDPOINTS.TRAIN_MODEL(chatbotId), data);
  },
  deleteModel : async (id: string) : Promise<void> => {
    await axiosInstance.delete(MODEL_ENDPOINTS.DELETE_MODEL(id));
  }
};