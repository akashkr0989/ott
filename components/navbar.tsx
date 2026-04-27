"use client";

import { Bell, Search } from "lucide-react";
import { useEffect, useState } from "react";

const links = ["Home", "Series", "Movies", "New & Popular", "My List"];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        isScrolled ? "bg-[#050505]/95 shadow-lg" : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <nav className="flex h-16 items-center justify-between px-4 sm:px-8 lg:px-12">
        <div className="flex items-center gap-7">
          <a className="text-2xl font-black uppercase tracking-normal text-red-600" href="#">
            StreamFlix
          </a>
          <div className="hidden items-center gap-5 text-sm text-zinc-200 md:flex">
            {links.map((link) => (
              <a className="transition hover:text-white" href="#" key={link}>
                {link}
              </a>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4 text-zinc-100">
          <button aria-label="Search" className="rounded-full p-2 transition hover:bg-white/10">
            <Search size={20} />
          </button>
          <button aria-label="Notifications" className="hidden rounded-full p-2 transition hover:bg-white/10 xs:inline-flex">
            <Bell size={20} />
          </button>
          <button
            aria-label="Profile menu"
            className="grid h-8 w-8 place-items-center rounded bg-red-600 text-sm font-bold"
          >
            A
          </button>
        </div>
      </nav>
    </header>
  );
}
