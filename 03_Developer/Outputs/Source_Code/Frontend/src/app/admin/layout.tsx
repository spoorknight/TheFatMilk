export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar Placeholder */}
      <aside className="w-64 border-r bg-gray-50 flex flex-col p-4">
        <div className="font-bold text-xl mb-8">Admin Panel</div>
        <nav className="flex flex-col gap-4">
          <span className="text-sm font-medium cursor-pointer">Dashboard</span>
          <span className="text-sm font-medium cursor-pointer">Menu</span>
          <span className="text-sm font-medium cursor-pointer">Orders</span>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-white">{children}</main>
    </div>
  );
}
