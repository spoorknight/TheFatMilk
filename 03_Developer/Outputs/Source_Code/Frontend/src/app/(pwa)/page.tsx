'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useGlobalStore } from '@/store/global.store';
import { apiClient } from '@/lib/api-client';
import Image from 'next/image';

export default function PWAHomePage() {
  const { user } = useGlobalStore();
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock banners
  const banners = [
    { id: 1, image: 'https://images.unsplash.com/photo-1555507015-10eb537b03b5?auto=format&fit=crop&q=80&w=1200&h=400', title: 'Bánh Mới Theo Mùa' },
    { id: 2, image: 'https://images.unsplash.com/photo-1495474472201-497746de562c?auto=format&fit=crop&q=80&w=1200&h=400', title: 'Cafe Buổi Sáng' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Assume we have an endpoint for categories later, but for now we'll fetch products
        const res = await apiClient.get('/products') as { data: any[] };
        setProducts(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const calculateDiscountPrice = (sellingPrice: number) => {
    // Basic logic for now. Actual logic depends on tier discount from API
    // We assume user object has a tier object with discountPercent, or we just mock a 5% discount if logged in
    const discount = user ? 0.05 : 0; // 5% discount for members
    return sellingPrice * (1 - discount);
  };

  return (
    <div className="pb-24 max-w-md mx-auto w-full min-h-screen bg-slate-50">
      {/* 1. Header & VIP Card Quick View */}
      <div className="bg-gradient-to-b from-amber-600 to-amber-700 px-4 pt-6 pb-12 rounded-b-[2.5rem] shadow-lg">
        <div className="flex justify-between items-center mb-6 text-white">
          <div>
            <h1 className="text-xl font-bold">The Fat Milk</h1>
            <p className="text-sm opacity-90">{user ? `Chào, ${user.name}` : 'Thưởng thức bánh ngon!'}</p>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
            🔔
          </div>
        </div>

        {/* VIP Card */}
        {user ? (
          <Card className="bg-gradient-to-tr from-slate-900 to-slate-800 border-none text-white shadow-xl translate-y-4">
            <CardContent className="p-5 flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Thẻ Thành Viên</p>
                <p className="text-2xl font-bold text-amber-400">1,250 <span className="text-sm font-normal text-slate-300">điểm</span></p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Hạng Vàng</p>
                <p className="text-xs text-amber-200">Giảm 5% toàn Menu</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white border-none shadow-xl translate-y-4">
            <CardContent className="p-5 flex justify-between items-center">
              <div>
                <p className="font-semibold text-amber-900">Đăng nhập ngay</p>
                <p className="text-sm text-slate-500">Để nhận ưu đãi thành viên</p>
              </div>
              <a href="/auth" className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-full">Đăng nhập</a>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="px-4 mt-8">
        {/* 2. Banners Slider */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 no-scrollbar">
          {banners.map(b => (
            <div key={b.id} className="snap-center shrink-0 w-[85%] h-36 relative rounded-2xl overflow-hidden shadow-md">
              <img src={b.image} alt={b.title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <p className="absolute bottom-3 left-4 text-white font-semibold">{b.title}</p>
            </div>
          ))}
        </div>

        {/* 3. Categories Icons */}
        <div className="mt-4 mb-8 flex justify-between overflow-x-auto no-scrollbar gap-4">
          {['Tất cả', 'Bánh Mặn', 'Bánh Ngọt', 'Đồ Uống', 'Combo'].map((cat, i) => (
            <div key={i} className="flex flex-col items-center gap-2 min-w-[4rem]">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl border border-slate-100">
                {['🍽️', '🥐', '🍰', '☕', '🎁'][i]}
              </div>
              <span className="text-xs font-medium text-slate-600">{cat}</span>
            </div>
          ))}
        </div>

        {/* 4. Products Grid */}
        <h2 className="text-lg font-bold text-slate-800 mb-4">Gợi ý cho bạn</h2>
        {loading ? (
          <p className="text-center text-slate-500">Đang tải...</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {products.map(p => {
              const discountedPrice = calculateDiscountPrice(p.sellingPrice);
              const isDiscounted = discountedPrice < p.sellingPrice;

              return (
                <div key={p.id} className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex flex-col">
                  <div className="aspect-square rounded-xl bg-slate-100 mb-3 relative overflow-hidden">
                    {p.images?.[0] ? (
                      <img src={`http://localhost:4000${p.images[0].url}`} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">🥐</div>
                    )}
                    {p.isSeasonal && (
                      <span className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">New</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm text-slate-800 line-clamp-2 leading-tight mb-1">{p.name}</h3>
                  <div className="mt-auto">
                    {isDiscounted ? (
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-400 line-through">{Number(p.sellingPrice).toLocaleString()} đ</span>
                        <span className="font-bold text-amber-600">{discountedPrice.toLocaleString()} đ</span>
                      </div>
                    ) : (
                      <span className="font-bold text-amber-600">{Number(p.sellingPrice).toLocaleString()} đ</span>
                    )}
                  </div>
                  <button className="mt-2 w-full py-2 bg-amber-50 text-amber-600 text-sm font-semibold rounded-xl hover:bg-amber-100 transition-colors">
                    Thêm
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
