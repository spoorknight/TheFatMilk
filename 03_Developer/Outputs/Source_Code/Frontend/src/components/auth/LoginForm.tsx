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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="login-phone" className="text-sm font-medium">Số điện thoại</Label>
        <Input
          id="login-phone"
          type="tel"
          placeholder="0901 234 567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="h-12 rounded-xl bg-white/60 border-white/80 focus:bg-white transition-colors"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="login-password" className="text-sm font-medium">Mật khẩu</Label>
        <Input
          id="login-password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-12 rounded-xl bg-white/60 border-white/80 focus:bg-white transition-colors"
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
        ) : 'Đăng nhập'}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/50" /></div>
        <div className="relative flex justify-center text-xs"><span className="bg-transparent px-2 text-muted-foreground">hoặc</span></div>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Chưa có tài khoản?{' '}
        <button
          type="button"
          className="font-semibold text-amber-600 hover:text-amber-700 underline underline-offset-4 transition-colors"
          onClick={() => setStep('register')}
        >
          Đăng ký ngay
        </button>
      </p>
    </form>
  );
};
