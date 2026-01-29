const CONTENT_BLOCK_STYLE_KEYS = {
  spacing: "spacing",
  spacingWithMargins: "spacingWithMargins",
  spacingNoBottom: "spacingNoBottom",
  smallOnly: "smallOnly",
  cardDeckWrapper: "cardDeckWrapper",
};

export const BLOCK_STYLES = {
  [CONTENT_BLOCK_STYLE_KEYS.spacing]: {
    large: { paddingTop: "20px" },
  },
  [CONTENT_BLOCK_STYLE_KEYS.spacingWithMargins]: {
    large: { paddingTop: "20px", marginTop: "auto", marginBottom: "auto" },
  },
  [CONTENT_BLOCK_STYLE_KEYS.spacingNoBottom]: {
    large: { paddingTop: "20px", paddingBottom: "0px" },
  },
  [CONTENT_BLOCK_STYLE_KEYS.smallOnly]: {
    large: { display: "none" },
    medium: { display: "none" },
    small: { display: "flex" },
  },
  [CONTENT_BLOCK_STYLE_KEYS.cardDeckWrapper]: {
    large: { paddingTop: "0px", marginTop: "-3px" },
  },
};

export const META = {
  seoImage:
    "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fb9c4b6c6ccaf45b5a3f9c03db4708ecc.png",
};

export const NAV_BUTTONS = [
  {
    label: "",
    hierarchy: "outline",
    size: "md",
    iconSize: "md",
    startIcon: "none",
    endIcon: "none",
    url: "https://solana.com/developers/evm-to-svm",
  },
];

export const RESOURCE_CARD_DECK = {
  numCols: 3,
  featured: true,
  cards: [
    {
      type: "image",
      headingAs: "h3",
      backgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
      },
      callToAction: {
        url: "/developers/guides/getstarted/hello-world-in-your-browser",
        endIcon: "arrow-right",
        hierarchy: "outline",
      },
    },
    {
      type: "image",
      headingAs: "h3",
      backgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
      },
      callToAction: {
        url: "https://www.soldev.app/course",
        endIcon: "arrow-right",
        hierarchy: "outline",
      },
    },
    {
      type: "image",
      headingAs: "h3",
      backgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
      },
      callToAction: {
        url: "https://youtu.be/0P8JeL3TURU?feature=shared",
        endIcon: "arrow-right",
        hierarchy: "outline",
      },
    },
    {
      type: "image",
      headingAs: "h3",
      backgroundImage: {
        src: "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Fdfb1773873354d118d134beca2334288.png",
      },
      callToAction: {
        url: "/developers",
        endIcon: "arrow-right",
        hierarchy: "outline",
      },
    },
  ],
};

export const CODE_BLOCKS = [
  {
    code: `import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import {
  createApproveInstruction,
  createTransferInstruction,
  getAssociatedTokenAddressSync
} from "@solana/spl-token";

const connection = new Connection("https://api.devnet.solana.com");
const owner = Keypair.generate();
const delegate = owner.publicKey;
const recipient = new PublicKey("DESTINATION_WALLET");
const mint = new PublicKey("TOKEN_MINT");
const amount = 1_000_000;

const ownerATA = getAssociatedTokenAddressSync(mint, owner.publicKey);
const recipientATA = getAssociatedTokenAddressSync(mint, recipient);

const ixApprove = createApproveInstruction(ownerATA, delegate, owner.publicKey, amount);
const ixTransfer = createTransferInstruction(ownerATA, recipientATA, owner.publicKey, amount);

const tx = new Transaction().add(ixApprove, ixTransfer);
tx.feePayer = owner.publicKey;
tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

tx.sign(owner);
const sig = await connection.sendRawTransaction(tx.serialize());
console.log("Sent (self-sponsored):", sig);`,
    language: "javascript",
  },
  {
    code: `import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { createTransferInstruction, getAssociatedTokenAddressSync } from "@solana/spl-token";

const connection = new Connection("https://api.devnet.solana.com");
const owner     = Keypair.generate();          // replace with real keypair
const feePayer  = Keypair.generate();          // replace with real keypair
const recipient = new PublicKey("DESTINATION_WALLET");
const mint      = new PublicKey("TOKEN_MINT");
const amount    = 500_000;

const ownerATA     = getAssociatedTokenAddressSync(mint, owner.publicKey);
const recipientATA = getAssociatedTokenAddressSync(mint, recipient);

const ix = createTransferInstruction(ownerATA, recipientATA, owner.publicKey, amount);

const tx = new Transaction().add(ix);
tx.feePayer        = feePayer.publicKey;
tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

tx.partialSign(owner);
tx.sign(feePayer);

const sig = await connection.sendRawTransaction(tx.serialize());
console.log("Sent (relayer-sponsored):", sig);
`,
    language: "javascript",
  },
];
