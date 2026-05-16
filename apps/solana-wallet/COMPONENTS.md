# Components Reference

## Overview

This document provides a quick reference for all React components in the Solana
Wallet application.

---

## UI Components

### Button

**File:** `src/components/Button.tsx`  
**Purpose:** Reusable button component with multiple variants

**Props:**

```typescript
interface ButtonProps {
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}
```

**Usage:**

```tsx
<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>

<Button variant="secondary" isLoading={isLoading}>
  Loading...
</Button>
```

### Input

**File:** `src/components/Input.tsx`  
**Purpose:** Reusable input field with validation support

**Props:**

```typescript
interface InputProps {
  label?: string;
  error?: string;
  helperText?: string;
  type?: "text" | "password" | "email" | "number";
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
```

**Usage:**

```tsx
<Input
  label="Secret Key"
  type="password"
  placeholder="Enter secret key"
  error={error}
  helperText="Keep this safe!"
  value={secretKey}
  onChange={(e) => setSecretKey(e.target.value)}
/>
```

### Card

**File:** `src/components/Card.tsx`  
**Purpose:** Container component for content sections

**Components:**

- `Card` - Main container
- `CardHeader` - Title and description
- `CardContent` - Card body content

**Usage:**

```tsx
<Card>
  <CardHeader title="Wallet Details" description="Your keys" />
  <CardContent>{/* Content goes here */}</CardContent>
</Card>
```

### Alert

**File:** `src/components/Alert.tsx`  
**Purpose:** Display notifications and alerts

**Props:**

```typescript
interface AlertProps {
  type: "info" | "success" | "warning" | "error";
  title?: string;
  message: string;
  onClose?: () => void;
}
```

**Usage:**

```tsx
<Alert type="success" title="Success" message="Wallet created!" />
<Alert type="error" message="Transaction failed" onClose={clearError} />
```

---

## Feature Components

### Header

**File:** `src/components/Header.tsx`  
**Purpose:** App header with wallet info and disconnect button

**Features:**

- Displays app title and owner info
- Shows truncated public key
- Disconnect button when wallet is connected

**Usage:**

```tsx
<Header />
```

### WalletIntro

**File:** `src/components/WalletIntro.tsx`  
**Purpose:** Initial wallet creation/import interface

**Features:**

- Create new wallet with keypair generation
- Import wallet from secret key
- Display public/secret keys with copy buttons
- Eye icon to toggle secret key visibility

**Usage:**

```tsx
<WalletIntro />
```

**State:**

- `showImport` - Toggle import form
- `secretKeyInput` - Secret key input value
- `error`, `success` - Error/success messages
- `showSecret` - Toggle secret key visibility

### BalanceDisplay

**File:** `src/components/BalanceDisplay.tsx`  
**Purpose:** Display current SOL balance

**Features:**

- Shows SOL balance in large font
- Estimated USD conversion
- Refresh button with loading state
- Auto-updates on network change

**Usage:**

```tsx
<BalanceDisplay />
```

### SendTransaction

**File:** `src/components/SendTransaction.tsx`  
**Purpose:** Send SOL to another address

**Features:**

- Recipient address input
- Amount input with validation
- Transaction submission with loading state
- Network indicator (testnet warning)

**Usage:**

```tsx
<SendTransaction />
```

**Form Fields:**

- `recipient` - Recipient public key
- `amount` - SOL amount to send

### AirdropRequest

**File:** `src/components/AirdropRequest.tsx`  
**Purpose:** Request free SOL on devnet/testnet

**Features:**

- Request 2 SOL per airdrop
- Disabled on mainnet
- Shows warning for mainnet
- Auto-refreshes balance after airdrop

**Usage:**

```tsx
<AirdropRequest />
```

### TokenManagement

**File:** `src/components/TokenManagement.tsx`  
**Purpose:** View and manage SPL token accounts

**Features:**

- Lists all SPL token accounts
- Shows token amount and decimals
- Copy mint address button
- Collapsible details section
- Refresh button to fetch latest tokens

**Usage:**

```tsx
<TokenManagement />
```

**Display:**

```
Mint Address: 7qX3u...9fK2h
Amount: 1000.0000 tokens
```

### NetworkSwitcher

**File:** `src/components/NetworkSwitcher.tsx`  
**Purpose:** Switch between Solana networks

**Features:**

- Three network buttons: devnet, testnet, mainnet
- Active network highlighted
- Auto-refreshes balance on switch

**Usage:**

```tsx
<NetworkSwitcher />
```

**Networks:**

- `devnet` - Development network
- `testnet` - Test network
- `mainnet` - Production network

---

## Context Components

### WalletProvider

**File:** `src/contexts/WalletContext.tsx`  
**Purpose:** Global wallet state and actions

**Provides:**

```typescript
interface WalletContextType {
  publicKey: string | null;
  isLoading: boolean;
  network: NetworkType;
  solBalance: number;
  tokenAccounts: TokenAccount[];

  createNewWallet: () => void;
  importWallet: (secretKey: string) => boolean;
  disconnectWallet: () => void;
  switchNetwork: (network: NetworkType) => void;
  refreshBalance: () => Promise<void>;
  refreshTokens: () => Promise<void>;
}
```

**Usage:**

```tsx
// Wrap app with provider
<WalletProvider>
  <App />
</WalletProvider>;

// Use in components
const { publicKey, solBalance, importWallet } = useWallet();
```

---

## Page Components

### Home Page

**File:** `app/page.tsx`  
**Purpose:** Main dashboard

**Sections:**

1. Welcome/Help section
2. Balance display (left column)
3. Send transaction form (left column)
4. Token management (left column)
5. Network switcher (right column)
6. Airdrop request (right column)
7. Resources links (right column)
8. Development notice (right column)

**Responsive Layout:**

- Mobile: Single column
- Desktop: 2-column layout (2/3 left, 1/3 right)

---

## Utility Functions

### Solana Utils

**File:** `src/utils/solana.ts`

**Key Functions:**

- `generateNewKeypair()` - Create new keypair
- `importKeypairFromSecret(secretKey)` - Restore from secret key
- `getSolBalance(publicKey, network)` - Fetch SOL balance
- `getTokenAccounts(publicKey, network)` - Fetch SPL tokens
- `sendTransaction(fromSecret, toPublic, amount, network)` - Send SOL
- `requestAirdrop(publicKey, amount, network)` - Request test SOL
- `getConnection(network)` - Get Solana RPC connection

### Storage Utils

**File:** `src/utils/storage.ts`

**Key Functions:**

- `saveWallet(publicKey, secretKey)` - Save to localStorage
- `getStoredWallet()` - Retrieve from localStorage
- `removeWallet()` - Delete from localStorage
- `getWalletFromStorage()` - Get with decryption
- `encryptData(data)` - Encrypt secret key
- `decryptData(encrypted)` - Decrypt secret key

---

## Component Tree

```
<WalletProvider>
  <Header />

  {!publicKey ? (
    <WalletIntro />
  ) : (
    <>
      <Welcome Section>
        <HelpButton />
      </Welcome>

      <Grid Layout>
        <LeftColumn>
          <BalanceDisplay />
          <SendTransaction />
          <TokenManagement />
        </LeftColumn>

        <RightColumn>
          <NetworkSwitcher />
          <AirdropRequest />
          <ResourceLinks />
          <DevNotice />
        </RightColumn>
      </Grid>
    </>
  )}

  <Footer />
</WalletProvider>
```

---

## Component Props Flow

### useWallet() Hook

All feature components use the `useWallet()` hook to access:

```typescript
const {
  publicKey, // Current wallet public key
  network, // Current network (devnet/testnet/mainnet)
  solBalance, // Current SOL balance
  tokenAccounts, // List of SPL tokens
  isLoading, // Loading state

  createNewWallet, // Create new keypair
  importWallet, // Import from secret key
  disconnectWallet, // Remove wallet
  switchNetwork, // Change network
  refreshBalance, // Fetch latest balance
  refreshTokens, // Fetch latest tokens
} = useWallet();
```

---

## Styling

All components use:

- **Tailwind CSS** for styling
- **Design tokens** via CSS variables (--primary, --accent, etc.)
- **Dark mode** support via `prefers-color-scheme`
- **Animations** via Tailwind animate classes

### Color Variables

```css
--background       /* Page background */
--foreground       /* Text color */
--primary         /* Primary action color (purple) */
--primary-foreground
--secondary       /* Secondary background */
--secondary-foreground
--accent          /* Accent color */
--accent-foreground
--border          /* Border color */
```

---

## Adding New Components

### Template Structure

```tsx
"use client"; // If interactive

import React from "react";
import { useWallet } from "@/contexts/WalletContext";
import { Card, CardHeader, CardContent } from "./Card";
import Button from "./Button";

interface ComponentProps {
  // Props here
}

const MyComponent: React.FC<ComponentProps> = (props) => {
  const { publicKey } = useWallet();

  if (!publicKey) return null;

  return (
    <Card>
      <CardHeader title="Title" description="Description" />
      <CardContent>{/* Content here */}</CardContent>
    </Card>
  );
};

export default MyComponent;
```

---

## Testing Components

### Example Test Setup

```tsx
import { render, screen } from "@testing-library/react";
import { WalletProvider } from "@/contexts/WalletContext";
import MyComponent from "./MyComponent";

describe("MyComponent", () => {
  it("renders correctly", () => {
    render(
      <WalletProvider>
        <MyComponent />
      </WalletProvider>,
    );
    expect(screen.getByText("Expected Text")).toBeInTheDocument();
  });
});
```

---

## Performance Tips

1. **Memoize components** to prevent unnecessary re-renders
2. **Split large components** into smaller, focused components
3. **Use `useCallback`** for event handlers
4. **Lazy load** heavy components
5. **Avoid inline functions** in render props

---

## Accessibility

All components include:

- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Color contrast compliance

---

## Last Updated

- **Created:** 2024
- **Owner:** Danish Ahmed KM
- **Purpose:** Personal Solana Wallet Development
