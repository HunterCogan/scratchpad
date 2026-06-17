"use client";

import { useRouter } from "next/navigation";
import { Button, Card, Chip } from "@heroui/react";
import { EyeIcon } from "@heroicons/react/24/outline";

export type UserProject = {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
};

function ProjectRow({
  project,
  username,
}: {
  project: UserProject;
  username: string;
}) {
  const router = useRouter();

  return (
    <Card className="w-full items-stretch flex-row">
      <div className="flex flex-1 flex-col gap-3">
        <Card.Header>
          <Card.Title>{project.name}</Card.Title>
          <Card.Description>
            {project.description.length > 0
              ? project.description
              : "No description"}
          </Card.Description>
        </Card.Header>
        <Card.Footer>
          <div className="flex gap-1 flex-wrap">
            <Chip size="md">Created: {project.createdAt}</Chip>
          </div>
          <div className="flex gap-1 ml-auto shrink-0">
            <Button
              variant="outline"
              size="sm"
              onPress={() => router.push(`/${username}/${project.slug}`)}
            >
              <EyeIcon className="h-4 w-4" />
              View
            </Button>
          </div>
        </Card.Footer>
      </div>
    </Card>
  );
}

export default function UserProjectsList({
  projects,
  username,
  isOwner,
}: {
  projects: UserProject[];
  username: string;
  isOwner: boolean;
}) {
  if (projects.length === 0) {
    return (
      <p className="text-sm text-default-500">
        {isOwner
          ? "No projects yet. Create one to get started."
          : "No projects yet."}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {projects.map((project) => (
        <ProjectRow key={project.id} project={project} username={username} />
      ))}
    </div>
  );
}
