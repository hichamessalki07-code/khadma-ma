import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/validations";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const { name, email, subject, message } = parsed.data;

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "noreply@khadma.ma",
      to: process.env.ADMIN_EMAIL || "contact@khadma.ma",
      subject: `[Khadma.ma Contact] ${subject}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#2563eb">Nouveau message de contact</h2>
          <p><strong>De :</strong> ${name} (${email})</p>
          <p><strong>Sujet :</strong> ${subject}</p>
          <div style="background:#f8fafc;padding:16px;border-radius:8px;margin-top:16px">
            <p style="white-space:pre-wrap">${message}</p>
          </div>
          <p style="color:#6b7280;font-size:12px;margin-top:32px">Khadma.ma — Formulaire de contact</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[contact]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
