// src/app/admin/settings/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Manage general application settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="appName">Application Name</Label>
            <Input id="appName" defaultValue="BookDoc" />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
             <div>
                <Label htmlFor="emailNotifications" className="font-medium">Enable Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                   Send email confirmations for bookings.
                </p>
              </div>
             <Switch id="emailNotifications" defaultChecked />
          </div>
           <div className="flex items-center justify-between rounded-lg border p-4">
             <div>
                <Label htmlFor="darkMode" className="font-medium">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                   Enable dark mode for the admin interface.
                </p>
              </div>
             <Switch id="darkMode" />
          </div>
           <Button>Save Changes</Button>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Physician Management</CardTitle>
          <CardDescription>Add or update physician information (placeholder).</CardDescription>
        </CardHeader>
        <CardContent>
           <p className="text-muted-foreground">Physician management features would go here.</p>
           <Button variant="outline" className="mt-4">Manage Physicians</Button>
        </CardContent>
      </Card>

    </div>
  );
}
