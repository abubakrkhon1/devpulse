"use client";
import { CheckCircle, Clock, Globe, Share2, UserIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select } from "../ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "../ui/switch";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { User } from "@/types/types";
import { toast } from "sonner";

export default function ProfileSection(user: User, onlineStatus: boolean) {
  const { setTheme, theme } = useTheme();
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    userId: "",
    name: "",
    jobTitle: "",
    department: "",
    bio: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        userId: user._id || "",
        name: user.name || "",
        jobTitle: user.jobTitle || "",
        department: user.department || "",
        bio: user.bio || "",
      });
    }
    console.log(user?.loginDevices);
  }, [user]);

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    const now = new Date();

    // Format just the time portion
    const timeFormat = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    const timeString = timeFormat.format(date);

    // Check if it's today
    if (date.toDateString() === now.toDateString()) {
      return `Today at ${timeString}`;
    }

    // Check if it's yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${timeString}`;
    }

    // If it's not today or yesterday, show the date
    const dateFormat = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    });
    const dateStringed = dateFormat.format(date);

    return `${dateStringed} at ${timeString}`;
  };

  // Fetch user data
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // API call
      const res = await fetch("/api/profile/updateBio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success("Your profile has been updated successfully.");
      } else {
        toast.error("Error updating user!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Card className="overflow-hidden border-0 shadow-md">
          <CardHeader className="bg-secondary/5 border-b border-border/50">
            <CardTitle className="text-xl flex items-center gap-2">
              <UserIcon size={18} className="text-primary" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleProfileUpdate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    className="border-border/50 focus-visible:ring-primary/30"
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    value={form.name}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="border-border/50 bg-secondary/5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Job Title
                  </Label>
                  <Input
                    id="title"
                    className="border-border/50 focus-visible:ring-primary/30"
                    onChange={(e) =>
                      setForm({ ...form, jobTitle: e.target.value })
                    }
                    value={form.jobTitle}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-sm font-medium">
                    Department
                  </Label>
                  <Input
                    id="department"
                    className="border-border/50 focus-visible:ring-primary/30"
                    onChange={(e) =>
                      setForm({ ...form, department: e.target.value })
                    }
                    value={form.department}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio" className="text-sm font-medium">
                    Bio
                  </Label>
                  <textarea
                    id="bio"
                    className="min-h-32 w-full rounded-md border border-border/50 bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30"
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    value={form.bio}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="relative overflow-hidden group"
                >
                  {isSaving ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    <span>Save Changes</span>
                  )}
                  <span className="absolute inset-0 translate-y-[105%] bg-primary/20 transition-transform group-hover:translate-y-[0%] duration-300" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-8 overflow-hidden border-0 shadow-md">
          <CardHeader className="bg-secondary/5 border-b border-border/50">
            <CardTitle className="text-xl flex items-center gap-2">
              <Globe size={18} className="text-primary" />
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border/50">
                <div>
                  <h4 className="font-medium">Language</h4>
                  <p className="text-sm text-muted-foreground">
                    Set your preferred language for the interface
                  </p>
                </div>
                <div className="flex gap-4">
                  <Select defaultValue="english">
                    <option value="english">English</option>
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                    <option value="german">German</option>
                    <option value="japanese">Japanese</option>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between pb-4 border-b border-border/50">
                <div>
                  <h4 className="font-medium">Time Zone</h4>
                  <p className="text-sm text-muted-foreground">
                    Set your local time zone for scheduling
                  </p>
                </div>
                <div className="flex gap-4">
                  <Select defaultValue="utc-8">
                    <option value="utc-8">Pacific Time (UTC-8)</option>
                    <option value="utc-5">Eastern Time (UTC-5)</option>
                    <option value="utc+0">GMT (UTC+0)</option>
                    <option value="utc+1">Central European (UTC+1)</option>
                    <option value="utc+8">China Standard (UTC+8)</option>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Theme</h4>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred color theme
                  </p>
                </div>
                <div className="flex gap-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className={
                      theme === "light"
                        ? `border-primary/20 bg-primary dark:bg-white dark:text-black text-white`
                        : `border-primary/20 bg-primary/5`
                    }
                    onClick={() => setTheme("light")}
                  >
                    Light
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={
                      theme === "dark"
                        ? `border-primary/20 bg-primary dark:bg-white dark:text-black text-white`
                        : `border-primary/20 bg-primary/5 dark:bg-secondary`
                    }
                    onClick={() => setTheme("dark")}
                  >
                    Dark
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={
                      theme === "system"
                        ? `border-primary/20 bg-primary dark:bg-white dark:text-black text-white`
                        : `border-primary/20 bg-primary/5 dark:bg-secondary`
                    }
                    onClick={() => setTheme("system")}
                  >
                    System
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        <Card className="overflow-hidden border-0 shadow-md">
          <CardHeader className="bg-secondary/5 border-b border-border/50">
            <CardTitle className="text-xl flex items-center gap-2">
              <Clock size={18} className="text-primary" />
              Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">Last Active</span>
                <span className="text-muted-foreground flex items-center gap-1">
                  <div
                    className={`${
                      onlineStatus ? "bg-green-500" : "bg-primary"
                    } h-2 w-2 rounded-full`}
                  ></div>
                  {onlineStatus ? (
                    <span className="text-green-500 pl-1">Active now</span>
                  ) : (
                    formatDate(user?.lastActive || new Date())
                  )}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">Login Devices</span>
                <div className="flex flex-col gap-3 mt-2">
                  {user?.loginDevices.map((device, index) => {
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="flex items-center gap-2">
                          {device.browser} • {device.os}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(device.loggedInAt || new Date())}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-border/50">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full">
                      View All Activity
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>
                        <span className="text-sm font-medium">
                          Login Devices
                        </span>
                      </DialogTitle>
                      <DialogDescription>
                        These are all of your devices you used to sign-in
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 mt-2">
                      {user?.loginDevices.map((device, index) => {
                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="flex items-center gap-2">
                              {device.browser} • {device.os}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(device.loggedInAt || new Date())}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Close
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 shadow-md">
          <CardHeader className="bg-secondary/5 border-b border-border/50">
            <CardTitle className="text-xl flex items-center gap-2">
              <Share2 size={18} className="text-primary" />
              Connected Accounts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-secondary/20 flex items-center justify-center">
                    <span className="font-semibold text-sm">G</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Google</h4>
                    <p className="text-xs text-muted-foreground">
                      Calendar & Drive
                    </p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-secondary/20 flex items-center justify-center">
                    <span className="font-semibold text-sm">S</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Slack</h4>
                    <p className="text-xs text-muted-foreground">
                      Messaging & Notifications
                    </p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-secondary/20 flex items-center justify-center">
                    <span className="font-semibold text-sm">G</span>
                  </div>
                  <div>
                    <h4 className="font-medium">GitHub</h4>
                    <p className="text-xs text-muted-foreground">
                      Repository Access
                    </p>
                  </div>
                </div>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
