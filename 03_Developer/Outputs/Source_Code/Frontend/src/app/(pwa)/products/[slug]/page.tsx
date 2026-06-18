'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { useGlobalStore } from '@/store/global.store';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useGlobalStore();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await apiClient.get(`/products/${params.slug}`) as { data: any };
        setProduct(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (params.slug) fetchProduct();
  }, [params.slug]);

  if (loading) return <div className="p-8 text-center">Đang tải...</div>;
  if (!product) return <div className="p-8 text-center text-rose-500">Sản phẩm không tồn tại</div>;

  const discount = user ? 0.05 : 0;
  const discountedPrice = product.sellingPrice * (1 - discount);

  return (
    <div className="pb-24 min-h-screen bg-slate-50 relative">
      {/* Back button */}
      <button 
        onClick={() => router.back()}
        className="absolute top-4 left-4 z-10 w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white"
      >
        ←
      </button>

      {/* Gallery */}
      <div className="bg-white">
        <div className="aspect-square relative bg-slate-100">
          {product.images && product.images.length > 0 ? (
            <img src={`http://localhost:4000${product.images[activeImage].url}`} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">🍞</div>
          )}
        </div>
        {product.images && product.images.length > 1 && (
          <div className="flex gap-2 p-4 overflow-x-auto no-scrollbar">
            {product.images.map((img: any, idx: number) => (
              <button 
                key={img.id} 
                onClick={() => setActiveImage(idx)}
                className={`w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 ${activeImage === idx ? 'border-amber-500' : 'border-transparent opacity-60'}`}
              >
                <img src={`http://localhost:4000${img.url}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-4 py-6 bg-white rounded-t-3xl -mt-6 relative z-10 shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-2xl font-bold text-slate-800 pr-4">{product.name}</h1>
          {product.isSeasonal && <span className="bg-rose-100 text-rose-600 text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">Theo mùa</span>}
        </div>

        <div className="flex items-baseline gap-2 mb-6">
          <span className="text-2xl font-bold text-amber-600">{discountedPrice.toLocaleString()} đ</span>
          {discount > 0 && <span className="text-sm text-slate-400 line-through">{Number(product.sellingPrice).toLocaleString()} đ</span>}
        </div>

        <p className="text-slate-600 text-sm leading-relaxed mb-6">
          {product.description || 'Không có mô tả cho sản phẩm này.'}
        </p>

        <div className="space-y-3">
          <h3 className="font-semibold text-slate-800">Thông tin chi tiết</h3>
          <div className="bg-slate-50 rounded-2xl p-4 space-y-3 text-sm">
            {product.allergens && (
              <div className="flex gap-2 text-rose-600">
                <span className="font-medium shrink-0">⚠️ Dị ứng:</span>
                <span>{product.allergens}</span>
              </div>
            )}
            {product.ingredients && (
              <div className="flex gap-2 text-slate-600">
                <span className="font-medium shrink-0 text-slate-800">Thành phần:</span>
                <span>{product.ingredients}</span>
              </div>
            )}
            {product.weight && (
              <div className="flex gap-2 text-slate-600">
                <span className="font-medium shrink-0 text-slate-800">Trọng lượng:</span>
                <span>{product.weight}</span>
              </div>
            )}
            {product.storageTemp && (
              <div className="flex gap-2 text-slate-600">
                <span className="font-medium shrink-0 text-slate-800">Bảo quản:</span>
                <span>{product.storageTemp}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 pb-safe">
        <button className="w-full h-14 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-amber-600/25 transition-all active:scale-95">
          Thêm vào giỏ hàng
        </button>
      </div>
    </div>
  );
}
