import type { AskGenerativeUi } from "./api";

export const createTokenGenerativeUiFixture = {
  version: "solana-docs-ui/v1",
  kind: "answer",
  components: [
    {
      type: "answer_intro",
      title: "Create a token in three parts",
      body: "On Solana, a token starts with a mint account, then each holder gets a token account for that mint, and minting creates the starting supply.",
      takeaways: [
        "The mint defines decimals, authority, and total supply.",
        "Token accounts hold balances for one owner and one mint.",
        "The CLI flow is create mint, create token account, then mint supply.",
      ],
    },
    {
      type: "concept_model",
      title: "Mental model",
      body: "The mint is the token definition. Token accounts are the per-holder balance records that point back to that mint.",
      nodes: [
        {
          id: "mint",
          archetype: "mint-account",
          label: "Mint account",
          description:
            "Defines the token and tracks supply, but does not hold user balances.",
          fields: [
            { label: "decimals", value: "9" },
            { label: "supply", value: "starts at 0" },
            { label: "authority", value: "wallet allowed to mint" },
          ],
        },
        {
          id: "token-account",
          archetype: "token-account",
          label: "Token account",
          description: "Stores a balance for one owner and one mint.",
          fields: [
            { label: "owner", value: "your wallet" },
            { label: "mint", value: "the mint address" },
            { label: "balance", value: "starts at 0" },
          ],
        },
      ],
      relationships: [
        {
          from: "token-account",
          to: "mint",
          kind: "reads",
          label: "references",
        },
      ],
    },
    {
      type: "step_flow",
      title: "CLI flow",
      body: "These commands create the mint, create your associated token account, and mint 100 tokens to it on devnet.",
      steps: [
        {
          title: "Create the mint",
          body: "Use Token-2022 for the new mint. The command returns the mint address used by later steps.",
          command: "spl-token create-token --program-2022",
          result: "Save the mint address from the command output.",
          effects: [
            {
              action: "reveal",
              node_id: "mint",
              label: "mint account exists with supply 0",
            },
          ],
          sources: [
            {
              title: "Token quickstart",
              url: "/docs/tokens/quickstart",
            },
          ],
        },
        {
          title: "Create your token account",
          body: "Create the associated token account where your wallet will hold this token.",
          command: "spl-token create-account <MINT>",
          result: "Save the token account address from the command output.",
          effects: [
            {
              action: "reveal",
              node_id: "token-account",
              label: "token account exists for your wallet and mint",
            },
            {
              action: "connect",
              node_id: "token-account",
              to_node_id: "mint",
              label: "token account references the mint",
            },
          ],
          sources: [
            {
              title: "Create token account",
              url: "/docs/tokens/basics/create-token-account",
            },
          ],
        },
        {
          title: "Mint the starting supply",
          body: "Mint 100 tokens into your token account. The mint supply and account balance both increase.",
          command: "spl-token mint <MINT> 100 <ACCOUNT>",
          result: "Your token account balance is now 100.",
          effects: [
            {
              action: "update",
              node_id: "mint",
              field: "supply",
              value: "100",
            },
            {
              action: "update",
              node_id: "token-account",
              field: "balance",
              value: "100",
            },
          ],
          sources: [
            {
              title: "Token quickstart",
              url: "/docs/tokens/quickstart",
            },
          ],
        },
      ],
    },
    {
      type: "source_links",
      title: "Sources",
      links: [
        {
          title: "Quickstart: create a token with the CLI",
          url: "/docs/tokens/quickstart",
        },
        {
          title: "Create token account",
          url: "/docs/tokens/basics/create-token-account",
        },
      ],
    },
  ],
} satisfies AskGenerativeUi;
