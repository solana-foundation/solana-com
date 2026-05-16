# Solana Personal Wallet - Setup Guide

Welcome! This is your personal Solana wallet application designed for devnet and
testnet development.

**Owner:** Danish Ahmed KM  
**Email:** danishahmed012320@yahoo.in

---

## Quick Start (from monorepo)

```bash
# Install all dependencies (if not already done)
cd /vercel/share/v0-project
pnpm install

# Run the wallet app in development mode
cd apps/solana-wallet
pnpm dev

# The app will be available at http://localhost:3001
```

## Standalone Usage

If you want to run the wallet app separately:

```bash
cd apps/solana-wallet
pnpm install
pnpm dev
```

## What's Included

### Core Features

✅ Create new wallets with keypair generation  
✅ Import existing wallets using secret keys  
✅ View SOL balance in real-time  
✅ Send SOL transactions  
✅ Request airdrops on devnet/testnet  
✅ View and manage SPL token accounts  
✅ Switch between devnet, testnet, and mainnet  
✅ View public and secret keys with copy functionality

### Project Structure

```
solana-wallet/
├── app/
│   ├── globals.css          # Global styles and Tailwind setup
│   ├── layout.tsx           # Root layout with WalletProvider
│   └── page.tsx             # Main wallet dashboard
├── src/
│   ├── components/          # React components
│   │   ├── Alert.tsx        # Alert/notification component
│   │   ├── AirdropRequest.tsx    # Request SOL airdrop
│   │   ├── BalanceDisplay.tsx    # Display SOL balance
│   │   ├── Button.tsx       # Reusable button component
│   │   ├── Card.tsx         # Card layout component
│   │   ├── Header.tsx       # App header
│   │   ├── Input.tsx        # Input field component
│   │   ├── NetworkSwitcher.tsx   # Network selection
│   │   ├── SendTransaction.tsx   # Send SOL UI
│   │   ├── TokenManagement.tsx   # SPL token view
│   │   └── WalletIntro.tsx  # Create/import wallet
│   ├── contexts/
│   │   └── WalletContext.tsx # Global wallet state
│   └── utils/
│       ├── solana.ts        # Solana Web3.js utilities
│       └── storage.ts       # localStorage encryption/decryption
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

### Technology Stack

- **Frontend Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Context API
- **Solana SDK:** @solana/web3.js
- **Icons:** Lucide React
- **Encoding:** bs58 (base58 encoding)
- **Crypto:** tweetnacl (Ed25519 signatures)

---

## Usage Guide

### 1. Create a New Wallet

1. Open the app at `http://localhost:3001`
2. Click **"Create New Wallet"**
3. Your public and secret keys will be displayed
4. **Important:** Save your secret key somewhere secure (but never on the
   internet!)
5. The wallet is now stored in browser localStorage

### 2. Import an Existing Wallet

1. Click **"Import Wallet"**
2. Paste your secret key (base58 format)
3. Click **"Import"**
4. Your wallet will be restored from the secret key

### 3. View Your Balance

- The main dashboard shows your current SOL balance
- Click **"Refresh Balance"** to update the balance
- Balance updates automatically when network changes

### 4. Send SOL

1. Fill in the **recipient address** (Solana public key)
2. Enter the **amount** in SOL
3. Click **"Send Transaction"**
4. Wait for confirmation
5. Balance will update automatically after transaction

### 5. Request Airdrop

1. Ensure you're on **devnet** or **testnet**
2. Click **"Request 2 SOL Airdrop"**
3. Wait a few moments for the SOL to arrive
4. The balance updates automatically

### 6. Manage Tokens (SPL)

1. Click **"Refresh Tokens"** in the Token Management section
2. All SPL token accounts associated with your wallet will appear
3. Copy token mint addresses by clicking the "Copy" button

### 7. Switch Networks

Use the network buttons in the right sidebar:

- **devnet** - Development network (free airdrops available)
- **testnet** - Alternative test network
- **mainnet** - Real Solana network ⚠️ **Use with caution!**

---

## Security Best Practices

### What This Wallet Stores

- **Stored in browser localStorage:**
  - Public key (visible)
  - Secret key (base64 encoded, not cryptographically secure)

### ⚠️ Important Security Notes

1. **Never use with real SOL** - This wallet is for development only
2. **Never share your secret key** - Anyone with it can control your wallet
3. **Browser storage is NOT secure** - Only use for test accounts
4. **Clear localStorage before sensitive work** - Use a real wallet for mainnet
5. **This is NOT a production wallet** - Missing security features like:
   - Proper key encryption
   - Password protection
   - Hardware wallet support
   - Multi-signature support

### For Production

Use established wallets like:

- Phantom Wallet
- Solflare
- Magic Eden
- Ledger
- Solanium

---

## Troubleshooting

### Airdrop Not Working?

**Problem:** Airdrop request fails  
**Solution:**

- Ensure you're on devnet or testnet (not mainnet)
- Wait 1-2 minutes between airdrop requests
- Check Solana network status: https://status.solana.com/

### Transaction Failed?

**Problem:** Send transaction returns error  
**Solution:**

- Verify recipient address is a valid Solana public key
- Ensure you have enough SOL for the transaction
- Check that recipient address is correct
- Verify network connectivity

### Keys Not Persisting?

**Problem:** Wallet not restored after browser close  
**Solution:**

- Check if browser localStorage is enabled
- Clear browser cache and try reimporting
- Export your secret key and save it somewhere safe

### Network Issues?

**Problem:** Balance not updating or connection errors  
**Solution:**

- Check your internet connection
- Try refreshing the page
- Switch to a different network
- Check Solana network status

---

## Development

### Build for Production

```bash
pnpm build
pnpm start
```

### Run Tests

```bash
pnpm test
```

### Type Checking

```bash
pnpm tsc --noEmit
```

---

## Environment Variables

Create a `.env.local` file to customize:

```env
# Network to use (devnet, testnet, mainnet)
NEXT_PUBLIC_SOLANA_NETWORK=devnet
```

---

## Key Files Explained

### `src/contexts/WalletContext.tsx`

Global state management using React Context. Handles:

- Wallet creation and import
- Balance and token account fetching
- Network switching
- Auto-load from localStorage

### `src/utils/solana.ts`

Solana blockchain interactions:

- Generate keypairs
- Import keypairs from secret keys
- Get balance and token accounts
- Send transactions and request airdrops
- Network management (devnet, testnet, mainnet)

### `src/utils/storage.ts`

Secure storage utilities:

- Encrypt/decrypt secret keys (basic base64)
- Save/load wallet from localStorage
- Remove wallet from storage

### `app/page.tsx`

Main dashboard component with:

- Welcome message with owner info
- Balance display
- Send transaction form
- Network switcher
- Helpful resources and tips

---

## Resources

### Solana Documentation

- [Solana Docs](https://docs.solana.com/)
- [Web3.js API](https://solana-labs.github.io/solana-web3.js/)
- [SPL Token Standard](https://spl.solana.com/token)
- [Solana Cookbook](https://solanacookbook.com/)

### Tools

- [Solana Explorer](https://explorer.solana.com/)
- [Solana Faucet](https://faucet.solana.com/)
- [Solana CLI Docs](https://docs.solana.com/cli)

### Community

- [Solana Discord](https://discord.gg/solana)
- [Solana Forums](https://forums.solana.com/)
- [Solana GitHub](https://github.com/solana-labs)

---

## Next Steps

### To Extend the Wallet

1. **Add NFT Support**
   - Use Metaplex SDK for NFT operations
   - Display NFTs in a gallery

2. **Add Swap Functionality**
   - Integrate Jupiter aggregator for token swaps
   - Show price quotes

3. **Add Portfolio Analytics**
   - Track transaction history
   - Display portfolio value over time
   - Show token distributions

4. **Improve Security**
   - Implement proper AES encryption
   - Add password protection
   - Support hardware wallets

5. **Add More Features**
   - Stake SOL
   - Vote on governance
   - Create SPL tokens

---

## Frequently Asked Questions

**Q: Can I use this for real SOL?**  
A: No. This is strictly for development and testing.

**Q: Where are my keys stored?**  
A: Browser localStorage, not securely encrypted.

**Q: Can I export my secret key?**  
A: Yes, click the eye icon to reveal it and copy it.

**Q: What happens if I clear browser data?**  
A: Your wallet will be deleted from storage.

**Q: Can I use the same keypair across multiple wallets?**  
A: Yes, import your secret key into any wallet.

**Q: Is this open source?**  
A: Yes! It's part of the solana.com monorepo.

---

## Support

For issues or questions:

1. Check the [README.md](./README.md)
2. Review the troubleshooting section above
3. Check Solana documentation
4. Open an issue in the repository

---

**Created by:** Danish Ahmed KM  
**Email:** danishahmed012320@yahoo.in  
**Purpose:** Personal Solana Wallet for Development  
**Status:** ✅ Ready for devnet/testnet testing
