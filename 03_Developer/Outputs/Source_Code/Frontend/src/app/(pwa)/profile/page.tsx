'use client';

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useGlobalStore } from '@/store/global.store';
import { authApi } from '@/lib/auth-api';
import { apiClient } from '@/lib/api-client';
import { useRouter } from 'next/navigation';

// Emoji/color mapping by slug (cosmetic only – business data comes from API)
const TIER_STYLE: Record<string, { color: string; emoji: string }> = {
  member:   { color: '#A0AEC0', emoji: '☕' },
  silver:   { color: '#A0AEC0', emoji: '🥈' },
  gold:     { color: '#ECC94B', emoji: '🥇' },
  platinum: { color: '#805AD5', emoji: '💎' },
};

interface TierData {
  id: string;
  name: string;
  slug: string;
  min_spent: string;
  discount_percent: string;
}

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
  const [tiers, setTiers] = useState<TierData[]>([]);
  const [loading, setLoading] = useState(true);
  const { token, logout } = useGlobalStore();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/auth');
      return;
    }

    const fetchData = async () => {
      try {
        const [profileRes, tiersRes] = await Promise.all([
          authApi.getMe() as Promise<{ data: ProfileData }>,
          apiClient.get('/tiers') as Promise<{ data: TierData[] }>,
        ]);
        setProfile(profileRes.data);
        setTiers(tiersRes.data);
      } catch {
        logout();
        router.push('/auth');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, router, logout]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-muted-foreground">Đang tải...</div>
      </div>
    );
  }

  if (!profile || tiers.length === 0) return null;

  const totalSpent = parseInt(profile.total_spent || '0', 10);

  // Calculate current tier and next tier from API data
  const currentTierIndex = tiers.reduce((acc, tier, idx) => {
    return totalSpent >= parseInt(tier.min_spent, 10) ? idx : acc;
  }, 0);
  const currentTier = tiers[currentTierIndex];
  const nextTier = tiers[currentTierIndex + 1] || null;
  const currentMin = parseInt(currentTier.min_spent, 10);
  const nextMin = nextTier ? parseInt(nextTier.min_spent, 10) : 0;

  const style = TIER_STYLE[currentTier.slug] || { color: '#A0AEC0', emoji: '☕' };
  const nextStyle = nextTier ? (TIER_STYLE[nextTier.slug] || { emoji: '⭐' }) : null;

  // Progress percentage to next tier
  const progressPercent = nextTier
    ? Math.min(((totalSpent - currentMin) / (nextMin - currentMin)) * 100, 100)
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
            background: `linear-gradient(135deg, ${style.color}44, ${style.color}88)`,
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
              <span className="text-2xl">{style.emoji}</span>
              <div>
                <p className="font-semibold">{currentTier.name}</p>
                <p className="text-xs text-muted-foreground">
                  Giảm {currentTier.discount_percent}%
                </p>
              </div>
            </div>
            {nextTier && nextStyle && (
              <div className="text-right">
                <p className="text-sm font-medium text-muted-foreground">
                  {nextStyle.emoji} {nextTier.name}
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
                  Còn {formatCurrency(nextMin - totalSpent)} để lên {nextTier.name}
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
