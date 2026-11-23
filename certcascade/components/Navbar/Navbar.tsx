"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "FAQs", href: "/faqs" },
  { label: "Blogs", href: "/blogs" },
  { label: "Reviews", href: "/reviews" },
];

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-(--brand-orange)/40";

const Navbar = () => {
  const pathname = usePathname();
  const [openOn, setOpenOn] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const menuOpen = openOn === pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenOn(null);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-20 border-b bg-white/80 backdrop-blur-md transition-shadow duration-200 ${
        scrolled
          ? "border-gray-200 shadow-sm"
          : "border-gray-200/70 shadow-none"
      }`}
    >
      <nav
        aria-label="Main"
        className="flex h-(--nav-height) items-center justify-between px-5 sm:px-12 lg:px-24"
      >
        <Link
          href="/"
          className={`group flex items-center gap-2.5 rounded-lg ${focusRing}`}
        >
          <Image
            src="/logo.svg"
            alt="CertCascade logo"
            width={40}
            height={40}
            priority
            className="transition-transform duration-150 group-hover:-rotate-3"
          />
          <span className="text-xl font-black tracking-tight text-gray-900">
            Cert<span className="text-(--brand-orange)">Cascade</span>
          </span>
        </Link>

        <ul className="hidden h-full items-stretch gap-2 md:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href);

            return (
              <li key={link.href} className="flex">
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`group/link relative flex h-full items-center px-3 text-sm font-medium transition-colors duration-150 ${focusRing} ${
                    active
                      ? "text-(--brand-orange)"
                      : "text-(--text-gray) hover:text-gray-900"
                  }`}
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-3 bottom-0 h-0.5 origin-left rounded-full bg-(--brand-orange) transition-transform duration-200 ${
                      active
                        ? "scale-x-100"
                        : "scale-x-0 group-hover/link:scale-x-100"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          className={`flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg transition-colors hover:bg-gray-100 md:hidden ${focusRing}`}
          onClick={() => setOpenOn(menuOpen ? null : pathname)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span
            className={`block h-0.5 w-6 rounded-full bg-gray-900 transition-transform duration-200 ${
              menuOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 rounded-full bg-gray-900 transition-opacity duration-200 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 rounded-full bg-gray-900 transition-transform duration-200 ${
              menuOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {menuOpen && (
        <ul
          id="mobile-menu"
          className="absolute left-0 top-full w-full border-b border-gray-200 bg-white px-3 py-2 shadow-lg md:hidden"
        >
          {navLinks.map((link) => {
            const active = isActive(link.href);

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpenOn(null)}
                  aria-current={active ? "page" : undefined}
                  className={`block rounded-lg px-3 py-3 text-base font-medium transition-colors ${focusRing} ${
                    active
                      ? "bg-orange-50 text-(--brand-orange)"
                      : "text-(--text-gray) hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </header>
  );
};

export default Navbar;