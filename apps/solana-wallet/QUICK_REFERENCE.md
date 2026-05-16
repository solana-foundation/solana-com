# Quick Reference - Solana Wallet Commands

## Development Commands

### Start Development Server

```bash
cd /vercel/share/v0-project/apps/solana-wallet
pnpm dev
```

Runs on `http://localhost:3001`

### Build for Production

```bash
pnpm build
```

Creates optimized production build in `.next/`

### Start Production Server

```bash
pnpm start
```

Runs production build (requires `pnpm build` first)

### Type Check

```bash
pnpm tsc --noEmit
```

Checks TypeScript without emitting files

### Lint Code

```bash
pnpm lint
```

Runs ESLint on the project

---

## Key Files at a Glance

| File                             | Purpose                                |
| -------------------------------- | -------------------------------------- |
| `app/layout.tsx`                 | Root layout, wraps with WalletProvider |
| `app/page.tsx`                   | Main dashboard with all features       |
| `app/globals.css`                | Global styles and Tailwind setup       |
| `src/contexts/WalletContext.tsx` | Global wallet state management         |
| `src/utils/solana.ts`            | Solana Web3.js integration             |
| `src/utils/storage.ts`           | localStorage encryption/decryption     |
| `src/components/*.tsx`           | 11 reusable React components           |

---

## Feature Quick Links

### View Your Keys

- **File:** `src/components/WalletIntro.tsx`
- **Shows:** Public key and secret key with copy buttons
- **Actions:** View, copy, toggle visibility

### Check Balance

- **File:** `src/components/BalanceDisplay.tsx`
- **Shows:** SOL balance in large font
- **Actions:** Refresh, view USD estimate

### Send SOL

- **File:** `src/components/SendTransaction.tsx`
- **Actions:** Enter recipient and amount, submit transaction
- **Validation:** Address and amount checks

### Request Airdrop

- **File:** `src/components/AirdropRequest.tsx`
- **Amount:** 2 SOL per request
- **Networks:** Devnet and testnet only

### View Tokens

- **File:** `src/components/TokenManagement.tsx`
- **Shows:** All SPL token accounts
- **Actions:** Refresh, copy mint address

### Switch Networks

- **File:** `src/components/NetworkSwitcher.tsx`
- **Options:** devnet, testnet, mainnet
- **Auto:** Refreshes balance and tokens

---

## Component Hierarchy

```
<WalletProvider>
  └─ <Header />
  └─ {publicKey ? (
       <Dashboard>
         <LeftColumn>
           <BalanceDisplay />
           <SendTransaction />
           <TokenManagement />
         </LeftColumn>
         <RightColumn>
           <NetworkSwitcher />
           <AirdropRequest />
           <Resources />
         </RightColumn>
       </Dashboard>
     ) : (
       <WalletIntro />
     )}
  └─ <Footer />
</WalletProvider>
```

---

## Context API Usage

```typescript
import { useWallet } from "@/contexts/WalletContext";

const MyComponent = () => {
  const {
    publicKey, // Current public key or null
    network, // 'devnet' | 'testnet' | 'mainnet'
    solBalance, // SOL amount
    tokenAccounts, // SPL token array
    isLoading, // Loading state

    createNewWallet, // () => void
    importWallet, // (secret: string) => boolean
    disconnectWallet, // () => void
    switchNetwork, // (net: NetworkType) => void
    refreshBalance, // () => Promise<void>
    refreshTokens, // () => Promise<void>
  } = useWallet();
};
```

---

## Common Tasks

### Create a New Component

1. Create file in `src/components/MyComponent.tsx`
2. Import necessary dependencies
3. Use `useWallet()` if needed state
4. Wrap with `Card` if needed
5. Export as default

```tsx
"use client";
import React from "react";
import { Card, CardHeader, CardContent } from "./Card";
import { useWallet } from "@/contexts/WalletContext";

const MyComponent: React.FC = () => {
  const { publicKey } = useWallet();

  if (!publicKey) return null;

  return (
    <Card>
      <CardHeader title="Title" description="Desc" />
      <CardContent>Content</CardContent>
    </Card>
  );
};

export default MyComponent;
```

### Add Utility Function

1. Create/edit in `src/utils/*.ts`
2. Add function with proper types
3. Export function
4. Import where needed

```typescript
// src/utils/myUtils.ts
export const myFunction = async (param: string): Promise<string> => {
  // Implementation
  return result;
};

// Usage in component
import { myFunction } from "@/utils/myUtils";
const result = await myFunction("input");
```

### Create New Page

1. Create `app/pagename/page.tsx`
2. Use layout from `app/layout.tsx`
3. Access wallet via `useWallet()` hook
4. Next.js auto-creates route

```typescript
// app/newpage/page.tsx
'use client';
import { useWallet } from '@/contexts/WalletContext';

export default function NewPage() {
  const { publicKey } = useWallet();
  return <div>{publicKey}</div>;
}
```

---

## Environment Variables

| Variable                     | Default  | Purpose         |
| ---------------------------- | -------- | --------------- |
| `NEXT_PUBLIC_SOLANA_NETWORK` | `devnet` | Default network |

Add to `.env.local`:

```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet
```

---

## Debugging

### Console Logs

```typescript
console.log("[v0] Debug message:", data);
```

### Check Browser Storage

```javascript
// In browser console
localStorage.getItem("solana_wallet");
```

### Network Info

```typescript
import { getConnection } from "@/utils/solana";
const conn = getConnection("devnet");
const version = await conn.getVersion();
```

---

## Solana RPC Endpoints

| Network | URL                                   |
| ------- | ------------------------------------- |
| devnet  | `https://api.devnet.solana.com`       |
| testnet | `https://api.testnet.solana.com`      |
| mainnet | `https://api.mainnet-beta.solana.com` |

---

## Testing Workflows

### Test Wallet Creation

1. Click "Create New Wallet"
2. View keys
3. Reload page - wallet should persist
4. Keys visible after reload

### Test Send Transaction

1. Create/import two wallets
2. Get address of second wallet
3. Send from first to second
4. Check balance updated

### Test Airdrop

1. Ensure on devnet
2. Request airdrop
3. Wait 1-2 min
4. Refresh balance
5. Should see +2 SOL

### Test Network Switch

1. Check balance on devnet
2. Switch to testnet
3. Balance should refresh
4. Different values expected

---

## Performance Tips

1. **Use useWallet() sparingly** - it triggers re-renders
2. **Memoize callbacks** - use `useCallback` for event handlers
3. **Lazy load components** - dynamic import for heavy components
4. **Batch updates** - update multiple state values together
5. **Debounce inputs** - delay API calls while typing

---

## Security Checklist

- ✅ Never commit `.env` files
- ✅ Never log secret keys
- ✅ Always validate user input
- ✅ Use HTTPS in production
- ✅ Clear sensitive data from memory
- ✅ Warn users about devnet-only use
- ✅ Never store keys without encryption
- ✅ Implement rate limiting for airdrops

---

## Monorepo Commands (from root)

```bash
# Install all workspace packages
pnpm install

# Build all apps
pnpm -r build

# Run specific app
pnpm -F solana-wallet dev

# Check dependencies
pnpm list -r @solana/web3.js
```

---

## File Locations Reference

```
/vercel/share/v0-project/
├── apps/
│   ├── solana-wallet/          ← You are here
│   ├── web/                    ← Main solana.com site
│   ├── docs/
│   ├── media/
│   └── ...
├── packages/
├── node_modules/
└── pnpm-lock.yaml
```

---

## Getting Help

1. Read documentation in order:
   - `README.md` - Overview
   - `SETUP.md` - Setup & usage
   - `COMPONENTS.md` - Component details
   - `QUICK_REFERENCE.md` - This file

2. Check Solana docs: https://docs.solana.com/

3. Check Web3.js docs: https://solana-labs.github.io/solana-web3.js/

4. Open GitHub issues for bugs

---

## Common Errors & Solutions

| Error                                | Cause                 | Solution                       |
| ------------------------------------ | --------------------- | ------------------------------ |
| `"Property 'encode' does not exist"` | bs58 import wrong     | Use `import bs58 from 'bs58'`  |
| `"Airdrop request failed"`           | Wrong network         | Ensure devnet/testnet selected |
| `"Invalid public key"`               | Bad address format    | Verify address is valid        |
| `"Keys not persisting"`              | localStorage disabled | Enable localStorage in browser |
| `"Module not found"`                 | Missing dependency    | Run `pnpm install`             |

---

## Browser DevTools Tips

### Redux DevTools

Not used - using Context API instead

### Console Warnings

Safe to ignore:

- Next.js plugin warning (already handled)
- HMR warnings during dev

### Local Storage

View at: DevTools → Storage → Local Storage → http://localhost:3001

---

## Deployment

### Deploy to Vercel

```bash
# From monorepo root
cd apps/solana-wallet
vercel
```

### Environment Variables

Set in Vercel dashboard:

- `NEXT_PUBLIC_SOLANA_NETWORK=devnet`

### Build Output

- Next.js generates static and dynamic pages
- Bundle size: ~200KB first load
- Fully client-side app (no backend needed)

---

**Last Updated:** 2024  
**Owner:** Danish Ahmed KM  
**Status:** Ready for development
