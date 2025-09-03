"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updatePassword } from "@/actions/auth";
import { useActionState, useEffect } from "react";
import toast from "react-hot-toast";

export default function PasswordSettings() {
  const [state, formAction] = useActionState(updatePassword, {
    success: false,
    message: "",
    errors: {},
  });

  useEffect(() => {
    if (state.success) {
      toast.success("Password changed successfully!");
    }
  }, [state.success]);

  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-gray-100">
          Account Settings
        </CardTitle>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your account credentials and security settings
        </p>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <Input
            name="password"
            placeholder="New Password"
            type="password"
            className="w-full"
          />
          <Input
            name="confirmPassword"
            placeholder="Confirm New Password"
            type="password"
            className="w-full"
          />
          <Button className="mt-2">Update Password</Button>
        </form>
      </CardContent>
    </Card>
  );
}
