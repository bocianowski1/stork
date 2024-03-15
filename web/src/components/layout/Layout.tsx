export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-slate-950 relative flex flex-col justify-between min-h-screen overflow-clip">
      {children}
    </main>
  );
}
