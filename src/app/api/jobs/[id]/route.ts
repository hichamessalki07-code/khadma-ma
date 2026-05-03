import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { jobSchema } from "@/lib/validations";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const job = await prisma.job.findUnique({
    where: { id },
    include: { company: true },
  });
  if (!job) return NextResponse.json({ error: "Offre introuvable" }, { status: 404 });
  return NextResponse.json({ job });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
  const company = dbUser ? await prisma.company.findUnique({ where: { userId: dbUser.id } }) : null;

  const job = await prisma.job.findUnique({ where: { id } });
  if (!job || job.companyId !== company?.id) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = jobSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const updated = await prisma.job.update({
    where: { id },
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      requirements: parsed.data.requirements,
      benefits: parsed.data.benefits,
      city: parsed.data.city,
      contractType: parsed.data.contractType as "CDI" | "CDD" | "STAGE" | "FREELANCE" | "ALTERNANCE" | "INTERIM",
      workMode: parsed.data.workMode as "ONSITE" | "REMOTE" | "HYBRID",
      experienceLevel: parsed.data.experienceLevel as "JUNIOR" | "MID" | "SENIOR" | "LEAD" | "EXECUTIVE",
      category: parsed.data.category,
      salaryMin: parsed.data.salaryMin,
      salaryMax: parsed.data.salaryMax,
      status: "PENDING_REVIEW",
    },
  });

  return NextResponse.json({ job: updated });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
  const company = dbUser ? await prisma.company.findUnique({ where: { userId: dbUser.id } }) : null;

  const job = await prisma.job.findUnique({ where: { id } });
  if (!job || (job.companyId !== company?.id && dbUser?.role !== "ADMIN")) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  await prisma.job.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
