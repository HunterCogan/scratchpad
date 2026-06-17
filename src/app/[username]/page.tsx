import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import connectDB from "@/lib/db";
import ProjectModel from "@/models/Project";
import UserModel from "@/models/User";
import UserProfile from "./_components/UserProfile";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  await connectDB();

  const user = await UserModel.findOne({ username }).lean();
  if (!user) {
    notFound();
  }

  const userId = user._id.toString();

  const projects = await ProjectModel.find({ creator: user._id })
    .sort({ createdAt: -1 })
    .lean();

  const serializedProjects = projects.map((p) => ({
    id: p._id.toString(),
    name: p.name,
    slug: p.slug,
    description: p.description ?? "",
    createdAt: new Date(p.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  }));

  return (
    <UserProfile
      name={user.name}
      username={user.username}
      color={user.color ?? "#808080"}
      imagePath={user.imagePath ?? undefined}
      about={user.about ?? ""}
      isOwner={session?.user?.id === userId}
      projects={serializedProjects}
    />
  );
}
