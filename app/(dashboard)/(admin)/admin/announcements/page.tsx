"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface Announcement {
  title: string;
  message: string;
  date: string;
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleCreateAnnouncement = () => {
    if (!title.trim() || !message.trim()) return;

    const newAnnouncement: Announcement = {
      title,
      message,
      date: new Date().toLocaleString(),
    };

    setAnnouncements([newAnnouncement, ...announcements]);
    setTitle("");
    setMessage("");
  };

  return (
    <div className="p-6 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Announcements
        </h1>

        {/* <Dialog>
          <DialogTrigger asChild>
            <Button>Create Announcement</Button>
          </DialogTrigger>

          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create a New Announcement</DialogTitle>
              <DialogDescription>
                Write a short title and message for your announcement.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <Input
                placeholder="Announcement Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Textarea
                placeholder="Write your announcement..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
              />
            </div>

            <DialogFooter>
              <Button onClick={handleCreateAnnouncement}>
                Post Announcement
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog> */}
      </header>

      {/* <section className="grid gap-4 md:grid-cols-2">
        {announcements.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No announcements yet. Create one above!
          </p>
        ) : (
          announcements.map((announcement, index) => (
            <Card
              key={index}
              className="bg-white dark:bg-gray-800 border dark:border-gray-700"
            >
              <CardHeader>
                <CardTitle className="text-green-700 dark:text-green-400">
                  {announcement.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  {announcement.message}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Posted on {announcement.date}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </section> */}
      <section className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4 p-6 bg-gray-50 dark:bg-gray-900">
        <div className="text-7xl">🚧🛠️</div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          This Page is a Work in Progress
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          We’re building something awesome here! Come back later to see it in
          action. In the meantime, explore other parts of the site 🏃‍♀️💨
        </p>
      </section>
    </div>
  );
}
