import { getFollowingPosts, getTrendingPosts } from "@/actions/posts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SocialFeed from "@/components/ui/social-feed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainFeed from "@/components/widgets/MainFeed";
import PeopleYouMayKnowCard from "@/components/widgets/PeopleYouMayKnowCard";
import PopularTags from "@/components/widgets/PopularTags";
import ProfileCard from "@/components/widgets/ProfileCard";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const loggedInUserId = session?.user?.id;

  const latest = loggedInUserId ? await getFollowingPosts(loggedInUserId) : [];
  const trending = await getTrendingPosts(loggedInUserId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
      {/* Main Feed */}
      <div className="md:col-span-2 space-y-4 top-6">
        <MainFeed latest={latest} trending={trending} />
      </div>

      {/* Right Column */}
      <div className="hidden md:flex flex-col space-y-4 sticky top-6 self-start h-fit">
        <ProfileCard />
        <PopularTags />
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
