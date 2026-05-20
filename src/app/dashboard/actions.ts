"use server";

import { verifySession } from "@/lib/dal";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import Project from "@/models/Project";
import mongoose from "mongoose";
import { ProjectSchema } from "@/lib/schemas/project.zod";

export async function handleCreateProject(formData: FormData) {
  const result = ProjectSchema.omit({ creator: true }).safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
  });

  if (!result.success) return;

  const session = await verifySession();
  await connectDB();
  await Project.create({
    creator: new mongoose.Types.ObjectId(session.userId),
    ...result.data,
  });

  redirect("/dashboard");
}

export async function handleDeleteProject(formData: FormData) {
  const projectId = formData.get("projectId") as string;
  if (!projectId) return;

  const session = await verifySession();
  await connectDB();

  await Project.deleteOne({
    _id: new mongoose.Types.ObjectId(projectId),
    creator: new mongoose.Types.ObjectId(session.userId),
  });

  redirect("/dashboard");
}
