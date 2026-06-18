'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { apiClient } from '@/lib/api-client';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // For simplicity, just basic product creation
  const [formData, setFormData] = useState({
    categoryId: '',
    name: '',
    slug: '',
    sku: '',
    costPrice: '',
    sellingPrice: '',
    isSeasonal: false,
    allergens: '',
  });

  const [files, setFiles] = useState<FileList | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await apiClient.get('/products') as { data: any[] };
      setProducts(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    // We assume categories exist. If not, we should have a generic category API.
    // For now we mock it or fetch from real API if implemented.
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value.toString());
    });

    if (files) {
      for (let i = 0; i < files.length; i++) {
        data.append('gallery', files[i]);
      }
    }

    try {
      // Note: apiClient defaults to application/json, we need to let browser set boundary
      await apiClient.post('/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchProducts();
    } catch (e) {
      alert('Tạo sản phẩm thất bại');
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold">Quản lý Sản phẩm</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Tạo Sản phẩm mới</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Category ID (Tạm nhập UUID)</Label>
                <Input value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Tên SP</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })} required />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Mã SKU</Label>
                <Input value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Giá vốn (VND)</Label>
                  <Input type="number" value={formData.costPrice} onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Giá bán (VND)</Label>
                  <Input type="number" value={formData.sellingPrice} onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Chất gây dị ứng (Allergens)</Label>
                <Input value={formData.allergens} onChange={(e) => setFormData({ ...formData, allergens: e.target.value })} placeholder="Sữa, hạt, gluten..." />
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox id="isSeasonal" checked={formData.isSeasonal} onCheckedChange={(c) => setFormData({ ...formData, isSeasonal: !!c })} />
                <Label htmlFor="isSeasonal">Sản phẩm theo mùa</Label>
              </div>
              <div className="space-y-2 pt-2">
                <Label>Upload Ảnh (Gallery)</Label>
                <Input type="file" multiple accept="image/*" onChange={(e) => setFiles(e.target.files)} />
              </div>
              <Button type="submit" className="w-full">Tạo Sản phẩm</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách Sản phẩm</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Đang tải...</p>
            ) : (
              <div className="space-y-4">
                {products.map(p => (
                  <div key={p.id} className="p-4 rounded-xl border border-border bg-card flex gap-4">
                    {p.images && p.images.length > 0 && (
                      <img src={`http://localhost:4000${p.images[0].url}`} alt={p.name} className="w-20 h-20 object-cover rounded-md" />
                    )}
                    <div>
                      <h3 className="font-semibold text-lg">{p.name}</h3>
                      <p className="text-sm text-muted-foreground">SKU: {p.sku}</p>
                      <p className="text-sm font-medium text-amber-600">{Number(p.sellingPrice).toLocaleString()} đ</p>
                      {p.isSeasonal && <span className="inline-block mt-1 px-2 py-0.5 bg-rose-100 text-rose-700 text-xs rounded-full">Theo mùa</span>}
                    </div>
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
