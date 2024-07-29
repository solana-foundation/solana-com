import {
  IMAGE_BACKGROUND_DETAILS,
  IMAGE_SETTINGS,
  getBrandFonts,
} from "@/utils/images";
import { ImageResponse } from "next/og";
import { config } from "src/config";
import { generateRandomInRange } from "@/utils/general";

type DeveloperDocsImageProps = {
  heading: string;
  title: string;
};

// Image generation
export default async function DeveloperDocsImage(
  { heading, title }: DeveloperDocsImageProps,
  size: ImageSize = IMAGE_SETTINGS.sizeDefault,
): Promise<ImageResponse> {
  //
  const solanaLogo = `${config.siteUrl}/img/logomark-color.svg`;

  // select a random background image to use
  const { min, max } = IMAGE_BACKGROUND_DETAILS;
  const bgImage = `${
    config.siteUrl
  }/img/og-backgrounds/shape-${generateRandomInRange(min, max)}.jpg`;

  return await new ImageResponse(
    (
      <div
        style={{
          // note: this image url must be an absolute uri resource...
          backgroundImage: `url(${bgImage})`,
          backgroundColor: "#000",
          backgroundSize: "100% 100%",
          lineHeight: "1",
          height: "100%",
          width: "100%",
          display: "flex",
          // transform: "scaleX(-1)",
          flexDirection: "column",
          // fontFamily: "Inter",
          padding: "50px 60px",
          color: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <img
            src={solanaLogo}
            alt={"solana logo"}
            style={{
              width: "64px",
              marginRight: "1.5rem",
            }}
          />

          <h1
            style={{
              fontWeight: 500,
              fontSize: "3.5rem",
              overflow: "hidden",
              color: "#aaa",
            }}
          >
            {heading}
          </h1>
        </div>

        <h2
          style={{
            fontWeight: 700,
            marginTop: "1rem",
            fontSize: "6.5rem",
          }}
        >
          {title}
        </h2>
      </div>
    ),
    {
      ...size,
      fonts: await getBrandFonts(),
    },
  );
}
