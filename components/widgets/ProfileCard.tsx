"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useAuth } from "@/context/AuthContext";
import { useGetUser } from "@/hooks/useGetUser";

export default function ProfileCard() {
  const { user } = useAuth();
  const { profile } = useGetUser(user?.email);

  if (!profile) {
    return (
      <Card className="p-6">
        <CardHeader className="text-center">
          <CardTitle className="text-lg font-semibold">Loading...</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-gray-500">
            Please wait while we load your profile.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col items-center text-center">
        <Avatar className="w-20 h-20">
          <AvatarImage src={profile.image} alt="Profile" />
          <AvatarFallback>
            {profile?.name?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="mt-2">{profile.name}</CardTitle>
        <p className="text-sm text-gray-500">{profile.bio}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span>{profile?.followers.length} Followers</span>
          <span>{profile?.following.length} Following</span>
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
