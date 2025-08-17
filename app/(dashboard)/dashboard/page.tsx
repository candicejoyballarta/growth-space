import { getAllPosts } from "@/actions/posts";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SocialFeed from "@/components/ui/social-feed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PopularTopics from "@/components/widgets/PopularTopics";
import ProfileCard from "@/components/widgets/ProfileCard";

export default async function DashboardPage() {
  const latest = await getAllPosts();
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
            <SocialFeed posts={latest} />
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
