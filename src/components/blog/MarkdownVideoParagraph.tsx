import { type HTMLAttributes, type ReactNode } from "react";
import VideoEmbed from "./VideoEmbed";
import { getTextContent, isVideoUrl } from "./videoLinks";

type MarkdownVideoParagraphProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
  node?: unknown;
};

const MarkdownVideoParagraph = ({
  children,
  node: _node,
  ...props
}: MarkdownVideoParagraphProps) => {
  const text = getTextContent(children).trim();

  if (isVideoUrl(text)) {
    return <VideoEmbed href={text} />;
  }

  return <p {...props}>{children}</p>;
};

export default MarkdownVideoParagraph;
