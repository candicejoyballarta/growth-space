import Image from "next/image";
import React from "react";
import { Card, CardContent, CardHeader } from "./card";
import { formatDate, html } from "@/lib/helpers";

export interface PostCardProps {
  post: {
    user: {
      name: string;
      image: string;
    };
    title?: string;
    likes?: number;
    comments?: number;
    content: string;
    tags?: string[];
    timestamp: string;
  };
}

const PostCard = ({ post }: PostCardProps) => {
  return (
    <Card className="shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
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
        {/* Optional Title */}
        {post.title && (
          <h3 className="text-base font-semibold">{post.title}</h3>
        )}

        {/* Main Text */}
        <div className="text-sm text-foreground whitespace-pre-wrap">
          {html(post.content)}
        </div>

        {/* Tags */}
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

        {/* Engagement Row */}
        <div className="flex justify-between pt-2 text-xs text-gray-500 border-t border-gray-100">
          <span>👍 {post.likes}</span>
          <span>💬 {post.comments}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
