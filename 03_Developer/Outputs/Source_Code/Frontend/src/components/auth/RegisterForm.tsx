'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authApi } from '@/lib/auth-api';
import { useAuthFlowStore } from '@/store/auth-flow.store';
import { AxiosError } from 'axios';

export const RegisterForm = () => {
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setStep, setPendingUserId, setOtpType, setPendingPhone } = useAuthFlowStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authApi.register({
        phone,
        password,
        full_name: fullName,
      }) as { data: { user_id: string } };
      setPendingUserId(res.data.user_id);
      setPendingPhone(phone);
      setOtpType('register');
      setStep('otp');
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      setError(axiosErr?.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="reg-name" className="text-sm font-medium">Họ và tên</Label>
        <Input
          id="reg-name"
          type="text"
          placeholder="Nguyễn Văn A"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="h-12 rounded-xl bg-white/60 border-white/80 focus:bg-white transition-colors"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-phone" className="text-sm font-medium">Số điện thoại</Label>
        <Input
          id="reg-phone"
          type="tel"
          placeholder="0901 234 567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="h-12 rounded-xl bg-white/60 border-white/80 focus:bg-white transition-colors"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-password" className="text-sm font-medium">Mật khẩu</Label>
        <Input
          id="reg-password"
          type="password"
          placeholder="Tối thiểu 8 ký tự"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-12 rounded-xl bg-white/60 border-white/80 focus:bg-white transition-colors"
          minLength={8}
          required
        />
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg shadow-amber-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-0.5 active:translate-y-0"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            Đang xử lý...
          </span>
        ) : 'Tạo tài khoản'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Đã có tài khoản?{' '}
        <button
          type="button"
          className="font-semibold text-amber-600 hover:text-amber-700 underline underline-offset-4 transition-colors"
          onClick={() => setStep('login')}
        >
          Đăng nhập
        </button>
      </p>
    </form>
  );
};
