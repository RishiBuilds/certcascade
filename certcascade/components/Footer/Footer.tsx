import Link from "next/link";
import { BsGithub } from "react-icons/bs";
import Container from "@/components/shared/Container";

interface FooterLinkItem {
  label: string;
  href: string;
}

const pages: FooterLinkItem[] = [
  { label: "Home", href: "/" },
  { label: "FAQs", href: "/faqs" },
  { label: "Blogs", href: "/blogs" },
  { label: "Reviews", href: "/reviews" },
];

const contact: FooterLinkItem[] = [
  { label: "X: @rishitwts_", href: "https://x.com/rishitwts_" },
  { label: "GitHub: @RishiBuilds", href: "https://github.com/RishiBuilds" },
  {
    label: "rishi.chaurasia.dev@gmail.com",
    href: "mailto:rishi.chaurasia.dev@gmail.com",
  },
];

const linkClass =
  "text-sm text-white/60 transition-colors duration-150 hover:text-white focus-visible:text-white focus-visible:underline outline-none break-all";

function FooterLink({ label, href }: FooterLinkItem) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={linkClass}>
        {label}
      </Link>
    );
  }
  const isWeb = href.startsWith("http");
  return (
    <a
      href={href}
      target={isWeb ? "_blank" : undefined}
      rel={isWeb ? "noopener noreferrer" : undefined}
      className={linkClass}
    >
      {label}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="bg-(--primary) pb-8 pt-16 text-white">
      <Container>
        <div className="grid grid-cols-1 gap-10 border-b border-white/10 pb-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              aria-label="CertCascade home"
              className="inline-flex w-fit items-center gap-0 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <span className="text-xl font-extrabold tracking-tight text-white">
                Cert<span className="text-orange-300">Cascade</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-white/60">
              Generate certificates, report cards, and IDs in bulk. Free, fast,
              and right in your browser.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Pages</h3>
            <ul className="flex flex-col gap-3">
              {pages.map((link) => (
                <li key={link.href}>
                  <FooterLink {...link} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-1 text-sm font-semibold text-white">
              Get in touch
            </h3>
            <p className="mb-4 text-sm text-white/50">Rishi Chaurasia, Founder</p>
            <ul className="flex flex-col gap-3">
              {contact.map((link) => (
                <li key={link.href}>
                  <FooterLink {...link} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">
              Open source
            </h3>
            <p className="mb-5 text-sm leading-relaxed text-white/60">
              CertCascade is fully open source. Explore the code, report issues,
              or contribute.
            </p>
            <a
              href="https://github.com/RishiBuilds/certcascade"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white outline-none transition-colors duration-150 hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <BsGithub aria-hidden="true" className="h-4 w-4 shrink-0" />
              Star on GitHub
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 pt-8 text-xs text-white/40 sm:flex-row">
          <p>© 2026 CertCascade. All rights reserved.</p>
          <p>
            Built by{" "}
            <a
              href="https://github.com/RishiBuilds"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white/60 transition-colors hover:text-white"
            >
              ✦ RISHI
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}
