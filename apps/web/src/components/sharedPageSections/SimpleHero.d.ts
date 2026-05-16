import { ComponentType } from "react";

interface SimpleHeroProps {
  frontmatter: {
    title: string;
    topic?: string;
  };
}

declare const SimpleHero: ComponentType<SimpleHeroProps>;
export default SimpleHero;
