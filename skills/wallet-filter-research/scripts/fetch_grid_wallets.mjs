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
      id
      name
      description
      productType {
        name
        slug
      }
      root {
        slug
        urlMain
        profileInfos {
          name
        }
      }
      urls {
        url
        urlType {
          slug
        }
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

console.log(
  JSON.stringify(
    products.map((product) => ({
      id: product.id,
      name: product.name,
      rootSlug: product.root?.slug,
      companyName: product.root?.profileInfos?.[0]?.name,
      productType: product.productType?.slug,
      website:
        product.urls?.find((url) => url.urlType?.slug === "product")?.url ??
        product.root?.urlMain,
      urls: product.urls
        ?.map((entry) => ({
          type: entry.urlType?.slug,
          url: entry.url,
        }))
        .filter((entry) => entry.url),
    })),
    null,
    2,
  ),
);
