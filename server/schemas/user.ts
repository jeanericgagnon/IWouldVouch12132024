import { z } from 'zod';

const skillSchema = z.object({
  name: z.string(),
  type: z.enum(['soft', 'hard']),
});

const portfolioItemSchema = z.object({
  type: z.string(),
  name: z.string(),
  url: z.string().url(),
});

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    title: z.string().optional(),
    bio: z.string().optional(),
    location: z.string().optional(),
    linkedin: z.string().url().optional(),
    skills: z.array(skillSchema).optional(),
    resumeUrl: z.string().url().optional(),
    portfolioItems: z.array(portfolioItemSchema).optional(),
  }),
});