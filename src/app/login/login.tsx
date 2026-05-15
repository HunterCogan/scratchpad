"use client";

import Link from "next/link";
import { Input, Form, Button } from "@heroui/react";

export function LoginPage() {
  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center px-4">
      <Form
        className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md gap-6 flex flex-col"
        onSubmit={(e) => {
          e.preventDefault();
          console.log("Login submitted");
        }}
      >
        <h2 className="text-4xl font-bold text-blue-500 text-center w-full">
          Login
        </h2>

        <Input
          name="email"
          type="text"
          placeholder="Enter your email"
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />

        <Input
          name="password"
          type="password"
          placeholder="Enter your password"
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />

        <Button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-md transition-colors"
        >
          Login
        </Button>

        <p className="text-sm text-center w-full text-black">
          {"Don't have an account? "}
          <Link href="/signup">
            <Button className="bg-transparent shadow-none text-blue-500 p-0">
              Sign up
            </Button>
          </Link>
        </p>
      </Form>
    </div>
  );
}
