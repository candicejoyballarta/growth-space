import { getUserById } from "@/actions/users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SocialFeed from "@/components/ui/social-feed";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import PeopleYouMayKnowCard from "@/components/widgets/PeopleYouMayKnowCard";

interface ProfilePageProps {
  params: { userId: string };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { userId } = params;
  const { user, posts } = await getUserById(userId);
  const session = await getServerSession(authOptions);

  if (!user) return <p>User not found.</p>;

  // Mock data
  const popularTags = ["#webdev", "#react", "#typescript", "#ux", "#design"];

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left/Main Column */}
      <div className="md:col-span-2 space-y-6">
        {/* Cover Image */}
        <div className="h-48 w-full bg-gray-200 rounded-lg relative">
          {user.coverImage && (
            <Image
              fill
              src={user.coverImage}
              alt={`${user.name} cover`}
              className="h-full w-full object-cover rounded-lg"
            />
          )}
          <div className="absolute bottom-0 left-6 transform translate-y-1/2 flex items-center gap-4">
            <Avatar className="w-36 h-36 border-4 border-white">
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
              <Button variant="outline">Follow</Button>
              <Button>Message</Button>
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
        <div className="flex justify-center gap-16 border-b border-gray-200 pb-4">
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
              <p className="font-semibold text-xl text-gray-900 group-hover:text-green-600 transition-colors">
                {stat.value}
              </p>
              <p className="text-sm text-gray-500 group-hover:text-green-600 transition-colors">
                {stat.label}
              </p>

              {/* Underline animation */}
              <span className="absolute left-1/2 -bottom-1 h-0.5 w-0 bg-green-600 transition-all duration-300 group-hover:w-10 group-hover:-translate-x-1/2"></span>
            </a>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="posts">
          <TabsList className="border-b border-gray-200 mb-4">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            {posts.length > 0 ? (
              <SocialFeed posts={posts} />
            ) : (
              <p className="text-gray-500 text-center py-10">No posts yet.</p>
            )}
          </TabsContent>

          <TabsContent value="about">
            <div className="space-y-3">
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Bio:</strong> {user.bio || "No bio provided"}
              </p>
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
        <div className="border p-4 rounded-lg bg-white shadow-sm">
          <h3 className="text-lg font-semibold mb-3">Popular Tags</h3>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag, i) => (
              <span
                key={i}
                className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs cursor-pointer hover:bg-green-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
