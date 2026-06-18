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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reg-name">Họ và tên</Label>
        <Input
          id="reg-name"
          type="text"
          placeholder="Nguyễn Văn A"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-phone">Số điện thoại</Label>
        <Input
          id="reg-phone"
          type="tel"
          placeholder="0901234567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-password">Mật khẩu</Label>
        <Input
          id="reg-password"
          type="password"
          placeholder="Tối thiểu 8 ký tự"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Đang xử lý...' : 'Đăng ký'}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Đã có tài khoản?{' '}
        <button type="button" className="text-primary underline" onClick={() => setStep('login')}>
          Đăng nhập
        </button>
      </p>
    </form>
  );
};
