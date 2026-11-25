# Payments and commerce (optional)

## When payments are in scope

Use this guidance when the user asks about:

- checkout flows, tips, payment buttons
- payment request URLs / QR codes
- fee abstraction / gasless transactions

## Solana Pay (preferred)

Use Solana Pay (`@solana/pay`) as the default for payment experiences:

- transfer request URLs for SOL and SPL token payments
- QR codes for mobile wallets and point of sale
- transaction requests for interactive or custom checkout flows
- reference keys to find and validate payments onchain

### When to use Solana Pay

- You need payment links or QR codes that any Solana wallet can open
- You're building merchant experiences (tipping, checkout, point of sale)
- You want a standard protocol instead of a custom payment flow

### Solana Pay patterns

- Generate a unique reference for every payment
- Find the payment with `findReference` or `watchReference`, then check it with
  `validateTransfer` before fulfilling an order
- Validate payments server-side, not only in the browser
- Docs: https://solana.com/docs/tools/solana-pay

## Kora (gasless / fee abstraction)

Consider Kora when you need:

- sponsored transactions (user doesn't pay gas)
- users paying fees in tokens other than SOL
- a trusted signing / paymaster component

## UX and security checklist for payments

- Always show recipient + amount + token clearly before signing.
- Protect against replay (use unique references / memoing where appropriate).
- Confirm settlement by querying chain state, not by trusting client-side
  callbacks.
- Handle partial failures gracefully (transaction sent but not confirmed).
- Provide clear error messages for common failure modes (insufficient balance,
  rejected signature).
