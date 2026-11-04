import type { AskGenerativeUi } from "./api";

export const tokenLifecycleGenerativeUiFixture = {
  version: "solana-docs-ui/v1",
  kind: "answer",
  components: [
    {
      type: "answer_intro",
      title: "Token lifecycle",
      body: "Create a token by creating a mint account, creating a token account for a wallet, then minting supply into it.",
    },
    {
      type: "concept_model",
      title: "Live model",
      nodes: [
        {
          id: "wallet",
          archetype: "wallet",
          label: "Wallet",
          fields: [{ label: "role", value: "payer and owner" }],
        },
        {
          id: "mint",
          archetype: "mint-account",
          label: "Mint account",
          fields: [
            { label: "supply", value: "0" },
            { label: "authority", value: "wallet" },
          ],
        },
        {
          id: "holder-token",
          archetype: "token-account",
          label: "Token account",
          fields: [
            { label: "owner", value: "wallet" },
            { label: "balance", value: "0" },
          ],
        },
      ],
      relationships: [
        { from: "wallet", to: "holder-token", kind: "owns" },
        { from: "holder-token", to: "mint", kind: "reads" },
      ],
    },
    {
      type: "step_flow",
      title: "Lifecycle flow",
      body: "The main token lifecycle is three on-chain changes after the wallet is ready.",
      steps: [
        {
          title: "Select devnet",
          setup: true,
          body: "Point wallet commands at devnet before creating token state.",
          command: "solana config set --url devnet",
          result: "Wallet now targets devnet.",
          effects: [
            {
              action: "update",
              node_id: "wallet",
              field: "cluster",
              value: "devnet",
            },
          ],
        },
        {
          title: "Fund wallet",
          setup: true,
          body: "Get devnet SOL for transaction fees.",
          command: "solana airdrop 2",
          result: "Wallet can pay for token account rent and fees.",
          effects: [
            {
              action: "update",
              node_id: "wallet",
              field: "balance",
              value: "funded",
            },
          ],
        },
        {
          title: "Create the mint",
          command: "spl-token create-token",
          result: "Mint account exists with supply 0.",
          effects: [
            {
              action: "reveal",
              node_id: "mint",
              field: "state",
              value: "initialized",
            },
          ],
        },
        {
          title: "Create the token account",
          command: "spl-token create-account <MINT>",
          result: "Wallet has a token account for this mint.",
          effects: [
            { action: "reveal", node_id: "holder-token" },
            {
              action: "connect",
              node_id: "wallet",
              to_node_id: "holder-token",
              kind: "owns",
            },
            {
              action: "connect",
              node_id: "holder-token",
              to_node_id: "mint",
              kind: "reads",
            },
          ],
        },
        {
          title: "Mint supply",
          command: "spl-token mint <MINT> 100 <TOKEN_ACCOUNT>",
          result: "The mint supply and holder balance both increase.",
          effects: [
            {
              action: "update",
              node_id: "mint",
              field: "supply",
              value: "100",
            },
            {
              action: "update",
              node_id: "holder-token",
              field: "balance",
              value: "100",
            },
          ],
        },
        {
          title: "Close the empty account",
          optional: true,
          command: "spl-token close <TOKEN_ACCOUNT>",
          result: "The token account is closed after the balance is zero.",
          effects: [{ action: "close", node_id: "holder-token" }],
        },
      ],
    },
  ],
} satisfies AskGenerativeUi;

export const pdaDerivationGenerativeUiFixture = {
  version: "solana-docs-ui/v1",
  kind: "answer",
  components: [
    {
      type: "answer_intro",
      title: "PDA derivation",
      body: "A PDA is a deterministic account address derived from seeds and one program id, then initialized by that program.",
    },
    {
      type: "concept_model",
      title: "Live model",
      nodes: [
        {
          id: "program",
          archetype: "program",
          label: "Program",
          fields: [{ label: "owns", value: "PDA state" }],
        },
        {
          id: "payer",
          archetype: "signer",
          label: "Payer signer",
          fields: [{ label: "funds", value: "rent" }],
        },
        {
          id: "vault-pda",
          archetype: "pda",
          label: "Vault PDA",
          fields: [
            { label: "bump", value: "pending" },
            { label: "state", value: "not created" },
          ],
        },
      ],
      relationships: [{ from: "program", to: "vault-pda", kind: "derives" }],
    },
    {
      type: "step_flow",
      title: "Derivation flow",
      steps: [
        {
          title: "Pick stable seeds",
          result: "Seeds and program id define the PDA address.",
          effects: [{ action: "reveal", node_id: "program" }],
        },
        {
          title: "Derive the PDA",
          command: "solana address -k <PROGRAM_ID> --seed vault",
          result: "The PDA and bump are now known.",
          effects: [
            {
              action: "reveal",
              node_id: "vault-pda",
              field: "bump",
              value: "254",
            },
            {
              action: "connect",
              node_id: "program",
              to_node_id: "vault-pda",
              kind: "derives",
            },
          ],
        },
        {
          title: "Initialize PDA data",
          result: "The program signs with seeds and writes initial state.",
          effects: [
            { action: "reveal", node_id: "payer" },
            {
              action: "update",
              node_id: "vault-pda",
              field: "state",
              value: "initialized",
            },
          ],
        },
      ],
    },
  ],
} satisfies AskGenerativeUi;

export const transactionSigningGenerativeUiFixture = {
  version: "solana-docs-ui/v1",
  kind: "answer",
  components: [
    {
      type: "answer_intro",
      title: "Transaction signing",
      body: "Instructions are assembled into a transaction, required signers approve it, and an RPC node sends it to validators.",
    },
    {
      type: "concept_model",
      title: "Live model",
      nodes: [
        { id: "signer", archetype: "signer", label: "Signer" },
        { id: "instruction", archetype: "instruction", label: "Instruction" },
        {
          id: "transaction",
          archetype: "transaction",
          label: "Transaction",
          fields: [
            { label: "signatures", value: "0" },
            { label: "status", value: "draft" },
          ],
        },
        { id: "rpc", archetype: "rpc-node", label: "RPC node" },
        { id: "validator", archetype: "validator", label: "Validator" },
      ],
      relationships: [
        { from: "signer", to: "transaction", kind: "signs" },
        { from: "rpc", to: "validator", kind: "writes" },
      ],
    },
    {
      type: "step_flow",
      title: "Signing flow",
      steps: [
        {
          title: "Build instructions",
          result: "The transaction body is ready but unsigned.",
          effects: [
            { action: "reveal", node_id: "instruction" },
            { action: "reveal", node_id: "transaction" },
          ],
        },
        {
          title: "Collect signatures",
          result: "Required signers approve the message.",
          effects: [
            { action: "reveal", node_id: "signer" },
            {
              action: "connect",
              node_id: "signer",
              to_node_id: "transaction",
              kind: "signs",
            },
            {
              action: "update",
              node_id: "transaction",
              field: "signatures",
              value: "1",
            },
          ],
        },
        {
          title: "Send to the cluster",
          command: "solana confirm <SIGNATURE>",
          result: "The validator confirms the transaction.",
          effects: [
            { action: "reveal", node_id: "rpc" },
            { action: "reveal", node_id: "validator" },
            {
              action: "connect",
              node_id: "rpc",
              to_node_id: "validator",
              kind: "writes",
            },
            {
              action: "update",
              node_id: "transaction",
              field: "status",
              value: "confirmed",
            },
          ],
        },
      ],
    },
  ],
} satisfies AskGenerativeUi;

export const cpiFlowGenerativeUiFixture = {
  version: "solana-docs-ui/v1",
  kind: "answer",
  components: [
    {
      type: "answer_intro",
      title: "CPI flow",
      body: "A program can invoke another program by passing the callee instruction and all accounts needed for the inner call.",
    },
    {
      type: "concept_model",
      title: "Live model",
      nodes: [
        { id: "caller", archetype: "program", label: "Caller program" },
        { id: "cpi", archetype: "instruction", label: "CPI instruction" },
        { id: "callee", archetype: "program", label: "Callee program" },
        {
          id: "state-pda",
          archetype: "pda",
          label: "State PDA",
          fields: [{ label: "data", value: "before" }],
        },
      ],
      relationships: [
        { from: "caller", to: "callee", kind: "invokes" },
        { from: "callee", to: "state-pda", kind: "writes" },
      ],
    },
    {
      type: "step_flow",
      title: "Invocation flow",
      steps: [
        {
          title: "Build the inner instruction",
          result:
            "The caller prepares the callee program id and account metas.",
          effects: [
            { action: "reveal", node_id: "caller" },
            { action: "reveal", node_id: "cpi" },
          ],
        },
        {
          title: "Invoke the callee",
          result: "The callee runs inside the caller transaction.",
          effects: [
            { action: "reveal", node_id: "callee" },
            {
              action: "connect",
              node_id: "caller",
              to_node_id: "callee",
              kind: "invokes",
            },
          ],
        },
        {
          title: "Write account state",
          result: "The callee mutates the passed writable account.",
          effects: [
            { action: "reveal", node_id: "state-pda" },
            {
              action: "connect",
              node_id: "callee",
              to_node_id: "state-pda",
              kind: "writes",
            },
            {
              action: "update",
              node_id: "state-pda",
              field: "data",
              value: "after",
            },
          ],
        },
      ],
    },
  ],
} satisfies AskGenerativeUi;

export const accountInitializationGenerativeUiFixture = {
  version: "solana-docs-ui/v1",
  kind: "answer",
  components: [
    {
      type: "answer_intro",
      title: "Account initialization",
      body: "Creating an account allocates lamports and space, assigns an owner program, then writes the program-specific data layout.",
    },
    {
      type: "concept_model",
      title: "Live model",
      nodes: [
        { id: "payer", archetype: "signer", label: "Payer signer" },
        { id: "owner-program", archetype: "program", label: "Owner program" },
        {
          id: "new-account",
          archetype: "pda",
          label: "New account",
          fields: [
            { label: "lamports", value: "0" },
            { label: "owner", value: "system" },
            { label: "state", value: "empty" },
          ],
        },
      ],
      relationships: [
        { from: "owner-program", to: "new-account", kind: "owns" },
      ],
    },
    {
      type: "step_flow",
      title: "Initialization flow",
      steps: [
        {
          title: "Allocate the account",
          result: "The payer funds rent and space for the account.",
          effects: [
            { action: "reveal", node_id: "payer" },
            { action: "reveal", node_id: "new-account" },
            {
              action: "update",
              node_id: "new-account",
              field: "lamports",
              value: "rent exempt",
            },
          ],
        },
        {
          title: "Assign ownership",
          result: "Only the owner program can later write this account data.",
          effects: [
            { action: "reveal", node_id: "owner-program" },
            {
              action: "connect",
              node_id: "owner-program",
              to_node_id: "new-account",
              kind: "owns",
            },
            {
              action: "update",
              node_id: "new-account",
              field: "owner",
              value: "owner program",
            },
          ],
        },
        {
          title: "Write initial data",
          result: "The account is ready for program instructions.",
          effects: [
            {
              action: "update",
              node_id: "new-account",
              field: "state",
              value: "initialized",
            },
          ],
        },
      ],
    },
  ],
} satisfies AskGenerativeUi;

export const rpcRequestLifecycleGenerativeUiFixture = {
  version: "solana-docs-ui/v1",
  kind: "answer",
  components: [
    {
      type: "answer_intro",
      title: "RPC request lifecycle",
      body: "A client sends an RPC request to an RPC node, the node reads cluster state from validators, and the response returns to the client.",
    },
    {
      type: "concept_model",
      title: "Live model",
      nodes: [
        {
          id: "client",
          archetype: "wallet",
          label: "Client",
          fields: [{ label: "request", value: "pending" }],
        },
        {
          id: "rpc",
          archetype: "rpc-node",
          label: "RPC node",
          fields: [{ label: "response", value: "none" }],
        },
        {
          id: "validator",
          archetype: "validator",
          label: "Validator",
          fields: [{ label: "slot", value: "latest" }],
        },
      ],
      relationships: [
        { from: "client", to: "rpc", kind: "reads" },
        { from: "rpc", to: "validator", kind: "reads" },
      ],
    },
    {
      type: "step_flow",
      title: "Request flow",
      steps: [
        {
          title: "Send the request",
          command: "curl https://api.devnet.solana.com -d '<JSON_RPC_BODY>'",
          result: "The RPC node receives the request.",
          effects: [
            { action: "reveal", node_id: "client" },
            { action: "reveal", node_id: "rpc" },
            {
              action: "connect",
              node_id: "client",
              to_node_id: "rpc",
              kind: "reads",
            },
          ],
        },
        {
          title: "Read cluster state",
          result:
            "The RPC node queries validator state for the requested slot.",
          effects: [
            { action: "reveal", node_id: "validator" },
            {
              action: "connect",
              node_id: "rpc",
              to_node_id: "validator",
              kind: "reads",
            },
            {
              action: "update",
              node_id: "validator",
              field: "slot",
              value: "confirmed",
            },
          ],
        },
        {
          title: "Return the response",
          result: "The client receives the JSON-RPC response body.",
          effects: [
            {
              action: "update",
              node_id: "rpc",
              field: "response",
              value: "returned",
            },
            {
              action: "update",
              node_id: "client",
              field: "request",
              value: "complete",
            },
          ],
        },
      ],
    },
  ],
} satisfies AskGenerativeUi;

export const commonVisualGenerativeUiFixtures = [
  { name: "token lifecycle", ui: tokenLifecycleGenerativeUiFixture },
  { name: "PDA derivation", ui: pdaDerivationGenerativeUiFixture },
  { name: "transaction signing", ui: transactionSigningGenerativeUiFixture },
  { name: "CPI flow", ui: cpiFlowGenerativeUiFixture },
  {
    name: "account initialization",
    ui: accountInitializationGenerativeUiFixture,
  },
  { name: "RPC request lifecycle", ui: rpcRequestLifecycleGenerativeUiFixture },
] as const;
