import Link from "next/link";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <nav
        aria-label="Main"
        className="flex h-(--nav-height) items-center justify-between px-5 sm:px-12 lg:px-24"
      >
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-4 focus-visible:ring-(--brand-orange)/30"
        >
          <img
            src="/logo.svg"
            alt="CertCascade logo"
            className="h-10 w-10 object-contain transition-transform duration-150 group-hover:-rotate-3"
          />
          <span className="text-xl font-black tracking-tight text-gray-900">
            Cert<span className="text-(--brand-orange)">Cascade</span>
          </span>
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;