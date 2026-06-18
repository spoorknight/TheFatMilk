import { apiClient } from '@/lib/api-client';

interface RegisterPayload {
  phone: string;
  password: string;
  full_name: string;
}

interface LoginPayload {
  phone: string;
  password: string;
}

interface VerifyOtpPayload {
  user_id: string;
  otp: string;
  type: string;
}

export const authApi = {
  register: (data: RegisterPayload) =>
    apiClient.post('/auth/register', data),

  verifyOtp: (data: VerifyOtpPayload) =>
    apiClient.post('/auth/verify-otp', data),

  login: (data: LoginPayload) =>
    apiClient.post('/auth/login', data),

  getMe: () =>
    apiClient.get('/auth/me'),
};
