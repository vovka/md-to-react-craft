import ReactMarkdown from "react-markdown";
import { splitDialogueBlocks } from "@/lib/splitDialogueBlocks";
import { markdownRemarkPlugins, markdownRehypePlugins, markdownComponents } from "./markdownConfig";
import DialoguePair from "./DialoguePair";

interface DialogueContentProps {
  content: string;
  showOpponent: boolean;
}

const DialogueContent = ({ content, showOpponent }: DialogueContentProps) => {
  const segments = splitDialogueBlocks(content);

  return (
    <>
      {segments.map((segment, index) =>
        segment.type === "dialogue" ? (
          <DialoguePair
            key={index}
            primary={segment.primary}
            opponent={segment.opponent}
            showOpponent={showOpponent}
          />
        ) : (
          <ReactMarkdown
            key={index}
            remarkPlugins={markdownRemarkPlugins}
            rehypePlugins={markdownRehypePlugins}
            components={markdownComponents}
          >
            {segment.content}
          </ReactMarkdown>
        ),
      )}
    </>
  );
};

export default DialogueContent;
