"use client";

import {
  useEffect,
  useState,
  useRef,
  createElement,
  useCallback,
  useMemo,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Dialog, DialogContent } from "@workspace/ui";
import ArtistsAndCreatorsNewsletter from "../newsletter/artistsAndCreators";

const ModalLauncher = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);
  const [modalComponent, setModalComponent] = useState(null);
  const [modalLaunchId, setModalLaunchId] = useState("default");
  const modalActionCompleted = useRef(false);
  const modalLaunchParam = searchParams.get("modalLaunch");
  const modalLaunchIdParam = searchParams.get("modalLaunchId");

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
    const currentPath = pathname;
    const currentQuery = {};
    for (const [key, value] of searchParams.entries()) {
      if (key !== "modalLaunch" && key !== "modalLaunchId") {
        currentQuery[key] = value;
      }
    }
    const search = new URLSearchParams(currentQuery).toString();
    router.push(`${currentPath}${search ? "?" + search : ""}`);
  }, [modalLaunchId, router, pathname, searchParams]);

  useEffect(() => {
    if (
      modalLaunchParam === "true" &&
      modalLaunchIdParam &&
      modalMapping[modalLaunchIdParam]
    ) {
      setModalComponent(
        createElement(modalMapping[modalLaunchIdParam], {
          modalCloseHandler,
          modalActionCompleted,
        }),
      );
      setShowModal(true);
      setModalLaunchId(modalLaunchIdParam);

      // track modal launch
      if (typeof window.gtag !== "undefined") {
        window.gtag("event", "modal_launch", {
          event_category: "engagement",
          event_action: "Opened",
          event_label: modalLaunchIdParam,
        });
      }
    } else {
      setShowModal(false);
      setModalComponent(null);
    }
  }, [modalLaunchIdParam, modalCloseHandler, modalMapping, modalLaunchParam]);

  return (
    <Dialog
      open={showModal}
      onOpenChange={(open) => !open && modalCloseHandler()}
    >
      <DialogContent
        className={`modal-${modalLaunchId} !p-0 max-h-[95vh] md:max-w-3xl overflow-auto rounded-md border-0 bg-black bg-[url('/src/img/landings/assets_2Fce0c7323a97a4d91bd0baa7490ec9139_2Ff1d4c0384bf94fd4bd51807305310e9e.png')] bg-center bg-cover bg-no-repeat`}
        data-bs-theme="dark"
        showCloseButton={true}
      >
        {modalComponent}
      </DialogContent>
    </Dialog>
  );
};

export default ModalLauncher;
