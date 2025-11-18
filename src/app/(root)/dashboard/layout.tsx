export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* <Header showAuth={true} /> */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
