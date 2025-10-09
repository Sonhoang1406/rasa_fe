import { useState } from "react";
import { ruleService } from "../lib/api/services/rule-service";
import { RuleListResponse, CreateRuleRequest, UpdateRuleRequest, RuleResponse } from "@/lib/types/rule-type";

export const useRule = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRules = async (query: string): Promise<RuleListResponse> => {
    setIsLoading(true);
    try {
      const response = await ruleService.getAllRules(query);
      setError(null);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch rules";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const createRule = async (data: CreateRuleRequest): Promise<RuleResponse> => {
    setIsLoading(true);
    try {
      const response = await ruleService.createRule(data);
      setError(null);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create rule";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateRule = async (id: string, data: UpdateRuleRequest): Promise<RuleResponse> => {
    setIsLoading(true);
    try {
      const response = await ruleService.updateRule(id, data);
      setError(null);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update rule";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRule = async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      await ruleService.deleteRule(id);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete rule";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchRules,
    createRule,
    updateRule,
    deleteRule,
    isLoading,
    error,
  };
};