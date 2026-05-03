import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
    include: {
      profile: {
        include: { skills: true, experiences: true, educations: true },
      },
    },
  });

  return NextResponse.json({ profile: dbUser?.profile || null });
}

export async function PUT(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
  if (!dbUser) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

  const formData = await req.formData();
  const cvFile = formData.get("cv") as File | null;

  let cvUrl: string | undefined;
  let cvFileName: string | undefined;

  if (cvFile) {
    const buffer = await cvFile.arrayBuffer();
    const fileName = `cv-${dbUser.id}-${Date.now()}.pdf`;
    const { error } = await supabase.storage
      .from("cvs")
      .upload(fileName, buffer, { contentType: "application/pdf", upsert: true });
    if (!error) {
      const { data } = supabase.storage.from("cvs").getPublicUrl(fileName);
      cvUrl = data.publicUrl;
      cvFileName = cvFile.name;
    }
  }

  const profileData: Record<string, unknown> = {};
  const fields = ["firstName", "lastName", "phone", "city", "bio", "linkedinUrl", "portfolioUrl", "whatsappNumber"];
  fields.forEach((f) => {
    const v = formData.get(f);
    if (v !== null) profileData[f] = v;
  });

  const expectedSalary = formData.get("expectedSalary");
  if (expectedSalary) profileData.expectedSalary = parseInt(String(expectedSalary));

  const experienceYears = formData.get("experienceYears");
  if (experienceYears) profileData.experienceYears = parseInt(String(experienceYears));

  if (cvUrl) profileData.cvUrl = cvUrl;
  if (cvFileName) profileData.cvFileName = cvFileName;

  const profile = await prisma.profile.upsert({
    where: { userId: dbUser.id },
    create: { userId: dbUser.id, firstName: String(profileData.firstName || ""), lastName: String(profileData.lastName || ""), ...profileData },
    update: profileData,
  });

  return NextResponse.json({ profile });
}
