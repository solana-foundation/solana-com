import type { Metadata } from "next";
import { AskGenerativeUiPreview } from "../../components/ask-generative-ui-preview";

export const metadata: Metadata = {
  title: "Ask Solana Generative UI Preview",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <AskGenerativeUiPreview />;
}
