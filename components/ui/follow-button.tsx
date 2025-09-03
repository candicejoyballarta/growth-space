"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";

interface FollowButtonProps {
  loggedInUserId?: string;
  followeeId: string;
}

export default function FollowButton({
  loggedInUserId,
  followeeId,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const handleFollowUser = async () => {
    if (!loggedInUserId) {
      toast.error("You must be logged in.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/users/follow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ followerId: loggedInUserId, followeeId }),
        });

        const resData = await res.json();

        if (res.ok) {
          toast.success(resData.message);
          // Toggle the follow state locally
          setIsFollowing((prev) => !prev);
        } else {
          toast.error("Failed to follow/unfollow user. Please try again later");
        }
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong.");
      }
    });
  };

  useEffect(() => {
    const fetchFollowStatus = async () => {
      if (!loggedInUserId) return;

      try {
        const res = await fetch(`/api/users/${loggedInUserId}/following`);
        const data = await res.json();

        if (res.ok) {
          const isUserFollowing = data.following.some(
            (user: { _id: string }) =>
              user._id.toString() === followeeId.toString()
          );
          setIsFollowing(isUserFollowing);
        } else {
          toast.error("Failed to fetch follow status");
        }
      } catch (error) {
        console.error("Failed to fetch follow status", error);
      }
    };

    fetchFollowStatus();
  }, [loggedInUserId, followeeId]);

  return (
    <Button variant="outline" disabled={isPending} onClick={handleFollowUser}>
      {isPending
        ? isFollowing
          ? "Unfollowing..."
          : "Following..."
        : isFollowing
        ? "Unfollow"
        : "Follow"}
    </Button>
  );
}
