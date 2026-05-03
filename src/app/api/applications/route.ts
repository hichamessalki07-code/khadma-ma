import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { createClient as createStorageClient } from "@/lib/supabase/server";
import { sendApplicationEmail, sendApplicationConfirmEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Connexion requise" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
    include: { profile: true },
  });
  if (!dbUser) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

  const formData = await req.formData();
  const jobSlug = formData.get("jobSlug") as string;
  const coverLetter = formData.get("coverLetter") as string | null;
  const cvFile = formData.get("cv") as File | null;

  if (!jobSlug) {
    return NextResponse.json({ error: "Offre manquante" }, { status: 400 });
  }

  const job = await prisma.job.findUnique({
    where: { slug: jobSlug, status: "PUBLISHED" },
    include: { company: true },
  });
  if (!job) return NextResponse.json({ error: "Offre introuvable" }, { status: 404 });

  // Check for duplicate application
  const existing = await prisma.application.findUnique({
    where: { jobId_userId: { jobId: job.id, userId: dbUser.id } },
  });
  if (existing) {
    return NextResponse.json({ error: "Vous avez déjà postulé à cette offre" }, { status: 409 });
  }

  // Upload CV if provided
  let cvUrl: string | null = null;
  let cvFileName: string | null = null;

  if (cvFile) {
    const supabaseStorage = await createStorageClient();
    const buffer = await cvFile.arrayBuffer();
    const fileName = `cv-${dbUser.id}-${Date.now()}.pdf`;
    const { error } = await supabaseStorage.storage
      .from("cvs")
      .upload(fileName, buffer, { contentType: "application/pdf" });
    if (!error) {
      const { data } = supabaseStorage.storage.from("cvs").getPublicUrl(fileName);
      cvUrl = data.publicUrl;
      cvFileName = cvFile.name;
    }
  }

  // Use profile CV if no new file
  if (!cvUrl && dbUser.profile?.cvUrl) {
    cvUrl = dbUser.profile.cvUrl;
    cvFileName = dbUser.profile.cvFileName;
  }

  const application = await prisma.application.create({
    data: {
      jobId: job.id,
      userId: dbUser.id,
      coverLetter: coverLetter || null,
      cvUrl,
      cvFileName,
      status: "PENDING",
    },
  });

  // Send emails (non-blocking)
  const name = dbUser.profile
    ? `${dbUser.profile.firstName} ${dbUser.profile.lastName}`
    : dbUser.email;

  if (job.company.email) {
    sendApplicationEmail({
      to: job.company.email,
      applicantName: name,
      jobTitle: job.title,
      companyName: job.company.name,
    }).catch(() => {});
  }

  sendApplicationConfirmEmail({
    to: dbUser.email,
    applicantName: name,
    jobTitle: job.title,
    companyName: job.company.name,
  }).catch(() => {});

  return NextResponse.json({ application }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
  if (!dbUser) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

  const applications = await prisma.application.findMany({
    where: { userId: dbUser.id },
    orderBy: { appliedAt: "desc" },
    include: {
      job: {
        include: { company: { select: { name: true } } },
      },
    },
  });

  return NextResponse.json({ applications });
}
