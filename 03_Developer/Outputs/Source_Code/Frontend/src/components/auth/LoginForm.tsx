'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authApi } from '@/lib/auth-api';
import { useAuthFlowStore } from '@/store/auth-flow.store';
import { useGlobalStore } from '@/store/global.store';
import { AxiosError } from 'axios';

export const LoginForm = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setStep } = useAuthFlowStore();
  const { setUser, setToken } = useGlobalStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authApi.login({ phone, password }) as { data: { user: { id: number; phone: string; role: string; name: string }; access_token: string } };
      setUser(res.data.user);
      setToken(res.data.access_token);
      window.location.href = '/';
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      setError(axiosErr?.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="login-phone">Số điện thoại</Label>
        <Input
          id="login-phone"
          type="tel"
          placeholder="0901234567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="login-password">Mật khẩu</Label>
        <Input
          id="login-password"
          type="password"
          placeholder="Nhập mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Đang xử lý...' : 'Đăng nhập'}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Chưa có tài khoản?{' '}
        <button type="button" className="text-primary underline" onClick={() => setStep('register')}>
          Đăng ký
        </button>
      </p>
    </form>
  );
};
