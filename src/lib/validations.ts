import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.string().email("Email invalide"),
    password: z
      .string()
      .min(8, "Le mot de passe doit comporter au moins 8 caractères"),
    confirmPassword: z.string(),
    firstName: z.string().min(2, "Prénom requis"),
    lastName: z.string().min(2, "Nom requis"),
    role: z.enum(["SEEKER", "EMPLOYER"]),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export const profileSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().optional(),
  city: z.string().optional(),
  bio: z.string().max(500).optional(),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
  whatsappNumber: z.string().optional(),
  expectedSalary: z.coerce.number().optional(),
  experienceYears: z.coerce.number().optional(),
  isOpenToWork: z.boolean().default(true),
  cvUrl: z.string().optional(),
});

export const jobSchema = z.object({
  title: z.string().min(5, "Titre requis (min 5 caractères)"),
  description: z.string().min(50, "Description requise (min 50 caractères)"),
  requirements: z.string().optional(),
  benefits: z.string().optional(),
  city: z.string().min(1, "Ville requise"),
  contractType: z.enum(["CDI", "CDD", "STAGE", "FREELANCE", "ALTERNANCE", "INTERIM"]),
  workMode: z.enum(["ONSITE", "REMOTE", "HYBRID"]),
  experienceLevel: z.enum(["JUNIOR", "MID", "SENIOR", "LEAD", "EXECUTIVE"]),
  category: z.string().min(1, "Catégorie requise"),
  salaryMin: z.coerce.number().optional(),
  salaryMax: z.coerce.number().optional(),
  skills: z.string().optional(),
  applyUrl: z.string().url().optional().or(z.literal("")),
  whatsappApply: z.string().optional(),
  expiresAt: z.string().optional(),
});

export const companySchema = z.object({
  name: z.string().min(2, "Nom de l'entreprise requis"),
  website: z.string().url().optional().or(z.literal("")),
  description: z.string().max(1000).optional(),
  industry: z.string().optional(),
  size: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  whatsappNumber: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(5),
  message: z.string().min(20),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type JobInput = z.infer<typeof jobSchema>;
export type CompanyInput = z.infer<typeof companySchema>;
export type ContactInput = z.infer<typeof contactSchema>;
