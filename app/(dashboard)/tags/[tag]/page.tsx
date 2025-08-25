import React from "react";

interface TagPageProps {
  params: { tag: string };
}

export default function TagPage({ params }: TagPageProps) {
  const { tag } = params;

  return <p>{tag}</p>;
}
