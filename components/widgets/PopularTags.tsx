import Link from "next/link";
import React from "react";

const PopularTags = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/tags/popular`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return <div>Failed to load tags</div>;
  }

  const popularTags = await res.json();

  return (
    <div className="border p-4 rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Popular Tags</h3>
      <div className="flex flex-wrap gap-2">
        {popularTags.map((tag: { _id: string; count: number }, i: number) => (
          <Link href={`/tags/${tag._id}`} key={i}>
            <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs cursor-pointer hover:bg-green-200">
              <span className="font-medium">#{tag._id}</span>
              <span className="bg-green-200 text-green-800 px-2 py-0.5 rounded-full text-[10px]">
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
