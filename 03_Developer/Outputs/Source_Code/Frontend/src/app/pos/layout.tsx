export default function PosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
