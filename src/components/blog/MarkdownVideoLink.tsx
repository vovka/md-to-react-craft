import { type AnchorHTMLAttributes, type ReactNode } from "react";
import VideoEmbed from "./VideoEmbed";
import { getTextContent, isExternalUrl, isVideoUrl } from "./videoLinks";

type MarkdownVideoLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children?: ReactNode;
  href?: string;
  node?: unknown;
};

const MarkdownVideoLink = ({ href = "", children, node: _node, ...props }: MarkdownVideoLinkProps) => {
  const linkText = getTextContent(children);
  const presentsUrl = linkText.trim() === href.trim();

  if (presentsUrl && isVideoUrl(href)) {
    return <VideoEmbed href={href} />;
  }

  return (
    <a
      href={href}
      target={isExternalUrl(href) ? "_blank" : undefined}
      rel={isExternalUrl(href) ? "noopener noreferrer" : undefined}
      {...props}
    >
      {children}
    </a>
  );
};

export default MarkdownVideoLink;
