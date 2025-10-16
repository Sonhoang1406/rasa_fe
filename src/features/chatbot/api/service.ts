import axiosInstance from "@/api/axios";
import ENDPOINTS from "@/api/endpoints";
import { ChatBot, ChatBotDetailResponse, ListChatBotResponse,ModelsListResponse,ActionsListResponse,HealthCheckResponse, SendModelResponse, RunModelResponse, PushActionResponse } from "../api/dto/ChatBotResponse";
import { CreateChatBotRequest, UpdateChatBotRequest, SendModelRequest, RunModelRequest, PushActionRequest } from "../api/dto/ChatBotRequests";
import createChatBotQuery, { ChatBotQuery } from "../api/dto/ChatBotQuery";

export const chatBotService = {
  fetchChatBots: async (query: ChatBotQuery): Promise<ListChatBotResponse> => {
    const response = await axiosInstance.get(`${ENDPOINTS.CHATBOT_ENDPOINTS.GET_ALL_PAGINATED}?${createChatBotQuery(query)}`);
    return response.data;
  },

  createChatBot: async (data: CreateChatBotRequest): Promise<ChatBot> => {
    const response = await axiosInstance.post(ENDPOINTS.CHATBOT_ENDPOINTS.CREATE, data);
    return response.data.data;
  },

  getChatBotById: async (id: string): Promise<ChatBotDetailResponse> => {
    const response = await axiosInstance.get(ENDPOINTS.CHATBOT_ENDPOINTS.GET_BY_ID(id));
    return response.data.data;
  },

  updateChatBot: async (id: string, data: UpdateChatBotRequest): Promise<ChatBot> => {
    const response = await axiosInstance.put(ENDPOINTS.CHATBOT_ENDPOINTS.UPDATE(id), data);
    return response.data.data;
  },

  hardDeleteChatBot: async (id: string): Promise<void> => {
    await axiosInstance.delete(ENDPOINTS.CHATBOT_ENDPOINTS.HARD_DELETE(id));
  },

  softDeleteChatBot: async (id: string): Promise<void> => {
    await axiosInstance.delete(ENDPOINTS.CHATBOT_ENDPOINTS.SOFT_DELETE(id));
  },

  restoreChatBot: async (id: string): Promise<void> => {
    await axiosInstance.patch(ENDPOINTS.CHATBOT_ENDPOINTS.RESTORE(id));
  },
   // Additional operations from backend
  getModelsList: async (id: string): Promise<ModelsListResponse> => {
    const response = await axiosInstance.get(ENDPOINTS.CHATBOT_ENDPOINTS.GET_MODELS_LIST(id));
    return response.data.data;
  },

  getActionsList: async (id: string): Promise<ActionsListResponse> => {
    const response = await axiosInstance.get(ENDPOINTS.CHATBOT_ENDPOINTS.GET_ACTIONS_LIST(id));
    return response.data.data;
  },

  healthCheck: async (id: string): Promise<HealthCheckResponse> => {
    const response = await axiosInstance.get(ENDPOINTS.CHATBOT_ENDPOINTS.HEALTH_CHECK(id));
    return response.data.data;
  },

  sendModel: async (id: string, data: SendModelRequest): Promise<SendModelResponse> => {
    const response = await axiosInstance.post(ENDPOINTS.CHATBOT_ENDPOINTS.SEND_MODEL(id),data);
    return response.data.data;
  },

  runModel: async (id: string, data: RunModelRequest): Promise<RunModelResponse> => {
    const response = await axiosInstance.post(ENDPOINTS.CHATBOT_ENDPOINTS.RUN_MODEL(id),data);
    return response.data.data;
  },

  pushAction: async (id: string, data: PushActionRequest): Promise<PushActionResponse> => {
    const response = await axiosInstance.post(ENDPOINTS.CHATBOT_ENDPOINTS.PUSH_ACTION(id),data);
    return response.data.data;
  },
};