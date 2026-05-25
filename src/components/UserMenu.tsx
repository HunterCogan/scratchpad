"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar, Button, Form } from "@heroui/react";
import { logout } from "@/lib/actions/auth";

export default function UserMenu({
  name,
  color,
}: {
  name: string;
  color: string | undefined;
}) {
  const [open, setOpen] = useState(false);
  // temporary solution to get the first initial char of the user
  const initial = name.substring(0, 2).toUpperCase();

  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)}>
        <Avatar>
          <Avatar.Fallback style={{ backgroundColor: color }}>
            {initial}
          </Avatar.Fallback>
        </Avatar>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 z-20 w-44 rounded-lg border border-nav-item-active bg-nav-surface shadow-lg overflow-hidden py-1">
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-nav-text hover:bg-nav-item-hover hover:text-nav-text transition-colors"
            >
              Settings
            </Link>
            <div className="h-px bg-nav-border my-1" />
            <Form
              action={logout}
              validationBehavior="native"
              className="contents"
            >
              <Button
                type="submit"
                variant="ghost"
                className="w-full text-left block px-4 py-2 text-sm text-red-400 hover:bg-nav-item-hover hover:text-nav-text transition-colors"
              >
                Logout
              </Button>
            </Form>
          </div>
        </>
      )}
    </div>
  );
}
