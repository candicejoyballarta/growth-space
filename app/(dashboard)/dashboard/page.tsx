import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MainFeed from "@/components/widgets/MainFeed";
import PeopleYouMayKnowCard from "@/components/widgets/PeopleYouMayKnowCard";
import PopularTags from "@/components/widgets/PopularTags";
import ProfileCard from "@/components/widgets/ProfileCard";
import { cookies } from "next/headers";

export default async function DashboardPage() {
  const cookieStore = await cookies();

  const latestRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/posts/following`,
    { cache: "no-store", headers: { Cookie: cookieStore.toString() } }
  );
  const latest = await latestRes.json();

  const trendingRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/posts/trending`,
    { cache: "no-store", headers: { Cookie: cookieStore.toString() } }
  );
  const trending = await trendingRes.json();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
      {/* Main Feed */}
      <div className="md:col-span-2 space-y-4 top-6">
        <MainFeed latest={latest} trending={trending} />
      </div>

      {/* Right Column */}
      <div className="hidden md:flex flex-col space-y-4 sticky top-6 self-start h-fit">
        {/* Profile & Social Widgets */}
        <ProfileCard />

        {/* Reflection Streak */}
        <Card>
          <CardHeader>
            <CardTitle>Reflection Streak</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">🔥 5-day streak</p>
            <div className="flex space-x-1">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full ${
                    i < 5 ? "bg-yellow-400" : "bg-gray-300"
                  }`}
                ></div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Your reflections this week
            </p>
          </CardContent>
        </Card>

        <PopularTags />
        <PeopleYouMayKnowCard />

        {/* Motivational Quote */}
        <Card className="bg-gradient-to-br from-green-100 to-green-50 border-0 shadow-lg gap-3">
          <CardHeader>
            <CardTitle className="text-green-700 text-lg font-semibold">
              Quote of the Day 🌱
            </CardTitle>
          </CardHeader>
          <CardContent className="relative text-gray-800 text-sm italic px-4 py-2">
            <span className="absolute -top-3 -left-3 text-4xl text-green-200 font-bold">
              “
            </span>
            <p className="ml-2">
              The secret of getting ahead is getting started.{" "}
              <span className="font-semibold">– Mark Twain</span>
            </p>
            <span className="absolute -bottom-3 -right-3 text-4xl text-green-200 font-bold rotate-180">
              ”
            </span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
