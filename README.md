# solana.com Monorepo test

Repository for [https://solana.com](https://solana.com) - a Turborepo-powered
monorepo with the main app in `apps/web/`.

## Setup locally

1. Clone the repo to your local machine:

   ```
   git clone https://github.com/solana-foundation/solana-com.git
   ```

2. Install the dependencies via `pnpm` (from root):

   ```
   pnpm install
   ```

3. Run the project locally (uses Turbo to run `dev` in `apps/web/`):

   ```
   pnpm dev
   ```

   Or, to run directly in the app folder:

   ```
   cd apps/web
   pnpm dev
   ```

## Maintainers

The solana.com website is managed and maintained by the Solana Foundation. Read
more on [how to contribute](apps/web/CONTRIBUTING.md).
