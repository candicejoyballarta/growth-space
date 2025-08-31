import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SocialFeed from "@/components/ui/social-feed";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import PeopleYouMayKnowCard from "@/components/widgets/PeopleYouMayKnowCard";
import PopularTags from "@/components/widgets/PopularTags";
import { cookies } from "next/headers";
import toast from "react-hot-toast";
import FollowButton from "@/components/ui/follow-button";

interface ProfilePageProps {
  params: Promise<{ userId: string }>;
}

export default async function ProfilePage(props: ProfilePageProps) {
  const params = await props.params;
  const { userId } = params;
  const session = await getServerSession(authOptions);
  const loggedInUserId = session?.user?.id;
  const cookieStore = await cookies();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/users/${userId}`,
    {
      cache: "no-store",
      headers: {
        Cookie: cookieStore.toString(),
      },
    }
  );

  if (!res.ok) return <p>User not found.</p>;

  const { user, posts } = await res.json();

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left/Main Column */}
      <div className="md:col-span-2 space-y-6">
        {/* Cover Image */}
        <div className="h-48 w-full bg-gray-200 dark:border-gray-800 rounded-lg relative">
          {user.coverImage && (
            <Image
              fill
              src={user.coverImage}
              alt={`${user.name} cover`}
              className="h-full w-full object-cover rounded-lg"
            />
          )}
          <div className="absolute bottom-0 left-6 transform translate-y-1/2 flex items-center gap-4">
            <Avatar className="w-36 h-36 border-4 border-white dark:border-gray-800 shadow-md">
              <AvatarImage src={user.image || "/profile.jpg"} alt={user.name} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="pt-20">
              <h1 className="text-3xl font-bold drop-shadow">{user.name}</h1>
              <p className="text-sm drop-shadow">{user.bio || "No bio yet"}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          {userId !== session?.user?.id ? (
            <>
              <FollowButton
                loggedInUserId={loggedInUserId}
                followeeId={userId}
              />
            </>
          ) : (
            <Button variant="outline" asChild>
              <Link href={`/dashboard/profile/${userId}/edit`}>
                Edit Profile
              </Link>
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-16 border-b border-gray-200 dark:border-gray-700 pb-4">
          {[
            { label: "Posts", value: posts.length, href: "#posts" },
            {
              label: "Followers",
              value: user?.followers?.length,
              href: "#followers",
            },
            {
              label: "Following",
              value: user?.following?.length,
              href: "#following",
            },
          ].map((stat, idx) => (
            <a
              key={idx}
              href={stat.href}
              className="relative text-center group"
            >
              <p className="font-semibold text-xl text-gray-900 dark:text-gray-100 group-hover:text-green-600 transition-colors">
                {stat.value}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-green-600 transition-colors">
                {stat.label}
              </p>

              {/* Underline animation */}
              <span className="absolute left-1/2 -bottom-1 h-0.5 w-0 bg-green-600 transition-all duration-300 group-hover:w-10 group-hover:-translate-x-1/2"></span>
            </a>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="posts">
          <TabsList className="border-b border-gray-200 mb-4 bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 dark:border-gray-700">
            <TabsTrigger
              value="posts"
              className="dark:text-gray-200 dark:active:text-white dark:data-[state=active]:dark:bg-gray-700"
            >
              Posts
            </TabsTrigger>
            <TabsTrigger
              value="about"
              className="dark:text-gray-200 dark:active:text-white dark:data-[state=active]:dark:bg-gray-700"
            >
              About
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="dark:text-gray-200 dark:active:text-white dark:data-[state=active]:dark:bg-gray-700"
            >
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" id="posts">
            {posts.length > 0 ? (
              <SocialFeed posts={posts} />
            ) : (
              <p className="text-gray-500 text-center py-10">No posts yet.</p>
            )}
          </TabsContent>

          <TabsContent value="about">
            <div className="space-y-6">
              {/* Bio */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-1 text-gray-900 dark:text-gray-100">
                  Bio
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {user.bio || "No bio provided"}
                </p>
              </div>

              {/* Growth Areas */}
              {user.growthAreas?.length > 0 && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm">
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    Growth Areas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.growthAreas.map((area: string, idx: number) => (
                      <span
                        key={idx}
                        className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-xs font-medium px-2 py-1 rounded-full"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Intentions */}
              {user.intentions && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm">
                  <h3 className="font-semibold mb-1 text-gray-900 dark:text-gray-100">
                    Intentions
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {user.intentions}
                  </p>
                </div>
              )}

              {/* Join Date */}
              <div className="text-gray-400 dark:text-gray-400 text-sm">
                Joined: {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <p className="text-gray-500 text-center py-10">
              Recent activity coming soon...
            </p>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right/Sidebar Column */}
      <div className="space-y-6">
        {/* Suggested Connections */}
        <PeopleYouMayKnowCard />

        {/* Popular Tags */}
        <PopularTags />
      </div>
    </div>
  );
}
