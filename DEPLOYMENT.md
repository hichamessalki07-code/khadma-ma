# Khadma.ma — Guide de Déploiement

## Prérequis

- Node.js 18+
- npm ou yarn
- Compte Supabase (gratuit)
- Compte Vercel (gratuit)
- Compte Resend (pour les emails)

---

## 1. Installation locale

```bash
# Cloner le projet
git clone <your-repo>
cd khadma-ma

# Installer les dépendances
npm install

# Copier les variables d'environnement
cp .env.example .env.local
```

---

## 2. Configuration Supabase

### 2.1 Créer un projet Supabase

1. Aller sur [supabase.com](https://supabase.com) → New Project
2. Copier les informations de connexion dans `.env.local`

### 2.2 Variables d'environnement

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

### 2.3 Configurer le Storage

Dans Supabase Dashboard → Storage :
- Créer un bucket `cvs` (public)
- Créer un bucket `logos` (public)
- Créer un bucket `covers` (public)

Politiques RLS pour `cvs` :
```sql
-- Allow authenticated users to upload their own CV
CREATE POLICY "Users can upload own CV"
ON storage.objects FOR INSERT
WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public read
CREATE POLICY "Public CV read"
ON storage.objects FOR SELECT
USING (bucket_id = 'cvs');
```

---

## 3. Base de données

```bash
# Générer le client Prisma
npm run db:generate

# Pousser le schéma (développement)
npm run db:push

# Ou créer une migration
npm run db:migrate
```

### 3.1 Créer un admin

Après l'inscription d'un utilisateur, changer son rôle en ADMIN via Supabase Dashboard ou via SQL :

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@khadma.ma';
```

---

## 4. Variables d'environnement complètes

```env
# App
NEXT_PUBLIC_APP_URL=https://khadma.ma
NEXT_PUBLIC_APP_NAME=Khadma.ma

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Email (Resend)
RESEND_API_KEY=re_xxxx
RESEND_FROM_EMAIL=noreply@khadma.ma

# Admin
ADMIN_EMAIL=admin@khadma.ma
ADMIN_SECRET=change-me-in-production

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=+212600000000
```

---

## 5. Lancer en développement

```bash
npm run dev
# → http://localhost:3000
```

---

## 6. Déploiement sur Vercel

### Option A : Via Git

1. Push votre code sur GitHub/GitLab
2. Aller sur [vercel.com](https://vercel.com) → Import Project
3. Sélectionner le repository
4. Ajouter toutes les variables d'environnement
5. Deploy !

### Option B : Via CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Production
vercel --prod
```

---

## 7. Configuration DNS (Domaine khadma.ma)

Dans votre registrar (Gandi, OVH, etc.) :
```
Type  : CNAME
Nom   : www
Valeur: cname.vercel-dns.com

Type  : A
Nom   : @
Valeur: 76.76.21.21
```

Dans Vercel Dashboard → Domains → Add Domain → `khadma.ma`

---

## 8. Checklist avant mise en production

- [ ] Variables d'environnement configurées sur Vercel
- [ ] Supabase Auth → Email templates personnalisés
- [ ] Supabase Auth → Site URL défini sur `https://khadma.ma`
- [ ] Supabase Auth → Redirect URLs ajoutées
- [ ] Storage buckets créés avec bonnes politiques RLS
- [ ] Email Resend configuré avec domaine vérifié
- [ ] Compte admin créé
- [ ] Test de candidature complet (bout en bout)
- [ ] Test de publication d'offre
- [ ] Test de connexion / inscription

---

## 9. Structure des fichiers clés

```
src/
├── app/
│   ├── (public)/           # Pages publiques (home, jobs, companies...)
│   ├── auth/               # Login, Register
│   ├── dashboard/
│   │   ├── seeker/         # Espace candidat
│   │   ├── employer/       # Espace recruteur
│   │   └── admin/          # Administration
│   ├── api/                # API Routes
│   ├── sitemap.ts          # Sitemap dynamique
│   └── robots.ts           # robots.txt
├── components/
│   ├── ui/                 # Composants UI (Shadcn)
│   ├── layout/             # Navbar, Footer
│   ├── jobs/               # JobCard, SearchBar, Filters
│   └── dashboard/          # Sidebars, Admin actions
├── lib/
│   ├── prisma.ts           # Client Prisma
│   ├── supabase/           # Client Supabase (client/server/middleware)
│   ├── utils.ts            # Utilitaires
│   ├── email.ts            # Emails (Resend)
│   └── validations.ts      # Schémas Zod
└── middleware.ts            # Auth middleware
```

---

## 10. Support

Pour toute question : contact@khadma.ma
