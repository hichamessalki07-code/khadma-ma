import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
  const savedJobs = await prisma.savedJob.findMany({
    where: { userId: dbUser?.id },
    include: { job: { include: { company: { select: { name: true, logoUrl: true, isVerified: true } } } } },
    orderBy: { savedAt: "desc" },
  });

  return NextResponse.json({ savedJobs });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { jobId } = await req.json();
  if (!jobId) return NextResponse.json({ error: "jobId requis" }, { status: 400 });

  const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
  if (!dbUser) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

  // Toggle save
  const existing = await prisma.savedJob.findUnique({
    where: { userId_jobId: { userId: dbUser.id, jobId } },
  });

  if (existing) {
    await prisma.savedJob.delete({ where: { id: existing.id } });
    return NextResponse.json({ saved: false });
  } else {
    await prisma.savedJob.create({ data: { userId: dbUser.id, jobId } });
    return NextResponse.json({ saved: true }, { status: 201 });
  }
}
