"use client";

import { Avatar, Dropdown } from "@heroui/react";
import { logout } from "@/lib/actions/auth";

// Makes a hash from a string and returns a hex color code. Used to generate a color for the user avatar if no color is provided.
function hashColor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++)
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  return `#${((h >>> 0) & 0xffffff).toString(16).padStart(6, "0")}`;
}

export default function UserMenu({
  name,
  color,
}: {
  name: string;
  color: string | undefined;
}) {
  const initial = name.substring(0, 2).toUpperCase();
  const avatarColor = color ?? hashColor(name);

  return (
    <div className="relative">
      <Dropdown>
        <Dropdown.Trigger>
          <Avatar className="cursor-pointer">
            <Avatar.Fallback style={{ backgroundColor: avatarColor }}>
              {initial}
            </Avatar.Fallback>
          </Avatar>
        </Dropdown.Trigger>
        <Dropdown.Popover placement="bottom end">
          <Dropdown.Menu>
            <Dropdown.Item href="/settings">Settings</Dropdown.Item>
            <Dropdown.Item onPress={() => logout()} className="text-red-400">
              Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
    </div>
  );
}
