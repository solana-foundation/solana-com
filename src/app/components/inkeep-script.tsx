"use client";

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    Inkeep: any;
  }
}

import Script from "next/script";

export function InkeepScript() {
  return (
    <Script
      id="inkeep-script"
      src="https://unpkg.com/@inkeep/uikit-js@0.3.14/dist/embed.js"
      type="module"
      strategy="afterInteractive"
      onReady={() => {
        const config = {
          colorModeSync: {
            observedElement: document.documentElement,
            isDarkModeCallback: (el) => {
              return el.classList.contains("dark");
            },
            colorModeAttribute: "class",
          },
          properties: {
            baseSettings: {
              apiKey: "20556dc0f7d6c26e590fc57f247c63e86fe5f6b992a5b6e4",
              integrationId: "cm7k5d7cx002os6019x2qsqwm",
              organizationId: "org_iKCh36NfndEFpB3M",
              primaryBrandColor: "#9945ff",
              customCardSettings: [
                {
                  filters: {
                    UrlMatch: {
                      ruleType: "PartialUrl",
                      partialUrl: "solana.com",
                    },
                  },
                  searchTabLabel: "Solana Docs",
                },
                {
                  filters: {
                    UrlMatch: {
                      ruleType: "PartialUrl",
                      partialUrl: "https://www.anchor-lang.com/docs",
                    },
                  },
                  searchTabLabel: "Anchor Docs",
                },
                {
                  filters: {
                    UrlMatch: {
                      ruleType: "PartialUrl",
                      partialUrl: "https://solana.stackexchange.com/",
                    },
                  },
                  searchTabLabel: "Stack Exchange",
                },
              ],
            },
            modalSettings: {
              // optional settings
            },
            searchSettings: {
              shouldOpenLinksInNewTab: true,
              placeholder: "Search",
            },
            aiChatSettings: {
              chatSubjectName: "Solana",
              botAvatarSrcUrl: "https://solana.com/favicon.png",
              disclaimerSettings: {
                isDisclaimerEnabled: true,
              },
              getHelpCallToActions: [
                {
                  name: "Stack Exchange",
                  url: "https://solana.stackexchange.com/",
                  icon: {
                    builtIn: "FaStackOverflow",
                  },
                },
              ],
              quickQuestions: [
                "How to quickly install Solana dependencies for local development?",
                "What is the Solana Account Model?",
                "How to build a Solana Program?",
              ],
            },
          },
        };
        // window.Inkeep().embed({
        //   componentType: "SearchBar",
        //   targetElement: "#inkeepSearchBar",
        //   ...config,
        // });
        window.Inkeep().embed({
          componentType: "ChatButton",
          ...config,
        });
      }}
    />
  );
}
