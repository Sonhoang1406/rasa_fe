export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  success: boolean;         
  message: string;          
  user?: {
    id: string;
    name: string;
    email: string;
  };                        
  accessToken?: string; 
  clientId?: string;
  refreshToken?: string;
  isPreAccess?: boolean;
  preAccessType?: string;       
  errors?: Record<string, string>; 
}