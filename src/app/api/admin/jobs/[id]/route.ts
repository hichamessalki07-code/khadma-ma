import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
  if (dbUser?.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès réservé aux administrateurs" }, { status: 403 });
  }

  const { action } = await req.json();

  if (action === "delete") {
    await prisma.job.delete({ where: { id } });
    return NextResponse.json({ success: true });
  }

  const statusMap: Record<string, "PUBLISHED" | "REJECTED"> = {
    approve: "PUBLISHED",
    reject: "REJECTED",
  };

  const newStatus = statusMap[action];
  if (!newStatus) {
    return NextResponse.json({ error: "Action invalide" }, { status: 400 });
  }

  const job = await prisma.job.update({
    where: { id },
    data: {
      status: newStatus,
      publishedAt: newStatus === "PUBLISHED" ? new Date() : undefined,
    },
  });

  await prisma.adminLog.create({
    data: {
      adminId: dbUser.id,
      action: `job_${action}`,
      entity: "Job",
      entityId: id,
      details: `Job ${action}ed: ${job.title}`,
    },
  });

  return NextResponse.json({ job });
}
