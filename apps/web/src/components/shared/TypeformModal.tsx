import { useCallback, useEffect, useRef } from "react";
import SharedModal from "./SharedModal";
import { createWidget } from "@typeform/embed";
import { useRouter } from "next/navigation";

const Typeform = ({
  id,
  onSuccess = () => {},
}: {
  id: string;
  onSuccess?: (_data: { responseId?: string }) => void;
}) => {
  const typeformRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    createWidget(id, {
      container: typeformRef.current!,
      noScrollbars: true,
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
}: {
  showTypeformModal: boolean;
  setShowTypeformModal: (_show: boolean) => void;
  typeformID: string;
  redirectTo?: string;
  className?: string;
  showCloseButton?: boolean;
}) => {
  const router = useRouter();
  const onSuccess = useCallback(
    (data: { responseId?: string }) => {
      if (data.responseId) {
        setShowTypeformModal(false);
        redirectTo && router.push(redirectTo);
      }
    },
    [setShowTypeformModal, router, redirectTo],
  );
  return (
    <SharedModal
      show={showTypeformModal}
      handleClose={() => setShowTypeformModal(false)}
      // centered
      size="xl"
      className={className}
      showCloseButton={showCloseButton}
      titleId="ecdr.title"
    >
      <div className="w-full [&_.typeform_iframe]:w-full [&_.typeform_iframe]:h-[35rem] [&_.typeform_.tf-v1-widget-close]:hidden">
        <Typeform id={typeformID} onSuccess={onSuccess} />
      </div>
    </SharedModal>
  );
};

export default TypeformModal;
