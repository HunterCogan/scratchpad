import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/dal";
import type { AIFeedback } from "@/types";
import { feedbackTool, FEEDBACK_SYSTEM } from "@/lib/anthropic";
import { rawToPseudocode } from "@/lib/scratch-pseudocode";
import connectDB from "@/lib/db";
import RemixModel from "@/models/Remix";

const client = new Anthropic();

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

  let message: Anthropic.Message;
  try {
    message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 3500,
      tools: [feedbackTool],
      tool_choice: { type: "tool", name: "submit_feedback" },
      system: FEEDBACK_SYSTEM,
      messages: [
        {
          role: "user",
          content: `
        Remix Name: "${remix.name}"
        Remix Description: "${remix.description}"
        project.json: ${pseudocode}
        `,
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
    console.error("Anthropic message truncated by token limit.");
    return NextResponse.json(
      { error: "Failed to generate feedback" },
      { status: 500 },
    );
  }

  const toolUse = message.content.find((b) => b.type === "tool_use");
  const feedback = toolUse?.input as AIFeedback;

  return NextResponse.json({ feedback });
}
