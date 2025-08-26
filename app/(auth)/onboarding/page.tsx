"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GoalForm, { GoalFormData } from "@/components/forms/GoalForm";
import { createGoal } from "@/actions/goals";
import toast from "react-hot-toast";

const growthOptions = [
  { name: "Health", emoji: "💪" },
  { name: "Career", emoji: "💼" },
  { name: "Relationships", emoji: "❤️" },
  { name: "Mindfulness", emoji: "🧘‍♀️" },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [growthAreas, setGrowthAreas] = useState<string[]>([]);
  const [intentions, setIntentions] = useState("");
  const [firstGoal, setFirstGoal] = useState("");
  const router = useRouter();

  const toggleGrowthArea = (area: string) => {
    setGrowthAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const handleSubmit = async () => {
    const res = await fetch("/api/users/onboarding", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ growthAreas, intentions }),
    });

    if (!res.ok) {
      toast.error("Failed to complete onboarding. Please try again.");
      return;
    }

    setCurrentStep(4);
    router.push("/dashboard");
  };

  const Step1 = () => (
    <div className="text-center p-6 bg-white rounded-2xl shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        🌱 Choose your Growth Areas
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {growthOptions.map((option) => {
          const selected = growthAreas.includes(option.name);
          return (
            <div
              key={option.name}
              onClick={() => toggleGrowthArea(option.name)}
              className={`flex flex-col items-center justify-center gap-2 p-5 rounded-xl cursor-pointer transition transform ${
                selected
                  ? "bg-green-600 text-white shadow-md scale-105"
                  : "bg-gray-50 text-gray-800 border border-gray-200 hover:scale-105 hover:shadow-sm"
              }`}
            >
              <div className="text-4xl">{option.emoji}</div>
              <div className="font-semibold text-lg">{option.name}</div>
            </div>
          );
        })}
      </div>

      <button
        className={`mt-4 w-full py-3 rounded-lg font-semibold text-white transition ${
          growthAreas.length > 0
            ? "bg-green-600 hover:bg-green-700 shadow-sm"
            : "bg-gray-300 cursor-not-allowed"
        }`}
        disabled={growthAreas.length === 0}
        onClick={() => setCurrentStep(2)}
      >
        Next 🚀
      </button>
    </div>
  );

  const Step2 = () => {
    const [intents, setIntents] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setIntents(e.target.value);
    };

    return (
      <div className="space-y-6 text-center p-6 bg-white rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-900">
          ✨ Set Your Intention
        </h2>

        <textarea
          value={intents}
          onChange={handleChange}
          placeholder="What do you want to achieve with Growth Space?"
          className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-left text-base placeholder:text-gray-400 shadow-sm focus:border-green-600 focus:ring-1 focus:ring-green-200 transition resize-none"
          rows={5}
        />

        {intents && (
          <div className="p-4 bg-green-50 rounded-xl border border-green-100 text-left shadow-sm">
            <span className="font-semibold text-green-800">Your Vision:</span>{" "}
            {intents}
          </div>
        )}

        <div className="flex justify-between gap-4 mt-4">
          <button
            className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-800 font-medium hover:bg-gray-200 transition"
            onClick={() => setCurrentStep(1)}
          >
            Back
          </button>
          <button
            className={`flex-1 py-3 rounded-xl font-medium text-white transition ${
              intents
                ? "bg-green-600 hover:bg-green-700 shadow-sm"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            onClick={() => {
              setCurrentStep(3);
              setIntentions(intents);
            }}
            disabled={!intents}
          >
            Next 🚀
          </button>
        </div>
      </div>
    );
  };

  const Step3 = () => {
    const [state, formAction] = useActionState(createGoal, {
      success: false,
      message: "",
      errors: {},
      formValues: {},
    });

    useEffect(() => {
      if (state.success) {
        toast.success("Goal created successfully!");
        setFirstGoal((state.formValues as GoalFormData).title || "");
        setCurrentStep(4);
      }
    }, [state.success]);

    return (
      <div className="space-y-6">
        <GoalForm
          onSubmit={formAction}
          showSkip={true}
          onSkip={() => setCurrentStep(4)}
          onCancel={() => setCurrentStep(2)}
        />
      </div>
    );
  };

  const Step4 = () => (
    <div className="text-center space-y-6 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-3xl font-bold text-gray-900">
        🎉 Welcome to Growth Space!
      </h2>
      <p className="text-gray-600 text-lg">Here’s what you’ll be tracking:</p>
      <ul className="list-none max-w-md mx-auto space-y-2">
        {growthAreas.map((area) => (
          <li
            key={area}
            className="flex items-center gap-3 bg-green-50 rounded-xl px-4 py-2 text-gray-800 font-medium"
          >
            <span className="text-lg">
              {area === "Health"
                ? "💪"
                : area === "Career"
                ? "💼"
                : area === "Relationships"
                ? "❤️"
                : "🧘‍♀️"}
            </span>
            {area}
          </li>
        ))}
        <div className="p-4 bg-green-50 rounded-xl border border-green-100 text-left shadow-sm">
          <span className="font-semibold text-green-800">Your Vision:</span>{" "}
          {intentions}
        </div>
        {firstGoal && (
          <li className="flex items-center gap-3 bg-yellow-50 rounded-xl px-4 py-2 text-gray-900 font-semibold">
            <span className="text-lg">🏆</span>
            First Goal: {firstGoal}
          </li>
        )}
      </ul>
      <button
        className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow-sm transition hover:scale-105"
        onClick={handleSubmit}
      >
        🚀 Go to Dashboard
      </button>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-green-100">
      <div className="w-full max-w-lg space-y-8 text-center">
        {currentStep === 1 && <Step1 />}
        {currentStep === 2 && <Step2 />}
        {currentStep === 3 && <Step3 />}
        {currentStep === 4 && <Step4 />}
      </div>
    </div>
  );
}
