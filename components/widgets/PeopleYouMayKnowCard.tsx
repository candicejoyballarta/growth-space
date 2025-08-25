"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

const PeopleYouMayKnowCard = () => {
  const { user } = useAuth();
  const loggedInUserId = user?.id;
  const [suggestedConnections, setPeople] = useState<
    { _id: string; name: string; image: string }[]
  >([]);

  const handleFollowUser = async (followeeId: string) => {
    if (!loggedInUserId) return;

    try {
      const res = await fetch("/api/users/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followerId: loggedInUserId, followeeId }),
      });

      if (res.ok) {
        // Remove the followed user from suggestions
        setPeople((prev) => prev.filter((p) => p._id !== followeeId));

        toast.success("User successfully followed!");
      } else {
        toast.error("Failed to follow user. Please try again later");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!loggedInUserId) return;

    const fetchPeople = async () => {
      try {
        const res = await fetch(
          `/api/users/suggestions?userId=${loggedInUserId}`
        );
        const data = await res.json();
        setPeople(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPeople();
  }, [loggedInUserId]);

  return (
    <div className="border p-4 rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-3">People You May Know</h3>
      <div className="space-y-3">
        {suggestedConnections.length > 0 ? (
          suggestedConnections.map((person) => (
            <div
              key={person._id}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={person?.image} />
                  <AvatarFallback>{person.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{person.name}</span>
              </div>
              <Button
                size="sm"
                className="cursor-pointer"
                onClick={() => handleFollowUser(person._id)}
              >
                Follow
              </Button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-gray-500">
            <p className="mb-2">No new suggestions at the moment.</p>
            <p>Follow more people to see suggestions here!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PeopleYouMayKnowCard;
