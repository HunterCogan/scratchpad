import { verifySession } from "@/lib/dal";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Project from "@/models/Project";
import mongoose from "mongoose";
import { ProjectSchema } from "@/lib/schemas/project.zod";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = ProjectSchema.omit({ creator: true }).safeParse({
      name: body.name,
      description: body.description || undefined,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: z.flattenError(result.error).fieldErrors },
        { status: 400 },
      );
    }

    const session = await verifySession();
    await connectDB();
    const project = await Project.create({
      creator: new mongoose.Types.ObjectId(session.userId),
      ...result.data,
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 },
    );
  }
}
