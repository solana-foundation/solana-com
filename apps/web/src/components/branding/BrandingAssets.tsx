import Image from "next/image";
import Divider from "../shared/Divider";
import Button from "../shared/Button";
import { useTranslations } from "next-intl";

const BrandingAssets = () => {
  const t = useTranslations();

  return (
    <section className="pt-10" id="asset">
      <h2 className="h3">{t("branding.assets.title")}</h2>
      <Button
        to="https://drive.google.com/drive/u/1/folders/1Y882o7uxW4Bx2vL6MXI-IozbGTX3ztBk"
        variant="secondary"
        size="large"
        newTab
        className="mt-8 mb-8"
      >
        {t("branding.assets.download-btn")}
      </Button>

      <Divider theme="light" axis="x" className="my-4" />
      <div className="flex justify-between items-center gap-x-6 gap-y-6 flex-wrap">
        <div>
          <p className="smaller uppercase mt-4 mb-4">
            {t("branding.assets.mainLogoType")}
          </p>
          <div className="flex items-center">
            <Button
              to="src/img/branding/solanaLogo.png"
              download
              className="mr-4 px-5"
            >
              PNG
            </Button>
            <Button
              className="px-5"
              to="src/img/branding/solanaLogo.svg"
              download
            >
              SVG
            </Button>
          </div>
        </div>
        <div className="min-w-[280px] w-[320px] h-[160px] flex items-center">
          <Image
            alt="Official Solana full logo (horizontal)"
            src="/src/img/branding/solanaLogo.svg"
            width={320}
            height={160}
          />
        </div>
      </div>

      <Divider theme="light" axis="x" className="my-4" />
      <div className="flex justify-between items-center gap-x-6 gap-y-6 flex-wrap">
        <div>
          <p className="smaller uppercase mt-4 mb-4">
            {t("branding.assets.logomark")}
          </p>
          <div className="flex items-center">
            <Button
              to="src/img/branding/solanaLogoMark.png"
              download
              className="mr-4 px-5"
            >
              PNG
            </Button>
            <Button
              className="px-5"
              to="src/img/branding/solanaLogoMark.svg"
              download
            >
              SVG
            </Button>
          </div>
        </div>
        <div className="min-w-[280px] w-[320px] h-[160px] flex items-center">
          <Image
            alt="Official Solana logo mark icon"
            src="/src/img/branding/solanaLogoMark.svg"
            width={100}
            height={100}
          />
        </div>
      </div>

      <Divider theme="light" axis="x" className="my-4" />
      <div className="flex justify-between items-center gap-x-6 gap-y-6 flex-wrap">
        <div>
          <p className="smaller uppercase mt-4 mb-4">
            {t("branding.assets.wordmark")}
          </p>
          <div className="flex items-center">
            <Button
              to="src/img/branding/solanaWordMark.png"
              download
              className="mr-4 px-5"
            >
              PNG
            </Button>
            <Button
              className="px-5"
              to="src/img/branding/solanaWordMark.svg"
              download
            >
              SVG
            </Button>
          </div>
        </div>
        <div className="min-w-[280px] w-[320px] h-[160px] flex items-center">
          <Image
            alt="Official Solana wordmark"
            src="/src/img/branding/solanaWordMark.svg"
            width={320}
            height={160}
          />
        </div>
      </div>

      <Divider theme="light" axis="x" className="my-4" />
      <div className="flex justify-between items-center gap-x-6 gap-y-6 flex-wrap">
        <div>
          <p className="smaller uppercase mt-4 mb-4">
            {t("branding.assets.vertical")}
          </p>
          <div className="flex items-center">
            <Button
              to="src/img/branding/solanaVerticalLogo.png"
              download
              className="mr-4 px-5"
            >
              PNG
            </Button>
            <Button
              className="px-5"
              to="src/img/branding/solanaVerticalLogo.svg"
              download
            >
              SVG
            </Button>
          </div>
        </div>
        <div className="min-w-[280px] w-[320px] h-[160px] flex items-center">
          <Image
            alt="Official Solana vertical logo"
            src="/src/img/branding/solanaVerticalLogo.svg"
            width={320}
            height={160}
          />
        </div>
      </div>

      <Divider theme="light" axis="x" className="my-4" />
      <div className="flex justify-between items-center gap-x-6 gap-y-6 flex-wrap">
        <div>
          <p className="smaller uppercase mt-4 mb-4">
            {t("branding.assets.foundation")}
          </p>
          <div className="flex items-center">
            <Button
              to="src/img/branding/solanaFoundationLogo.png"
              download
              className="mr-4 px-5"
            >
              PNG
            </Button>
            <Button
              className="px-5"
              to="src/img/branding/solanaFoundationLogo.svg"
              download
            >
              SVG
            </Button>
          </div>
        </div>
        <div className="min-w-[280px] w-[320px] h-[160px] flex items-center">
          <Image
            alt="Official Solana Foundation logo"
            src="/src/img/branding/solanaFoundationLogo.svg"
            width={320}
            height={160}
          />
        </div>
      </div>
    </section>
  );
};

export default BrandingAssets;
