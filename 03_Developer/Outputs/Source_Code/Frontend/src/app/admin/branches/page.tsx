'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/api-client';

export default function BranchesPage() {
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    latitude: '',
    longitude: '',
  });

  const fetchBranches = async () => {
    try {
      const res = await apiClient.get('/branches') as { data: any[] };
      setBranches(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/branches', {
        ...formData,
        latitude: formData.latitude ? Number(formData.latitude) : undefined,
        longitude: formData.longitude ? Number(formData.longitude) : undefined,
      });
      setFormData({ name: '', address: '', phone: '', latitude: '', longitude: '' });
      fetchBranches();
    } catch (e) {
      alert('Tạo chi nhánh thất bại');
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold">Quản lý Chi nhánh</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Tạo Chi nhánh mới</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Tên chi nhánh</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Địa chỉ</Label>
                <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Số điện thoại</Label>
                <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Latitude</Label>
                  <Input type="number" step="any" value={formData.latitude} onChange={(e) => setFormData({ ...formData, latitude: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Longitude</Label>
                  <Input type="number" step="any" value={formData.longitude} onChange={(e) => setFormData({ ...formData, longitude: e.target.value })} />
                </div>
              </div>
              <Button type="submit" className="w-full">Tạo mới</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách Chi nhánh</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Đang tải...</p>
            ) : (
              <div className="space-y-4">
                {branches.map(b => (
                  <div key={b.id} className="p-4 rounded-xl border border-border bg-card">
                    <h3 className="font-semibold text-lg">{b.name}</h3>
                    <p className="text-sm text-muted-foreground">{b.address}</p>
                    {b.phone && <p className="text-sm">📞 {b.phone}</p>}
                    {(b.latitude && b.longitude) && (
                      <p className="text-xs text-blue-500 mt-2">📍 {b.latitude}, {b.longitude}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
