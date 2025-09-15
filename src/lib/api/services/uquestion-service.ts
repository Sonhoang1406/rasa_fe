import axiosInstance from "../axios";
import { UQUESTION_ENDPOINTS } from "../endpoints";
import { UQuestionListResponse, CreateUQuestionRequest, UpdateUQuestionRequest } from "@/lib/types/uquestion-type";

export const uquestionService = {
  getAllUQuestions: async (query: string): Promise<UQuestionListResponse> => {
    const response = await axiosInstance.get(UQUESTION_ENDPOINTS.GET_ALL_UQUESTIONS(query));
    return response.data;
  },

  createUQuestion: async (data: CreateUQuestionRequest): Promise<void> => {
    await axiosInstance.post(UQUESTION_ENDPOINTS.CREATE_UQUESTION, data);
  },

  updateUQuestion: async (id: string, data: UpdateUQuestionRequest): Promise<void> => {
    await axiosInstance.patch(UQUESTION_ENDPOINTS.UPDATE_UQUESTION(id), data);
  },

  deleteUQuestion: async (id: string): Promise<void> => {
    await axiosInstance.delete(UQUESTION_ENDPOINTS.DELETE_UQUESTION(id));
  },
};