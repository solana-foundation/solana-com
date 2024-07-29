import classNames from "classnames";
import Image from "next/image";
import { useState } from "react";
import VideoModal from "../shared/VideoModal";
import { Trans, useTranslation } from "next-i18next";
import Button from "../shared/Button";

import demoPreviewImg from "../../../assets/ai/demo-preview.png";
import ChatGpt from "../../../assets/ai/chatgpt.inline.svg";

import styles from "./AiChatGPT.module.scss";

export default function AiChatGPT() {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const { t } = useTranslation();

  return (
    <section className="pt-10 my-10 overflow-hidden">
      <div className="container position-relative">
        <div className={styles["chatgpt__light"]}></div>
        <h2 className={styles["chatgpt__title"]}>
          <span className="d-none d-md-flex align-items-center">
            <Trans
              i18nKey="ai.chatgpt.title"
              components={{
                chatgpt: <ChatGpt className={styles["chatgpt__title--icon"]} />,
              }}
            />
          </span>
          <span className="d-flex flex-column align-items-center d-md-none">
            <Trans
              i18nKey="ai.chatgpt.title-mobile"
              components={{
                chatgpt: <ChatGpt className={styles["chatgpt__title--icon"]} />,
              }}
            />
          </span>
        </h2>
        <div className="d-flex flex-column flex-lg-row">
          <div
            className={classNames(
              styles["chatgpt__plugin--video"],
              "position-relative w-lg-50",
            )}
          >
            <button
              className="p-0 m-0 border-0"
              onClick={() => setShowVideoModal(true)}
            >
              <Image
                src={demoPreviewImg}
                fill
                style={{ objectFit: "contain" }}
                alt=""
              />
            </button>
          </div>
          <div className="d-flex flex-column w-lg-50 justify-content-center">
            <h3 className={styles["chatgpt__plugin--title"]}>
              {t("ai.chatgpt.plugin.title")}
            </h3>
            <p className={styles["chatgpt__plugin--content"]}>
              {t("ai.chatgpt.plugin.content")}
            </p>
            <Button to="https://github.com/solana-labs/chatgpt-plugin" newTab>
              {t("ai.chatgpt.plugin.cta")}
            </Button>
          </div>
        </div>
      </div>
      <VideoModal
        type="vimeo"
        showVideoModal={showVideoModal}
        setShowVideoModal={setShowVideoModal}
        urlId="827562071"
      />
    </section>
  );
}
