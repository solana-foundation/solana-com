"use client";

import { Dialog, DialogContent } from "@/app/components/ui/dialog";

const HUBSPOT_FORM_URL =
  "https://5lohw.share.hsforms.com/2eu8rKcY_RCe8GKjBX7_0mw?bd_vertical=depin";

export const DePinEmailModal = ({
  _open,
  onOpenChange,
}: {
  _open: boolean;
  onOpenChange: (_open: boolean) => void;
}) => {
  return (
    <Dialog open={_open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full p-0 overflow-hidden">
        <div className="w-full max-h-[85vh] border-0">
          <iframe
            src={HUBSPOT_FORM_URL}
            title="DePin Email Signup"
            className="w-full h-[600px] sm:h-[710px] border-0"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
