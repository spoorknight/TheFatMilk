'use client';

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useGlobalStore } from '@/store/global.store';
import { authApi } from '@/lib/auth-api';
import { useRouter } from 'next/navigation';

// Tier definitions matching backend CustomerTier
const TIERS = [
  { slug: 'member', name: 'Member', min: 0, color: '#A0AEC0', emoji: '☕' },
  { slug: 'silver', name: 'Silver', min: 2_000_000, color: '#A0AEC0', emoji: '🥈' },
  { slug: 'gold', name: 'Gold', min: 5_000_000, color: '#ECC94B', emoji: '🥇' },
  { slug: 'platinum', name: 'Platinum', min: 10_000_000, color: '#805AD5', emoji: '💎' },
];

interface ProfileData {
  id: string;
  phone: string;
  full_name: string;
  avatar_url: string | null;
  role: string;
  tier_id: string | null;
  total_spent: string;
  points_balance: number;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const { token, logout } = useGlobalStore();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/auth');
      return;
    }
    const fetchProfile = async () => {
      try {
        const res = await authApi.getMe() as { data: ProfileData };
        setProfile(res.data);
      } catch {
        logout();
        router.push('/auth');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token, router, logout]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-muted-foreground">Đang tải...</div>
      </div>
    );
  }

  if (!profile) return null;

  const totalSpent = parseInt(profile.total_spent || '0', 10);

  // Calculate current tier and next tier
  const currentTierIndex = TIERS.reduce((acc, tier, idx) => {
    return totalSpent >= tier.min ? idx : acc;
  }, 0);
  const currentTier = TIERS[currentTierIndex];
  const nextTier = TIERS[currentTierIndex + 1] || null;

  // Progress percentage to next tier
  const progressPercent = nextTier
    ? Math.min(((totalSpent - currentTier.min) / (nextTier.min - currentTier.min)) * 100, 100)
    : 100;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const initials = profile.full_name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  return (
    <div className="px-4 py-6 space-y-4 max-w-md mx-auto">
      {/* Profile Header */}
      <Card className="overflow-hidden">
        <div
          className="h-24 relative"
          style={{
            background: `linear-gradient(135deg, ${currentTier.color}44, ${currentTier.color}88)`,
          }}
        />
        <CardHeader className="-mt-12 items-center pb-2">
          <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
            <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name} />
            <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-lg font-bold mt-2">{profile.full_name}</h2>
          <p className="text-sm text-muted-foreground">{profile.phone}</p>
        </CardHeader>
      </Card>

      {/* Tier Card */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentTier.emoji}</span>
              <div>
                <p className="font-semibold">{currentTier.name}</p>
                <p className="text-xs text-muted-foreground">Hạng hiện tại</p>
              </div>
            </div>
            {nextTier && (
              <div className="text-right">
                <p className="text-sm font-medium text-muted-foreground">
                  {nextTier.emoji} {nextTier.name}
                </p>
                <p className="text-xs text-muted-foreground">Hạng tiếp theo</p>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progressPercent} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatCurrency(totalSpent)}</span>
              {nextTier ? (
                <span>
                  Còn {formatCurrency(nextTier.min - totalSpent)} để lên {nextTier.name}
                </span>
              ) : (
                <span className="text-primary font-medium">Hạng cao nhất! 🎉</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Points & Stats */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">{profile.points_balance}</p>
              <p className="text-xs text-muted-foreground">Điểm tích lũy</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
              <p className="text-xs text-muted-foreground">Tổng chi tiêu</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Logout */}
      <Button variant="outline" className="w-full" onClick={handleLogout}>
        Đăng xuất
      </Button>
    </div>
  );
}
