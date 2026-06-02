import Link from "next/link";
import { notFound } from "next/navigation";
import { verifySession } from "@/lib/dal";
import connectDB from "@/lib/db";
import ProjectModel from "@/models/Project";
import UserModel from "@/models/User";
import mongoose from "mongoose";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const session = await verifySession();

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    notFound();
  }

  await connectDB();

  const user = await UserModel.findById(userId).lean();
  if (!user) {
    notFound();
  }

  const projects = await ProjectModel.find({
    creator: new mongoose.Types.ObjectId(userId),
  })
    .sort({ createdAt: -1 })
    .lean();

  const serializedProjects = projects.map((p) => ({
    id: p._id.toString(),
    name: p.name,
    description: p.description ?? "",
    createdAt: new Date(p.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  }));

  const isOwner = session.userId === userId;
  const aboutText = user.about?.trim() ?? "";

  return (
    <div className="w-full font-sans">
      <main className="max-w-3xl mx-auto px-6 py-8 flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          {isOwner && (
            <Link
              href="/settings"
              className="text-sm font-medium text-primary hover:underline shrink-0"
            >
              Edit
            </Link>
          )}
        </div>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">About me</h2>
          <p className="text-sm text-default-500">
            {aboutText.length > 0 ? aboutText : "No bio yet."}
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Projects</h2>
          {serializedProjects.length === 0 ? (
            <p className="text-sm text-default-500">No projects yet.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {serializedProjects.map((project) => (
                <li key={project.id} className="text-sm">
                  <Link
                    href={`/projects/${userId}?projectId=${project.id}`}
                    className="font-medium hover:underline"
                  >
                    {project.name}
                  </Link>
                  {project.description.length > 0 && (
                    <span className="text-default-500">
                      {" "}
                      — {project.description}
                    </span>
                  )}
                  <span className="text-default-400"> ({project.createdAt})</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
