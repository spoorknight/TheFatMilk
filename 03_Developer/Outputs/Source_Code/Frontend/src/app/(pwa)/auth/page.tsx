'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { OtpInputForm } from '@/components/auth/OtpInputForm';
import { useAuthFlowStore } from '@/store/auth-flow.store';

export default function AuthPage() {
  const { step } = useAuthFlowStore();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto mb-2 text-3xl font-bold text-primary">
            The Fat Milk
          </div>
          <CardTitle className="text-xl">
            {step === 'login' && 'Đăng nhập'}
            {step === 'register' && 'Đăng ký tài khoản'}
            {step === 'otp' && 'Xác thực OTP'}
          </CardTitle>
          <CardDescription>
            {step === 'login' && 'Nhập số điện thoại và mật khẩu để tiếp tục'}
            {step === 'register' && 'Tạo tài khoản mới để đặt hàng'}
            {step === 'otp' && 'Nhập mã xác thực đã gửi đến điện thoại'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'login' && <LoginForm />}
          {step === 'register' && <RegisterForm />}
          {step === 'otp' && <OtpInputForm />}
        </CardContent>
      </Card>
    </div>
  );
}
