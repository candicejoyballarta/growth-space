"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import QOTDCard from "@/components/widgets/QOTDCard";
import HighlightPost from "@/components/widgets/HighlightPost";
import PeopleYouMayKnowCard from "@/components/widgets/PeopleYouMayKnowCard";
import PostCard from "@/components/ui/post-card";
import { CommentType } from "@/components/ui/comments";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface PostData {
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
}

export default function PostPage() {
  const { postId } = useParams();
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const res = await fetch(`/api/posts/${postId}`);
        if (!res.ok) throw new Error("Failed to fetch goal");

        const data: PostData = await res.json();
        setPost(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchGoal();
  }, [postId]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!post) return <p className="text-center mt-10">Goal not found</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Button variant="link" onClick={() => router.back()}>
          <ArrowLeft /> Back
        </Button>
        <PostCard post={post} loading={loading} setLoading={setLoading} />
      </div>
      {/* Right Column: Interactive Cards */}
      <div className="space-y-6">
        <QOTDCard />
        <HighlightPost />
        <PeopleYouMayKnowCard />
      </div>
    </div>
  );
}
