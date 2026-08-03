import { useState } from "react";
import { useTranslations } from "next-intl";
import { config } from "src/config";
import {
  TwitterShareButton,
  XIcon,
  FacebookShareButton,
  FacebookIcon,
  TelegramShareButton,
  TelegramIcon,
} from "react-share";
import { Link as LinkIcon } from "@boxicons/react/Link";

const SocialShareButtons = ({
  url,
  title,
  className = "",
}: {
  url: string;
  title?: string;
  className?: string;
}) => {
  const t = useTranslations();

  const [copied, setCopied] = useState(false);
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const { social } = config;
  const copyLink = async (u: string) => {
    if (timer) {
      clearTimeout(timer);
    }

    if (!navigator.clipboard) {
      return;
    }
    try {
      await navigator.clipboard.writeText(u);
    } catch (error) {
      console.error(error);
    }

    setCopied(true);
    setTimer(setTimeout(() => setCopied(false), 2000));
  };

  return (
    <section className={className}>
      <div className="flex items-center gap-x-[0.8em] [&>button_svg_circle]:fill-[#c4c4c4] [&>button_svg_path]:fill-[#222]">
        <TwitterShareButton url={url} title={title} via={social.twitter.name}>
          <XIcon size={32} round />
        </TwitterShareButton>
        <FacebookShareButton url={url}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <TelegramShareButton url={url} title={title}>
          <TelegramIcon size={32} round />
        </TelegramShareButton>
        <button
          type="button"
          onClick={() => copyLink(url)}
          className="flex size-8 cursor-pointer items-center justify-center rounded-full border-none bg-[#c4c4c4] p-0 text-[#222]"
        >
          {copied ? (
            <span className="text-base text-[#42ba96]">
              {t("commands.copied")}
            </span>
          ) : (
            <LinkIcon width={20} height={20} aria-hidden="true" />
          )}
        </button>
      </div>
    </section>
  );
};

export default SocialShareButtons;
