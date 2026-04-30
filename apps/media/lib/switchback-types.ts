export type SwitchbackItem = {
  title: string;
  isReport?: boolean | null;
  status?: string | null;
  publishedAt?: string | null;
  description?: string | null;
  eyebrow?: string | null;
  headline?: string | null;
  pdfUrl?: string | null;
  image?: {
    src?: string | null;
    alt?: string | null;
  } | null;
  hubspotForm?: {
    buttonLabel?: string | null;
    portalId?: string | null;
    formId?: string | null;
  } | null;
  categories?: Array<{ category?: string | null } | null> | null;
  tags?: Array<{ tag?: string | null } | null> | null;
  buttons?: Array<{ label?: string | null; url?: string | null } | null> | null;
  body: () => Promise<string>;
};
