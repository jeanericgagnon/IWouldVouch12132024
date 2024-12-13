import { z } from 'zod';

const skillSchema = z.object({
  name: z.string(),
  type: z.enum(['soft', 'hard']),
});

const relationshipSchema = z.object({
  type: z.string(),
  company: z.string(),
  duration: z.string(),
});

const exampleSchema = z.object({
  description: z.string(),
  attachments: z.array(
    z.object({
      name: z.string(),
      url: z.string().url(),
    })
  ).optional(),
});

const additionalSectionSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export const createReferenceSchema = z.object({
  body: z.object({
    toUserId: z.string().uuid(),
    relationship: relationshipSchema,
    endorsement: z.string().min(100),
    skills: z.array(skillSchema),
    rating: z.number().min(1).max(5),
    examples: exampleSchema.optional(),
    additionalSections: z.array(additionalSectionSchema).optional(),
  }),
});