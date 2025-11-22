import { useState, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import BlogList from "@/components/blog/BlogList";
import SearchBar from "@/components/blog/SearchBar";
import { posts } from "@/lib/posts";

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    
    const query = searchQuery.toLowerCase();
    return posts.filter(
      post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold text-center mb-8">Blog</h1>
        
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        {filteredPosts.length > 0 ? (
          <BlogList posts={filteredPosts} />
        ) : (
          <div className="text-center text-muted-foreground py-12">
            No articles found matching your search.
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Blog;
