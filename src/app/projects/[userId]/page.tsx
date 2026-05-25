import { verifySession } from "@/lib/dal";
import connectDB from "@/lib/db";
import ProjectModel from "@/models/Project";
import RemixModel from "@/models/Remix";
import mongoose from "mongoose";
import { notFound } from "next/navigation";
import { ProjectContent, type RemixItem } from "./_components/ProjectContent";
import type { ProgramFile } from "@/lib/schemas/remix.zod";
import { Avatar, Separator } from "@heroui/react";
import CreateRemixModal from "./_components/CreateRemixModal";

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ projectId?: string }>;
}) {
  const { userId } = await params;
  const { projectId } = await searchParams;

  await verifySession();
  await connectDB();

  const project = await ProjectModel.findOne({
    _id: new mongoose.Types.ObjectId(projectId),
    creator: new mongoose.Types.ObjectId(userId),
  }).lean();

  if (!project) notFound();

  const remixes = await RemixModel.find({ project: project._id })
    .sort({ createdAt: -1 })
    .populate("uploader", "name")
    .lean();

  const serializedRemixes: RemixItem[] = remixes.map((remix) => ({
    id: remix._id.toString(),
    name: remix.name,
    uploaderName: remix.uploader.name,
    description: remix.description,
    isMain: remix.isMain,
    projectJsonData:
      remix.files.find((f: ProgramFile) => f.fileType === "logic")?.data ?? "",
    createdAt: remix.createdAt.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  }));

  return (
    <div className="font-sans h-screen flex flex-col overflow-hidden">
      <main className="px-6 py-8 flex flex-col gap-6 flex-1 min-h-0">
        <div className="flex flex-row gap-2 justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">{project.name}</h1>
            {project.description && (
              <p className="text-sm text-gray-400">{project.description}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Avatar>
              <Avatar.Fallback>AC</Avatar.Fallback>
            </Avatar>
            <CreateRemixModal projectId={project._id.toString()} />
          </div>
        </div>
        <Separator></Separator>
        <ProjectContent remixes={serializedRemixes} />
      </main>
    </div>
  );
}
