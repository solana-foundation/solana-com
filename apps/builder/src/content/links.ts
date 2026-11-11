/**
 * Outbound links for the Builder site.
 *
 * While a value is `null`, its buttons render in place but do not navigate.
 */
export const links: Record<"register" | "sponsorship", string | null> = {
  /** Luma registration page. Primary CTA across the site. */
  register: "https://luma.com/builder-epoch-01",
  /** Sponsorship enquiry form or mailto: link. */
  sponsorship: "https://solanafoundation.typeform.com/builder-sponsor",
};
