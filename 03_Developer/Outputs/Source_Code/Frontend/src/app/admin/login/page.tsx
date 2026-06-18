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

export default function AdminLoginPage() {
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

      if (res.data.user.role !== 'admin') {
        setError('Tài khoản không có quyền truy cập Admin');
        setLoading(false);
        return;
      }

      setUser(res.data.user);
      setToken(res.data.access_token);
      router.push('/admin');
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      setError(axiosErr?.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <Card className="w-full max-w-md shadow-2xl border-slate-700 bg-slate-800/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto mb-2 text-3xl font-bold text-white">
            🛠️ Admin Panel
          </div>
          <CardTitle className="text-xl text-white">Đăng nhập quản trị</CardTitle>
          <CardDescription className="text-slate-400">
            Dành cho quản trị viên The Fat Milk
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-phone" className="text-slate-300">Số điện thoại</Label>
              <Input
                id="admin-phone"
                type="tel"
                placeholder="0901234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password" className="text-slate-300">Mật khẩu</Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                required
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={loading}>
              {loading ? 'Đang xử lý...' : 'Đăng nhập Admin'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
