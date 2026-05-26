import { SBDHeader } from "@/components/layout/SBDHeader";
import { SBDHeaderMobile } from "@/components/layout/SBDHeaderMobile";
import { SBDFooter } from "@/components/layout/SBDFooter";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { ChatWidget } from "@/components/layout/ChatWidget";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Desktop header — hidden below lg breakpoint */}
      <div className="hidden lg:block">
        <SBDHeader />
      </div>
      {/* Mobile header — hidden at lg and above */}
      <div className="lg:hidden">
        <SBDHeaderMobile />
      </div>

      {/* Page content — bottom padding for mobile nav */}
      <main id="main-content" className="flex-1 pb-16 lg:pb-0">{children}</main>

      <SBDFooter />
      <MobileBottomNav />
      <ChatWidget />
    </>
  );
}
