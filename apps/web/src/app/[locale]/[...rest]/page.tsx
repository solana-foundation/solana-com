import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default function CatchAll() {
  notFound();
}
