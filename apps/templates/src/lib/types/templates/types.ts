export interface TemplateSource {
  id: string;
  name: string;
  source: string;
  owner: string;
  provider: string;
  repo: string;
}

export interface Template {
  description: string;
  displayName?: string;
  id: string;
  image?: string;
  keywords: string[];
  name: string;
  path: string;
  readme: string;
  repoUrl: string;
  source: TemplateSource;
  usecase?: string;
}

export type TemplateFilter = {
  id: string;
  name: string;
  keywords: {
    id: string;
    name: string;
  }[];
};
