import { useParams, Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { getPostBySlug } from "@/lib/posts";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return <Navigate to="/blog" replace />;
  }

  const post = getPostBySlug(slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <Layout>
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        <Badge className="mb-4 bg-primary text-primary-foreground">
          {post.category}
        </Badge>

        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 mb-8 text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
              {post.author[0]}
            </div>
            <span className="font-medium text-foreground">{post.author}</span>
          </div>
          <span>•</span>
          <time>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
          <span>•</span>
          <span>{post.readingTime}</span>
        </div>

        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-96 object-cover rounded-lg mb-8"
        />

        <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground prose-a:text-primary">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              a: ({ href, children, ...props }) => (
                <a
                  href={href}
                  target={href?.startsWith('http') ? '_blank' : undefined}
                  rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                  {...props}
                >
                  {children}
                </a>
              )
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default BlogPost;
