import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function PopularTopics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Popular Topics</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {["Agile", "Cloud", "Leadership", "UI/UX", "Data"].map((topic, i) => (
          <Button key={i} variant="secondary" size="sm">
            <Link href={`/topics/${topic.toLowerCase()}`}>{topic}</Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
