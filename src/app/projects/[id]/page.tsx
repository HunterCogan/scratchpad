import { verifySession } from "@/lib/dal";
import connectDB from "@/lib/db";
import Project from "@/models/Project";
import Remix from "@/models/Remix";
import mongoose from "mongoose";
import { notFound } from "next/navigation";
import CreateRemixModal from "./_components/CreateRemixModal";
import { Card } from "@heroui/react";

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

  const remixes = await Remix.find({ project: project._id })
    .sort({ createdAt: -1 })
    .populate("uploader", "name")
    .lean();

  return (
    <div className="w-full font-sans">
      <main className="max-w-3xl mx-auto px-6 py-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">{project.name}</h1>
          {project.description && (
            <p className="text-sm text-gray-400">{project.description}</p>
          )}
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Remixes</h2>
            <CreateRemixModal projectId={id} />
          </div>
          {remixes.length === 0 ? (
            <p className="text-sm text-gray-400">No remixes yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {remixes.map((remix) => (
                <Card key={remix._id}>
                  <Card.Header>
                    <Card.Title>{remix.uploader.name}</Card.Title>
                    <Card.Description>{remix.description}</Card.Description>
                  </Card.Header>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
