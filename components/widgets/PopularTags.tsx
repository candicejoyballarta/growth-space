import Link from "next/link";
import React from "react";

const PopularTags = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/tags/popular`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return <div>Failed to load tags</div>;
  }

  const popularTags = await res.json();

  return (
    <div className="border p-4 rounded-lg bg-white bg-gradient-to-br dark:from-gray-800 dark:to-gray-900">
      <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
        Popular Tags
      </h3>
      <div className="flex flex-wrap gap-2">
        {popularTags.map((tag: { tag: string; count: number }, i: number) => (
          <Link href={`/tags/${tag.tag}`} key={i}>
            <div
              className="flex items-center gap-2 px-3 py-1 rounded-full text-xs cursor-pointer transition-colors
                            bg-green-100 text-green-700 hover:bg-green-200
                            dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800"
            >
              <span className="font-medium">#{tag.tag}</span>
              <span
                className="px-2 py-0.5 rounded-full text-[10px]
                               bg-green-200 text-green-800
                               dark:bg-green-800 dark:text-green-200"
              >
                {tag.count}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PopularTags;
