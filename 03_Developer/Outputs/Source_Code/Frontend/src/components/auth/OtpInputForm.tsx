'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authApi } from '@/lib/auth-api';
import { useAuthFlowStore } from '@/store/auth-flow.store';
import { useGlobalStore } from '@/store/global.store';
import { AxiosError } from 'axios';

export const OtpInputForm = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { pendingUserId, otpType, pendingPhone, reset } = useAuthFlowStore();
  const { setUser, setToken } = useGlobalStore();

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Vui lòng nhập đủ 6 chữ số');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await authApi.verifyOtp({
        user_id: pendingUserId!,
        otp: otpCode,
        type: otpType,
      }) as { data: { user: { id: number; phone: string; role: string; name: string }; access_token: string } };
      setUser(res.data.user);
      setToken(res.data.access_token);
      reset();
      window.location.href = '/';
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      setError(axiosErr?.response?.data?.message || 'Mã OTP không hợp lệ');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Nhập mã OTP đã gửi đến số
        </p>
        <p className="font-semibold">{pendingPhone || '***'}</p>
      </div>

      <div className="flex justify-center gap-2">
        {otp.map((digit, index) => (
          <Input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-12 h-12 text-center text-lg font-bold"
          />
        ))}
      </div>

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Đang xác thực...' : 'Xác nhận OTP'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        <button type="button" className="text-primary underline" onClick={() => reset()}>
          Quay lại đăng nhập
        </button>
      </p>
    </form>
  );
};
