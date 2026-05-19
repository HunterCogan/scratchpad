import { z } from "zod";

export const ProjectSchema = z.object({
  creator: z.string(),
  name: z
    .string()
    .min(1, "Project name must be at least 1 character")
    .max(200, "Project name cannot exceed 200 characters")
    .trim(),
  description: z
    .string()
    .max(500, "Project description cannot exceed 500 characters")
    .trim()
    .optional(),
  team: z.array(z.string()).optional(),
});

export type Project = z.infer<typeof ProjectSchema>;
