'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
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
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) { setError('Vui lòng nhập đủ 6 chữ số'); return; }
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
      <div className="text-center space-y-1">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 mb-2">
          <span className="text-3xl">📱</span>
        </div>
        <p className="text-sm text-muted-foreground">Mã OTP đã gửi đến</p>
        <p className="font-bold text-lg tracking-wider">{pendingPhone || '***'}</p>
      </div>

      <div className="flex justify-center gap-3" onPaste={handlePaste}>
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-border/60 bg-white/60 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:bg-white outline-none transition-all duration-200"
          />
        ))}
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 text-center">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg shadow-amber-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-0.5"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            Đang xác thực...
          </span>
        ) : 'Xác nhận OTP'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        <button type="button" className="font-semibold text-amber-600 hover:text-amber-700 underline underline-offset-4 transition-colors" onClick={() => reset()}>
          ← Quay lại
        </button>
      </p>
    </form>
  );
};
