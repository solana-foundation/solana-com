declare module "prismjs" {
  type PrismGrammar = Record<string, unknown>;

  const Prism: {
    highlight: (
      code: string,
      grammar: PrismGrammar,
      language: string,
    ) => string;
    languages: Record<string, PrismGrammar | undefined>;
  };

  export default Prism;
}

declare module "prismjs/components/prism-bash";
declare module "prismjs/components/prism-json";
declare module "prismjs/components/prism-jsx";
declare module "prismjs/components/prism-latex";
declare module "prismjs/components/prism-rust";
declare module "prismjs/components/prism-solidity";
declare module "prismjs/components/prism-tsx";
declare module "prismjs/components/prism-typescript";
