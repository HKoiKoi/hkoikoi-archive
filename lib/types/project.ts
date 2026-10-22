export interface ProjectLinks {
  repository?: string;
  demo?: string;
}

export interface ProjectCard {
  slug: string;
  title: string;
  summary: string;
  period?: string;
  techStack: string[];
  isFeatured: boolean;
}

export interface ProjectDetail extends ProjectCard {
  role?: string;
  links: ProjectLinks;
  contentMdx: string;
}
