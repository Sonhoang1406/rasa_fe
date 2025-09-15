import axiosInstance from "../axios";
import { RULE_ENDPOINTS } from "../endpoints";
import { RuleListResponse, CreateRuleRequest, RuleResponse, UpdateRuleRequest } from "@/lib/types/rule-type";

export const ruleService = {
  getAllRules: async (query: string): Promise<RuleListResponse> => {
    const response = await axiosInstance.get(RULE_ENDPOINTS.GET_ALL_RULE(query));
    return response.data;
  },

  createRule: async (data: CreateRuleRequest): Promise<RuleResponse> => {
    const response = await axiosInstance.post(RULE_ENDPOINTS.CREATE_RULE, data);
    return response.data;
  },

  updateRule: async (id: string, data: UpdateRuleRequest): Promise<RuleResponse> => {
    const response = await axiosInstance.patch(RULE_ENDPOINTS.UPDATE_RULE(id), data);
    return response.data;
  },

  deleteRule: async (id: string): Promise<void> => {
    await axiosInstance.delete(RULE_ENDPOINTS.DELETE_RULE(id));
  },
};