export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  clientId?: string;
  isPreAccess: boolean,
  preAccessType?: string;
}