import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 py-8">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input placeholder="Full Name" defaultValue="Jane Doe" />
            <Input placeholder="Username" defaultValue="janedoe" />
            <Input placeholder="Email" defaultValue="jane.doe@example.com" />
          </div>
          <Button className="mt-2">Update Profile</Button>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Manage your account credentials and security settings
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Change Password"
            type="password"
            defaultValue="********"
          />
          <Input
            placeholder="Confirm Password"
            type="password"
            defaultValue="********"
          />
          <Button className="mt-2">Update Password</Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <p>Email Notifications</p>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <p>Push Notifications</p>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <p>Weekly Summary</p>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Theme Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Theme Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button className="bg-gray-100 text-gray-800 hover:bg-gray-200">
              Light
            </Button>
            <Button className="bg-gray-800 text-white hover:bg-gray-900">
              Dark
            </Button>
            <Button className="bg-gradient-to-r from-green-600 to-green-400 text-white hover:opacity-90">
              System
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
