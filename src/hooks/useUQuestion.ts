import { useState } from "react";
import { uquestionService } from "../lib/api/services/uquestion-service";
import { UQuestionListResponse, CreateUQuestionRequest, UpdateUQuestionRequest } from "@/lib/types/uquestion-type";

export const useUQuestions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUQuestions = async (query: string): Promise<UQuestionListResponse> => {
    setIsLoading(true);
    try {
      const response = await uquestionService.getAllUQuestions(query);
      setError(null);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch user questions";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const createUQuestion = async (data: CreateUQuestionRequest) => {
    setIsLoading(true);
    try {
      await uquestionService.createUQuestion(data);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create user question";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUQuestion = async (id: string, data: UpdateUQuestionRequest) => {
    setIsLoading(true);
    try {
      await uquestionService.updateUQuestion(id, data);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update user question";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUQuestion = async (id: string) => {
    setIsLoading(true);
    try {
      await uquestionService.deleteUQuestion(id);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete user question";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchUQuestions, createUQuestion, updateUQuestion, deleteUQuestion, isLoading, error };
};