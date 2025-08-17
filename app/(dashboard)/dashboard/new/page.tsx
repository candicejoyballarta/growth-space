"use client";

import { createPost } from "@/actions/posts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TagInput from "@/components/ui/tag-input";
import WysiwygEditor from "@/components/ui/wysiwyg-editor";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function NewEntryPage() {
  const router = useRouter();
  const [state, formAction] = useActionState(createPost, {
    success: false,
    message: "",
    errors: {},
    formValues: {
      title: "",
      content: "",
      tags: [],
    },
  });

  const [tags, setTags] = useState<string[]>(state.formValues?.tags || []);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (state.success) {
      toast.success("Post created successfully!");
      router.push("/dashboard");
    }
  }, [state.success, router]);

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

        <Button type="submit" className="w-full">
          Submit Post
        </Button>
      </form>
    </div>
  );
}
