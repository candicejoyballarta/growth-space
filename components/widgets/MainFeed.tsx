"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import SocialFeed, { ISocFeed } from "../ui/social-feed";
import PostCardLoader from "../ui/PostCardLoader";

interface IMainFeed {
  latest: ISocFeed["posts"];
  trending: ISocFeed["posts"];
}

const MainFeed = ({ latest, trending }: IMainFeed) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 1);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const renderPosts = (posts: ISocFeed["posts"]) => {
    if (!posts || posts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500 dark:text-gray-400">
          <span className="text-4xl mb-3">📭</span>
          <h3 className="text-lg font-semibold mb-1 text-gray-800 dark:text-gray-100">
            Nothing to see here… yet!
          </h3>
          <p className="text-sm">
            Looks like there are no posts in this section. Check back later or
            follow more people to fill your feed!
          </p>
        </div>
      );
    }
    return <SocialFeed posts={posts} />;
  };

  return (
    <Tabs defaultValue="latest">
      <TabsList
        className={`sticky top-6 h-10 z-20 flex gap-3 px-5 py-2 transition-all duration-200 ${
          scrolled
            ? "bg-green-600 shadow-md backdrop-blur-sm border-gray-200 dark:bg-gray-900 dark:border-gray-700"
            : "bg-transparent border-transparent"
        }`}
      >
        <TabsTrigger
          value="latest"
          variant="outline"
          className={`${
            scrolled
              ? "text-white data-[state=active]:border-white"
              : "text-primary border-black dark:text-gray-200 dark:border-gray-500"
          }`}
        >
          Latest
        </TabsTrigger>
        <TabsTrigger
          value="trending"
          variant="outline"
          className={`${
            scrolled
              ? "text-white data-[state=active]:border-white"
              : "text-primary border-black dark:text-gray-200 dark:border-gray-500"
          }`}
        >
          Trending
        </TabsTrigger>
      </TabsList>

      <TabsContent value="latest" className="space-y-4">
        <Suspense fallback={<PostCardLoader />}>{renderPosts(latest)}</Suspense>
      </TabsContent>

      <TabsContent value="trending" className="space-y-4">
        <Suspense fallback={<PostCardLoader />}>
          {renderPosts(trending)}
        </Suspense>
      </TabsContent>
    </Tabs>
  );
};

export default MainFeed;
