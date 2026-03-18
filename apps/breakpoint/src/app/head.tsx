import { config } from "@/config";

export default function Head() {
  return (
    <>
      <link
        rel="stylesheet"
        href={`${config.assetPrefix}/live/breakpoint-live-1.css`}
      />
      <link
        rel="stylesheet"
        href={`${config.assetPrefix}/live/breakpoint-live-2.css`}
      />
    </>
  );
}
