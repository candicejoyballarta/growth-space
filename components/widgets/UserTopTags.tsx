import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";

interface IUserTopTags {
  userId?: string;
}

interface Tag {
  tag: string;
  count: number;
}

const UserTopTags = async ({ userId }: IUserTopTags) => {
  const res = await fetch(
    userId
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userId}/tags`
      : `${process.env.NEXT_PUBLIC_BASE_URL}/api/tags/popular`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return <div>Failed to load tags</div>;
  }

  const topUsedTags: Tag[] = await res.json();

  return (
    <Card className="shadow-md rounded-2xl border border-gray-200 bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 dark:border-gray-700">
      <CardHeader>
        <CardTitle>Top Tags</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {topUsedTags.length > 0 ? (
          topUsedTags.map((t, i) => (
            <Link href={`/tags/${t.tag}`} key={i}>
              <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs cursor-pointer hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800 transition-colors">
                <span className="font-medium">#{t.tag}</span>
                <span className="bg-green-200 text-green-800 px-2 py-0.5 rounded-full text-[10px]">
                  {t.count}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-sm text-gray-500">
            No top tags yet… but don’t worry, greatness is just around the
            corner! 🌟
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default UserTopTags;
