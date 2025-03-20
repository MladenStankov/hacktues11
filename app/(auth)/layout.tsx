export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-svh flex items-center justify-center w-full">
      {children}
    </main>
  );
}
