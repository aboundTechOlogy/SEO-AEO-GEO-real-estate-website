// Blog post type and utilities
// Posts are stored as MDX files in /content/blog/
// For now, using a static array until we set up MDX pipeline

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  coverImage?: string;
  readTime: string;
  featured?: boolean;
}

// Static posts for launch — will migrate to MDX/CMS later
export const posts: BlogPost[] = [
  {
    slug: "miami-luxury-real-estate-market-2026",
    title: "Miami Luxury Real Estate: What to Expect in 2026",
    excerpt:
      "From record-breaking sales to new developments reshaping the skyline, here's what's driving Miami's luxury market this year.",
    date: "2026-02-17",
    author: "Andrew Whalen",
    category: "Market Insights",
    readTime: "5 min read",
    featured: true,
  },
  {
    slug: "brickell-new-developments-guide",
    title: "Every New Development Coming to Brickell in 2026",
    excerpt:
      "A comprehensive guide to the towers, residences, and mixed-use projects transforming Miami's financial district.",
    date: "2026-02-17",
    author: "Andrew Whalen",
    category: "New Developments",
    readTime: "8 min read",
    featured: true,
  },
  {
    slug: "buying-luxury-condo-miami-first-time",
    title: "First-Time Luxury Condo Buyer? Here's What Nobody Tells You",
    excerpt:
      "HOA reserves, developer reputation, assignment clauses — the things that actually matter when buying a $2M+ condo in Miami.",
    date: "2026-02-17",
    author: "Andrew Whalen",
    category: "Buyer Guide",
    readTime: "6 min read",
  },
];

export function getAllPosts(): BlogPost[] {
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getFeaturedPosts(): BlogPost[] {
  return posts.filter((p) => p.featured);
}

export function getPostsByCategory(category: string): BlogPost[] {
  return posts.filter((p) => p.category === category);
}
