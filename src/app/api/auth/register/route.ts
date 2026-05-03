import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { userId, email, firstName, lastName, role } = await req.json();

    if (!email || !role) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

    // Upsert user
    const user = await prisma.user.upsert({
      where: { email },
      create: {
        id: userId,
        email,
        role: role as "SEEKER" | "EMPLOYER" | "ADMIN",
        emailVerified: false,
      },
      update: { role: role as "SEEKER" | "EMPLOYER" | "ADMIN" },
    });

    // Create profile for seekers
    if (role === "SEEKER" && firstName) {
      await prisma.profile.upsert({
        where: { userId: user.id },
        create: { userId: user.id, firstName, lastName: lastName || "" },
        update: { firstName, lastName: lastName || "" },
      });
    }

    // Send welcome email (non-blocking)
    sendWelcomeEmail({ to: email, name: firstName || email.split("@")[0] }).catch(() => {});

    return NextResponse.json({ user });
  } catch (error) {
    console.error("[register]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
