import { Children, isValidElement, type ReactNode } from "react";

const GITHUB_ATTACHMENT_VIDEO_PATTERN =
  /^https:\/\/github\.com\/user-attachments\/assets\/[0-9a-f-]{36}(?:[?#].*)?$/i;
const DIRECT_VIDEO_PATTERN = /^(?:https?:\/\/|\/).+\.(mp4|webm|mov|m4v)(?:[?#].*)?$/i;

export const getTextContent = (children: ReactNode): string =>
  Children.toArray(children)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") {
        return String(child);
      }

      if (isValidElement<{ children?: ReactNode }>(child)) {
        return getTextContent(child.props.children);
      }

      return "";
    })
    .join("");

export const isExternalUrl = (url: string): boolean => /^https?:\/\//i.test(url);

export const isVideoUrl = (url: string): boolean =>
  GITHUB_ATTACHMENT_VIDEO_PATTERN.test(url) || DIRECT_VIDEO_PATTERN.test(url);
