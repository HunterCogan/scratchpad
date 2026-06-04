"use client";

import { useState } from "react";
import { Avatar, Chip, Input, Surface, TextArea } from "@heroui/react";
import { BackButton } from "@/components/BackButton";
import AddCollaboratorModal from "./AddCollaboratorModal";
import CreateRemixModal from "./CreateRemixModal";

interface TeamMember {
  id: string;
  name: string;
  color: string;
}

interface ProjectHeaderProps {
  projectId: string;
  creatorId: string;
  userId: string;
  initialName: string;
  initialDescription: string;
  createdAt: string;
  lastUpdated: string | undefined;
  team: TeamMember[];
  creatorName: string;
  creatorColor: string;
}

export function ProjectHeader({
  projectId,
  creatorId,
  userId,
  initialName,
  initialDescription,
  createdAt,
  lastUpdated,
  team,
  creatorName,
  creatorColor,
}: ProjectHeaderProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);

  // Creates a copy of team where session user is first
  // used to display session user's Avatar next to the project creator
  const sortedTeam = [...team].sort((a) => (a.id === userId ? -1 : 0));

  return (
    <Surface className="flex flex-row justify-between rounded-3xl p-6">
      <div className="flex flex-row flex-1 gap-6">
        <BackButton href="/dashboard" />
        <div className="flex flex-col flex-1">
          <Input
            value={name}
            readOnly={userId !== creatorId}
            onChange={(e) => setName(e.target.value)}
            className="border-none shadow-none rounded-none text-2xl font-bold m-1 p-1"
          />
          <TextArea
            value={description}
            readOnly={userId !== creatorId}
            onChange={(e) => setDescription(e.target.value)}
            className="border-none shadow-none rounded-none text-sm m-1 p-1 max-h-18"
          />
          <div className="flex flex-row gap-2 my-2">
            <Chip>Created: {createdAt}</Chip>
            {lastUpdated && <Chip>Updated: {lastUpdated}</Chip>}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-end">
          <div className="flex -space-x-2">
            <Avatar className="ring-2 ring-white">
              <Avatar.Fallback style={{ backgroundColor: creatorColor }}>
                {creatorName.substring(0, 2).toUpperCase()}
              </Avatar.Fallback>
            </Avatar>
            {sortedTeam.slice(0, 2).map((member) => (
              <Avatar key={member.id} className="ring-2 ring-white">
                <Avatar.Fallback style={{ backgroundColor: member.color }}>
                  {member.name.substring(0, 2).toUpperCase()}
                </Avatar.Fallback>
              </Avatar>
            ))}
            {team.length - 2 > 0 && (
              <Avatar className="ring-2 ring-white">
                <Avatar.Fallback className="text-xs">
                  +{team.length - 2}
                </Avatar.Fallback>
              </Avatar>
            )}
          </div>
          {userId === creatorId && (
            <span className="ml-2">
              <AddCollaboratorModal projectId={projectId} />
            </span>
          )}
        </div>
        <CreateRemixModal projectId={projectId} creatorId={creatorId} />
      </div>
    </Surface>
  );
}
