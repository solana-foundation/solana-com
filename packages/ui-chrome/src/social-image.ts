export const DEFAULT_SOCIAL_IMAGE_URL = "https://solana.com/social/solana.png";

export const DEFAULT_SOCIAL_IMAGE = {
  url: DEFAULT_SOCIAL_IMAGE_URL,
  secureUrl: DEFAULT_SOCIAL_IMAGE_URL,
  width: 1200,
  height: 630,
  alt: "Solana logo on a purple, blue, and green gradient background",
  type: "image/png",
} as const;

export function createDefaultSocialImage(
  alt: string = DEFAULT_SOCIAL_IMAGE.alt,
) {
  return {
    ...DEFAULT_SOCIAL_IMAGE,
    alt,
  };
}
