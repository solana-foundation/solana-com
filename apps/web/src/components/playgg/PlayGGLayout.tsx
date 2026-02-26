import { createContext, useState } from "react";
import TypeformModal from "../shared/TypeformModal";
import { Footer } from "@solana-com/ui-chrome";
import styles from "./PlayGGLayout.module.scss";

export const ModalContext = createContext({});

const PlayGGLayout = ({ children }: { children?: React.ReactNode }) => {
  const [showTypeformModal, setShowTypeformModal] = useState(false);

  return (
    <div
      style={
        {
          "--color-playgg-black": "#111",
          "--color-playgg-white": "#fff",
          "--color-playgg-purple": "#9945ff",
          "--color-playgg-green": "#14f195",
        } as React.CSSProperties
      }
    >
      <div className={styles["playgg-layout"]}>
        <ModalContext.Provider
          value={{
            showTypeformModal,
            setShowTypeformModal,
          }}
        >
          <main>{children}</main>

          <TypeformModal
            showTypeformModal={showTypeformModal}
            setShowTypeformModal={setShowTypeformModal}
            typeformID=""
            className={styles["playgg-layout__modal"]}
            showCloseButton={false}
          />
        </ModalContext.Provider>
      </div>
      <Footer />
      <style global jsx>{`
        body {
          background: var(--color-playgg-white);
          color: var(--color-playgg-black);
        }
      `}</style>
    </div>
  );
};

export default PlayGGLayout;
