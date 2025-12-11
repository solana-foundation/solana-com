"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@@/src/app/components/ui/dialog";
import { Loader2 } from "lucide-react";

type EmailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  formUrl?: string;
};

const HUBSPOT_FORM_URL =
  "https://5lohw.share.hsforms.com/2eu8rKcY_RCe8GKjBX7_0mw?bd_vertical=depin";

export const EmailModal = ({ isOpen, onClose, formUrl }: EmailModalProps) => {
  const url = formUrl || HUBSPOT_FORM_URL;
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full p-0 overflow-hidden bg-white border-gray-200 rounded-xl">
        <div className="w-full max-h-[80vh] border-0 relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}
          <iframe
            src={url}
            title="Email Signup"
            className="w-full h-[600px] sm:h-[710px] border-0"
            onLoad={() => setIsLoading(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
