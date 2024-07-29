import { config } from "src/config";
import { ServerRuntime } from "next";
import { ImageResponseOptions } from "next/server";

/**
 * Helper function for loading the brand fonts for images
 */
export async function getBrandFonts(): Promise<ImageResponseOptions["fonts"]> {
  const [
    // comment for better diffs
    brandBold,
    brandMedium,
  ] = await Promise.all([
    fetch(
      config.siteUrl +
        new URL("../fonts/diatype/ABCDiatype-Bold.woff", import.meta.url),
    ).then((res) => res.arrayBuffer()),
    fetch(
      config.siteUrl +
        new URL("../fonts/diatype/ABCDiatype-Medium.woff", import.meta.url),
    ).then((res) => res.arrayBuffer()),
  ]);

  return [
    {
      name: "Diatype",
      data: brandMedium,
      style: "normal",
      weight: 500,
    },
    {
      name: "Diatype",
      data: brandBold,
      style: "normal",
      weight: 700,
    },
  ];
}

/**
 * Details about the available background images to use
 */
export const IMAGE_BACKGROUND_DETAILS = {
  min: 1,
  max: 15,
};

/**
 * Default image configuration settings to standardize the generated images
 */
export const IMAGE_SETTINGS: {
  runtime: ServerRuntime;
  sizeDefault: ImageSize;
  contentType: string;
} = {
  /**
   * 1280x630 works well for everywhere
   */
  sizeDefault: {
    width: 1200,
    height: 630,
  },
  /**  */
  contentType: "image/png",
  /**  */
  runtime: "nodejs",
};
