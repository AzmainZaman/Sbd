import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminMobileBanner } from "@/components/admin/AdminMobileBanner";
import { assertAdmin } from "@/lib/auth-guard";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await assertAdmin();
  return (
    <>
      {/* Mobile: show banner only */}
      <AdminMobileBanner />

      {/* Desktop: dark sidebar + content */}
      <div className="hidden lg:flex flex-1">
        <AdminSidebar />
        <main id="main-content" className="flex-1 min-w-0 overflow-auto bg-bg">{children}</main>
      </div>
    </>
  );
}
