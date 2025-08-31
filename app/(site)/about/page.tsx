import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100 py-14 px-6 transition-colors">
      <section className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-green-700 dark:text-green-400 mb-2">
          About Growth Space
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
          Growth Space is a place for sharing insights, reflections, and
          encouraging others to grow with purpose. It represents a commitment to
          personal development, lifelong learning, and meaningful conversations.
        </p>

        {/* 👇 Back to Home button */}
        <Button asChild variant="outline">
          <Link href="/">Back to Home</Link>
        </Button>
      </section>

      <section className="max-w-4xl mx-auto mt-12 grid md:grid-cols-2 gap-12 items-center">
        <Image
          src="/candice-profile.jpg"
          alt="Candice Joy Ballarta"
          width={400}
          height={400}
          className="rounded-xl shadow-md mx-auto"
        />

        <div>
          <h2 className="text-2xl font-semibold text-green-700 dark:text-green-400 mb-4">
            Meet the Developer
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Hi! I&apos;m <strong>Candice Joy Ballarta</strong>, an Analyst
            Programmer at Essilor Shared Services Philippines Inc. I specialize
            in building interactive, user-friendly interfaces using React,
            Next.js, TypeScript, and Tailwind CSS.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            This project is a reflection of my passion for front-end development
            and building purposeful user experiences. It also integrates some of
            my learnings in agile development, PWA optimization, and modular
            code structure.
          </p>
          <Button asChild>
            <Link href="https://github.com/candicejoyballarta" target="_blank">
              Visit My GitHub
            </Link>
          </Button>
        </div>
      </section>

      <section className="mt-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">More From My GitHub</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-xl mx-auto">
          You can explore more of my side projects, including web applications,
          discord bots, and experimental UI layouts that reflect my growth as a
          developer.
        </p>
        <Button asChild variant="outline">
          <Link
            href="https://github.com/candicejoyballarta?tab=repositories"
            target="_blank"
          >
            See Repositories
          </Link>
        </Button>
      </section>
    </div>
  );
}
