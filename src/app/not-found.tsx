import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import ShellLayout from "@/components/ShellLayout";
import Link from "next/link";
import { Button } from "@heroui/react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function NotFound() {
  const session = await auth.api.getSession({ headers: await headers() });
  const isLoggedIn = !!session?.user?.id;

  return (
    <ShellLayout
      header={<Header />}
      navbar={isLoggedIn ? <Navbar /> : undefined}
    >
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] gap-4 text-center px-4">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="text-xl font-semibold">Page not found</p>
        <p className="text-sm text-muted-foreground max-w-sm">
          The URL you entered doesn&apos;t exist. It may have been removed or
          you may have mistyped it.
        </p>
        <Link href={isLoggedIn ? "/dashboard" : "/"}>
          <Button variant="primary">
            {isLoggedIn ? "Back to Dashboard" : "Back to Home"}
          </Button>
        </Link>
      </div>
    </ShellLayout>
  );
}
