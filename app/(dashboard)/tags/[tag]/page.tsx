import SocialFeed from "@/components/ui/social-feed";
import PeopleYouMayKnowCard from "@/components/widgets/PeopleYouMayKnowCard";
import PopularTags from "@/components/widgets/PopularTags";
import { cookies } from "next/headers";
import React from "react";

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export default async function TagPage(props: TagPageProps) {
  const cookieStore = await cookies();
  const params = await props.params;
  const { tag } = params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/posts/tags/${tag}`,
    {
      cache: "no-store",
      headers: {
        Cookie: cookieStore.toString(),
      },
    }
  );

  if (!res.ok) return <p>Posts cannot be found.</p>;

  const { data, pagination } = await res.json();

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left/Main Column */}
      <div className="md:col-span-2 space-y-6">
        <h1 className="text-4xl font-extrabold dark:text-white">{tag}</h1>

        <SocialFeed posts={data} />
      </div>

      {/* Right/Sidebar Column */}
      <div className="space-y-6">
        {/* Suggested Connections */}
        <PeopleYouMayKnowCard />

        {/* Popular Tags */}
        <PopularTags />
      </div>
    </div>
  );
}
