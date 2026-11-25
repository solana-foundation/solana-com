---
name: solana-tone-of-voice
description:
  Write or revise public-facing Solana.com copy in the Solana voice. Use for
  English UI copy, landing pages, docs prose, Media posts, metadata, CTAs, and
  social copy; do not use to replace a named author's intentional voice or fixed
  legal text.
---

# Solana Tone of Voice

Use this skill whenever generating or materially rewriting reader-facing English
for Solana.com. It applies to a two-word button label as much as a long-form
article: small strings should say exactly what happens, and longer copy should
give the reader real information rather than inflated positioning.

This is a style and editorial-quality pass, not permission to change the facts,
product scope, or authorial point of view. Preserve supplied quotations,
first-person writing, legal language, and approved brand names unless the user
asks to change them.

## Establish the content context first

Do not apply one generic “Solana voice” to every surface. Before drafting or
substantially revising copy:

1. Identify the reader, the copy's job, and the content bucket from the route,
   component, or content collection. A developer landing page, API reference,
   event announcement, release note, and podcast feature have different jobs.
2. Read the repository's root instructions and the closest app-level `AGENTS.md`
   or `CLAUDE.md`. Follow any local content, source, and format rules ahead of
   this skill.
3. Inspect a small set of nearby, published examples for the same surface and
   audience. Use them to calibrate length, hierarchy, terminology, and energy;
   do not copy their claims or wording.
4. Read [content modes](references/content-modes.md) and choose the closest
   mode. When a page combines modes, use the mode that matches each section's
   purpose rather than forcing one voice across the whole page.

## Start with the reader's concrete need

Before drafting, identify the one thing the reader should learn, do, or decide.
Write from that fact or action outward.

- Lead with the actor and action: “Anza released …”, “Send a stablecoin payment
  …”, “Compare EVM patterns with …”. Prefer a named subject over passive
  construction or an abstract noun.
- Make benefits observable. Name the capability, mechanism, metric, resource, or
  next step that supports the claim. Confidence comes from specificity, not
  heightened language.
- Say who the copy is for only when it changes the instruction. Address builders
  as “you” for tasks; use third person for reported teams and partners; use “we”
  only when speaking for the Solana Foundation.
- Define an unfamiliar technical term on first use when enough source material
  is available. Do not dilute technical documentation into marketing copy.

Do not invent facts, measurements, dates, partnerships, customer outcomes,
roadmaps, links, or quotes. If the requested message needs a proof point that is
not supplied or available in the repository, write a narrower claim or flag the
gap for the requester.

## The voice

Write with directness, technical fluency, and a little momentum. The copy is
plainspoken enough to scan, but never generic or bloodless. Vary sentence length
naturally; a short declarative sentence is useful when it carries a real point,
not when it manufactures drama.

Prefer:

- concrete verbs: build, ship, settle, compare, deploy, inspect, pay, test
- specific nouns: the product, protocol, team, asset, guide, release, or
  resource in question
- precise CTAs: “Read the migration guide”, “View release notes”, “Create a
  token”
- a clear distinction when the source supports it: what changed, how it works,
  and what the reader can do next

Avoid language that could describe any technology company or be swapped onto a
competitor's site without changing its meaning. In particular, do not use
superlatives or empty modifiers as a substitute for evidence (for example,
“world-class”, “unmatched”, “seamless”, “revolutionary”, “cutting-edge”, or
“robust”). Ordinary words are fine when they convey a real, supportable fact.

Also avoid common generated-copy shapes:

- a grand prediction about “the future” or an “ever-evolving landscape” before
  the reader knows what actually happened
- rhetorical scaffolding such as “not just … but …”, “whether you are …”, or
  “this is more than …” when a direct sentence would do
- stacks of abstract benefits such as “speed, scale, and innovation” without a
  mechanism or result
- artificial contrast, slogan fragments, or a three-part flourish added only for
  energy
- vague CTA copy such as “Learn more”, “Explore”, or “Get started” when the
  destination and action can be named
- process or information-architecture talk directed at visitors: “this page
  brings together”, “resources from the previous hub”, “a curated collection”,
  or “the tools you need for every stage of your journey”. State what is
  available and what it lets the reader do instead.

## Review before handing off

Read the copy once as a skeptical builder or reader.

1. Can each important sentence answer “who did what, how, or why does it
   matter?” Remove or rewrite any sentence that cannot.
2. Is every claim grounded in supplied material, repository context, or a
   verified source? Narrow anything that is not.
3. Does the copy describe the user's job and next action rather than the page,
   collection, strategy, or writing process?
4. Are the title, description, CTA, and body saying distinct things rather than
   restating the same promise?
5. Would a reader recognize a specific Solana capability or resource without
   being asked to believe an adjective? If not, make the copy more concrete.
