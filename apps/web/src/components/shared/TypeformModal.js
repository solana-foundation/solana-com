import { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
import SharedModal from "./SharedModal";
import { createWidget } from "@typeform/embed";
import { useRouter } from "next/router";

const StyledTypeform = styled.div`
  width: 100%;
  .typeform {
    iframe {
      width: 100%;
      height: 35rem;
    }
    .tf-v1-widget-close {
      display: none;
    }
  }
`;

const Typeform = ({ id, onSuccess = () => {} }) => {
  const typeformRef = useRef(null);

  useEffect(() => {
    createWidget(id, {
      container: typeformRef.current,
      id,
      buttonText: "Start",
      hideScrollbars: true,
      popup: false,
      onSubmit: onSuccess,
    });
  }, [typeformRef, id, onSuccess]);

  return <div ref={typeformRef} className="typeform" />;
};

const TypeformModal = ({
  showTypeformModal,
  setShowTypeformModal,
  typeformID,
  redirectTo,
  className,
  showCloseButton,
}) => {
  const router = useRouter();
  const onSuccess = useCallback(
    (data) => {
      if (data.responseId) {
        setShowTypeformModal(false);
        redirectTo &&
          router.push({
            pathname: redirectTo,
          });
      }
    },
    [setShowTypeformModal, router, redirectTo],
  );
  return (
    <SharedModal
      show={showTypeformModal}
      handleClose={() => setShowTypeformModal(false)}
      centered
      size="xl"
      className={className}
      showCloseButton={showCloseButton}
    >
      <StyledTypeform>
        <Typeform
          id={typeformID}
          onSuccess={onSuccess}
          redirectTo={redirectTo}
        />
      </StyledTypeform>
    </SharedModal>
  );
};

export default TypeformModal;
