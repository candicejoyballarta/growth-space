"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SocialFeed from "@/components/ui/social-feed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PopularTopics from "@/components/widgets/PopularTopics";
import ProfileCard from "@/components/widgets/ProfileCard";
import { useState } from "react";

export default function DashboardPage() {
  const [followers, setFollowers] = useState(128);
  const [posts, setPosts] = useState(24);

  const latestPosts = [
    {
      id: 1,
      author: "Jane Doe",
      title: "Key Takeaways from Agile Workshop",
      tags: ["Agile", "Project Management"],
      likes: 12,
      comments: 3,
    },
    {
      id: 2,
      author: "John Smith",
      title: "My Experience with AWS Training",
      tags: ["Cloud", "AWS"],
      likes: 20,
      comments: 5,
    },
  ];

  const trendingPosts = [
    {
      id: 3,
      author: "Emily Chan",
      title: "Design Thinking Essentials",
      tags: ["Design", "Innovation"],
      likes: 50,
      comments: 12,
    },
    {
      id: 4,
      author: "Mark Lee",
      title: "Data Visualization Best Practices",
      tags: ["Data", "Visualization"],
      likes: 42,
      comments: 8,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
      {/* Left Column - Profile */}
      <div className="space-y-4">
        <ProfileCard />

        <PopularTopics />
      </div>

      {/* Main Feed */}
      <div className="md:col-span-2">
        <Tabs defaultValue="latest">
          <TabsList>
            <TabsTrigger value="latest">Latest</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
          </TabsList>

          <TabsContent value="latest" className="space-y-4">
            {/* {latestPosts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <p className="text-sm text-gray-500">By {post.author}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-2">
                    {post.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs bg-gray-100 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>👍 {post.likes}</span>
                    <span>💬 {post.comments}</span>
                  </div>
                </CardContent>
              </Card>
            ))} */}
            <SocialFeed />
          </TabsContent>

          <TabsContent value="trending" className="space-y-4">
            {trendingPosts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <p className="text-sm text-gray-500">By {post.author}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-2">
                    {post.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs bg-gray-100 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>👍 {post.likes}</span>
                    <span>💬 {post.comments}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Column */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>People You May Know</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {["Sam Patel", "Linda Wong", "Carlos Ruiz"].map((name, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>{name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{name}</span>
                </div>
                <Button size="sm" variant="secondary">
                  Follow
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Trainings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">📅 Effective Communication - Aug 20</p>
            <p className="text-sm">📅 Data Analytics 101 - Aug 25</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
