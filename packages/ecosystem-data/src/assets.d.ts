declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: { src: string };
  export default content;
}

declare module "*.jpg" {
  const content: { src: string };
  export default content;
}

declare module "*.jpeg" {
  const content: { src: string };
  export default content;
}

declare module "*.webp" {
  const content: { src: string };
  export default content;
}
