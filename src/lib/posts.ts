import { BlogPost } from "@/types/blog";

// This will be populated by the build script
export const posts: BlogPost[] = [
  {
    slug: "traveling-greece-two-weeks",
    title: "What Traveling Greece For 2 Weeks Taught Me About Life",
    date: "2021-06-21",
    author: "George Costanza",
    category: "Travel",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam mollis lectus vitae nulla malesuada amet purus sed. A condimentum tempus a egestas sodales diam cras.",
    coverImage: "https://images.unsplash.com/photo-1601581987809-a874a81309c9?w=800&h=600&fit=crop",
    tags: ["travel", "life lessons", "greece"],
    content: `# What Traveling Greece For 2 Weeks Taught Me About Life

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam mollis lectus vitae nulla malesuada amet purus sed. A condimentum tempus a egestas sodales diam cras.

## The Journey Begins

Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante.

## Lessons Learned

1. Embrace the unknown
2. Connect with locals
3. Slow down and enjoy the moment

Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.`,
    readingTime: "11 min read"
  },
  {
    slug: "never-order-chicken-nuggets",
    title: "Why You Should Never Order 12 Chicken Nuggets and Fries",
    date: "2021-08-01",
    author: "George Costanza",
    category: "Food Theory",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam mollis lectus vitae nulla malesuada amet purus sed. A condimentum tempus a egestas sodales diam cras.",
    coverImage: "https://images.unsplash.com/photo-1562967914-608f82629710?w=800&h=600&fit=crop",
    tags: ["food", "nutrition", "health"],
    content: `# Why You Should Never Order 12 Chicken Nuggets and Fries

Let me tell you why this seemingly innocent meal choice could be problematic.

## The Math Doesn't Add Up

When you order 12 nuggets and fries, you're actually getting more food than you need. Here's the breakdown...

## Better Alternatives

Consider these healthier options that still satisfy your cravings.`,
    readingTime: "7 min read"
  },
  {
    slug: "minimalist-lifestyle-guide",
    title: "The Complete Guide to Living a Minimalist Lifestyle",
    date: "2021-09-15",
    author: "George Costanza",
    category: "Lifestyle",
    excerpt: "Discover how minimalism can transform your life and bring more focus, clarity, and peace to your daily routine.",
    coverImage: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop",
    tags: ["minimalism", "lifestyle", "productivity"],
    content: `# The Complete Guide to Living a Minimalist Lifestyle

Minimalism isn't about owning nothing—it's about owning what matters.

## What is Minimalism?

At its core, minimalism is intentional living...`,
    readingTime: "9 min read"
  },
  {
    slug: "remote-work-productivity-tips",
    title: "10 Proven Tips to Stay Productive While Working Remotely",
    date: "2021-10-03",
    author: "George Costanza",
    category: "Technology",
    excerpt: "Working from home comes with its own set of challenges. Here are the strategies that actually work.",
    coverImage: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&h=600&fit=crop",
    tags: ["remote work", "productivity", "tech"],
    content: `# 10 Proven Tips to Stay Productive While Working Remotely

Remote work is here to stay. Here's how to make it work for you.`,
    readingTime: "12 min read"
  }
];

export const getPostBySlug = (slug: string): BlogPost | undefined => {
  return posts.find(post => post.slug === slug);
};

export const getPostsByCategory = (category: string): BlogPost[] => {
  return posts.filter(post => post.category.toLowerCase() === category.toLowerCase());
};

export const getAllCategories = (): string[] => {
  return Array.from(new Set(posts.map(post => post.category)));
};
