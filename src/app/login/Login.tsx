"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Form,
  Input,
  Label,
  TextField,
  Checkbox,
  Card,
  InputGroup,
} from "@heroui/react";
import Link from "next/link";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { authClient } from "@/lib/auth-client";

export default function LoginPage({
  currentPage = "login",
}: {
  currentPage?: "login" | "home";
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    setLoading(true);

    const { error } = await authClient.signIn.email({
      email,
      password,
      rememberMe,
    });

    setLoading(false);

    if (error) {
      setError(error.message || "Failed to login");
    } else {
      router.refresh();
      router.push("/dashboard");
    }
  }

  function validate() {
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return false;
    }

    if (!password.trim()) {
      setError("Password is required");
      return false;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }

    return true;
  }

  const pageStyles =
    currentPage === "login" ? "h-screen place-items-center" : "";

  return (
    <div className={`grid p-6 sm:p-12 ${pageStyles}`}>
      <div className="flex flex-col items-center w-full">
        {currentPage === "home" ? (
          <>
            <Label className="text-3xl font-semibold">Welcome back</Label>
            <p className="opacity-80 mb-5">Log in to your MixGit account</p>
          </>
        ) : (
          <Label className="text-4xl sm:text-5xl mb-4">Login</Label>
        )}

        <Card variant="default" className="shadow-lg w-full max-w-md">
          <Form
            onSubmit={handleSubmit}
            className="justify-center w-full max-w-md gap-6 flex flex-col p-1 sm:p-5"
          >
            <TextField className="flex flex-col gap-1" isRequired>
              <Label>Email</Label>
              <Input
                variant="secondary"
                type="email"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </TextField>

            <TextField className="flex flex-col gap-1" isRequired>
              <Label>Password</Label>
              <InputGroup variant="secondary">
                <InputGroup.Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-tl-[inherit] rounded-bl-[inherit]"
                />
                <InputGroup.Suffix className="pr-0">
                  <Button
                    type="button"
                    variant="ghost"
                    excludeFromTabOrder
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeIcon className="w-5 h-5" />
                    ) : (
                      <EyeSlashIcon className="w-5 h-5" />
                    )}
                  </Button>
                </InputGroup.Suffix>
              </InputGroup>
            </TextField>

            <Checkbox
              id="rememberMe"
              isSelected={rememberMe}
              onChange={setRememberMe}
              variant="secondary"
            >
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
              <Checkbox.Content>
                <Label htmlFor="rememberMe" className="text-sm">
                  Remember Me
                </Label>
              </Checkbox.Content>
            </Checkbox>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isDisabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Form>
        </Card>

        <div className="text-sm text-center mt-6">
          Don&apos;t have an account?{" "}
          <Link className="text-blue-500" href="/signup">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
