import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  VisuallyHidden,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui";
import { useTranslations } from "next-intl";
import Button from "./Button";

/**
 * Shared Modal for various Messages.
 *
 * @param show            If the modal should be visible.
 * @param handleClose     Callback for close action.
 * @param titleId         i18next id for the title.
 * @param title           Title content.
 * @param messageId       i18next id for the message if no children are given.
 * @param showCloseButton If an additional close Button should be shown.
 * @param className       Optional className for modal dialog.
 * @param hideTitle       If the modal title should be hidden.
 */
const SharedModal = ({
  size,
  show,
  handleClose,
  titleId,
  title,
  messageId,
  showCloseButton = true,
  children,
  className = "",
  hideTitle = false,
}: {
  size?: "lg" | "xl";
  show: boolean;
  handleClose: () => void;
  titleId?: string;
  title?: string;
  messageId?: string;
  showCloseButton?: boolean;
  children?: React.ReactNode;
  className?: string;
  hideTitle?: boolean;
}) => {
  const t = useTranslations();

  const sizeClass =
    size === "lg"
      ? "sm:max-w-3xl"
      : size === "xl"
        ? "sm:max-w-5xl"
        : "sm:max-w-lg";

  return (
    <Dialog open={show} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        className={`dark-modal-content ${sizeClass} max-h-[95vh] overflow-auto text-white border-[0px] ${className}`}
        showCloseButton
        closeButtonClassName="box-content w-[1.5rem] h-[1.5rem] p-[0.25rem] text-[#232323] border-0 !bg-purple-700 rounded-full [&>svg]:!size-6"
      >
        <DialogHeader className="border-b border-[#333] p-4 -ml-6 -mr-6 -mt-6 min-h-16">
          {hideTitle ? (
            <VisuallyHidden>
              <DialogTitle className="h4 text-left mb-0">
                {titleId ? t(titleId) : title}
              </DialogTitle>
            </VisuallyHidden>
          ) : (
            <DialogTitle className="py-2 h4 text-left mb-0">
              {titleId ? t(titleId) : title}
            </DialogTitle>
          )}
        </DialogHeader>
        <DialogDescription asChild>
          <div>
            {children ? children : <h4>{messageId && t(messageId)}</h4>}
          </div>
        </DialogDescription>
        {showCloseButton && (
          <DialogFooter className="border-0 pt-0">
            <Button onClick={handleClose} variant="secondary">
              {t("commands.close")}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SharedModal;
