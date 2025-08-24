"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "./card";
import { formatDate, html } from "@/lib/helpers";
import { Heart, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface PostCardProps {
  post: {
    user: {
      name: string;
      image: string;
    };
    id: string;
    title?: string;
    likes?: number;
    liked: boolean;
    content: string;
    tags?: string[];
    timestamp: string;
  };
}

type CommentType = {
  id: string;
  content: string;
  author: {
    id?: string;
    name: string;
    image: string;
  };
  createdAt?: string;
};

const PostCard = ({ post }: PostCardProps) => {
  const [likes, setLikes] = useState(post.likes || 0);
  const [liked, setLiked] = useState(post.liked || false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [showComments, setShowComments] = useState(false);

  console.log(post);

  useEffect(() => {
    fetch(`/api/posts/${post.id}/comments`)
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch((err) => console.error("Error fetching comments:", err));
  }, [post.id]);

  // Toggle like with optimistic UI
  const toggleLike = async () => {
    // optimistic
    setLiked((prev) => !prev);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));

    try {
      const res = await fetch(`/api/posts/${post.id}/like`, { method: "POST" });
      const data = await res.json();

      if (!data.success) throw new Error("Failed to like");

      // ✅ trust server response
      setLikes(data.likesCount);
      setLiked(data.liked);
    } catch (err) {
      console.error(err);
      // rollback
      setLiked((prev) => !prev);
      setLikes((prev) => (liked ? prev + 1 : prev - 1));
    }
  };

  // Submit comment with optimistic update
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const optimisticComment: CommentType = {
      id: `temp-${Date.now()}`,
      content: commentInput,
      author: { name: "You", image: "/profile.jpg" },
    };

    setComments((prev) => [optimisticComment, ...prev]);
    setCommentInput("");

    const res = await fetch(`/api/posts/${post.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: optimisticComment.content }),
    });

    const data = await res.json();
    if (!data.success) {
      // rollback
      setComments((prev) => prev.filter((c) => c.id !== optimisticComment.id));
    } else {
      const newComment: CommentType = data.comment;
      setComments((prev) => [
        newComment,
        ...prev.filter((c) => c.id !== optimisticComment.id),
      ]);
    }
  };

  return (
    <Card className="shadow-sm rounded-lg gap-2 border border-gray-200 hover:shadow-md transition-shadow">
      {/* Header */}
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <Image
          width={40}
          height={40}
          src={post.user.image}
          alt={post.user.name}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div>
          <p className="font-medium leading-tight">{post.user.name}</p>
          <p className="text-xs text-muted-foreground">
            {formatDate(post.timestamp)}
          </p>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="space-y-3">
        {post.title && (
          <h3 className="text-base font-semibold">{post.title}</h3>
        )}

        <div className="text-sm text-foreground whitespace-pre-wrap">
          {html(post.content)}
        </div>

        {post.tags && post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Engagement */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <button
            onClick={toggleLike}
            className={`flex items-center gap-1 text-sm transition ${
              liked ? "text-red-500" : "text-gray-500 hover:text-red-500"
            }`}
          >
            <Heart
              className={`h-4 w-4 ${liked ? "fill-red-500" : "stroke-current"}`}
            />
            {likes}
          </button>

          <button
            onClick={() => setShowComments((prev) => !prev)}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-green-600 transition"
          >
            <MessageCircle className="h-4 w-4" /> {comments.length}
          </button>
        </div>

        {/* Comment Section */}
        {showComments && (
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
            <div className="space-y-2">
              {comments.length > 0 ? (
                comments.map((c) => (
                  <div key={c.id} className="flex gap-2 items-start">
                    <Image
                      src={c.author.image || "/profile.jpg"}
                      alt={c.author.name}
                      width={24}
                      height={24}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <p className="text-sm">
                      <span className="font-medium">{c.author.name}</span>{" "}
                      {c.content}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400">No comments yet.</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PostCard;
