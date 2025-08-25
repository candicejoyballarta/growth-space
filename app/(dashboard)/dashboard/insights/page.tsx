import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InsightsPage() {
  // Static data
  const stats = [
    { label: "Posts", value: 34 },
    { label: "Reflections", value: 18 },
    { label: "Goals Completed", value: 7 },
  ];

  const topTags = ["Productivity", "Wellness", "Learning", "Focus"];

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
        <Card>
          <CardHeader>
            <CardTitle>Top Tags</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {topTags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Right Column */}
      <div className="flex flex-col space-y-4 sticky top-6 self-start h-fit">
        {/* Motivational Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Insight of the Day</CardTitle>
          </CardHeader>
          <CardContent className="text-sm italic text-gray-700">
            <code>{`"Consistency beats intensity. Small steps every day lead to big
            results."`}</code>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium">Read 10 Books</p>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div className="h-2 w-2/5 bg-green-500 rounded-full"></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Progress: 40%</p>
            </div>
            <div>
              <p className="text-sm font-medium">Meditate Daily</p>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div className="h-2 w-3/4 bg-blue-500 rounded-full"></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Progress: 75%</p>
            </div>
          </CardContent>
        </Card>

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
