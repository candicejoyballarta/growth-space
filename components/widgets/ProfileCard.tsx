"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface ProfileCardProps {
  user: {
    id: string;
    name: string;
    image?: string;
    bio?: string;
    followersCount?: number;
    followingCount?: number;
    followers?: string[];
    following?: string[];
  };
}

export default function ProfileCard({ user: profile }: ProfileCardProps) {
  if (!profile) {
    return (
      <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-900 shadow-lg rounded-2xl p-6">
        <CardHeader className="text-center">
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Loading...
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center text-gray-500 dark:text-gray-400">
          Please wait while we load your profile.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 shadow-lg rounded-2xl">
      <CardHeader className="flex flex-col items-center text-center">
        <Avatar className="w-20 h-20">
          {profile.image ? (
            <AvatarImage src={profile.image} alt={profile.name} />
          ) : (
            <AvatarFallback>
              {profile?.name?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          )}
        </Avatar>
        <CardTitle className="mt-2 text-gray-800 dark:text-gray-100">
          {profile.name}
        </CardTitle>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {profile.bio}
        </p>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
          <span>{profile?.followersCount || 0} Followers</span>
          <span>{profile?.followingCount || 0} Following</span>
        </div>

        <div className="flex flex-col gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/new">Create Post</Link>
          </Button>
          <Button variant="main" asChild>
            <Link href="/dashboard/goals">Manage Goals</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
