"use client";

import { createPost } from "@/actions/posts";
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
import { useAuth } from "@/context/AuthContext";
import { useGetUserGoals } from "@/hooks/useGetUserGoals";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IGoal } from "../goals/page";
import { useSession } from "next-auth/react";

export default function NewEntryPage() {
  const { data: session, status } = useSession();

  const router = useRouter();
  const [state, formAction] = useActionState(createPost, {
    success: false,
    message: "",
    errors: {},
    formValues: {
      title: "",
      content: "",
      tags: [],
      goalId: "",
    },
  });

  const [tags, setTags] = useState<string[]>(state.formValues?.tags || []);
  const [content, setContent] = useState("");
  const [selectedGoal, setSelectedGoal] = useState(
    state.formValues?.goalId || ""
  );

  const { goals, loading, error } = useGetUserGoals(session?.user.id);

  useEffect(() => {
    if (state.success) {
      toast.success("Post created successfully!");
      router.push("/dashboard");
    }
  }, [state.success, router]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>You are not logged in</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create a New Post</h1>
      <form className="space-y-4" action={formAction}>
        <Input
          type="text"
          placeholder="Post Title"
          name="title"
          required
          defaultValue={state.formValues?.title}
        />
        <input type="hidden" name="goalId" value={selectedGoal} />

        {/* Goal Selection */}
        {loading ? (
          <p>Loading...</p>
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
        <TagInput
          tags={tags}
          setTags={setTags}
          placeholder="Add Tags"
          name="tags"
        />

        {/* Error Messages */}
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
          Submit Post
        </Button>
      </form>
    </div>
  );
}
