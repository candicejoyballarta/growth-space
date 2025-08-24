import { connectToDB } from "@/lib/mongoose";
import { Post } from "@/models/Post";
import { IUser, User } from "@/models/User";
import { success } from "zod";
import { getUserPosts } from "./posts";

type IPerson = {
  _id: string;
  name: string;
  image: string;
};

export async function getPeopleYouMayKnow(loggedInUserId: string) {
  await connectToDB();

  // Get the logged-in user
  const currentUser = await User.findById(loggedInUserId).lean<IUser>();

  if (!currentUser) return [];

  const excludeIds = [
    loggedInUserId,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(currentUser.following?.map((item: any) =>
      item.type ? item.type.toString() : item.toString()
    ) || []),
  ];

  // Find users not in the exclude list
  const users = await User.find({ _id: { $nin: excludeIds } })
    .select("name image")
    .limit(3)
    .lean<IPerson[]>();

  return users.map((user: IPerson) => ({
    id: user._id.toString(),
    name: user.name,
    image: user.image || "/profile.jpg",
  }));
}

export async function getUserById(userId: string) {
  await connectToDB();

  // Fetch user info and posts in parallel
  const [userInfo, userPosts] = await Promise.all([
    User.findById(userId).lean<IUser>(),
    getUserPosts(userId),
  ]);

  if (!userInfo) {
    return {
      success: false,
      message: "There was an error finding this user.",
    };
  }

  return {
    success: true,
    user: userInfo,
    posts: userPosts,
  };
}
