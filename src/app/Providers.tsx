"use client";

import { ToastProvider } from "@heroui/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToastProvider placement="bottom" />
      {children}
    </>
  );
}
