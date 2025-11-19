"use client";

import { useMouseFollower } from "./hooks/useMouseFollower";
import FooterMouseEffectSvg from "./assets/footer-mouse-effect.inline.svg";

interface FooterMouseEffectProps {
  className?: string;
  children: React.ReactNode;
}

export const FooterMouseEffect: React.FC<FooterMouseEffectProps> = ({
  className,
  children,
}) => {
  const { ref, imageRef } = useMouseFollower<HTMLDivElement, HTMLDivElement>({
    offsetX: 0,
    offsetY: 0,
  });

  return (
    <div className={className} ref={ref}>
      <div
        className="mix-blend-overlay"
        ref={imageRef}
        style={{ visibility: "hidden", opacity: 0 }}
      >
        <FooterMouseEffectSvg className="absolute top-0 left-0 translate-x-[-50%] translate-y-[-50%] w-[370px] h-[290px] max-w-none object-contain blur-[32px]" />
      </div>
      {children}
    </div>
  );
};
