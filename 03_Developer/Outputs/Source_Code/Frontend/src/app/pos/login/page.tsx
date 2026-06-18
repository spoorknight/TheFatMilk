'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { authApi } from '@/lib/auth-api';
import { useGlobalStore } from '@/store/global.store';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

export default function PosLoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser, setToken } = useGlobalStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authApi.login({ phone, password }) as {
        data: { user: { id: number; phone: string; role: string; name: string }; access_token: string };
      };
      if (!['staff', 'admin'].includes(res.data.user.role)) {
        setError('Tài khoản không có quyền truy cập POS');
        setLoading(false);
        return;
      }
      setUser(res.data.user);
      setToken(res.data.access_token);
      router.push('/pos');
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      setError(axiosErr?.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Warm gradient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900 via-orange-900 to-rose-900" />
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full bg-amber-500/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-rose-500/10 blur-3xl" />
        {/* Dots pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,.04)_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="animate-fade-in-up w-full max-w-md">
        <Card className="glass-dark border-white/10 shadow-2xl shadow-black/40">
          <CardHeader className="text-center pb-2 space-y-4">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <span className="text-3xl">☕</span>
            </div>
            <div>
              <CardTitle className="text-xl text-white">Staff POS</CardTitle>
              <CardDescription className="text-amber-200/60 mt-1">
                Hệ thống bán hàng The Fat Milk
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="pos-phone" className="text-sm font-medium text-amber-100/80">Số điện thoại</Label>
                <Input
                  id="pos-phone"
                  type="tel"
                  placeholder="0901 234 567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-amber-200/30 focus:bg-white/10 focus:border-amber-500/50 transition-colors"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pos-password" className="text-sm font-medium text-amber-100/80">Mật khẩu</Label>
                <Input
                  id="pos-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-amber-200/30 focus:bg-white/10 focus:border-amber-500/50 transition-colors"
                  required
                />
              </div>

              {error && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-300">
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
                    Đang xử lý...
                  </span>
                ) : 'Bắt đầu ca làm việc'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-amber-200/30 mt-6">
          Dành cho nhân viên The Fat Milk
        </p>
      </div>
    </div>
  );
}
