import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { jobSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const city = searchParams.get("city");
  const category = searchParams.get("category");
  const contract = searchParams.get("contract");
  const remote = searchParams.get("remote");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { status: "PUBLISHED" };
  if (q) where.OR = [
    { title: { contains: q, mode: "insensitive" } },
    { description: { contains: q, mode: "insensitive" } },
  ];
  if (city) where.city = city;
  if (category) where.category = category;
  if (contract) where.contractType = contract;
  if (remote) where.workMode = remote;

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
      include: { company: { select: { name: true, logoUrl: true, isVerified: true } } },
    }),
    prisma.job.count({ where }),
  ]);

  return NextResponse.json({ jobs, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
  if (!dbUser || dbUser.role !== "EMPLOYER") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const company = await prisma.company.findUnique({ where: { userId: dbUser.id } });
  if (!company) {
    return NextResponse.json({ error: "Créez d'abord votre profil entreprise" }, { status: 400 });
  }

  const body = await req.json();
  const parsed = jobSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const data = parsed.data;
  const baseSlug = slugify(data.title);
  const uniqueSlug = `${baseSlug}-${Date.now()}`;

  const skillsArray = data.skills
    ? data.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const job = await prisma.job.create({
    data: {
      companyId: company.id,
      title: data.title,
      slug: uniqueSlug,
      description: data.description,
      requirements: data.requirements,
      benefits: data.benefits,
      city: data.city,
      contractType: data.contractType as "CDI" | "CDD" | "STAGE" | "FREELANCE" | "ALTERNANCE" | "INTERIM",
      workMode: data.workMode as "ONSITE" | "REMOTE" | "HYBRID",
      experienceLevel: data.experienceLevel as "JUNIOR" | "MID" | "SENIOR" | "LEAD" | "EXECUTIVE",
      category: data.category,
      salaryMin: data.salaryMin,
      salaryMax: data.salaryMax,
      skills: skillsArray,
      applyUrl: data.applyUrl || null,
      whatsappApply: data.whatsappApply || null,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      status: "PENDING_REVIEW",
    },
  });

  return NextResponse.json({ job }, { status: 201 });
}
