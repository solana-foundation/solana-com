import Image, { ImageProps } from "next/image";
import { RepokitTemplate } from "@/lib/generated/repokit";
import { useRepokitTemplateImage } from "./use-repokit-template-image";

export function TemplatesUiImage({
  template,
  ...props
}: Omit<ImageProps, "alt" | "src"> & {
  template: RepokitTemplate;
}) {
  const image = useRepokitTemplateImage({ template });

  if (!image) {
    // TODO: Add fallback image
    return null;
  }
  // TODO: WAT!
  delete image.blurHeight;
  delete image.blurWidth;

  return <Image {...image} alt={`Preview of ${template.name}`} {...props} />;
}
