import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { companySchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET() {
  const companies = await prisma.company.findMany({
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    include: { _count: { select: { jobs: { where: { status: "PUBLISHED" } } } } },
  });
  return NextResponse.json({ companies });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
  if (!dbUser) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

  const body = await req.json();
  const parsed = companySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const { name, ...rest } = parsed.data;
  const baseSlug = slugify(name);
  const slug = `${baseSlug}-${Date.now()}`;

  const company = await prisma.company.upsert({
    where: { userId: dbUser.id },
    create: {
      userId: dbUser.id,
      name,
      slug,
      ...rest,
    },
    update: { name, ...rest },
  });

  // Update user role to EMPLOYER
  await prisma.user.update({
    where: { id: dbUser.id },
    data: { role: "EMPLOYER" },
  });

  return NextResponse.json({ company }, { status: 201 });
}
