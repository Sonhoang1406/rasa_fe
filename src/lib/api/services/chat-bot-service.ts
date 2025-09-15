import axiosInstance from "../axios";
import { CHATBOT_ENDPOINTS } from "../endpoints";
import { ChatBotListResponse, CreateChatBotRequest, ChatBot, UpdateChatBotRequest } from "@/lib/types/chat-bot-type";

export const chatBotService = {
  getAllChatBots: async (query: string): Promise<ChatBotListResponse> => {
    const response = await axiosInstance.get(CHATBOT_ENDPOINTS.GET_ALL_CHATBOT(query));
    return response.data;
  },

  createChatBot: async (data: CreateChatBotRequest): Promise<ChatBot> => {
    const response = await axiosInstance.post(CHATBOT_ENDPOINTS.CREATE_CHATBOT, data);
    return response.data;
  },

  updateChatBot: async (id: string, data: UpdateChatBotRequest): Promise<ChatBot> => {
    const response = await axiosInstance.patch(CHATBOT_ENDPOINTS.UPDATE_CHATBOT(id), data);
    return response.data;
  },

  deleteChatBot: async (id: string): Promise<void> => {
    await axiosInstance.delete(CHATBOT_ENDPOINTS.DELETE_CHATBOT(id));
  },
};