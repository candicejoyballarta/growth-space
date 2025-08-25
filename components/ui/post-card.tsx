"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "./card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { formatDate, html } from "@/lib/helpers";
import { Ellipsis, Heart, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import CommentsSection, { CommentType } from "./comments";

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
    comments?: CommentType[];
  };
}

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useAuth();
  const loggedInUserId = user?.id;
  const [likes, setLikes] = useState(post.likes || 0);
  const [liked, setLiked] = useState(post.liked || false);

  const [showComments, setShowComments] = useState(false);

  const toggleLike = async () => {
    setLiked((prev) => !prev);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));

    try {
      const res = await fetch(`/api/posts/${post.id}/like`, { method: "POST" });
      const data = await res.json();

      if (!data.success) throw new Error("Failed to like");

      setLikes(data.likesCount);
      setLiked(data.liked);
    } catch (err) {
      console.error(err);
      // rollback
      setLiked((prev) => !prev);
      setLikes((prev) => (liked ? prev + 1 : prev - 1));
    }
  };

  return (
    <Card className="shadow-sm rounded-lg gap-2 border border-gray-200 hover:shadow-md transition-shadow">
      {/* Header */}
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <Image
          width={50}
          height={50}
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
            <MessageCircle className="h-4 w-4" /> {post.comments?.length}
          </button>
        </div>

        {/* Comment Section */}
        {showComments && (
          <CommentsSection
            postId={post.id}
            postComments={post.comments || []}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PostCard;
