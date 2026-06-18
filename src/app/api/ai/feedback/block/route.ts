import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/dal";
import { FEEDBACK_SYSTEM } from "@/lib/anthropic";
import { AIFeedbackSchema } from "@/lib/schemas/ai.zod";
import { rawToPseudocode } from "@/lib/scratch-pseudocode";
import connectDB from "@/lib/db";
import RemixModel from "@/models/Remix";

const client = new Anthropic();

function escapeForTag(value: string): string {
  return value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function POST(req: NextRequest) {
  await verifySession();

  // projectJsonData can be very large to send over the network,
  // instead, user can send Remix id and we query from DB
  const { remixId } = await req.json();

  if (!remixId) {
    return NextResponse.json(
      { error: "No remix ID provided" },
      { status: 400 },
    );
  }

  await connectDB();
  const remix = await RemixModel.findById(remixId).lean();

  if (!remix) {
    return NextResponse.json({ error: "Remix not found" }, { status: 404 });
  }

  const projectJsonData =
    remix.files.find((f) => f.fileType === "logic")?.data ?? "";

  let pseudocode: string;
  try {
    pseudocode = rawToPseudocode(projectJsonData);
  } catch {
    pseudocode = projectJsonData;
  }

  let message;
  try {
    message = await client.messages.parse({
      model: "claude-sonnet-4-6",
      max_tokens: 3500,
      system: FEEDBACK_SYSTEM,
      output_config: { format: zodOutputFormat(AIFeedbackSchema) },
      messages: [
        {
          role: "user",
          content: [
            `<remix_name>${escapeForTag(remix.name)}</remix_name>`,
            `<remix_description>${escapeForTag(
              remix.description,
            )}</remix_description>`,
            `<pseudocode>\n${escapeForTag(pseudocode)}\n</pseudocode>`,
          ].join("\n"),
        },
      ],
    });
  } catch (err) {
    console.error("Anthropic message creation failed:", err);
    return NextResponse.json(
      { error: "Failed to generate feedback" },
      { status: 502 },
    );
  }

  if (message.stop_reason === "max_tokens") {
    console.error("Anthropic message truncated by token limit");
    return NextResponse.json(
      { error: "Failed to generate feedback" },
      { status: 500 },
    );
  }

  if (message.stop_reason === "refusal") {
    console.error("Anthropic refused the request");
    return NextResponse.json(
      { error: "Failed to generate feedback" },
      { status: 502 },
    );
  }

  const parsed = message.parsed_output;

  if (!parsed) {
    console.error("Anthropic returned no parseable feedback");
    return NextResponse.json(
      { error: "Failed to generate feedback" },
      { status: 502 },
    );
  }

  const feedback = {
    what_works_well: parsed.what_works_well,
    suggestions: parsed.suggestions,
    logic_issues: parsed.logic_issues,
  };

  return NextResponse.json({ feedback });
}
