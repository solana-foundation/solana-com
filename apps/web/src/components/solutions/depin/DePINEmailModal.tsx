"use client";

import { Dialog, DialogContent } from "@@/src/app/components/ui/dialog";

type EmailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  formUrl?: string;
};

const HUBSPOT_FORM_URL =
  "https://5lohw.share.hsforms.com/2eu8rKcY_RCe8GKjBX7_0mw?bd_vertical=depin";

export const EmailModal = ({ isOpen, onClose, formUrl }: EmailModalProps) => {
  const url = formUrl || HUBSPOT_FORM_URL;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full p-0 overflow-hidden">
        <div className="w-full max-h-[85vh] border-0">
          <iframe
            src={url}
            title="Email Signup"
            className="w-full h-[600px] sm:h-[710px] border-0"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
