'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { OtpInputForm } from '@/components/auth/OtpInputForm';
import { useAuthFlowStore } from '@/store/auth-flow.store';

export default function AuthPage() {
  const { step } = useAuthFlowStore();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 py-8">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50" />
        <div className="absolute top-0 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-amber-200/40 to-orange-300/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-tr from-rose-200/40 to-pink-200/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-amber-100/20 to-transparent blur-3xl" />
      </div>

      {/* Logo + Brand */}
      <div className="animate-fade-in-up mb-6 text-center" style={{ animationDelay: '0ms' }}>
        <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25 animate-pulse-ring mb-4">
          <span className="text-4xl">🥛</span>
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">
          The Fat Milk
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Bánh & Thức uống thủ công</p>
      </div>

      {/* Auth Card */}
      <div className="animate-fade-in-up w-full max-w-md" style={{ animationDelay: '150ms', opacity: 0 }}>
        <Card className="glass border-white/50 shadow-xl shadow-amber-900/5">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl font-semibold">
              {step === 'login' && 'Chào mừng trở lại'}
              {step === 'register' && 'Tạo tài khoản mới'}
              {step === 'otp' && 'Xác thực OTP'}
            </CardTitle>
            <CardDescription className="text-sm">
              {step === 'login' && 'Đăng nhập để đặt hàng và tích điểm'}
              {step === 'register' && 'Đăng ký để nhận ưu đãi thành viên'}
              {step === 'otp' && 'Nhập mã 6 chữ số đã gửi đến điện thoại'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            {step === 'login' && <LoginForm />}
            {step === 'register' && <RegisterForm />}
            {step === 'otp' && <OtpInputForm />}
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="animate-fade-in-up mt-6 text-xs text-muted-foreground" style={{ animationDelay: '300ms', opacity: 0 }}>
        © 2026 The Fat Milk. Crafted with ❤️
      </div>
    </div>
  );
}
