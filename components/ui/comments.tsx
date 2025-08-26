import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/lib/helpers";
import React, { useState } from "react";
import { Input } from "./input";
import { Button } from "./button";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Ellipsis } from "lucide-react";
import Link from "next/link";

export type CommentType = {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    image: string;
  };
  timestamp: string;
};

interface CommentsSectionProps {
  postId: string;
  postComments: CommentType[];
}

const CommentsSection = ({ postId, postComments }: CommentsSectionProps) => {
  const { user } = useAuth();
  const loggedInUserId = user?.id;
  const [comments, setComments] = useState<CommentType[]>(postComments || []);
  const [commentInput, setCommentInput] = useState("");
  const [showAll, setShowAll] = useState(false);
  const maxVisible = 3;

  const visibleComments = showAll ? comments : comments.slice(0, maxVisible);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const optimisticComment: CommentType = {
      _id: `temp-${Date.now()}`,
      content: commentInput,
      author: {
        _id: "1",
        name: user?.name || "You",
        image: user?.image || "/profile.jpg",
      },
      timestamp: formatDate(new Date()),
    };

    setComments((prev) => [optimisticComment, ...prev]);
    setCommentInput("");

    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "addComment",
          content: optimisticComment.content,
          userId: loggedInUserId,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        // rollback
        setComments((prev) =>
          prev.filter((c) => c._id !== optimisticComment._id)
        );
      } else {
        const newComment: CommentType = {
          _id: data.comment._id,
          content: data.comment.content,
          author: {
            _id: data.comment.author?._id,
            name: data.comment.author?.name || "Unknown",
            image: data.comment.author?.image || "/profile.jpg",
          },
          timestamp: data.comment.createdAt,
        };

        setComments((prev) => [
          newComment,
          ...prev.filter((c) => c._id !== optimisticComment._id),
        ]);
      }
    } catch (err) {
      console.error("Error posting comment", err);
      // rollback
      setComments((prev) =>
        prev.filter((c) => c._id !== optimisticComment._id)
      );
    }
  };

  // Inside PostCard component
  const handleCommentDelete = async (commentId: string) => {
    // Optimistically remove the comment
    const previousComments = [...comments];
    setComments((prev) => prev.filter((c) => c._id !== commentId));

    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "deleteComment",
          commentId,
          userId: loggedInUserId,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        // Rollback if deletion failed
        setComments(previousComments);
      }
    } catch (err) {
      console.error("Error deleting comment", err);
      setComments(previousComments);
    }
  };

  return (
    <div className="mt-3 space-y-3">
      <form onSubmit={handleCommentSubmit} className="flex gap-2">
        <Input
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1"
        />
        <Button type="submit" size="sm">
          Post
        </Button>
      </form>

      {/* Comments List */}
      <div className="space-y-3">
        {visibleComments.map((c, i) => (
          <div
            key={c._id || `temp-${i}`}
            className="flex gap-2 items-start relative"
          >
            <Image
              src={c.author?.image || "/profile.jpg"}
              alt={c.author?.name || "Unknown"}
              width={50}
              height={50}
              className="w-10 h-10 rounded-full object-cover"
            />

            <div className="flex-1">
              <p className="text-sm">
                <span className="font-medium">
                  {c.author?.name || "Unknown"}
                </span>{" "}
                {c.content}
              </p>
              {c.timestamp && (
                <p className="text-xs text-gray-400 mt-1">
                  {formatDate(c.timestamp)}
                </p>
              )}
            </div>

            {c.author?._id === loggedInUserId && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1 hover:bg-gray-100 rounded-full">
                    <Ellipsis className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-28">
                  <DropdownMenuItem
                    onClick={() => handleCommentDelete(c._id)}
                    className="text-sm"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        ))}

        {comments.length > maxVisible && (
          <button
            className="text-xs text-green-600 hover:underline"
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll
              ? "Show Less"
              : `Show ${comments.length - maxVisible} More`}
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
