import Footer from "@/components/common/footer";
import Header from "@/components/common/header";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      <main className="min-h-svh w-full mt-16">{children}</main>
      <Footer />
    </>
  );
}
