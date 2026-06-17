import { z } from "zod";

// Accepts a project ID or a full Scratch URL and returns the digits.
export const projectIdSchema = z.string().transform((val, ctx) => {
  const trimmed = val.trim();
  if (/^\d+$/.test(trimmed)) return trimmed;
  const match = trimmed.match(/scratch\.mit\.edu\/projects\/(\d+)/);
  if (match) return match[1]; // match[1] is \d+
  ctx.addIssue({
    code: "custom",
    message: "Enter a valid Scratch project URL or ID",
  });
  return z.NEVER;
});
