import { getFollowingPosts, getTrendingPosts } from "@/actions/posts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SocialFeed from "@/components/ui/social-feed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PeopleYouMayKnowCard from "@/components/widgets/PeopleYouMayKnowCard";
import PopularTopics from "@/components/widgets/PopularTopics";
import ProfileCard from "@/components/widgets/ProfileCard";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const loggedInUserId = session?.user?.id;

  // Fetch posts
  const latest = loggedInUserId
    ? await getFollowingPosts(loggedInUserId) // only posts from following + user
    : [];
  const trending = await getTrendingPosts();

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
            <SocialFeed posts={latest} />
          </TabsContent>

          <TabsContent value="trending" className="space-y-4">
            <SocialFeed posts={trending} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Column */}
      <div className="space-y-4">
        <PeopleYouMayKnowCard />

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
