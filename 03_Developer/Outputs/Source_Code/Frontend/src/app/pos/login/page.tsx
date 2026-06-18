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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 px-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto mb-2 text-3xl font-bold text-amber-800">
            ☕ Staff POS
          </div>
          <CardTitle className="text-xl">Đăng nhập POS</CardTitle>
          <CardDescription>
            Dành cho nhân viên The Fat Milk
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pos-phone">Số điện thoại</Label>
              <Input
                id="pos-phone"
                type="tel"
                placeholder="0901234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pos-password">Mật khẩu</Label>
              <Input
                id="pos-password"
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={loading}>
              {loading ? 'Đang xử lý...' : 'Đăng nhập POS'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
