/**
 * Outbound links for the Builder site.
 *
 * TODO(launch): fill in the speaker form from the copy doc before the site
 * goes live. While a value is `null`, its buttons render in place but do not
 * navigate.
 */
export const links: Record<
  "register" | "speaker" | "sponsorship",
  string | null
> = {
  /** Luma registration page. Primary CTA across the site. */
  register: "https://luma.com/builder-epoch-01",
  /** Speaker interest form. */
  speaker: null,
  /** Sponsorship enquiry form or mailto: link. */
  sponsorship: "https://solanafoundation.typeform.com/builder-sponsor",
};
