export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="font-bold text-xl text-primary">The Fat Milk</div>
        <nav className="flex items-center gap-4">
          <span className="text-sm">Store</span>
        </nav>
      </div>
    </header>
  );
};
