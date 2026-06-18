import { create } from 'zustand';

type AuthStep = 'login' | 'register' | 'otp';

interface AuthState {
  step: AuthStep;
  pendingUserId: string | null;
  otpType: string;
  pendingPhone: string | null;
  setStep: (step: AuthStep) => void;
  setPendingUserId: (id: string) => void;
  setOtpType: (type: string) => void;
  setPendingPhone: (phone: string) => void;
  reset: () => void;
}

export const useAuthFlowStore = create<AuthState>((set) => ({
  step: 'login',
  pendingUserId: null,
  otpType: 'register',
  pendingPhone: null,
  setStep: (step) => set({ step }),
  setPendingUserId: (id) => set({ pendingUserId: id }),
  setOtpType: (type) => set({ otpType: type }),
  setPendingPhone: (phone) => set({ pendingPhone: phone }),
  reset: () => set({ step: 'login', pendingUserId: null, otpType: 'register', pendingPhone: null }),
}));
