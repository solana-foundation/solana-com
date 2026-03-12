import { getMessages } from "next-intl/server";
import { BreakpointPage } from "@/components/BreakpointPage";
import { buildBreakpointPageContent, type AppMessages } from "@/content/page";

export default async function HomePage() {
  const messages = (await getMessages()) as unknown as AppMessages;
  const content = buildBreakpointPageContent(messages.breakpoint);

  return <BreakpointPage content={content} />;
}
