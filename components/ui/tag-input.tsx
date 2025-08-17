// components/TagInput.tsx
import { useState } from "react";
import { Input } from "./input";

type TagInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  tags: string[];
  setTags: (tags: string[]) => void;
  placeholder?: string;
};

const TagInput = ({ tags, setTags, placeholder }: TagInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      const newTag = `#${inputValue.trim()}`;
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setInputValue("");
    }
  };

  const handleDelete = (tagToDelete: string) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  return (
    <div className="flex flex-col gap-2">
      <Input
        type="text"
        placeholder={placeholder || "Add a tag"}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
      />

      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center bg-green-600 text-white px-3 py-1 rounded-full text-sm shadow-sm hover:bg-green-700 transition-colors"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => handleDelete(tag)}
              aria-label={`Remove ${tag}`}
              className="ml-2 text-white hover:text-red-200 focus:outline-none focus:ring-1 focus:ring-white rounded-full transition"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagInput;
