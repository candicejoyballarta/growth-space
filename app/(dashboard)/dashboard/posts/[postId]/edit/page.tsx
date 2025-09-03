"use client";

import { updatePost } from "@/actions/posts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TagInput from "@/components/ui/tag-input";
import WysiwygEditor from "@/components/ui/wysiwyg-editor";
import { useGetUserGoals } from "@/hooks/useGetUserGoals";
import { useRouter, useParams } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IGoal } from "../../../goals/page";
import { useSession } from "next-auth/react";

export default function EditPostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { postId } = useParams();
  const [state, formAction] = useActionState(updatePost, {
    success: false,
    message: "",
    errors: {},
    formValues: {},
  });

  // Initialize as undefined to detect loading
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [content, setContent] = useState<string | undefined>(undefined);
  const [tags, setTags] = useState<string[] | undefined>(undefined);
  const [selectedGoal, setSelectedGoal] = useState<string>("");

  const { goals, loading: goalsLoading } = useGetUserGoals(session?.user?.id);

  // Fetch post data
  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${postId}`);
        const data = await res.json();

        if (data?.error) throw new Error(data.error);

        setTitle(data.title || "");
        setContent(data.content || "");
        setTags(data.tags || []);
        setSelectedGoal(data.goal?._id || "");
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch post data");
      }
    };

    fetchPost();
  }, [postId]);

  useEffect(() => {
    if (state.success) {
      toast.success("Post updated successfully!");
      router.push("/dashboard");
    }
  }, [state.success, router]);

  if (status === "loading") return <p>Loading session...</p>;
  if (!session) return <p>You are not logged in.</p>;

  // Wait until post data is fetched
  if (title === undefined || content === undefined || tags === undefined) {
    return <p>Loading post data...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit a Post</h1>
      <form className="space-y-4" action={formAction}>
        <Input
          type="text"
          placeholder="Post Title"
          name="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {goalsLoading ? (
          <p>Loading goals...</p>
        ) : (
          <Select
            name="goalId"
            value={selectedGoal}
            onValueChange={(val) => setSelectedGoal(val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="-- Select a Goal (optional) --" />
            </SelectTrigger>
            <SelectContent>
              {goals.map((goal: IGoal) => (
                <SelectItem key={goal._id} value={goal._id}>
                  {goal.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <WysiwygEditor content={content} setContent={setContent} />
        <input type="hidden" name="content" value={content} />

        <TagInput
          tags={tags}
          setTags={setTags}
          placeholder="Add Tags"
          name="tags"
        />
        <input type="hidden" name="tags" value={tags.join(",")} />

        {state.message && !state.success && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-300 p-3">
            <p className="text-sm font-medium text-red-700 mb-2">
              {state.message}
            </p>
            <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
              {Object.values(state.errors).map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        <input type="hidden" name="goalId" value={selectedGoal} />

        <Button type="submit" className="w-full">
          Update Post
        </Button>
      </form>
    </div>
  );
}
