# Authoring a Solana Changelog

Solana Changelog posts are regular Keystatic posts with the `Changelog`
category. Published entries appear on `/changelog`, in its RSS feed, and on
their normal `/news/[slug]` article page. They are intentionally excluded from
the `/news` homepage.

## Create the post

Follow the branch and review workflow in
[authoring-posts-with-branching.md](./authoring-posts-with-branching.md), then
create a new entry in the `Posts` collection.

Use these fields:

| Field        | Guidance                                                          |
| ------------ | ----------------------------------------------------------------- |
| Title        | `Solana Changelog: Month D, YYYY`                                 |
| Status       | Keep as `Draft` until approved                                    |
| Hero Image   | Supply the weekly changelog image for the article and social SEO  |
| Description  | A topic-first sentence connecting two to four concrete highlights |
| Author       | Usually `Solana Foundation`                                       |
| Publish Date | Enter the intended publication date and time in UTC               |
| Categories   | Add `Changelog` first and `Developers` second                     |
| Tags         | Use relevant existing tags; typically include `Developer`         |

The `Changelog` category is required. Without it, the post will not appear on
`/changelog` or in the changelog RSS feed.

## Write the description

Write a compact, topic-first headline sentence:

```text
Agave v4.2.0 shipped as RPC coverage expanded and Solana Kit added new APIs.
```

The `/changelog` listing uses the description as the issue heading when the post
title contains only its publication date. The description is also used on
article cards and as the SEO summary, so keep it:

- to one sentence and no more than 160 characters, including spaces;
- led by the most important named release or change, without recurring setup
  such as “This week’s highlights” or “In this issue”;
- focused on two to four specific releases, protocol changes, or tools;
- connected naturally with words such as `as`, `alongside`, or `and`;
- written with active verbs and version numbers when they are a key part of the
  update; and
- free of setup or generic claims such as “another week of engineering updates.”

End with a period. Prioritize the items a developer would be most likely to scan
for or search for; the opening paragraph can provide broader context.

## Structure the issue

Open with a short paragraph summarizing what changed and why it matters. Then
organize the body into scannable sections such as:

```md
## Releases

- Project shipped [v1.2.3](https://github.com/example/releases/tag/v1.2.3).

## Protocol and validator work

- Describe the change, its developer impact, and link to the primary source.

## SDKs and developer tooling

- Call out new SDK, framework, testing, or RPC work.

## Other developer resources

- Link useful technical articles, tools, talks, or research.
```

Prefer direct release notes, pull requests, specifications, and documentation
over secondary sources. Keep each bullet focused on one change, put version
numbers in code formatting when practical, and explain the developer impact
without marketing language.

## Before publishing

- Confirm `Changelog` is the first category.
- Verify every version number and link against its primary source.
- Check the description works as a compact card and SEO summary.
- Preview the article and confirm its back link says `Back to Changelog`.
- Confirm the issue appears on `/changelog` and does not appear on `/news`.
- Check `/changelog/rss.xml` after the production publish time has passed.
