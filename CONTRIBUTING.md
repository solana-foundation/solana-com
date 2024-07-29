# Contributing to solana.com

We really appreciate your input, and that's why we've made solana.com an open-source project! We're all about keeping things easy and transparent when it comes to contributing to the site, whether it's:

- Reporting a bug
- Submitting a fix
- Discussing the current state of this repo
- Proposing new features

## Avoid official recommendations

Avoid any language around making "official recommendations" such as "I recommend
product X" or "Product Y is the best". The content within this repo will be
publicly published on solana.com which is maintained by the
[Solana Foundation](https://solana.org). As such, any "product recommendations"
may appear as if coming directly from the Solana Foundation. The Solana
Foundation does not make official recommendations for products but rather helps
share what options are available in the broader Solana ecosystem.

## Avoid "picking favorites"

Avoid language similar to "service X is my favorite". When talking about or
naming specific products within the Solana ecosystem, writers and maintainers
should make their best attempt to list multiple options that meet similar use
cases. As a general rule of thumb, try to share at least 3-4 options of similar
products or services, not just a single named one. For example, when talking
about wallet providers, a writer could list Phantom, Solflare, Backpack, and
Ultimate. When talking about RPC providers, a writer should link to
[solana.com/rpc](https://solana.com/rpc) instead of listing specific names.

## Use up-to-date code snippets

Write content that uses up-to-date code. Code bases change, functions get
deprecated, and methods get removed. When submitting code snippets within the
content here, use the most up-to-date code available for the given functionality
being used. Especially net new content, like adding a new guide.

## Style guidelines

To aid in keeping both consistent content and a high-quality experience, all
code/content maintained within this repo shall use the style guidelines set
forth here.

Failure to adhere to these style guidelines will slow down the review process
and block approval/merging.

## Crowdin localization

Translations are handled via the Crowdin platform. The content within this repo is in the default/base language of English. When the content is uploaded to the Crowdin platform, it will be broken into small strings where people that have access can perform translations.

## Developer Content API

The majority of the content within the developer specific sections of solana.com (e.g. `/developers` and `/docs`) are driven from the [`developer-content`](https://github.com/solana-foundation/developer-content) repo which deploys an API for `solana-com` to consume via the [`ContentApi` class](/src/utils/contentApi.ts).

This class defaults to the public API endpoint of `https://solana-developer-content.vercel.app`.

For local development and testing of developer content changes, you can run the `developer-content` API locally and set the `NEXT_PUBLIC_DEVELOPER_CONTENT_API_URL` env variable to use your local instance to view your changes within the UI of `solana-com`:

```conf
NEXT_PUBLIC_DEVELOPER_CONTENT_API_URL="http://localhost:3001"
```

> Note: This assumes the `developer-content` API is running on port `3001` (which it is configured to do so by default).

## Builder API

The blog content located at `/news` and most of the landing pages under `/solutions` utilize Builder.io, a headless CMS integrated with our current Next.js project.

```conf
NEXT_PUBLIC_BUILDER_API_KEY=""
NEXT_PUBLIC_BUILDER_NEWS_SETTINGS_ID=""
```

> Note from Builder [docs](https://www.builder.io/c/docs/using-your-api-key): The Builder Public API Key is public, meaning that you don't have to keep it private.
