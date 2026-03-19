# Creating Switchbacks and Reports in Keystatic

> A practical guide for content editors creating standard switchbacks and
> report-backed switchbacks in the media app.

---

## What a Switchback Is

A switchback is a reusable image-and-copy content block stored in the
`Switchbacks` collection in Keystatic.

At the simplest level, a switchback contains:

- A title for internal identification
- An image
- An eyebrow
- A headline
- Rich text body content
- One or more buttons

Switchbacks were originally used as supporting marketing sections attached to
posts. They now also serve a second purpose: they can act as the source of
truth for **reports**.

This means there are now **two valid ways** to use a switchback:

1. As a normal switchback attached to a post or other page
2. As a published report that appears under `/reports/[slug]`

---

## What a Report Is

A report is a **report-backed switchback**.

There is no separate `Reports` collection in Keystatic. Instead, reports live
inside `Switchbacks` and are activated with the `Use As Report` field.

Reports exist for content such as:

- Research pieces
- Ecosystem analysis
- Institutional or finance reports
- Gated report landing pages
- Downloadable PDFs promoted through a HubSpot form

In practice, a report is a switchback with extra report metadata:

- Publish status
- Date
- Description
- Categories
- Tags
- Optional PDF URL
- Optional HubSpot modal CTA

If `Use As Report` is not enabled, the switchback behaves like a normal
switchback and **will not** appear on `/reports`.

---

## Where to Create It

Open Keystatic and go to:

- `Switchbacks`

For a general Keystatic walkthrough, see:

- [keystatic-walkthrough.md](/Users/karambit/Sites/solana-com/apps/media/docs/keystatic-walkthrough.md)

The existing switchback screenshots in that walkthrough are still accurate for
finding the collection and creating a new entry:

- `screenshots/09-switchbacks-list.png`
- `screenshots/10-switchback-create-form.png`

No new screenshots were required for this guide.

---

## Creating a Standard Switchback

Use a standard switchback when you need a reusable marketing section and you do
not need it to become a report page.

### Required editorial flow

1. Open `Switchbacks`
2. Click `Add`
3. Fill in the content fields
4. Leave `Use As Report` unchecked
5. Save

### Standard switchback fields

| Field            | Purpose                               |
| ---------------- | ------------------------------------- |
| `Title`          | Internal identifier and slug source   |
| `Image`          | Uploaded image plus alt text          |
| `Eyebrow`        | Small label above the headline        |
| `Headline`       | Main visible title                    |
| Main editor body | The long-form copy for the switchback |
| `Buttons`        | Regular CTA links                     |

### Important authoring note

The main body content belongs in the **main content editor**, not in frontmatter.

In the content file on disk, the body is stored below the frontmatter block
because `body` is the collection `contentField`.

This is correct:

```md
---
title: Example
headline: Example Headline
---

Body content goes here.
```

This is wrong:

```md
---
title: Example
body: |
  Body content goes here.
---
```

---

## Creating a Report

Use a report when the content should appear as a standalone report landing page
under `/reports/[slug]`.

### Report behavior

When a switchback is configured as a report:

- It becomes eligible for the `/reports` listing
- It becomes available at `/reports/[slug]`
- It is returned by `/api/reports/latest`
- It can display a gated HubSpot modal CTA
- It can also expose a direct PDF download button

### Required report fields

To make a switchback render as a report:

1. Set `Use As Report` to `true`
2. Set `Report Status` to `published`

If either is missing, the report page will not resolve.

### Recommended report setup

Fill these fields for every report:

| Field                | Why it matters                                       |
| -------------------- | ---------------------------------------------------- |
| `Title`              | Defines the entry slug                               |
| `Use As Report`      | Enables report behavior                              |
| `Report Status`      | Must be `published` for the route to work            |
| `Report Date`        | Used for sorting and display                         |
| `Report Description` | Used for SEO and preview copy                        |
| `Image`              | Main hero image for the report page                  |
| `Eyebrow`            | Category-style label above the headline              |
| `Headline`           | Main report title shown on page                      |
| Main editor body     | Structured report copy shown in the hero text column |
| `Report Categories`  | Used for filtering and page metadata                 |
| `Report Tags`        | Used for filtering and tagging                       |

### Optional report fields

| Field              | Use case                               |
| ------------------ | -------------------------------------- |
| `PDF URL`          | Adds a direct `Download Report` button |
| `HubSpot Form CTA` | Opens a gated HubSpot form in a modal  |
| `Buttons`          | Extra regular external links           |

---

## How Reports Render

Reports are intentionally designed to feel like structured landing pages, not
like news articles.

The report page template currently renders:

- Eyebrow
- Headline
- Description
- Date and categories
- Main body copy inside the primary text column
- Optional HubSpot modal CTA
- Optional direct PDF download
- Supporting image on the opposite side

This means the body should be written as **landing-page copy**, not as a long
article with many sections unless that is intentional.

Good report body structure:

- One short subhead
- One or two short explanatory paragraphs
- Clear value proposition

Avoid:

- Very long article-style bodies unless the page is meant to read like a full
  article
- Repeating the same message in both description and body without purpose

---

## HubSpot Form CTA

For gated reports, use the dedicated `HubSpot Form CTA` field instead of a
generic button link.

### Why this field exists

The `Get the full report` action is not a standard outbound button.

It is expected to:

- Open a modal
- Load a HubSpot form
- Keep the user on the report page

Because of that, the CTA is structured as:

- `Button Label`
- `Form URL`

### How to use it

For a gated report:

1. Fill `HubSpot Form CTA > Button Label`
2. Fill `HubSpot Form CTA > Form URL`
3. Save the entry

The report template will render that CTA as a modal trigger automatically.

### When not to use it

Do not use `HubSpot Form CTA` for:

- Regular external links
- Documentation links
- Case study or product navigation

Use regular `Buttons` for those.

---

## Categories and Tags for Reports

Reports should use the existing taxonomy collections.

### Categories

Categories are broad buckets used for filtering and organization.

Current category slugs live in:

- `/apps/media/content/categories`

Examples include:

- `finance`
- `institutions`
- `developers`
- `payments`
- `ecosystem`

### Tags

Tags are more specific labels.

Current tag slugs live in:

- `/apps/media/content/tags`

Useful report tags include:

- `reports`
- `featured`
- `finance`
- `network-performance-reports`
- `validator-health-reports`
- `energy-use-reports`

### Editorial recommendation

For every report:

- Add at least one category
- Add the `reports` tag unless there is a strong reason not to
- Add `featured` only when the report is meant to be the highlighted report

---

## Images for Switchbacks and Reports

All switchback images should now use:

- `/uploads/switchbacks/...`

This includes report-backed switchbacks.

The repo was migrated so older switchbacks no longer point to the legacy
`/uploads/posts/...` paths.

### Editorial rule

When editing a switchback in Keystatic:

- Upload the image through the `Image` field
- Do not manually paste a legacy `/uploads/posts/...` path

That keeps switchback assets consistent and easier to manage.

---

## Publishing Checklist for a Report

Before marking a report as published, confirm all of the following:

- `Use As Report` is enabled
- `Report Status` is `published`
- `Report Date` is set
- `Report Description` is filled
- `Headline` is correct
- `Image` is uploaded
- Main body content is in the editor
- At least one category is selected
- Relevant tags are selected
- `HubSpot Form CTA` is configured if the report is gated
- `PDF URL` is configured if there is a downloadable file

---

## Common Failure Modes

### The report URL 404s

Usually one of these:

- `Use As Report` is not enabled
- `Report Status` is not `published`
- The slug in the URL does not match the switchback slug

### The body does not appear in Keystatic correctly

Cause:

- The content was put into frontmatter instead of the main editor

Fix:

- Move the report copy below the `---` frontmatter block

### The CTA opens as a normal link instead of a modal

Cause:

- The content is using `Buttons` instead of `HubSpot Form CTA`

Fix:

- Move the HubSpot URL into the structured `HubSpot Form CTA` field

### The report shows no filtering metadata

Cause:

- Categories or tags are empty

Fix:

- Add appropriate category and tag relationships

### The image path looks inconsistent

Cause:

- A manual path was pasted or the image was sourced from an older location

Fix:

- Re-upload through the switchback `Image` field so it stores under
  `/uploads/switchbacks/...`

---

## Example: Tokenized Equities

`tokenized-equities` is a good example of a report-backed switchback that uses:

- A report headline and description
- Category and tag relationships
- Body copy in the main editor
- A HubSpot modal CTA
- A report route under `/reports/tokenized-equities`

Source file:

- [tokenized-equities.mdx](/Users/karambit/Sites/solana-com/apps/media/content/switchbacks/tokenized-equities.mdx)

---

## Summary

Use `Switchbacks` for both:

- reusable marketing sections
- standalone reports

The difference is whether `Use As Report` is enabled.

If it is a report:

- publish it
- give it taxonomy
- write the body in the main editor
- use the structured HubSpot CTA for gated forms
- use `PDF URL` for direct downloads

That keeps reports consistent in Keystatic, the report API, and the `/reports`
pages.
