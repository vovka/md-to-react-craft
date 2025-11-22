import { Link } from "react-router-dom";
import { BlogPost } from "@/types/blog";
import { Badge } from "@/components/ui/badge";

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <article className="group">
      <Link to={`/blog/${post.slug}`}>
        <div className="overflow-hidden rounded-lg mb-4">
          <img 
            src={post.coverImage} 
            alt={post.title}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <Badge className="mb-3 bg-primary text-primary-foreground hover:bg-primary/90">
          {post.category}
        </Badge>
        <h3 className="text-2xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <time>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
          <span>•</span>
          <span>{post.readingTime}</span>
        </div>
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
            {post.author[0]}
          </div>
          <span className="text-sm text-foreground">{post.author}</span>
        </div>
      </Link>
    </article>
  );
};

export default BlogCard;
