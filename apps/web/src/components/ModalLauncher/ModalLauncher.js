import {
  useEffect,
  useState,
  useRef,
  createElement,
  useCallback,
  useMemo,
} from "react";
import { useRouter } from "next/router";
import { Modal, CloseButton } from "react-bootstrap";
import ArtistsAndCreatorsNewsletter from "../newsletter/artistsAndCreators";

const ModalLauncher = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [modalComponent, setModalComponent] = useState(null);
  const [modalLaunchId, setModalLaunchId] = useState("default");
  const modalActionCompleted = useRef(false);

  const modalMapping = useMemo(
    () => ({
      artistAndCreatorsNewsletter: ArtistsAndCreatorsNewsletter,
    }),
    [],
  );

  const modalCloseHandler = useCallback(() => {
    // if the modal action is not complete, track bounce
    if (!modalActionCompleted.current && typeof window.gtag !== "undefined") {
      window.gtag("event", "modal_bounce", {
        event_category: "engagement",
        event_action: "Closed Without Submission",
        event_label: modalLaunchId,
      });
    }

    // Update the URL
    const currentPath = router.pathname;
    const currentQuery = { ...router.query };
    delete currentQuery.modalLaunch;
    delete currentQuery.modalLaunchId;
    router.push(
      {
        pathname: currentPath,
        query: currentQuery,
      },
      undefined,
      { shallow: true },
    );
  }, [modalLaunchId, router]);

  useEffect(() => {
    const { modalLaunch, modalLaunchId } = router.query;

    if (
      modalLaunch === "true" &&
      modalLaunchId &&
      modalMapping[modalLaunchId]
    ) {
      setModalComponent(
        createElement(modalMapping[router.query.modalLaunchId], {
          modalCloseHandler,
          modalActionCompleted,
        }),
      );
      setShowModal(true);
      setModalLaunchId(modalLaunchId);

      // track modal launch
      if (typeof window.gtag !== "undefined") {
        window.gtag("event", "modal_launch", {
          event_category: "engagement",
          event_action: "Opened",
          event_label: modalLaunchId,
        });
      }
    } else {
      setShowModal(false);
      setModalComponent(null);
    }
  }, [router.query, modalCloseHandler, modalMapping]);

  return (
    <Modal
      show={showModal}
      onHide={modalCloseHandler}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName=""
      className={`modal-${modalLaunchId}`}
      centered
    >
      <Modal.Header className={`rounded-top border-0 `} data-bs-theme="dark">
        <CloseButton
          className={`btn-close btn-close-white`}
          onClick={modalCloseHandler}
        />
      </Modal.Header>
      <Modal.Body className={`rounded-bottom`}>{modalComponent}</Modal.Body>
    </Modal>
  );
};

export default ModalLauncher;
