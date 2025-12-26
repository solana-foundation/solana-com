import { readFile } from "fs/promises";
import { join } from "path";
import { ServerRuntime } from "next";
import { ImageResponseOptions } from "next/server";

/**
 * Helper function for loading the brand fonts for images
 */
export async function getBrandFonts(): Promise<ImageResponseOptions["fonts"]> {
  const fontsDir = join(process.cwd(), "src/fonts/diatype");
  const [
    // comment for better diffs
    brandBold,
    brandMedium,
  ] = await Promise.all([
    readFile(join(fontsDir, "ABCDiatype-Bold.woff")),
    readFile(join(fontsDir, "ABCDiatype-Medium.woff")),
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
  sizeDefault: { width: number; height: number };
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
