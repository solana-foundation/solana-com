#!/usr/bin/env node

const endpoint = "https://beta.node.thegrid.id/graphql";

const query = /* GraphQL */ `
  query SolanaWalletProducts {
    products(
      where: {
        productType: {
          slug: {
            _in: [
              "wallet"
              "hardware_wallet"
              "embedded_wallet"
              "multi_sig_wallet"
            ]
          }
        }
        productStatus: { slug: { _eq: "live" } }
        supportsProducts: {
          supportsProduct: { name: { _eq: "Solana Mainnet" } }
        }
      }
      limit: 250
    ) {
      root {
        urlMain
        profileInfos {
          name
        }
      }
      urls {
        url
      }
    }
  }
`;

const response = await fetch(endpoint, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ query }),
});

if (!response.ok) {
  throw new Error(`The Grid request failed with ${response.status}`);
}

const payload = await response.json();

if (payload.errors?.length) {
  throw new Error(
    payload.errors
      .map((error) => error.message)
      .filter(Boolean)
      .join("; "),
  );
}

const products = payload.data?.products ?? [];

function compactString(value) {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

function uniqueStrings(values) {
  const seen = new Set();
  return values.map(compactString).filter((value) => {
    if (!value || seen.has(value)) {
      return false;
    }

    seen.add(value);
    return true;
  });
}

console.log(
  JSON.stringify(
    products
      .map((product) => ({
        companyNames: uniqueStrings(
          product.root?.profileInfos?.map((profile) => profile.name) ?? [],
        ),
        urls: uniqueStrings([
          product.root?.urlMain,
          ...(product.urls?.map((entry) => entry.url) ?? []),
        ]),
      }))
      .filter((entry) => entry.companyNames.length || entry.urls.length),
    null,
    2,
  ),
);
