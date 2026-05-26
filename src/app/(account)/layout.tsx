import { SBDHeader } from "@/components/layout/SBDHeader";
import { SBDHeaderMobile } from "@/components/layout/SBDHeaderMobile";
import { SBDFooter } from "@/components/layout/SBDFooter";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { ChatWidget } from "@/components/layout/ChatWidget";
import { DashSidebar } from "@/components/dashboard/DashSidebar";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Desktop header */}
      <div className="hidden lg:block">
        <SBDHeader />
      </div>
      {/* Mobile header */}
      <div className="lg:hidden">
        <SBDHeaderMobile />
      </div>

      {/* Two-column layout: sidebar + content */}
      <div className="flex flex-1">
        <DashSidebar />
        <main id="main-content" className="flex-1 min-w-0 pb-16 lg:pb-0">{children}</main>
      </div>

      <SBDFooter />
      <MobileBottomNav />
      <ChatWidget />
    </>
  );
}
