export interface Rule {
    _id: string;
    name: string;
    desc: string;
    steps: Array<{
      intent: string | null;
      action: string | null;
    }>;
    deleted: boolean;
    deletedAt: string | null;
    deleteAfter: string | null;
  }
  
  export interface RuleListResponse {
    success: boolean;
    data: Rule[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }
  
  export interface RuleResponse {
    success: boolean;
    data: Rule;
  }
  
  export interface CreateRuleRequest {
    name: string;
    desc: string;
    steps: Array<{
      intent: string | null;
      action: string | null;
    }>;
  }
  
  export interface UpdateRuleRequest {
    name: string;
    desc: string;
    steps: Array<{
      intent: string | null;
      action: string | null;
    }>;
  }