"use client";

import Image from "next/image";
import Link from "next/link";
import { formatDate, html } from "@/lib/helpers";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Heart, MessageCircle } from "lucide-react"; // icons

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const HighlightPost = () => {
  const { data, error, isLoading } = useSWR("/api/posts/highlight", fetcher);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Insight of the Day</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-500 italic">
          Loading popular post...
        </CardContent>
      </Card>
    );
  }

  if (error || data.message) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Insight of the Day</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-500 italic">
          Couldn’t fetch highlight post.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow gap-3">
      {/* Header */}
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <Image
          width={40}
          height={40}
          src={data.user.image}
          alt={data.user.name}
          className="h-9 w-9 rounded-full object-cover"
        />
        <div>
          <p className="font-medium leading-tight">{data.user.name}</p>
          <p className="text-xs text-muted-foreground">
            {formatDate(data.createdAt)}
          </p>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="space-y-2">
        {data.title && (
          <h3 className="text-base font-semibold">{data.title}</h3>
        )}

        <div className="text-sm text-gray-700 line-clamp-3">
          {html(data.content)}
        </div>

        <Link
          href={`/posts/${data.id}`}
          className="block text-xs text-blue-600 hover:underline mt-2"
        >
          Read more →
        </Link>

        {/* Likes & Comments */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mt-3">
          <span className="flex items-center gap-1">
            <Heart className="h-4 w-4 text-red-500" /> {data.likesCount}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4 text-gray-500" />{" "}
            {data.commentsCount}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default HighlightPost;
