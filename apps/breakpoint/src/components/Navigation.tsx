import Link from "next/link";

export default function Navigation() {
  return (
    <nav
      aria-label="Primary"
      className="absolute left-1/2 top-3 z-30 flex h-12 -translate-x-1/2 items-center bg-black px-4"
    >
      <Link
        href="/"
        className="flex h-5 items-center gap-[7px]"
        aria-label="Breakpoint 2026"
      >
        <img
          src="/assets/nav-solana.svg"
          alt=""
          aria-hidden="true"
          className="block h-[19.55px] w-[22.68px]"
        />
        <img
          src="/assets/nav-bp26.svg"
          alt="BP26"
          className="block h-5 w-[104.45px]"
        />
      </Link>
    </nav>
  );
}
