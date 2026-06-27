const VideoEmbed = ({ href }: { href: string }) => (
  <video src={href} controls preload="metadata" playsInline className="blog-post-video">
    <a href={href}>Open video</a>
  </video>
);

export default VideoEmbed;
