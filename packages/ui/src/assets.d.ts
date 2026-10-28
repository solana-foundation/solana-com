declare module "*.jpg" {
  const image: import("next/image").StaticImageData;
  export default image;
}

declare module "*.webp" {
  const image: import("next/image").StaticImageData;
  export default image;
}
