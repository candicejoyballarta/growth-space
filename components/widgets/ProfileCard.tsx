"use client";

import Link from "next/link";
import { useAuth } from "../providers/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function ProfileCard() {
  const { user } = useAuth();

  if (!user) {
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
          <AvatarImage src={user.image} alt="Profile" />
          <AvatarFallback>
            {user?.name?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="mt-2">{user.name}</CardTitle>
        <p className="text-sm text-gray-500">{user.bio}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span>0 Followers</span>
          <span>0 Posts</span>
        </div>
        <div className="flex flex-col gap-2">
          <Button variant="main">View Profile</Button>
          <Button variant="secondary" asChild>
            <Link href="/dashboard/new">Create Post</Link>
          </Button>
          <Button variant="outline">Manage Bookmarks</Button>
        </div>
      </CardContent>
    </Card>
  );
}
