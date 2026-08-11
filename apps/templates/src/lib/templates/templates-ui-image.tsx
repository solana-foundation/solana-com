import Image, { ImageProps } from "next/image";
import { Template } from "../types/templates";
import { GITHUB_RAW_BASE } from "../config/github";

export function TemplatesUiImage({
  template,
  ...props
}: Omit<ImageProps, "alt" | "src"> & {
  template: Template;
}) {
  // Use the og-image.png from the template's image field
  const imageSrc = template.image
    ? `${GITHUB_RAW_BASE}/${template.image}`
    : null;
  const { className, ...imageProps } = props;

  if (!imageSrc) {
    // Fallback placeholder
    return (
      <div
        className={`flex aspect-[1200/630] w-full items-center justify-center bg-white/[0.02] ${className ?? ""}`}
      >
        <span className="font-brand-mono text-[11px] leading-[1.42] font-bold uppercase tracking-wide text-nd-mid-em-text/60">
          No preview available
        </span>
      </div>
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={`Preview of ${template.displayName || template.name}`}
      width={1200}
      height={630}
      className={className ?? "h-auto w-full"}
      {...imageProps}
    />
  );
}
