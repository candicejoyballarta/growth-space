"use client";

import { useState } from "react";
import { html } from "@/lib/helpers";

interface PostContentProps {
  content: string;
  maxLength?: number;
}

const PostContent = ({ content, maxLength = 200 }: PostContentProps) => {
  const [expanded, setExpanded] = useState(false);

  const plainText = content.replace(/<[^>]+>/g, "");
  const isLong = plainText.length > maxLength;

  const displayContent = expanded
    ? content
    : plainText.slice(0, maxLength) + (isLong ? "..." : "");

  return (
    <div className="text-sm text-foreground whitespace-pre-wrap">
      {html(displayContent)}
      {isLong && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="ml-2 text-green-600 hover:underline text-xs"
        >
          See more
        </button>
      )}
      {expanded && (
        <button
          onClick={() => setExpanded(false)}
          className="ml-2 text-green-600 hover:underline text-xs"
        >
          See less
        </button>
      )}
    </div>
  );
};

export default PostContent;
