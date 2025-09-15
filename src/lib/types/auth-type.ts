import { UserProfile } from "./user-type"
export interface LoginRequest {
    usernameOrEmail: string
    password: string
  }
  
  export interface LoginResponse {
    credentialId: string
  }

  export interface RegisterRequest {
    email: string
    password: string
    name: string
    phone: string
    username: string
    address: string
    dob: string
    gender: string
  }

  export interface RegisterResponse {
    token: string
    refreshToken?: string
    user: UserProfile
  }

  export interface VerifyRequest {
    email: string
    otp: string
  }

  export interface ForgotPasswordRequest{
    email: string
  }

  export interface ForgotPasswordResponse{
    success: boolean
    data: null
    message: string
  }

  export interface ResetPasswordRequest{
    otp: string
    email: string
    newPassword: string
    newPasswordConfirm: string
  }

  export interface ResetPasswordResponse{
    success: boolean
    data: null
    message: string
  }