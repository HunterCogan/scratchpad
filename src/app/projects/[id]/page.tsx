import { verifySession } from "@/lib/dal";
import connectDB from "@/lib/db";
import Project from "@/models/Project";
import mongoose from "mongoose";
import { notFound } from "next/navigation";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await verifySession();
  await connectDB();

  const project = await Project.findOne({
    _id: new mongoose.Types.ObjectId(id),
    creator: new mongoose.Types.ObjectId(session.userId),
  }).lean();

  if (!project) notFound();

  return (
    <div className="w-full font-sans">
      <main className="max-w-3xl mx-auto px-6 py-8 flex flex-col gap-2">
        <h1 className="text-2xl font-bold">{project.name}</h1>
        {project.description && (
          <p className="text-sm text-gray-400">{project.description}</p>
        )}
      </main>
    </div>
  );
}
