import { getPopularTags } from "@/actions/posts";
import React from "react";

const PopularTags = async () => {
  const popularTags = await getPopularTags();

  return (
    <div className="border p-4 rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Popular Tags</h3>
      <div className="flex flex-wrap gap-2">
        {popularTags.map((tag, i) => (
          <span
            key={i}
            className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs cursor-pointer hover:bg-green-200"
          >
            {tag.tagName}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PopularTags;
