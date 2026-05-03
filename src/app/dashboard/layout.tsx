import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // Supabase not configured
  }

  if (!user) {
    redirect("/auth/login?redirectTo=/dashboard/seeker");
  }

  return <>{children}</>;
}
