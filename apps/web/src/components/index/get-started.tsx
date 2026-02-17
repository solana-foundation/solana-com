import { Dialog, DialogContent } from "@/app/components/ui/dialog";
import { cn } from "@/app/components/utils";
import SolanaMono from "@@/public/src/img/icons/SolanaMono.inline.svg";
import { useEffect, useState } from "react";
import ArrowUpRight from "@@/public/src/img/icons/ArrowUpRight.inline.svg";

export interface GetStartedProps {
  title?: string;
  tabs?: {
    id: string;
    title: string;
    Icon?: React.ComponentType<{
      className?: string;
      "aria-hidden"?: boolean | "true" | "false";
    }>;
  }[];
  links?: Record<
    string,
    {
      title: string;
      href: string;
    }[]
  >;
  onClose?: () => void;
  open?: boolean;
}

export const GetStarted: React.FC<GetStartedProps> = (props) => {
  const { title, tabs, links, onClose, open } = props;
  const [activeTab, setActiveTab] = useState<string | null>(
    tabs[0]?.id ?? null,
  );
  useEffect(() => {
    setActiveTab((state) => state ?? tabs[0]?.id ?? null);
  }, [tabs]);
  const activeLinks = activeTab ? links?.[activeTab] : undefined;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        overlayClassName="bg-nd-inverse/90 backdrop-blur-[20px]"
        className="max-w-7xl p-0 w-full overflow-hidden bg-transparent border-0 max-md:top-auto max-md:bottom-0 max-md:translate-y-0"
        closeClassName="w-8 md:w-14 h-8 md:h-14 top-4 md:top-12 right-4 md:right-12 [&>svg]:size-4 md:[&>svg]:size-6 !bg-nd-border-light hover:!bg-nd-border-prominent hover:!text-nd-cta rounded-full"
      >
        <div className="p-twd-4 md:p-twd-12 ">
          <h2 className="nd-heading-l flex items-center">
            <SolanaMono className="size-7 md:size-14 mr-twd-2.5 md:mr-twd-6 mt-[-4px]" />
            {title}
          </h2>
          <div className="grid grid-cols-3 gap-twd-1 mt-twd-6 md:mt-twd-10 relative">
            {tabs?.map((item) => (
              <button
                key={item.id}
                className={cn(
                  "flex flex-col items-start gap-twd-3 md:gap-twd-10 p-twd-3 md:p-twd-6 rounded-xl bg-nd-border-light hover:bg-nd-border-prominent text-nd-mid-em-text-alpha hover:text-nd-cta backdrop-blur-[8px]",
                  activeTab === item.id && "!bg-nd-primary !text-nd-inverse",
                )}
                onClick={() => setActiveTab(item.id)}
              >
                <div className="shrink-0 grow-0">
                  {item.Icon && (
                    <item.Icon className="block w-5 h-5 md:w-8 md:h-8" />
                  )}
                </div>
                <h4 className="font-medium nd-body-l md:text-[28px]">
                  {item.title}
                </h4>
              </button>
            ))}
          </div>
          <div className="overflow-hidden mt-twd-3 md:mt-twd-8">
            {activeLinks?.map((item, index) => (
              <a
                key={index}
                className="group flex flex-row gap-twd-3 md:gap-twd-4 py-twd-3 md:p-twd-5 w-full text-nd-mid-em-text-alpha hover:text-nd-cta hover:border-nd-border-hovered border-b last:border-b-0 border-nd-border-light"
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="shrink-0 grow-0 flex items-start justify-center">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center bg-nd-border-light group-hover:bg-nd-cta">
                    <span className="nd-body-s text-nd-mid-em-text pt-[1px] group-hover:text-nd-inverse">
                      {index + 1}
                    </span>
                  </div>
                </div>
                <div className="w-auto grow flex items-center justify-start min-w-0">
                  <div className="max-w-full nd-body-l leading-[1.5]">
                    {item.title}
                  </div>
                </div>
                <ArrowUpRight className="size-4 md:size-5 opacity-[0.64] text-nd-cta self-center" />
              </a>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
