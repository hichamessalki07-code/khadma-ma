import { SeekerSidebar } from "@/components/dashboard/seeker-sidebar";

export default function SeekerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SeekerSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
