"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "./card";
import { formatDate } from "@/lib/helpers";
import { Heart, MessageCircle, MoreVertical } from "lucide-react";
import CommentsSection, { CommentType } from "./comments";
import PostContent from "./post-content";
import GoalEmbed from "./goal-embed";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Button } from "./button";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export interface PostCardProps {
  post: {
    user: {
      _id: string;
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
    goalId?: {
      _id: string;
      title: string;
      progress: number;
      color: string;
      emoji: string;
    } | null;
  };
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const PostCard = ({ post, loading, setLoading }: PostCardProps) => {
  const router = useRouter();
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

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Post deleted!");
        // Optionally: refresh page or remove post from UI
        router.refresh(); // if you're in an app router context
      } else {
        toast.error(data.error || "Failed to delete post");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while deleting the post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm rounded-lg gap-2 border border-gray-200 hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-3">
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
        </div>

        {/* Three dots menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="rounded-full">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/posts/${post.id}/edit`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={() => handleDelete(post.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      {/* Content */}
      <CardContent className="space-y-3">
        {post.title && (
          <h3 className="text-base font-semibold">{post.title}</h3>
        )}

        <PostContent content={post.content} />

        {post.goalId?.title && (
          <GoalEmbed goal={post.goalId} userId={post.user._id} />
        )}

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
