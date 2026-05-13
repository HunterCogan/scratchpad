"use client";

import { useState } from "react";
import {
  Button,
  Card,
  Spinner,
  Chip,
  Input,
  Accordion,
  Separator,
  Text,
} from "@heroui/react";
import { UserIcon, UserPlusIcon } from "@heroicons/react/24/solid";

/**
 * READ ME:
 * THIS WILL BE DELETED IN THE FUTURE.
 * This page is designed to test the authentication flow.
 * It includes forms for user sign up, login, and logout functionality.
 * I sometimes like testing things with a UI, as a "user"
 *
 **/

type ApiResponse = {
  status?: number;
  data?: { message?: string; userId?: string };
  error?: string;
};

export default function TestAuthPage() {
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [registerError, setRegisterError] = useState("");

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");

  // Register handler
  const handleRegister = async () => {
    setRegisterError("");
    setResult(null);

    // Validation
    if (
      !registerForm.email ||
      !registerForm.password ||
      !registerForm.confirmPassword
    ) {
      setRegisterError("All fields are required");
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setRegisterError("Passwords do not match");
      return;
    }

    if (registerForm.password.length < 8) {
      setRegisterError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registerForm.email,
          password: registerForm.password,
        }),
      });
      const data = await res.json();
      setResult({ status: res.status, data });

      if (res.ok) {
        setRegisterForm({ email: "", password: "", confirmPassword: "" });
      }
    } catch (error) {
      setResult({ error: (error as Error).message });
    }
    setLoading(false);
  };

  // Login handler
  const handleLogin = async () => {
    setLoginError("");
    setResult(null);

    if (!loginForm.email || !loginForm.password) {
      setLoginError("Email and password are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      setResult({ status: res.status, data });

      if (res.ok) {
        setLoginForm({ email: "", password: "" });
      }
    } catch (error) {
      setResult({ error: (error as Error).message });
    }
    setLoading(false);
  };

  // Logout handler
  const handleLogout = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      const data = await res.json();
      setResult({ status: res.status, data });
    } catch (error) {
      setResult({ error: (error as Error).message });
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-2xl p-6">
        <div className="flex flex-col gap-2 mb-6">
          <Text size="xl" className="font-bold text-black">
            Authentication Testing
          </Text>
          <Text className="text-default-500 text-black">
            Test the authentication flow with forms below
          </Text>
        </div>

        <Separator className="mb-6" />

        <div className="gap-6 flex flex-col">
          {/* Accordion with Register and Login Forms */}
          <Accordion allowsMultipleExpanded>
            {/* Register Section */}
            <Accordion.Item key="register">
              <Accordion.Heading>
                <Accordion.Trigger className="flex items-center justify-between gap-2 w-full text-left py-3 px-4 bg-default-100 rounded-lg">
                  <span className="flex items-center gap-2 text-black font-semibold text-lg">
                    <UserPlusIcon className="h-8 w-8" /> Sign Up
                  </span>
                  <Accordion.Indicator />
                </Accordion.Trigger>
              </Accordion.Heading>
              <Accordion.Panel>
                <Accordion.Body>
                  <div className="flex flex-col gap-4 pb-4">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={registerForm.email}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          email: e.target.value,
                        })
                      }
                      disabled={loading}
                    />
                    <Input
                      type="password"
                      placeholder="Enter password (min 8 characters)"
                      value={registerForm.password}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          password: e.target.value,
                        })
                      }
                      disabled={loading}
                    />
                    <Input
                      type="password"
                      placeholder="Confirm your password"
                      value={registerForm.confirmPassword}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      disabled={loading}
                      color={
                        registerForm.confirmPassword &&
                        registerForm.password !== registerForm.confirmPassword
                          ? "danger"
                          : "default"
                      }
                    />

                    {registerForm.confirmPassword && (
                      <div
                        className={`text-sm ${
                          registerForm.password === registerForm.confirmPassword
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {registerForm.password === registerForm.confirmPassword
                          ? "✓ Passwords match"
                          : "❌ Passwords do not match"}
                      </div>
                    )}

                    {registerError && (
                      <div className="bg-red-50 text-red-700 p-3 rounded border border-red-200 text-sm">
                        {registerError}
                      </div>
                    )}

                    <Button
                      onPress={handleRegister}
                      isDisabled={loading}
                      isPending={loading}
                      fullWidth
                      variant="primary"
                      size="lg"
                    >
                      Sign Up
                    </Button>
                  </div>
                </Accordion.Body>
              </Accordion.Panel>
            </Accordion.Item>

            {/* Login Section */}
            <Accordion.Item key="login">
              <Accordion.Heading>
                <Accordion.Trigger className="flex items-center justify-between gap-2 w-full text-left py-3 px-4 bg-default-100 rounded-lg">
                  <span className="flex items-center gap-2 text-black font-semibold text-lg">
                    <UserIcon className="h-8 w-8" /> Login
                  </span>
                  <Accordion.Indicator />
                </Accordion.Trigger>
              </Accordion.Heading>
              <Accordion.Panel>
                <Accordion.Body>
                  <div className="flex flex-col gap-4 pb-4">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={loginForm.email}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, email: e.target.value })
                      }
                      disabled={loading}
                    />
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, password: e.target.value })
                      }
                      disabled={loading}
                    />

                    {loginError && (
                      <div className="bg-red-50 text-red-700 p-3 rounded border border-red-200 text-sm">
                        {loginError}
                      </div>
                    )}

                    <Button
                      onPress={handleLogin}
                      isDisabled={loading}
                      isPending={loading}
                      fullWidth
                      variant="secondary"
                      size="lg"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Login
                    </Button>
                  </div>
                </Accordion.Body>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>

          <Separator />

          {/* Logout Button Section */}
          <div className="flex justify-center">
            <Button
              onPress={handleLogout}
              isDisabled={loading}
              isPending={loading}
              variant="danger"
              size="sm"
            >
              Logout
            </Button>
          </div>

          {/* Results Section */}
          {result && (
            <div className="gap-4 flex flex-col">
              <hr />
              <div className="flex items-center gap-2">
                <Text size="lg" className="font-semibold text-black">
                  Response
                </Text>
                <Chip
                  size="sm"
                  variant="soft"
                  color={
                    result?.status &&
                    result.status >= 200 &&
                    result.status < 300
                      ? "success"
                      : "danger"
                  }
                >
                  {result.status || "Error"}
                </Chip>
              </div>
              <pre className="bg-default-100 p-4 rounded-lg text-xs overflow-auto max-h-96 border border-default-200 text-red-800">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center gap-2">
              <Spinner size="sm" />
              <span className="text-default-500">Processing...</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
