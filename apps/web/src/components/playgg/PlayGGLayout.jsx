import { createContext, useState } from "react";
import styled from "styled-components";
import TypeformModal from "../shared/TypeformModal";
import Footer from "../Footer";
import styles from "./PlayGGLayout.module.scss";

export const ModalContext = createContext({});

const LayoutWrapper = styled.div`
  --color-playgg-black: #111;
  --color-playgg-white: #fff;
  --color-playgg-purple: #9945ff;
  --color-playgg-green: #14f195;
`;

const PlayGGLayout = ({ children }) => {
  const [showTypeformModal, setShowTypeformModal] = useState(false);

  return (
    <LayoutWrapper>
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
    </LayoutWrapper>
  );
};

export default PlayGGLayout;
