"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TagInput from "@/components/ui/tag-input";
import WysiwygEditor from "@/components/ui/wysiwyg-editor";
import { useState } from "react";

export default function NewEntryPage() {
  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState("");

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create a New Post</h1>
      <form className="space-y-4">
        <Input type="text" placeholder="Post Title" required />
        <WysiwygEditor content={content} setContent={setContent} />
        <TagInput tags={tags} setTags={setTags} placeholder="Add Tags" />
        <Button type="submit" className="w-full">
          Submit Post
        </Button>
      </form>
    </div>
  );
}
