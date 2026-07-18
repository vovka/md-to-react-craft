export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  category: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
  content: string;
  readingTime: string;
  layout?: "default" | "dialogue";
  primaryAuthor?: string;
  opponentAuthor?: string;
}

export interface BlogFrontmatter {
  title: string;
  date: string;
  author: string;
  category: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
}
