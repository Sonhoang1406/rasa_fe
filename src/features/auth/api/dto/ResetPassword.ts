export interface ResetPasswordRequest {
  id: string;
  otp: string;
  password: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>; // hoặc {}
}