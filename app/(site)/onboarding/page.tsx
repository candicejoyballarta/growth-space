"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const [growthAreas, setGrowthAreas] = useState<string[]>([]);
  const [intentions, setIntentions] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch("/api/users/onboarding", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ growthAreas, intentions }),
    });

    router.push("/dashboard");
  };

  return (
    <div className="max-w-lg mx-auto py-12">
      <h1 className="text-2xl font-bold mb-6">
        Welcome! Let’s personalize your journey
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Growth Areas */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Select Growth Areas
          </label>
          <div className="flex gap-2 flex-wrap">
            {["Health", "Career", "Relationships", "Mindfulness"].map(
              (area) => (
                <button
                  type="button"
                  key={area}
                  onClick={() =>
                    setGrowthAreas((prev) =>
                      prev.includes(area)
                        ? prev.filter((a) => a !== area)
                        : [...prev, area]
                    )
                  }
                  className={`px-3 py-1 rounded-full border ${
                    growthAreas.includes(area)
                      ? "bg-green-600 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {area}
                </button>
              )
            )}
          </div>
        </div>

        {/* Intentions */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Your Intention
          </label>
          <textarea
            value={intentions}
            onChange={(e) => setIntentions(e.target.value)}
            className="w-full border rounded-md p-2"
            placeholder="What do you want to achieve with Growth Space?"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
        >
          Continue
        </button>
      </form>
    </div>
  );
}
