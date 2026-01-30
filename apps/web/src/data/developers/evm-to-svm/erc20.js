const CONTENT_BLOCK_STYLE_KEYS = {
  spacing: "spacing",
  spacingWithMargins: "spacingWithMargins",
  tableWrapper: "tableWrapper",
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
  [CONTENT_BLOCK_STYLE_KEYS.tableWrapper]: {
    large: {
      paddingRight: "50px",
      paddingLeft: "50px",
      paddingTop: "20px",
    },
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
    "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F002f07f3d6134176a2168e7209972e98.png",
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

export const CONTENT_EDITOR_CTA = {
  button: {
    url: "https://solana.com/developers/evm-to-svm/accounts",
  },
};

export const CODE_BLOCKS = [
  {
    code: `// SPDX-License-Identifier: MIT license
pragma solidity =0.8.28;

struct Mint {
    uint8 decimals;
    uint256 supply;
    address mintAuthority;
    address freezeAuthority;
    address mintAddress;
}

struct TokenAccount {
    address mintAddress;
    address owner;
    uint256 balance;
    bool isFrozen;
}

contract Spl20 {
    mapping(address => Mint) public mints;
    mapping(address => TokenAccount) public tokenAccounts;
    mapping(address => bool) public mintAddresses;
    mapping(address => bool) public tokenAddresses;

    function initializeMint(uint8 decimals, address mintAuthority, address freezeAuthority, address mintAddress)
        public
        returns (Mint memory)
    {
        require(mintAddresses[mintAddress] == false, "Mint already exists");
        mints[mintAddress] = Mint(decimals, 0, mintAuthority, freezeAuthority, mintAddress);
        mintAddresses[mintAddress] = true;
        return Mint(decimals, 0, mintAuthority, freezeAuthority, mintAddress);
    }

    function mintTokens(address toMintTokens, address mintAddress, uint256 amount) public {
        require(mints[mintAddress].mintAuthority == msg.sender, "Only the mint authority can mint tokens");
        require(mints[mintAddress].mintAddress != address(0), "Token does not exist");
        require(mints[mintAddress].supply + amount <= type(uint256).max, "Supply overflow");

        mints[mintAddress].supply += amount;

        address tokenAddress = address(uint160(uint256(keccak256(abi.encodePacked(toMintTokens, mintAddress)))));

        if (tokenAccounts[tokenAddress].mintAddress == address(0)) {
            tokenAccounts[tokenAddress] = TokenAccount(mintAddress, toMintTokens, 0, false);
            tokenAddresses[tokenAddress] = true;
        }
        tokenAccounts[tokenAddress].balance += amount;
        tokenAccounts[tokenAddress].owner = toMintTokens;
    }

    function transfer(address to, address mintAddress, uint256 amount) public {
        address toTokenAddress = address(uint160(uint256(keccak256(abi.encodePacked(to, mintAddress)))));
        address fromTokenAddress = address(uint160(uint256(keccak256(abi.encodePacked(msg.sender, mintAddress)))));

        require(tokenAccounts[fromTokenAddress].balance >= amount, "Insufficient balance");
        require(tokenAccounts[toTokenAddress].balance + amount <= type(uint256).max, "Supply overflow");
        require(tokenAccounts[fromTokenAddress].owner == msg.sender, "fromToken owner is not msg.sender");
        require(tokenAccounts[fromTokenAddress].isFrozen == false, "fromToken is frozen");
        require(tokenAccounts[toTokenAddress].isFrozen == false, "toToken is frozen");

        if (tokenAccounts[toTokenAddress].mintAddress == address(0)) {
            tokenAccounts[toTokenAddress] = TokenAccount(mintAddress, to, 0, false);
            tokenAddresses[toTokenAddress] = true;
        }

        tokenAccounts[fromTokenAddress].balance -= amount;
        tokenAccounts[toTokenAddress].balance += amount;
    }

    function getMint(address token) public view returns (Mint memory) {
        return mints[token];
    }

    function getTokenAccount(address owner, address token) public view returns (TokenAccount memory) {
        return tokenAccounts[address(uint160(uint256(keccak256(abi.encodePacked(owner, token)))))];
    }
}`,
    language: "solidity",
  },
  {
    code: "function name() public view returns (string) // Returns the name of the token",
    language: "bash",
  },
  {
    code: `import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { fetchDigitalAsset, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey } from "@metaplex-foundation/js";
const mintAddress = new PublicKey("Token Address");

async function name() {
  try {
    const umi = createUmi("https://api.devnet.solana.com");
    umi.use(mplTokenMetadata());
    const digitalAsset = await fetchDigitalAsset(umi, mintAddress);
    return digitalAsset.metadata.name;
  } catch (error) {
    console.error("Error fetching token name:", error);
    return null;
  }
}

name().then(name => {
    console.log("token Name:", name);
  })
  .catch(error => {
    console.error("Error:", error);
  });
`,
    language: "jsx",
  },
  {
    code: "function symbol() public view returns (string) // Returns the symbol of the token",
    language: "bash",
  },
  {
    code: `import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { fetchDigitalAsset, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey } from "@metaplex-foundation/js";
const mintAddress = new PublicKey("Token Address");

async function symbol() {
  try {
    const umi = createUmi("https://api.devnet.solana.com");
    umi.use(mplTokenMetadata());
    const asset = await fetchDigitalAsset(umi, mintAddress);
    return asset.metadata.symbol;
  } catch (error) {
    console.error("Error fetching NFT symbol:", error);
    return null;
  }
}

symbol().then(symbol => {
  console.log("Symbol:", symbol);
}).catch(error => {
  console.error("Error:", error);
});
`,
    language: "jsx",
  },
  {
    code: "function decimals() public view returns (uint8) // Returns the number of decimals the token use",
    language: "bash",
  },
  {
    code: `import { Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const mintAddress = new PublicKey("Token Address");

async function decimals() {
    let response = await connection.getTokenSupply(mintAddress);
    return response.value.decimals;
}

decimals().then(decimals => {
  console.log(decimals);
}).catch(error => {
  console.error("Error:", error);
});`,
    language: "jsx",
  },
  {
    code: "function balanceOf(address _owner) public view returns (uint256 balance) // Returns the number of tokens in owner's account",
    language: "bash",
  },
  {
    code: `import { Connection, PublicKey } from "@solana/web3.js";
import { AccountLayout }from "@solana/spl-token";

const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const mintAddress = new PublicKey("Token Address");
const ownerAddress = new PublicKey("Your Wallet Address");

async function balanceOf(_owner){
  let response = await connection.getTokenAccountsByOwner(_owner, { mint: mintAddress });
  const accountInfo = AccountLayout.decode(response.value[0].account.data);
  return accountInfo.amount;
}

balanceOf(ownerAddress).then(balance => {
  console.log(balance); // need to multiply the result by the decimal precision to get the correct value.
}).catch(error => {
  console.error("Error:", error);
});`,
    language: "jsx",
  },
  {
    code: "function totalSupply() public view returns (uint256) // Returns the total issuance of tokens",
    language: "bash",
  },
  {
    code: `import { Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const mintAddress = new PublicKey("Token Address");

async function totalSupply() {
    let response = await connection.getTokenSupply(mintAddress);
    return response.value.amount;
}

totalSupply().then(supply => {
  console.log(supply); // need to multiply the result by the decimal precision to get the correct value
}).catch(error => {
  console.error("Error:", error);
});`,
    language: "jsx",
  },
  {
    code: "function transfer(address _to, uint256 _value) public returns (bool success) // Moves a value amount of tokens from the caller’s account to _to ",
    language: "solidity",
  },
  {
    code: `import { Keypair, Transaction, Connection, PublicKey } from "@solana/web3.js";
import { createTransferCheckedInstruction } from "@solana/spl-token";

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

// Must contain your private key as a Uint8Array
const ownerSecretkey = [];
const ownerPrivatekeypair = Keypair.fromSecretKey(new Uint8Array(ownerSecretkey));

const receiverAddress = new PublicKey("Receiver's Wallet Address");
const mintAddress = new PublicKey("Token Address");
const ownerTokenAccount = new PublicKey("Your Associated Token Account Address");
const receiverTokenAccount = new PublicKey("Receiver's Associated Token Account Address");

// For a token with 9 decimals, transferring 1 => 1 * 10^9
const amount = 1;

async function transfer(_to, _value) {
  try {
    // Create a transaction with the transfer instruction
    const tx = new Transaction().add(
      createTransferCheckedInstruction(
        ownerTokenAccount,
        mintAddress,
        receiverTokenAccount,
        ownerPrivatekeypair.publicKey,
        _value * Math.pow(10, 9), // Decimal correction
        9 // decimals
      )
    );

    // Send the transaction (simplified, no explicit blockhash or feePayer set)
    await connection.sendTransaction(tx, [ownerPrivatekeypair]);
    return true;
  } catch (error) {
    console.error("Error in transfer:", error);
    return false;
  }
}

transfer(receiverAddress, amount)
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.error("Error:", error);
  });
`,
    language: "jsx",
  },
  {
    code: `import { Keypair, Transaction, Connection, PublicKey } from "@solana/web3.js";
import { createTransferCheckedInstruction, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

// Must contain your private key as a Uint8Array
const ownerSecretkey = [];
const ownerPrivatekeypair = Keypair.fromSecretKey(new Uint8Array(ownerSecretkey));

const receiverAddress = new PublicKey("Receiver's Wallet Address");
const mintAddress = new PublicKey("Token Address");
const amount = 1; // Amount to transfer

async function transfer(_to, _value) {
  try {
    // Get or create the sender's ATA
    const ownerTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      ownerPrivatekeypair, // Fee payer
      mintAddress,
      ownerPrivatekeypair.publicKey
    );

    // Get or create the receiver's ATA
    const receiverTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      ownerPrivatekeypair, // Fee payer
      mintAddress,
      _to
    );

    // Build the transaction
    const tx = new Transaction().add(
      createTransferCheckedInstruction(
        ownerTokenAccount.address,
        mintAddress,
        receiverTokenAccount.address,
        ownerPrivatekeypair.publicKey,
        _value * Math.pow(10, 9), // Decimal correction (9 decimals)
        9 // decimals
      )
    );

    // Send the transaction (simple version)
    await connection.sendTransaction(tx, [ownerPrivatekeypair]);
    return true;
  } catch (error) {
    console.error("Error in transfer:", error);
    return false;
  }
}

// Execute the transfer function
transfer(receiverAddress, amount)
  .then(result => {
    console.log("Transaction result:", result);
  })
  .catch(error => {
    console.error("Error:", error);
  });
`,
    language: "jsx",
  },
];
