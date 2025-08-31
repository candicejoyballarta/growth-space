/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UsersGrowthAreas from "@/components/widgets/UsersGrowthAreas";
import UsersGrowthCard from "@/components/widgets/UsersGrowthCard";
import { formatActivityText, formatDate, formatNumber } from "@/lib/helpers";
import { ActivityType, IActivity } from "@/models/Activity";
import { Users, Target, Trophy, Activity } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";

type TopUser = {
  user: string;
  count: number;
  trend: string;
};

export default async function AdminHome() {
  const cookieStore = await cookies();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/admin/dashboard`,
    { cache: "no-store", headers: { Cookie: cookieStore.toString() } }
  );
  const dashboardData = await res.json();

  return (
    <main className="p-6 space-y-8 bg-gray-50 dark:bg-gray-900 transition-colors min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Welcome back, {dashboardData?.user?.name} 👋
        </h1>
        <div className="flex gap-2">
          <Link href="/admin/users">
            <button className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition">
              Manage Users
            </button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard
          title="Active Users"
          value={formatNumber(dashboardData?.kpis?.totalUsers)}
          change={dashboardData?.kpis?.totalUsersChange}
          icon={<Users />}
        />
        <KPICard
          title="Goals Completed"
          value={formatNumber(dashboardData?.kpis?.totalGoalsCompleted)}
          change={dashboardData?.kpis?.totalGoalsChange}
          icon={<Target />}
        />
        <KPICard
          title="Avg Streak"
          value={formatNumber(dashboardData?.kpis?.avgStreak)}
          change={dashboardData?.kpis?.avgStreakChange}
          icon={<Activity />}
        />
        <KPICard
          title="New Signups"
          value={formatNumber(dashboardData?.kpis?.newSignups)}
          change={dashboardData?.kpis?.newSignupsChange}
          icon={<Trophy />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UsersGrowthCard data={dashboardData?.lineData} />

        <UsersGrowthAreas data={dashboardData?.pieData} />
      </div>

      {/* Leaderboard + Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-800 dark:text-gray-100">
              🏆 Top Users (This Month)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {dashboardData?.topUsers?.map((user: TopUser, i: number) => (
              <LeaderboardItem
                key={i}
                user={user.user}
                count={user.count}
                trend={user.trend}
              />
            ))}
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-800 dark:text-gray-100">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {dashboardData?.activities?.map((act: IActivity, i: number) => (
              <div key={i}>
                <ActivityItem
                  text={formatActivityText(
                    act.type as ActivityType,
                    act.metadata
                  )}
                  time={formatDate(act.createdAt)}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function KPICard({ title, value, change, icon }: any) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm text-gray-500 dark:text-gray-400">{title}</h3>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {value}
          </p>
          <span className="text-green-600 dark:text-green-400 text-sm">
            {change}
          </span>
        </div>
        <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
          {icon}
        </div>
      </div>
    </div>
  );
}

function LeaderboardItem({ user, count, trend }: any) {
  return (
    <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
      <span className="text-gray-800 dark:text-gray-200">{user}</span>
      <span className="font-semibold text-gray-800 dark:text-gray-100">
        {count} {trend}
      </span>
    </div>
  );
}

function ActivityItem({ text, time }: any) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-600 dark:text-gray-300">{text}</span>
      <span className="text-gray-400 dark:text-gray-500">{time}</span>
    </div>
  );
}
