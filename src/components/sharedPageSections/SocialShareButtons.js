import { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";
import { config } from "src/config";
import {
  TwitterShareButton,
  XIcon,
  FacebookShareButton,
  FacebookIcon,
  TelegramShareButton,
  TelegramIcon,
} from "react-share";
import CopyLinkIcon from "../../../public/src/img/icons/copyLink.inline.svg";

const StyledSection = styled.section`
  .shared-icons {
    display: flex;
    align-items: center;
    column-gap: 0.8em;

    & > button {
      svg {
        circle {
          fill: #c4c4c4;
        }
        path {
          fill: #222;
        }
      }
    }
  }
`;

const StyledCopied = styled.button`
  cursor: pointer;
  background-color: transparent;
  border: none;
  padding: 0;

  .copied {
    font-size: 1rem;
    color: #42ba96;
  }
`;

const SocialShareButtons = ({ url, title, className = "" }) => {
  const { t } = useTranslation();

  const [copied, setCopied] = useState(false);
  const [timer, setTimer] = useState(null);

  const { social } = config;
  const copyLink = async (u) => {
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
    <StyledSection className={className}>
      <div className="shared-icons">
        <TwitterShareButton url={url} title={title} via={social.twitter.name}>
          <XIcon size={32} round />
        </TwitterShareButton>
        <FacebookShareButton url={url}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <TelegramShareButton url={url} title={title}>
          <TelegramIcon size={32} round />
        </TelegramShareButton>
        <StyledCopied type="button" onClick={() => copyLink(url)}>
          {copied ? (
            <span className="copied">{t("commands.copied")}</span>
          ) : (
            <CopyLinkIcon />
          )}
        </StyledCopied>
      </div>
    </StyledSection>
  );
};

export default SocialShareButtons;
