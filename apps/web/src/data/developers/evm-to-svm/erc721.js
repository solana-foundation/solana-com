const CONTENT_BLOCK_STYLE_KEYS = {
  spacing: "spacing",
  spacingWithMargins: "spacingWithMargins",
  spacingWithOffset: "spacingWithOffset",
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
  [CONTENT_BLOCK_STYLE_KEYS.spacingWithOffset]: {
    large: { paddingTop: "20px", marginLeft: "-1px" },
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
    "/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2F5fb32dca8e88413bbfb1e77778c2af52.png",
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
    url: "/developers/evm-to-svm/erc20",
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

struct Metadata {
    string name;
    string symbol;
    string tokenURI;
}

contract Spl721 {
    mapping(address => Mint) public mints;
    mapping(address => TokenAccount) public tokenAccounts;
    mapping(address => Metadata) public nftMetadata;
    mapping(address => bool) public mintAddresses;
    mapping(address => bool) public tokenAddresses;

    function initializeMint(
        uint8 decimals,
        address mintAuthority,
        address freezeAuthority,
        address mintAddress
    )
        public
        returns (Mint memory)
    {
        require(!mintAddresses[mintAddress], "Mint already exists");
        mints[mintAddress] = Mint(decimals, 0, mintAuthority, freezeAuthority, mintAddress);
        mintAddresses[mintAddress] = true;
        return mints[mintAddress];
    }

    function setMetadata(
        address mintAddress,
        string memory name,
        string memory symbol,
        string memory tokenURI
    )
        public
    {
        require(mintAddresses[mintAddress], "Mint does not exist");
        nftMetadata[mintAddress] = Metadata(name, symbol, tokenURI);
    }

    function mintNFT(address toMintTokens, address mintAddress) public {
        require(mintAddresses[mintAddress], "NFT mint does not exist");
        require(mints[mintAddress].mintAuthority == msg.sender, "Only the mint authority can mint");
        require(mints[mintAddress].supply == 0, "NFT already minted");
        mints[mintAddress].supply = 1;
        address tokenAddress = address(uint160(uint256(keccak256(abi.encodePacked(toMintTokens, mintAddress)))));
        if (!tokenAddresses[tokenAddress]) {
            tokenAccounts[tokenAddress] = TokenAccount(mintAddress, toMintTokens, 0, false);
            tokenAddresses[tokenAddress] = true;
        }
        tokenAccounts[tokenAddress].balance = 1;
        tokenAccounts[tokenAddress].owner = toMintTokens;
    }

    function transfer(address to, address mintAddress, uint256 amount) public {
        address toTokenAddress = address(uint160(uint256(keccak256(abi.encodePacked(to, mintAddress)))));
        address fromTokenAddress = address(uint160(uint256(keccak256(abi.encodePacked(msg.sender, mintAddress)))));
        require(tokenAccounts[fromTokenAddress].balance >= amount, "Insufficient balance");
        require(amount == 1, "Only transferring 1 NFT at a time");
        require(tokenAccounts[fromTokenAddress].owner == msg.sender, "Not the NFT owner");
        require(!tokenAccounts[fromTokenAddress].isFrozen, "Sender token account is frozen");
        if (tokenAddresses[toTokenAddress]) {
            require(!tokenAccounts[toTokenAddress].isFrozen, "Receiver token account is frozen");
        }
        if (!tokenAddresses[toTokenAddress]) {
            tokenAccounts[toTokenAddress] = TokenAccount(mintAddress, to, 0, false);
            tokenAddresses[toTokenAddress] = true;
        }
        tokenAccounts[fromTokenAddress].balance -= amount;
        tokenAccounts[toTokenAddress].balance += amount;
        tokenAccounts[toTokenAddress].owner = to;
    }

    function freezeAccount(address owner, address mintAddress) public {
        require(mintAddresses[mintAddress], "Mint does not exist");
        require(mints[mintAddress].freezeAuthority == msg.sender, "Only the freeze authority can freeze");
        address tokenAddress = address(uint160(uint256(keccak256(abi.encodePacked(owner, mintAddress)))));
        require(tokenAddresses[tokenAddress], "Token account not found");
        tokenAccounts[tokenAddress].isFrozen = true;
    }

    function getMint(address token) public view returns (Mint memory) {
        return mints[token];
    }

    function getTokenAccount(address owner, address token) public view returns (TokenAccount memory) {
        return tokenAccounts[address(uint160(uint256(keccak256(abi.encodePacked(owner, token)))))];
    }

    function getMetadata(address mintAddress) public view returns (Metadata memory) {
        return nftMetadata[mintAddress];
    }
}
`,
    language: "solidity",
  },
  {
    code: "function name() external view returns (string); // Returns the token collection name",
    language: "solidity",
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
    console.error("Error fetching NFT name:", error);
    return null;
  }
}

name().then(nftName => {
    console.log("NFT Name:", nftName);
  })
  .catch(error => {
    console.error("Error:", error);
  });
`,
    language: "jsx",
  },
  {
    code: "function symbol() external view returns (string); // Returns the token collection symbol",
    language: "solidity",
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
    const digitalAsset = await fetchDigitalAsset(umi, mintAddress);
    return digitalAsset.metadata.symbol;
  } catch (error) {
    console.error("Error fetching NFT symbol:", error);
    return null;
  }
}

symbol().then(nftSymbol => {
  console.log("NFT Symbol:", nftSymbol);
}).catch(error => {
  console.error("Error:", error);
});
`,
    language: "jsx",
  },
  {
    code: "function tokenURI(uint256 _tokenId) external view returns (string); // Returns the tokenURI of the token",
    language: "bash",
  },
  {
    code: `import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { fetchDigitalAsset, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey } from "@metaplex-foundation/js";
const mintAddress = new PublicKey("Token Address");

async function tokenURI( /* no tokenId */ ) {
  try {
    const umi = createUmi("https://api.devnet.solana.com");
    umi.use(mplTokenMetadata());
    const digitalAsset = await fetchDigitalAsset(umi, mintAddress);
    return digitalAsset.metadata.uri;
  } catch (error) {
    console.error("Error fetching token URI:", error);
    return null;
  }
}

tokenURI()
  .then(uri => {
    console.log("Token URI:", uri);
  })
  .catch(error => {
    console.error("Error:", error);
  });
`,
    language: "jsx",
  },
  {
    code: "function ownerOf(uint256 _tokenId) public view returns (address) // Returns the owner of the tokenId token",
    language: "bash",
  },
  {
    code: `import { Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const mintAddress = new PublicKey("Token Address");

async function ownerOf( /*no tokenId*/ ){
  const largestAccounts = await connection.getTokenLargestAccounts(new PublicKey(mintAddress));
  const largestAccountInfo = await connection.getParsedAccountInfo(largestAccounts.value[0].address);
  return largestAccountInfo.value.data.parsed.info.owner;
}

ownerOf().then(owner => {
  console.log(owner);
}).catch(error => {
  console.error("Error:", error);
});
`,
    language: "jsx",
  },
  {
    code: "function transferFrom(address _from, address _to, uint256 _tokenId) external payable; // Transfers tokenId token from _from to _to",
    language: "solidity",
  },
  {
    code: `import { Keypair, Transaction, Connection, PublicKey } from "@solana/web3.js";
import { createTransferCheckedInstruction } from "@solana/spl-token";

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

// Replace with your real private key (as a Uint8Array)
const ownerSecretkey = [];
const ownerPrivatekeypair = Keypair.fromSecretKey(new Uint8Array(ownerSecretkey));

const fromPublicKey = ownerPrivatekeypair.publicKey; // The sender's public key
const toPublicKey = new PublicKey("Receiver's Wallet Address");

const mintAddress = new PublicKey("Token Address");

// Pre-existing ATA addresses (for \`_from\` and \`_to\`)
const ownerTokenAccount = new PublicKey("Associated Token Account of _from");
const receiverTokenAccount = new PublicKey("Associated Token Account of _to");

// For an NFT, decimals = 0 and amount = 1
async function transferFrom(_from, _to) {
  try {
    const tx = new Transaction().add(
      createTransferCheckedInstruction(
        ownerTokenAccount,              // _from's ATA
        mintAddress,
        receiverTokenAccount,           // _to's ATA
        ownerPrivatekeypair.publicKey,  // Authority for \`_from\` (the private key must match this public key)
        1,                              // amount = 1 NFT
        0                               // decimals = 0 for NFT
      )
    );
    
    // Send transaction (simple version)
    await connection.sendTransaction(tx, [ownerPrivatekeypair]);
    return true;
  } catch (error) {
    console.error("Error in transferFrom:", error);
    return false;
  }
}

transferFrom(fromPublicKey, toPublicKey)
  .then(result => {
    console.log("transferFrom result:", result);
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

// Insert your private key as a Uint8Array
const ownerSecretkey = [];
const ownerPrivatekeypair = Keypair.fromSecretKey(new Uint8Array(ownerSecretkey));

const fromAddress = ownerPrivatekeypair.publicKey;  // The sender's public key
const toAddress = new PublicKey("Receiver's Wallet Address");

const mintAddress = new PublicKey("Token Address");

// For an NFT: decimals = 0, amount = 1
async function transferFrom(_from, _to) {
  try {
    // Retrieve (or create if missing) the sender's ATA
    const ownerTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      ownerPrivatekeypair,    // Fee payer
      mintAddress,
      _from
    );

    // Retrieve (or create if missing) the receiver's ATA
    const receiverTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      ownerPrivatekeypair,    // Fee payer (use the receiver if needed)
      mintAddress,
      _to
    );

    // Create transaction with a transfer of 1 NFT (decimals=0)
    const tx = new Transaction().add(
      createTransferCheckedInstruction(
        ownerTokenAccount.address,
        mintAddress,
        receiverTokenAccount.address,
        ownerPrivatekeypair.publicKey,
        1, // Always transfer exactly 1 (NFT)
        0  // decimals = 0 for an NFT
      )
    );

    // Send the transaction
    await connection.sendTransaction(tx, [ownerPrivatekeypair]);
    return true;
  } catch (error) {
    console.error("Error in transferFrom:", error);
    return false;
  }
}

transferFrom(fromAddress, toAddress)
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
