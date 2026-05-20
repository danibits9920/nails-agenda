import AdminSidebar from "@/components/ui/AdminSidebar";
import { MobileTopBar, MobileBottomNav } from "@/components/ui/MobileAdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-cream)]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <MobileTopBar />
        <main className="flex-1 min-w-0 overflow-y-auto pb-20 md:pb-0">
          {children}
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
