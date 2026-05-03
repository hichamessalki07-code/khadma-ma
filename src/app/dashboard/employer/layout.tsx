import { EmployerSidebar } from "@/components/dashboard/employer-sidebar";

export default function EmployerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <EmployerSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
