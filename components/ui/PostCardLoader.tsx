import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function PostCardLoader() {
  return (
    <Card className="shadow-sm rounded-lg border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="h-10 w-10 rounded-full bg-gray-300 animate-pulse" />

          {/* Name + date */}
          <div className="space-y-1">
            <div className="h-3 w-28 bg-gray-300 rounded animate-pulse" />
            <div className="h-2 w-16 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Menu button placeholder */}
        <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse" />
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Title */}
        <div className="h-4 w-2/3 bg-gray-300 rounded animate-pulse" />

        {/* Content */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-5/6 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Goal embed placeholder */}
        <div className="h-20 w-full bg-gray-100 rounded-lg animate-pulse" />

        {/* Tags */}
        <div className="flex gap-2">
          <div className="h-5 w-12 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse" />
        </div>

        {/* Engagement */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <div className="h-4 w-10 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}
