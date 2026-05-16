# Solana Personal Wallet

A personal Solana wallet application for managing SOL and SPL tokens on devnet
and testnet.

**Owner:** Danish Ahmed KM  
**Email:** danishahmed012320@yahoo.in

## ⚠️ Important Security Note

This wallet stores private keys in browser localStorage for development purposes
only. **DO NOT** use this wallet with real SOL or on mainnet. This is designed
exclusively for devnet and testnet development and testing.

## Features

- 🔑 **Create New Wallet** - Generate a new Solana keypair
- 📥 **Import Wallet** - Import existing wallet using secret key
- 💰 **View Balance** - Check your SOL balance in real-time
- 💸 **Send Transactions** - Transfer SOL to other addresses
- 🎁 **Request Airdrop** - Get free SOL on devnet/testnet
- 🪙 **Token Management** - View and manage SPL tokens
- 🔄 **Network Switching** - Switch between devnet, testnet, and mainnet
- 🔐 **Secure Storage** - Basic encryption for stored keys

## Getting Started

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

The wallet will be available at `http://localhost:3001`

## Usage

1. **Create or Import a Wallet**
   - Click "Create New Wallet" to generate a new keypair
   - Or click "Import Wallet" to use an existing secret key

2. **Check Your Balance**
   - Your SOL balance is displayed on the main dashboard
   - Click "Refresh Balance" to update

3. **Request SOL Airdrop**
   - Click "Request 2 SOL Airdrop" on devnet/testnet
   - Useful for testing transactions

4. **Send Transactions**
   - Enter recipient address and amount
   - Click "Send Transaction" to transfer SOL

5. **Manage Tokens**
   - View your SPL token accounts
   - Copy token mint addresses for reference

6. **Switch Networks**
   - Use the network buttons to switch between devnet, testnet, and mainnet
   - ⚠️ Never test with real SOL on mainnet

## Architecture

### Context API

- `WalletContext` - Global wallet state and actions
- Auto-loads wallet from localStorage on mount
- Manages network switching and balance refresh

### Utilities

- `@/utils/solana.ts` - Solana Web3.js integration
- `@/utils/storage.ts` - Encrypted localStorage management

### Components

- `WalletIntro` - Wallet creation/import
- `BalanceDisplay` - SOL balance view
- `SendTransaction` - Transfer SOL
- `AirdropRequest` - Request test SOL
- `TokenManagement` - View SPL tokens
- `NetworkSwitcher` - Change networks
- `Header` - Navigation and wallet info

## Environment Variables

Create a `.env.local` file (optional):

```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet
```

## Technologies

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **@solana/web3.js** - Solana integration
- **Lucide React** - Icons
- **tweetnacl** - Cryptography

## Security Considerations

- Keys are stored in browser localStorage (not recommended for production)
- No password protection on stored keys
- Always use devnet/testnet for testing
- Never share your secret key
- Never use this wallet with real mainnet SOL

## Development

```bash
# Development
pnpm dev

# Build
pnpm build

# Start production build
pnpm start

# Linting
pnpm lint
```

## Troubleshooting

**Airdrop not working?**

- Make sure you're on devnet or testnet (not mainnet)
- Wait a few moments between airdrop requests
- Check Solana network status

**Transaction failed?**

- Verify the recipient address is valid
- Ensure you have enough SOL for the transaction
- Check network connectivity

**Keys not persisting?**

- Clear browser storage and reimport keys
- Ensure localStorage is enabled

## Resources

- [Solana Documentation](https://docs.solana.com/)
- [Solana Explorer](https://explorer.solana.com/)
- [Web3.js Documentation](https://solana-labs.github.io/solana-web3.js/)
- [SPL Token Documentation](https://spl.solana.com/token)

## License

MIT

---

**Developed by Danish Ahmed KM**  
For Solana development and testing purposes only.
