import MainFeed from "@/components/widgets/MainFeed";
import PeopleYouMayKnowCard from "@/components/widgets/PeopleYouMayKnowCard";
import PopularTags from "@/components/widgets/PopularTags";
import ProfileCard from "@/components/widgets/ProfileCard";
import QOTDCard from "@/components/widgets/QOTDCard";
import ReflectionStreakCard from "@/components/widgets/ReflectionStreakCard";
import { cookies } from "next/headers";

export default async function DashboardPage() {
  const cookieStore = await cookies();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/pages/dashboard`,
    { cache: "no-store", headers: { Cookie: cookieStore.toString() } }
  );
  const dashboardData = await res.json();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
      {/* Main Feed */}
      <div className="md:col-span-2 space-y-4 top-6">
        <MainFeed
          latest={dashboardData.followingPosts}
          trending={dashboardData.trendingPosts}
        />
      </div>

      {/* Right Column */}
      <div className="hidden md:flex flex-col space-y-4 sticky top-6 self-start h-fit">
        {/* Profile & Social Widgets */}
        <ProfileCard user={dashboardData.user} />

        {/* Reflection Streak */}
        <ReflectionStreakCard days={dashboardData.streak} />

        <PopularTags />
        <PeopleYouMayKnowCard />

        {/* Motivational Quote */}
        <QOTDCard />
      </div>
    </div>
  );
}
