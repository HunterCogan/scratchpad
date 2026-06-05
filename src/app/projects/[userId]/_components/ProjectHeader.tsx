"use client";

import { useState } from "react";
import {
  AlertDialog,
  Avatar,
  Button,
  Chip,
  Dropdown,
  Input,
  Spinner,
  Surface,
  TextArea,
  Tooltip,
  useOverlayState,
} from "@heroui/react";
import AddCollaboratorModal from "./AddCollaboratorModal";
import CreateRemixModal from "./CreateRemixModal";
import { UserMinusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

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
  const [loading, setLoading] = useState(false);
  const [leaveError, setLeaveError] = useState<string | null>(null);

  const leaveState = useOverlayState();

  // Creates a copy of team where project creator is sortedTeam[0] and session user is sortedTeam[1]
  const sortedTeam = [
    { id: creatorId, name: creatorName, color: creatorColor },
    ...[...team]
      .filter((m) => m.id !== creatorId)
      .sort((a) => (a.id === userId ? -1 : 0)),
  ];
  const isVisitor = !sortedTeam.some((m) => m.id === userId);

  async function handleLeaveProject() {
    setLoading(true);
    try {
      // TODO: implement when UPDATE route is ready
    } finally {
      setLoading(false);
    }
  }

  return (
    <Surface className="flex gap-2 rounded-3xl p-4">
      <div className="flex flex-1">
        <div className="flex flex-col flex-1 gap-1">
          <Input
            value={name}
            readOnly={userId !== creatorId}
            onChange={(e) => setName(e.target.value)}
            className="border-none shadow-none rounded-sm text-2xl font-bold p-1"
          />
          <TextArea
            value={description}
            readOnly={userId !== creatorId}
            onChange={(e) => setDescription(e.target.value)}
            className="resize-none border-none shadow-none rounded-sm text-sm p-1"
          />
          <div className="flex flex-row gap-2 my-2">
            <Chip size="sm">
              <Chip.Label>Created: {createdAt}</Chip.Label>
            </Chip>
            <Chip size="sm">
              <Chip.Label>
                Updated: {lastUpdated ? lastUpdated : "never"}
              </Chip.Label>
            </Chip>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex justify-end gap-2">
          <div className="flex -space-x-2">
            {sortedTeam.slice(0, 3).map((member) => (
              <Link
                key={member.id}
                target="_blank"
                href={`/users/${member.id}`}
              >
                <Tooltip delay={0}>
                  <Tooltip.Trigger>
                    <Avatar className="ring-2 ring-white">
                      <Avatar.Fallback
                        style={{ backgroundColor: member.color }}
                      >
                        {member.name.substring(0, 2).toUpperCase()}
                      </Avatar.Fallback>
                    </Avatar>
                  </Tooltip.Trigger>
                  <Tooltip.Content>
                    <p>{member.name}</p>
                  </Tooltip.Content>
                </Tooltip>
              </Link>
            ))}
            {sortedTeam.length - 3 > 0 && (
              <Dropdown>
                <Dropdown.Trigger>
                  <Avatar className="ring-2 ring-white">
                    <Avatar.Fallback className="text-xs">
                      +{sortedTeam.length - 3}
                    </Avatar.Fallback>
                  </Avatar>
                </Dropdown.Trigger>
                <Dropdown.Popover>
                  <Dropdown.Menu>
                    {sortedTeam.slice(3).map((member) => (
                      <Dropdown.Item
                        key={member.id}
                        target="_blank"
                        href={`/users/${member.id}`}
                      >
                        {member.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            )}
          </div>
          {!isVisitor && (
            <div className="flex gap-1">
              <AddCollaboratorModal
                projectId={projectId}
                isDisabled={userId !== creatorId}
              />

              <AlertDialog
                isOpen={leaveState.isOpen}
                onOpenChange={leaveState.setOpen}
              >
                <Tooltip>
                  <Button
                    variant="danger-soft"
                    isIconOnly
                    onPress={leaveState.open}
                  >
                    <UserMinusIcon />
                  </Button>
                  <Tooltip.Content>
                    <p>Leave project</p>
                  </Tooltip.Content>
                </Tooltip>

                <AlertDialog.Backdrop>
                  <AlertDialog.Container>
                    <AlertDialog.Dialog>
                      <AlertDialog.CloseTrigger className="m-3" />

                      <AlertDialog.Header>
                        <AlertDialog.Heading className="flex items-center gap-2 text-2xl mb-3">
                          <AlertDialog.Icon />
                          Leave Project?
                        </AlertDialog.Heading>
                      </AlertDialog.Header>

                      <AlertDialog.Body>
                        {team.length === 0 ? (
                          <p>
                            <strong>{name}</strong> will be permanently deleted.
                            This cannot be undone.
                          </p>
                        ) : (
                          <p>
                            You will no longer be able to contribute to this
                            project.
                          </p>
                        )}
                        {leaveError && (
                          <p className="text-red-500 text-sm mt-2">
                            {leaveError}
                          </p>
                        )}
                      </AlertDialog.Body>

                      <AlertDialog.Footer>
                        <Button variant="tertiary" onPress={leaveState.close}>
                          Cancel
                        </Button>

                        <Button
                          variant="danger"
                          isDisabled={loading}
                          onPress={handleLeaveProject}
                        >
                          {loading && <Spinner size="sm" />}
                          {loading ? "Leaving..." : "Leave"}
                        </Button>
                      </AlertDialog.Footer>
                    </AlertDialog.Dialog>
                  </AlertDialog.Container>
                </AlertDialog.Backdrop>
              </AlertDialog>
            </div>
          )}
        </div>
        {!isVisitor && (
          <CreateRemixModal
            projectId={projectId}
            creatorId={creatorId}
          ></CreateRemixModal>
        )}
      </div>
    </Surface>
  );
}
