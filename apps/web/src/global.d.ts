declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}

declare module "*.scss" {
  const content: Record<string, string>;
  export default content;
}

interface Window {
  gtag?: (command: string, ...args: unknown[]) => void;
  builderNoTrack?: boolean;
}

declare let builderNoTrack: boolean | undefined;
