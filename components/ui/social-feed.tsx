import React from "react";
import PostCard from "./post-card";

const mockPosts = [
  {
    user: {
      name: "Jane Doe",
      image:
        "https://res.cloudinary.com/deqr9srmf/image/upload/v1754989456/growth-space/rzy32o5a9ekhtv841pw4.jpg",
    },
    title: "Key Takeaways from Agile Project Management Workshop",
    content:
      "Learned how to implement daily stand-ups effectively and how to handle sprint retrospectives for better team alignment.",
    tags: ["Agile", "Project Management", "Teamwork"],
    likes: 42,
    comments: 8,
    timestamp: "2 hours ago",
  },
  {
    user: {
      name: "Mark Lee",
      image:
        "https://res.cloudinary.com/deqr9srmf/image/upload/v1754989456/growth-space/rzy32o5a9ekhtv841pw4.jpg",
    },
    title: "Data Visualization Best Practices",
    content:
      "Focus on clarity, use consistent color palettes, and avoid unnecessary chartjunk. Tools like Tableau and Power BI make it easy to iterate quickly.",
    tags: ["Data", "Visualization", "Tableau"],
    likes: 31,
    comments: 5,
    timestamp: "Yesterday",
  },
  {
    user: {
      name: "Emily Chan",
      image:
        "https://res.cloudinary.com/deqr9srmf/image/upload/v1754989456/growth-space/rzy32o5a9ekhtv841pw4.jpg",
    },
    content:
      "Just finished the 'Emotional Intelligence for Leaders' course — highly recommend it! It’s been eye-opening for improving communication with my team.",
    tags: ["Leadership", "Soft Skills", "Communication"],
    likes: 57,
    comments: 14,
    timestamp: "3 days ago",
  },
  {
    user: {
      name: "Carlos Ruiz",
      image:
        "https://res.cloudinary.com/deqr9srmf/image/upload/v1754989456/growth-space/rzy32o5a9ekhtv841pw4.jpg",
    },
    title: "Cloud Security Essentials",
    content:
      "Understand shared responsibility models and always implement multi-factor authentication. Encryption at rest and in transit is non-negotiable.",
    tags: ["Cloud", "Security", "AWS"],
    likes: 19,
    comments: 3,
    timestamp: "Aug 1, 2025",
  },
];

const SocialFeed = () => {
  return (
    <div className="flex flex-col gap-4">
      {mockPosts.map((post, idx) => (
        <PostCard key={idx} post={post} />
      ))}
    </div>
  );
};

export default SocialFeed;
