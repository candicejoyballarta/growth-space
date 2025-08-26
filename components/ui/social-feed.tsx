"use client";

import { useState } from "react";
import PostCard, { PostCardProps } from "./post-card";

export interface ISocFeed {
  posts: PostCardProps["post"][];
}

const SocialFeed = ({ posts }: ISocFeed) => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post, idx) => (
        <PostCard
          key={idx}
          post={post}
          loading={loading}
          setLoading={setLoading}
        />
      ))}
    </div>
  );
};

export default SocialFeed;
