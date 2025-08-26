import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ActiveGoalsCard from "@/components/widgets/ActiveGoalsCard";
import HighlightPostCard from "@/components/widgets/HighlightPost";
import ReflectionStreakCard from "@/components/widgets/ReflectionStreakCard";
import UserTopTags from "@/components/widgets/UserTopTags";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function InsightsPage() {
  const session = await getServerSession(authOptions);

  // Static data
  const stats = [
    { label: "Posts", value: 34 },
    { label: "Reflections", value: 18 },
    { label: "Goals Completed", value: 7 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto py-6">
      {/* Left Column */}
      <div className="md:col-span-2 space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <Card key={i} className="text-center">
              <CardContent>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Weekly Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent className="h-48 flex items-center justify-center bg-gray-100 text-gray-400 rounded-lg">
            Chart Placeholder
          </CardContent>
        </Card>

        {/* Top Tags */}
        <UserTopTags userId={session?.user?.id} />
      </div>

      {/* Right Column */}
      <div className="flex flex-col space-y-4 sticky top-6 self-start h-fit">
        {/* Motivational Insights */}
        <HighlightPostCard />

        <ActiveGoalsCard />

        {/* Reflection Streak */}
        <ReflectionStreakCard />

        {/* Reflection History */}
        <Card>
          <CardHeader>
            <CardTitle>Reflection History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">Aug 20 – Focused on deep work</p>
            <p className="text-sm">Aug 19 – Practiced gratitude journaling</p>
            <p className="text-sm">Aug 18 – Meditation session completed</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
