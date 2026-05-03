import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
  if (dbUser?.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès réservé aux administrateurs" }, { status: 403 });
  }

  const { action, role } = await req.json();

  if (action === "toggle_active") {
    const target = await prisma.user.findUnique({ where: { id } });
    if (!target) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    const updated = await prisma.user.update({
      where: { id },
      data: { isActive: !target.isActive },
    });
    return NextResponse.json({ user: updated });
  }

  if (action === "set_role" && role) {
    const updated = await prisma.user.update({
      where: { id },
      data: { role: role as "SEEKER" | "EMPLOYER" | "ADMIN" },
    });
    return NextResponse.json({ user: updated });
  }

  return NextResponse.json({ error: "Action invalide" }, { status: 400 });
}
