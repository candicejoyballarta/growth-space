"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import EmailSettings from "@/components/ui/email-settings";
import PasswordSettings from "@/components/ui/password-settings";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-8">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Settings
      </h1>

      {/* Email Settings */}
      <EmailSettings />

      {/* Password Settings */}
      <PasswordSettings />

      {/* Theme Preferences */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">
            Theme Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              className={`${
                theme === "light"
                  ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  : "bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-400"
              } hover:bg-gray-200 dark:hover:bg-gray-500 transition`}
              onClick={() => theme !== "light" && toggleTheme()}
            >
              Light
            </Button>
            <Button
              className={`${
                theme === "dark"
                  ? "bg-gray-800 text-white dark:bg-gray-900 dark:text-white"
                  : "bg-gray-700 text-gray-300 dark:bg-gray-700 dark:text-gray-300"
              } hover:bg-gray-900 dark:hover:bg-gray-800 transition`}
              onClick={() => theme !== "dark" && toggleTheme()}
            >
              Dark
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
