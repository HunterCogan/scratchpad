"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import Link from "next/link";

export function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav>
      {/* Hamburger Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="
                fixed top-4 left-4 z-50
                w-10 h-10
                flex flex-col justify-center items-center
                bg-gray-800 rounded-lg shadow-lg
                hover:bg-gray-700 
                transition-colors duration-200 ease-in-out
                cursor-pointer
            "
      >
        {/* Line 1 */}
        <span
          className={`
                    block h-0.5 w-5 bg-white
                    transition-all duration-500 ease-in-out
                    ${isOpen ? "rotate-45 translate-y-2" : ""}
                `}
        />

        {/* Line 2 */}
        <span
          className={`
                    block h-0.5 w-5 bg-white my-0
                    transition-all duration-500 ease-in-out
                    ${isOpen ? "opacity-0" : "opacity-100"}
                `}
        />

        {/* Line 3 */}
        <span
          className={`
                    block h-0.5 w-5 bg-white
                    transition-all duration-500 ease-in-out
                    ${isOpen ? "-rotate-50 -translate-y-3" : ""}
                `}
        />
      </Button>

      {/* Sidebar */}

      {/* Header */}

      <div
        className={`
                    fixed
                    top-0
                    left-0
                    h-screen
                    w-64
                    z-40
                    bg-gray-800
                    p-6
                    shadow-2xl
                    transform
                    transition-transform
                    duration-500
                    ease-in-out
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                `}
      >
        <h2 className="text-2xl  font-bold text-white mt-16 border-b border-gray-500 pb-2">
          Scratchpad
        </h2>

        <ul className="flex flex-col gap-6 text-lg mt-9">
          <li>
            <Link
              href="/new"
              className={`
                text-lg 
                text-white
                hover:text-blue-400
                transition-colors duration-300 
                underline 
                decoration-transparent 
                hover:decoration-blue-400`}
            >
              Dashboard
            </Link>
          </li>

          <li>
            <Link
              href="/about"
              className={`
                text-lg 
                text-white
                hover:text-blue-400
                transition-colors duration-300 
                underline 
                decoration-transparent 
                hover:decoration-blue-400`}
            >
              My Scratchpad
            </Link>
          </li>

          <li>
            <Link
              href="/shared"
              className={`
            text-lg 
            text-white 
            hover:text-blue-400 
            transition-colors duration-300 
            underline 
            decoration-transparent 
            hover:decoration-blue-400`}
            >
              Shared With Me
            </Link>
          </li>

          <li>
            <Link
              href="/settings"
              className={`
            text-lg 
            text-white 
            hover:text-blue-400 
            transition-colors duration-300 
            underline 
            decoration-transparent 
            hover:decoration-blue-400`}
            >
              Favorites
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
