import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MainFeed from "@/components/widgets/MainFeed";
import PeopleYouMayKnowCard from "@/components/widgets/PeopleYouMayKnowCard";
import PopularTags from "@/components/widgets/PopularTags";
import ProfileCard from "@/components/widgets/ProfileCard";
import QOTDCard from "@/components/widgets/QOTDCard";
import ReflectionStreakCard from "@/components/widgets/ReflectionStreakCard";
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
        <ReflectionStreakCard />

        <PopularTags />
        <PeopleYouMayKnowCard />

        {/* Motivational Quote */}
        <QOTDCard />
      </div>
    </div>
  );
}
