"use client";

import { useState } from "react";

export function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
                fixed top-4 left-4 z-50
                w-11 h-12
                flex flex-col justify-center items-center
                bg-gray-800 rounded-lg shadow-lg
                hover:bg-gray-700 
                transition-colors duration-300 ease-in-out
                cursor-pointer
            "
      >
        {/* Line 1 */}
        <span
          className={`
                    block h-0.5 w-6 bg-white
                    transition-all duration-500 ease-in-out
                    ${isOpen ? "rotate-44 translate-y-2" : ""}
                `}
        />

        {/* Line 2 */}
        <span
          className={`
                    block h-0.5 w-6 bg-white my-1
                    transition-all duration-500 ease-in-out
                    ${isOpen ? "opacity-0" : "opacity-100"}
                `}
        />

        {/* Line 3 */}
        <span
          className={`
                    block h-0.5 w-6 bg-white
                    transition-all duration-500 ease-in-out
                    ${isOpen ? "-rotate-48 -translate-y-1" : ""}
                `}
        />
      </button>

      {/* Sidebar */}
      <div
        className={`
                    fixed
                    top-0
                    left-0
                    h-screen
                    w-64
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
        <ul className="flex flex-col gap-6 text-lg mt-14">
          <li>
            <a href="/new" className="hover:text-blue-400">
              Dashboard
            </a>
          </li>

          <li>
            <a href="/about" className="hover:text-blue-400">
              My Scratchpad
            </a>
          </li>

          <li>
            <a href="/shared" className="hover:text-blue-400">
              Shared With Me
            </a>
          </li>

          <li>
            <a href="/settings" className="hover:text-blue-400">
              Favorites
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
