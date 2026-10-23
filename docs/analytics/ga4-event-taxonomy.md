# Solana.com GA4 event taxonomy

This is the shared contract for the marketing surface: Web, Docs, Media,
Templates, Accelerate, and Breakpoint. Application code emits these events via
`@solana-com/ui-chrome/analytics`; GTM forwards them to the appropriate GA4
Google tag.

Analytics scripts and event emission are disabled for local development, preview
deployments, and non-production builds. Production remains subject to the
existing Consent Mode gate.

## Events

| Event               | Use                                                                  | Required parameters                        |
| ------------------- | -------------------------------------------------------------------- | ------------------------------------------ |
| `generate_lead`     | A newsletter, contact, application, or registration request succeeds | `app_name`, `lead_type`, `form_id`         |
| `select_content`    | A meaningful CTA, resource, card, episode, or modal is selected      | `app_name`, `content_type`                 |
| `view_item`         | An important resource or other intent-bearing item becomes visible   | `app_name`, `content_type`, `content_id`   |
| `podcast_play`      | A visitor starts or resumes an episode                               | `app_name`, `content_type`, `content_name` |
| `podcast_subscribe` | A visitor chooses a podcast platform                                 | `app_name`, `content_type`, `platform`     |

Optional common parameters are `content_id`, `content_name`, `placement`, and
`link_url`. URLs exclude query strings. Values are trimmed and capped at 100
characters. Never send email addresses, form values, user identifiers, or raw
search terms.

## GA4 enhanced measurement

Keep GA4-generated `page_view`, `session_start`, `first_visit`,
`user_engagement`, `scroll`, `file_download`, `view_search_results`, and video
events. Retain the existing custom scroll-depth tags as requested.

Disable GTM triggers that emit generic `click`, `navigation_click`,
`button_click`, `tab_click`, and `speaker_expand`. They lack a stable business
meaning and should be replaced only where a specific interaction maps to an
event above.

Avoid duplicate `form_start` and `form_submit`: retain GA4 enhanced measurement
or GTM form triggers, but not both. Use `generate_lead` as the conversion event,
because it means the request actually succeeded.

## GTM configuration checklist

1. In each app's implementation, use exactly one Google tag with the intended
   GA4 measurement ID and an All Pages trigger. The primary property may use a
   direct Google tag; Breakpoint uses its separate GTM container.
2. Do not load a second direct `gtag.js` implementation when that Google tag is
   present in GTM; two implementations duplicate automatic page views.
3. Ensure the Google tag observes the consent default before it fires. The apps
   already initialize Consent Mode before GTM loads.
4. Forward the five custom events above. Register only useful dimensions:
   `app_name`, `lead_type`, `content_type`, `content_id`, `placement`, and
   `platform`.
5. Mark `generate_lead` as a key event. Mark `podcast_subscribe` only if it is a
   marketing KPI. Do not mark clicks, scrolls, opens, or views as key events.
6. In Google tag settings, configure all first-party Solana domains and verify
   the cross-domain list. Use Preview/Tag Assistant on every app route before
   publishing.

## Container ownership

Container IDs must be maintained per application. Breakpoint uses the existing
live container `GTM-TNX63HZ`; do not infer that a tag installed on `solana.com`
also covers a separately deployed app behind a route rewrite.

Configure the vendor's Meta, LinkedIn, and X tags in `GTM-TNX63HZ`, alongside
the existing GA4 and scroll-depth triggers. Test with GTM Preview on
`/breakpoint` before publishing. This preserves the established measurement
history and avoids duplicate vendor tags.
