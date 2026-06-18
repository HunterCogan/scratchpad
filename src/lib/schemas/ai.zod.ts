import { z } from "zod";

const AIFeedbackTopicSchema = z.object({
  title: z
    .string()
    .describe(
      "A short headline for this topic — aim for 8 words or fewer so it fits on one line. Put the explanation in `detail`, not here.",
    ),
  detail: z.string(),
});

export const AIFeedbackSchema = z.object({
  analysis: z
    .string()
    .describe(
      "Private scratchpad — the user never sees this, so write terse notes, not prose. No markdown, no headers, no blank lines. Do NOT tour the project or describe scripts that look correct. Spend words only on scripts where you suspect a real bug, and there, trace the actual values or control flow step by step (e.g. loop arithmetic, comparison boundaries) to confirm it. Only report a logic issue you have traced and are confident actually misbehaves at runtime; if you are unsure, leave it out rather than listing a maybe.",
    ),
  what_works_well: z
    .string()
    .describe("A sentence that describes what the project does well."),
  suggestions: z
    .array(AIFeedbackTopicSchema)
    .min(2)
    .max(3)
    .describe("Suggestions for improving the project."),
  logic_issues: z
    .array(AIFeedbackTopicSchema)
    .min(0)
    .max(2)
    .describe("Logic issues you notice in the project."),
});

export type AIFeedbackTopic = z.infer<typeof AIFeedbackTopicSchema>;
export type AIFeedbackResult = z.infer<typeof AIFeedbackSchema>;
