import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] text-white">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl text-white/70 mb-8">Page not found</p>
      <Link
        href="/"
        className="rounded-full bg-[#14F195] px-6 py-3 text-black font-medium hover:opacity-90 transition-opacity"
      >
        Back to Home
      </Link>
    </div>
  );
}
