"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { PlusIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  Modal,
  TextField,
  useOverlayState,
} from "@heroui/react";
import { handleCreateProject } from "../actions";
import { ProjectSchema } from "@/lib/schemas/project.zod";

// Confirmation button that show on the Modal and submits the Form inputs
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" fullWidth isPending={pending}>
      Create Project
    </Button>
  );
}

// Modal that contains the form for creating a new project. It is opened with the Create New Project button.
export default function CreateProjectModal() {
  const state = useOverlayState();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <Modal state={state}>
      <Button variant="primary">
        <PlusIcon className="h-4 w-4" />
        Create New Project
      </Button>
      <Modal.Backdrop>
        <Modal.Container size="md">
          <Modal.Dialog>
            <Modal.CloseTrigger className="m-2" />
            <Modal.Header>
              <Modal.Heading className="text-2xl">
                New Scratchpad Project
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <Form
                action={handleCreateProject}
                className="flex flex-col gap-4 p-1"
                validationBehavior="aria"
                onSubmit={(e) => {
                  setSubmitted(true);
                  if (!name.trim()) e.preventDefault();
                }}
              >
                <TextField
                  isRequired
                  name="name"
                  value={name}
                  onChange={setName}
                  validate={(value) => {
                    if (!submitted && !value) return null;
                    if (!value) return "Project name is required";
                    const result = ProjectSchema.shape.name.safeParse(value);
                    return result.success
                      ? null
                      : result.error.issues[0].message;
                  }}
                >
                  <Label>Title</Label>
                  <Input
                    variant="secondary"
                    placeholder='"My Awesome Scratchpad Project!"'
                  />
                  <Description>
                    Choose a unique name for your project
                  </Description>
                  <FieldError />
                </TextField>
                <TextField
                  name="description"
                  value={description}
                  onChange={setDescription}
                  validate={(value) => {
                    if (!value) return null;
                    const result =
                      ProjectSchema.shape.description.safeParse(value);
                    return result.success
                      ? null
                      : (result.error.issues[0]?.message ?? null);
                  }}
                >
                  <Label>Description</Label>
                  <Input
                    variant="secondary"
                    placeholder='"Made by a smart team of students!"'
                  />
                  <Description>
                    Write a short description for your project
                  </Description>
                  <FieldError />
                </TextField>
                <SubmitButton />
              </Form>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
