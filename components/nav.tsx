"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/descubrir", label: "Descubrir" },
  { href: "/galeria", label: "Galería" },
  { href: "/videoteca", label: "Videoteca" },
  { href: "/collections", label: "Colecciones" },
  { href: "/favoritos", label: "Favoritos" },
];

export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolledState, setScrolledState] = useState(false);
  const scrolled = !isHome || scrolledState;

  useEffect(() => {
    const onScroll = () => setScrolledState(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav
        className={`mx-auto flex max-w-7xl items-center gap-4 px-6 transition-[height] duration-300 ${
          scrolled ? "h-16" : "h-24"
        }`}
      >
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image src="/icon.png" alt="Galleryz" width={28} height={28} priority />
          <span
            className={`text-sm font-medium tracking-tight transition-colors ${
              scrolled ? "text-black dark:text-white" : "text-white"
            }`}
          >
            Galleryz
          </span>
        </Link>
        <div
          className={`no-scrollbar flex flex-1 items-center justify-start gap-8 overflow-x-auto text-sm transition-colors sm:justify-end ${
            scrolled ? "text-zinc-700 dark:text-zinc-300" : "text-white"
          }`}
        >
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="group relative shrink-0 py-1 whitespace-nowrap"
            >
              {link.label}
              <span
                className={`absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${
                  scrolled ? "bg-black dark:bg-white" : "bg-white"
                }`}
              />
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
