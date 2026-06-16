import Link from 'next/link';

export const BottomNavigation = () => {
  return (
    <nav className="fixed bottom-0 z-50 w-full border-t bg-white h-16 safe-area-bottom">
      <div className="grid h-full w-full grid-cols-4 items-center justify-items-center text-sm">
        <Link href="/" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary">
          <span className="font-medium">Trang chủ</span>
        </Link>
        <Link href="/menu" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary">
          <span className="font-medium">Menu</span>
        </Link>
        <Link href="/orders" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary">
          <span className="font-medium">Đơn hàng</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary">
          <span className="font-medium">Tài khoản</span>
        </Link>
      </div>
    </nav>
  );
};
