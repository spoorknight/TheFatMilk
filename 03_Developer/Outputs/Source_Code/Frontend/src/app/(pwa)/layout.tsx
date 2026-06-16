import { Header } from '@/components/layout/Header';
import { BottomNavigation } from '@/components/layout/BottomNavigation';

export default function PwaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col pb-16">
      <Header />
      <main className="flex-1">{children}</main>
      <BottomNavigation />
    </div>
  );
}
