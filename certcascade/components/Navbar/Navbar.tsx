"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Container from "@/components/shared/Container";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "FAQs", href: "/faqs" },
  { label: "Blogs", href: "/blogs" },
];

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-(--brand-orange)/40";

const Navbar = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-30 border-b bg-white/90 backdrop-blur-md transition-shadow duration-200 ${
        scrolled ? "border-gray-200 shadow-sm" : "border-gray-200/60 shadow-none"
      }`}
    >
      <Container>
        <nav
          aria-label="Main"
          className="flex h-(--nav-height) items-center justify-between"
        >
          <Link
            href="/"
            className={`group flex items-center gap-2.5 rounded-lg ${focusRing}`}
          >
            <Image
              src="/logo.svg"
              alt="CertCascade logo"
              width={36}
              height={36}
              priority
              className="transition-transform duration-150 group-hover:-rotate-3"
            />
            <span className="text-xl font-extrabold tracking-tight text-gray-900">
              Cert<span className="text-(--brand-orange)">Cascade</span>
            </span>
          </Link>

          <ul className="hidden h-full items-stretch gap-1 md:flex">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href} className="flex">
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`group/link relative flex h-full items-center px-3 text-sm font-medium transition-colors duration-150 ${focusRing} ${
                      active
                        ? "text-(--brand-orange-ink)"
                        : "text-(--text-gray) hover:text-gray-900"
                    }`}
                  >
                    {link.label}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-3 bottom-0 h-0.5 origin-left rounded-full bg-(--brand-orange) transition-transform duration-200 ${
                        active ? "scale-x-100" : "scale-x-0 group-hover/link:scale-x-100"
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
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span
              className={`block h-0.5 w-5 rounded-full bg-gray-900 transition-transform duration-200 ${
                menuOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 rounded-full bg-gray-900 transition-opacity duration-200 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 rounded-full bg-gray-900 transition-transform duration-200 ${
                menuOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </button>
        </nav>
      </Container>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-gray-200 bg-white shadow-md md:hidden"
        >
          <Container>
            <ul className="flex flex-col py-2">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`block min-h-[44px] rounded-lg px-3 py-3 text-sm font-medium transition-colors ${focusRing} ${
                        active
                          ? "bg-orange-50 text-(--brand-orange-ink)"
                          : "text-(--text-gray) hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Container>
        </div>
      )}
    </header>
  );
};

export default Navbar;
