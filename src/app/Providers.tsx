"use client";

import { ThemeProvider } from "next-themes";
import { ToastProvider } from "@heroui/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <ToastProvider placement="bottom" />
      {children}
    </ThemeProvider>
  );
}
