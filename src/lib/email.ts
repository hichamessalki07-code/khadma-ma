import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL || "noreply@khadma.ma";

export async function sendApplicationEmail(opts: {
  to: string;
  applicantName: string;
  jobTitle: string;
  companyName: string;
}) {
  return resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: `Nouvelle candidature – ${opts.jobTitle}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#2563eb">Khadma.ma</h2>
        <p>Bonjour,</p>
        <p><strong>${opts.applicantName}</strong> a postulé pour l'offre <strong>${opts.jobTitle}</strong> chez <strong>${opts.companyName}</strong>.</p>
        <p>Connectez-vous à votre tableau de bord pour consulter sa candidature.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/employer/applications"
           style="display:inline-block;background:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px">
          Voir les candidatures
        </a>
        <p style="color:#6b7280;font-size:12px;margin-top:32px">Khadma.ma – La plateforme emploi au Maroc</p>
      </div>
    `,
  });
}

export async function sendApplicationConfirmEmail(opts: {
  to: string;
  applicantName: string;
  jobTitle: string;
  companyName: string;
}) {
  return resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: `Candidature envoyée – ${opts.jobTitle}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#2563eb">Khadma.ma</h2>
        <p>Bonjour ${opts.applicantName},</p>
        <p>Votre candidature pour le poste <strong>${opts.jobTitle}</strong> chez <strong>${opts.companyName}</strong> a bien été envoyée.</p>
        <p>Vous pouvez suivre l'état de vos candidatures depuis votre tableau de bord.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/seeker/applications"
           style="display:inline-block;background:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px">
          Mes candidatures
        </a>
        <p style="color:#6b7280;font-size:12px;margin-top:32px">Khadma.ma – La plateforme emploi au Maroc</p>
      </div>
    `,
  });
}

export async function sendWelcomeEmail(opts: { to: string; name: string }) {
  return resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: "Bienvenue sur Khadma.ma !",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#2563eb">Bienvenue sur Khadma.ma 🎉</h2>
        <p>Bonjour ${opts.name},</p>
        <p>Votre compte a bien été créé. Commencez dès maintenant à explorer les offres d'emploi au Maroc.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/jobs"
           style="display:inline-block;background:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px">
          Explorer les offres
        </a>
        <p style="color:#6b7280;font-size:12px;margin-top:32px">Khadma.ma – La plateforme emploi au Maroc</p>
      </div>
    `,
  });
}
