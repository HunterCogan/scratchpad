"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Avatar,
  Button,
  Form,
  Input,
  Label,
  Spinner,
  TextArea,
  TextField,
} from "@heroui/react";

type SettingsFormProps = {
  userId: string;
  initialName: string;
  initialColor: string;
  initialAbout: string;
};

function normalizeHexColor(value: string) {
  const trimmed = value.trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(trimmed)) return trimmed;
  if (/^[0-9A-Fa-f]{6}$/.test(trimmed)) return `#${trimmed}`;
  return trimmed;
}

export default function SettingsForm({
  userId,
  initialName,
  initialColor,
  initialAbout,
}: SettingsFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [color, setColor] = useState(initialColor);
  const [about, setAbout] = useState(initialAbout);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const avatarInitial = useMemo(
    () => name.substring(0, 2).toUpperCase() || "??",
    [name],
  );

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          color: normalizeHexColor(color),
          about,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const fieldErrors = data.error;
        if (fieldErrors && typeof fieldErrors === "object") {
          const first = Object.values(fieldErrors).flat()[0];
          setError(
            typeof first === "string" ? first : "Failed to save profile",
          );
        } else {
          setError(
            typeof data.error === "string"
              ? data.error
              : "Failed to save profile",
          );
        }
        return;
      }

      setSuccess(true);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Avatar size="lg">
          <Avatar.Fallback style={{ backgroundColor: color }}>
            {avatarInitial}
          </Avatar.Fallback>
        </Avatar>
        <div>
          <p className="text-sm text-default-500">Profile preview</p>
          <Link
            href={`/users/${userId}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            View your profile
          </Link>
        </div>
      </div>

      <Form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <TextField isRequired>
          <Label>Display name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </TextField>

        <div className="flex flex-col gap-2">
          <Label>Avatar color</Label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-10 w-14 cursor-pointer rounded border border-default-200 bg-transparent"
              aria-label="Pick avatar color"
            />
            <Input
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="#808080"
              className="flex-1"
            />
          </div>
        </div>

        <TextField>
          <Label>About me</Label>
          <TextArea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Tell others a little about yourself"
            rows={4}
          />
          <p className="text-xs text-default-400 mt-1">
            {about.length}/500 characters
          </p>
        </TextField>

        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && (
          <p className="text-sm text-green-600">Profile saved successfully.</p>
        )}

        <Button type="submit" variant="primary" isDisabled={loading}>
          {loading && <Spinner size="sm" />}
          {loading ? "Saving..." : "Save profile"}
        </Button>
      </Form>
    </div>
  );
}
