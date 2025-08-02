import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Herobar from "@/components/Herobar";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Herobar />

      {/* Features Section */}
      <section className="py-20 px-6 bg-green-50" id="features">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-green-800">
            Why Growth Space?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Goal Tracking",
                description:
                  "Define your objectives and break them down into actionable steps.",
                icon: "🚀",
              },
              {
                title: "Self-Reflection",
                description:
                  "Build mindfulness and emotional awareness through guided prompts.",
                icon: "🧘",
              },
              {
                title: "Growth Dashboard",
                description:
                  "Visualize your progress and insights in a personalized dashboard.",
                icon: "📈",
              },
              {
                title: "Community Support",
                description:
                  "Share and grow with a supportive community focused on development.",
                icon: "🤝",
              },
            ].map((feature, idx) => (
              <Card
                key={idx}
                className="bg-white shadow-md p-6 hover:shadow-xl transition duration-300"
              >
                <CardContent className="flex flex-col items-center text-center">
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-20 px-6" id="how-it-works">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-gray-800">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                step: "Step 1",
                title: "Create Your Space",
                description:
                  "Sign up and personalize your growth space with your goals and intentions.",
              },
              {
                step: "Step 2",
                title: "Track and Act",
                description:
                  "Break down your goals into milestones and keep track of progress consistently.",
              },
              {
                step: "Step 3",
                title: "Reflect and Evolve",
                description:
                  "Use reflection prompts to gain insights and adapt your journey as you grow.",
              },
            ].map((item, idx) => (
              <Card
                key={idx}
                className="bg-white shadow-md p-6 hover:shadow-xl transition duration-300"
              >
                <CardContent className="flex flex-col items-center text-center">
                  <div className="text-xl font-bold text-green-600 mb-2">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="text-center py-16 px-6 bg-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Ready to start growing?
        </h2>
        <Button className="text-lg px-6 py-3">Join Growth Space Today</Button>
      </section>
    </div>
  );
}
