import PostCard, { PostCardProps } from "./post-card";

export interface ISocFeed {
  posts: PostCardProps["post"][];
}

const SocialFeed = ({ posts }: ISocFeed) => {
  return (
    <div className="flex flex-col gap-4">
      {posts.map((post, idx) => (
        <PostCard key={idx} post={post} />
      ))}
    </div>
  );
};

export default SocialFeed;
