import { useState } from "react";
import { chatBotService } from "@/lib/api/services/chat-bot-service";
import { ChatBotListResponse, CreateChatBotRequest, UpdateChatBotRequest, ChatBot } from "@/lib/types/chat-bot-type";

export const useChatBot = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChatBots = async (query: string): Promise<ChatBotListResponse> => {
    setIsLoading(true);
    try {
      const response = await chatBotService.getAllChatBots(query);
      setError(null);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch chatbots";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const createChatBot = async (data: CreateChatBotRequest): Promise<ChatBot> => {
    setIsLoading(true);
    try {
      const response = await chatBotService.createChatBot(data);
      setError(null);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create chatbot";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateChatBot = async (id: string, data: UpdateChatBotRequest): Promise<ChatBot> => {
    setIsLoading(true);
    try {
      const response = await chatBotService.updateChatBot(id, data);
      setError(null);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update chatbot";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteChatBot = async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      await chatBotService.deleteChatBot(id);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete chatbot";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchChatBots,
    createChatBot,
    updateChatBot,
    deleteChatBot,
    isLoading,
    error,
  };
};