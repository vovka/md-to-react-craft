import ReactMarkdown from "react-markdown";
import { markdownRemarkPlugins, markdownRehypePlugins, markdownComponents } from "./markdownConfig";

interface DialoguePairProps {
  primary: string;
  opponent: string;
  showOpponent: boolean;
}

const DialoguePair = ({ primary, opponent, showOpponent }: DialoguePairProps) => {
  return (
    <div className={`grid gap-10 items-end mb-8 ${showOpponent ? "md:grid-cols-2" : "max-w-3xl mx-auto"}`}>
      <div className="min-w-0">
        <ReactMarkdown
          remarkPlugins={markdownRemarkPlugins}
          rehypePlugins={markdownRehypePlugins}
          components={markdownComponents}
        >
          {primary}
        </ReactMarkdown>
      </div>

      {showOpponent && (
        <div className="min-w-0 rounded-lg border-l-4 border-primary bg-muted p-6">
          <ReactMarkdown
            remarkPlugins={markdownRemarkPlugins}
            rehypePlugins={markdownRehypePlugins}
            components={markdownComponents}
          >
            {opponent}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default DialoguePair;
