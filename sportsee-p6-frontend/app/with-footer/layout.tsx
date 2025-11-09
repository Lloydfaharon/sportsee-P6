import Footer from "@/app/components/footer/Footer";

export default function WithFooterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="grow">{children}</main>
      <Footer />
    </div>
  );
}
