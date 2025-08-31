import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ActiveGoalsCard from "@/components/widgets/ActiveGoalsCard";
import HighlightPostCard from "@/components/widgets/HighlightPost";
import ProfileCard from "@/components/widgets/ProfileCard";
import ReflectionHistoryCard from "@/components/widgets/ReflectionHistory";
import ReflectionStreakCard from "@/components/widgets/ReflectionStreakCard";
import UserTopTags from "@/components/widgets/UserTopTags";
import WeeklyActivityChart from "@/components/widgets/WeeklyActivityChart";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function InsightsPage() {
  const cookieStore = await cookies();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/pages/activity`,
    { cache: "no-store", headers: { Cookie: cookieStore.toString() } }
  );
  const insightsData = await res.json();

  if (!insightsData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent>
            <p className="text-gray-500 text-center">
              Failed to load insights.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto py-6">
      {/* Left Column */}
      <div className="md:col-span-2 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-4 md:col-span-1">
            {insightsData?.stats
              ?.slice(0, 2)
              .map((stat: { value: number; label: string }, i: number) => (
                <Card
                  key={i}
                  className="text-center shadow-sm rounded-2xl border border-gray-100 bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 dark:border-gray-700"
                >
                  <CardContent>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* Right column: Goal Progress Chart */}
          <div className="md:col-span-2">
            <ReflectionStreakCard days={insightsData?.streak} />
          </div>
        </div>

        {/* Weekly Activity Chart */}
        <WeeklyActivityChart />

        {/* Top Tags */}
        <UserTopTags userId={insightsData?.user?._id} />
      </div>

      {/* Right Column */}
      <div className="flex flex-col space-y-4 sticky top-6 self-start h-fit">
        <ProfileCard user={insightsData?.user} />

        <ActiveGoalsCard goals={insightsData.activeGoals || []} />

        {/* Reflection History */}
        <ReflectionHistoryCard
          reflections={insightsData?.reflectHistory || []}
        />
      </div>
    </div>
  );
}
