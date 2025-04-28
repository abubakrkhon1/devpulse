"use client";

import { useState, useEffect, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Bell,
  Key,
  LogOut,
  User as UserIcon,
  Briefcase,
  CreditCard,
  Shield,
  Calendar,
  Mail,
  CheckCircle,
  Clock,
  Lock,
  Globe,
  Share2,
  AlertTriangle,
  Icon,
  CircleX,
  LucideIcon,
  Dot,
} from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { UserOnlineContext } from "../layout";

// Missing SelectComponent
const Select = ({ children, defaultValue, ...props }: any) => (
  <select
    defaultValue={defaultValue}
    className="h-9 w-full rounded-md border border-border/50 bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30"
    {...props}
  >
    {children}
  </select>
);

export default function AccountPage() {
  const [activeSection, setActiveSection] = useState<string>("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [showMessage, setShowMessage] = useState<{
    message: string;
    status: boolean;
    icon: LucideIcon; // <-- type properly
  }>({
    message: "",
    status: false,
    icon: CheckCircle,
  });
  const { user, loading, error } = useUser();

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
  }, [user]);

  // Inside your AccountPage component
  const onlineStatus = useContext(UserOnlineContext);

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
        setShowMessage({
          message: "Your profile has been updated successfully.",
          icon: CheckCircle,
          status: true,
        });
        setTimeout(
          () =>
            setShowMessage({ message: "", icon: CheckCircle, status: false }),
          3000
        );
      } else {
        setShowMessage({
          message: "Error updating user!",
          icon: CircleX,
          status: true,
        });
        setTimeout(
          () =>
            setShowMessage({ message: "", icon: CheckCircle, status: false }),
          3000
        );
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-secondary/5">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 animate-pulse"></div>
          <div className="h-4 w-48 bg-primary/10 rounded animate-pulse"></div>
          <div className="h-3 w-32 bg-primary/10 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5">
      {/* Header with user overview */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 backdrop-blur-sm z-0"></div>
        <div className="container max-w-6xl mx-auto pt-8 pb-12 px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
              <AvatarImage src={user?.avatar || ""} alt={user?.name} />
              <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                {user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <h1 className="text-2xl font-bold">{user?.name}</h1>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-primary/10 text-primary border-0"
                  >
                    {user?.role}
                  </Badge>
                  {user?.verified && (
                    <Badge
                      variant="outline"
                      className="bg-secondary/10 border-0 flex gap-1 items-center"
                    >
                      <CheckCircle size={12} className="text-primary" />{" "}
                      Verified
                    </Badge>
                  )}
                </div>
              </div>

              <div className="my-1 text-muted-foreground">
                {onlineStatus ? (
                  <h4 className="text-green-500 flex">
                    <Dot /> {"Online"}
                  </h4>
                ) : (
                  <h4 className="text-neutral-500">
                    {"Last online: " + formatDate(user?.lastActive || "")}
                  </h4>
                )}
              </div>

              <div className="mt-1 text-muted-foreground">
                <span className="inline-flex items-center gap-1 mr-4">
                  <Briefcase size={14} /> {user?.jobTitle}
                </span>
                <span className="inline-flex items-center gap-1 mr-4">
                  <Mail size={14} /> {user?.email}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar size={14} /> Joined{" "}
                  {formatDate(user?.createdAt || "")}
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="hidden md:flex gap-2 items-center self-start"
            >
              <LogOut size={16} />
              Sign Out
            </Button>
          </div>

          {/* Navigation tabs under glassy header */}
          <div className="flex mt-8 border-b overflow-x-auto pb-px hide-scrollbar">
            {[
              { id: "profile", label: "Profile", icon: UserIcon },
              { id: "security", label: "Security", icon: Shield },
              { id: "notifications", label: "Notifications", icon: Bell },
              { id: "billing", label: "Billing", icon: CreditCard },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`px-5 py-3 flex items-center gap-2 font-medium text-sm whitespace-nowrap transition-colors
                  ${
                    activeSection === item.id
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="container max-w-6xl mx-auto py-8 px-4">
        {/* Success notification */}
        {showMessage.status && (
          <div
            className={`${
              showMessage.icon == CircleX && "bg-red-300"
            } mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg flex items-center gap-3`}
          >
            <showMessage.icon size={20} className="text-primary" />
            <p>{showMessage.message}</p>
          </div>
        )}

        {/* Profile Section */}
        {activeSection === "profile" && (
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
                          onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                          }
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
                        <Label
                          htmlFor="department"
                          className="text-sm font-medium"
                        >
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
                          onChange={(e) =>
                            setForm({ ...form, bio: e.target.value })
                          }
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
                          <option value="utc+1">
                            Central European (UTC+1)
                          </option>
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
                          className="border-primary/20 bg-primary/5"
                        >
                          Light
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-primary/20 bg-primary/5"
                        >
                          Dark
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-primary/20 bg-primary/5"
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
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                        {user?.isOnline ? (
                          <span className="text-green-500 pl-1">
                            Active now
                          </span>
                        ) : (
                          formatDate(user?.lastActive || "Error formatting")
                        )}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">Login Devices</span>
                      <div className="flex flex-col gap-3 mt-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                            MacBook Pro • San Francisco
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Current
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-muted-foreground"></div>
                            iPhone 15 • San Francisco
                          </span>
                          <span className="text-xs text-muted-foreground">
                            2 hours ago
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/50">
                      <Button variant="outline" size="sm" className="w-full">
                        View All Activity
                      </Button>
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
        )}

        {/* Security Section */}
        {activeSection === "security" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="overflow-hidden border-0 shadow-md">
                <CardHeader className="bg-secondary/5 border-b border-border/50">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Lock size={18} className="text-primary" />
                    Login Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-border/50">
                      <div>
                        <h4 className="font-medium">Password</h4>
                        <p className="text-sm text-muted-foreground">
                          Last changed 3 months ago
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-primary/20 bg-primary/5"
                      >
                        Change Password
                      </Button>
                    </div>

                    <div className="flex items-center justify-between pb-4 border-b border-border/50">
                      <div>
                        <h4 className="font-medium">
                          Two-Factor Authentication (2FA)
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-primary/20 text-primary border-primary/10">
                          Enabled
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-primary/20 bg-primary/5"
                        >
                          Manage
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pb-4 border-b border-border/50">
                      <div>
                        <h4 className="font-medium">Recovery Email</h4>
                        <p className="text-sm text-muted-foreground">
                          Backup email for account recovery
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          a****@gmail.com
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-primary/20 bg-primary/5"
                        >
                          Update
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Active Sessions</h4>
                        <p className="text-sm text-muted-foreground">
                          Devices where you're currently logged in
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-primary/20 bg-primary/5"
                      >
                        View All
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-8 overflow-hidden border-0 shadow-md">
                <CardHeader className="bg-secondary/5 border-b border-border/50">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Shield size={18} className="text-primary" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-border/50">
                      <div>
                        <h4 className="font-medium">Login Notifications</h4>
                        <p className="text-sm text-muted-foreground">
                          Get alerted about new login attempts
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between pb-4 border-b border-border/50">
                      <div>
                        <h4 className="font-medium">Secure Browsing</h4>
                        <p className="text-sm text-muted-foreground">
                          Always use HTTPS for enhanced security
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Session Timeout</h4>
                        <p className="text-sm text-muted-foreground">
                          Automatically log out after inactivity
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <Select defaultValue="60">
                          <option value="30">30 minutes</option>
                          <option value="60">1 hour</option>
                          <option value="120">2 hours</option>
                          <option value="240">4 hours</option>
                          <option value="720">12 hours</option>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="overflow-hidden border-0 shadow-md">
                <CardHeader className="bg-secondary/5 border-b border-border/50">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <AlertTriangle size={18} className="text-primary" />
                    Security Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Overall Security
                        </span>
                        <Badge className="bg-primary/20 text-primary border-primary/10">
                          Strong
                        </Badge>
                      </div>
                      <div className="w-full bg-secondary/20 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: "85%" }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">
                        Security Checklist
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2 text-muted-foreground">
                          <CheckCircle size={16} className="text-primary" />
                          Strong password set
                        </li>
                        <li className="flex items-center gap-2 text-muted-foreground">
                          <CheckCircle size={16} className="text-primary" />
                          Two-factor authentication enabled
                        </li>
                        <li className="flex items-center gap-2 text-muted-foreground">
                          <CheckCircle size={16} className="text-primary" />
                          Recovery email configured
                        </li>
                        <li className="flex items-center gap-2 text-muted-foreground">
                          <CheckCircle size={16} className="text-primary" />
                          Recent security audit completed
                        </li>
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-border/50">
                      <div className="p-3 bg-primary/5 border border-primary/10 rounded-lg">
                        <p className="text-sm">
                          Your account security is reviewed regularly. Last
                          security scan:{" "}
                          <span className="font-medium">April 20, 2025</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Notifications Section */}
        {activeSection === "notifications" && (
          <Card className="overflow-hidden border-0 shadow-md">
            <CardHeader className="bg-secondary/5 border-b border-border/50">
              <CardTitle className="text-xl flex items-center gap-2">
                <Bell size={18} className="text-primary" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="pb-6 border-b border-border/50">
                  <h3 className="text-lg font-medium mb-4">
                    Email Notifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Security Alerts</h4>
                        <p className="text-sm text-muted-foreground">
                          Get notified about security issues
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Project Updates</h4>
                        <p className="text-sm text-muted-foreground">
                          Get notified about your project activities
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Team Messages</h4>
                        <p className="text-sm text-muted-foreground">
                          Get notified about team communication
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Monthly Reports</h4>
                        <p className="text-sm text-muted-foreground">
                          Receive monthly activity summary
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="pb-6 border-b border-border/50">
                  <h3 className="text-lg font-medium mb-4">
                    Push Notifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Project Updates</h4>
                        <p className="text-sm text-muted-foreground">
                          Real-time update notifications
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Comments</h4>
                        <p className="text-sm text-muted-foreground">
                          When someone comments on your work
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Task Assignments</h4>
                        <p className="text-sm text-muted-foreground">
                          When you're assigned a new task
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Mentions</h4>
                        <p className="text-sm text-muted-foreground">
                          When you're mentioned in comments or discussions
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="pb-6 border-b border-border/50">
                  <h3 className="text-lg font-medium mb-4">
                    Notification Channels
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Email</h4>
                        <p className="text-sm text-muted-foreground">
                          Send notifications to your email address
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Browser</h4>
                        <p className="text-sm text-muted-foreground">
                          Show browser notifications
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Mobile Push</h4>
                        <p className="text-sm text-muted-foreground">
                          Send notifications to your mobile device
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">SMS</h4>
                        <p className="text-sm text-muted-foreground">
                          Receive important alerts via text message
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Frequency Settings
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Email Digest</h4>
                        <p className="text-sm text-muted-foreground">
                          How often to send email summaries
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <Select defaultValue="daily">
                          <option value="realtime">Real-time</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="never">Never</option>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Quiet Hours</h4>
                        <p className="text-sm text-muted-foreground">
                          Don't send notifications during these hours
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">From</span>
                          <Select defaultValue="22">
                            <option value="20">8:00 PM</option>
                            <option value="21">9:00 PM</option>
                            <option value="22">10:00 PM</option>
                            <option value="23">11:00 PM</option>
                          </Select>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">To</span>
                          <Select defaultValue="7">
                            <option value="6">6:00 AM</option>
                            <option value="7">7:00 AM</option>
                            <option value="8">8:00 AM</option>
                            <option value="9">9:00 AM</option>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex justify-end">
                  <Button>Save Notification Preferences</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Billing Section */}
        {activeSection === "billing" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="overflow-hidden border-0 shadow-md">
                <CardHeader className="bg-secondary/5 border-b border-border/50">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <CreditCard size={18} className="text-primary" />
                    Payment Methods
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Payment Method 1 */}
                    <div className="flex items-center justify-between pb-4 border-b border-border/50">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-16 bg-secondary/10 rounded flex items-center justify-center">
                          <span className="font-semibold">VISA</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Visa ending in 4242</h4>
                          <p className="text-sm text-muted-foreground">
                            Expires 09/2026
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-primary/5 border-primary/10"
                        >
                          Default
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-primary/20 bg-primary/5"
                        >
                          Edit
                        </Button>
                      </div>
                    </div>

                    {/* Payment Method 2 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-16 bg-secondary/10 rounded flex items-center justify-center">
                          <span className="font-semibold">MC</span>
                        </div>
                        <div>
                          <h4 className="font-medium">
                            Mastercard ending in 8353
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Expires 12/2027
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-primary/20 bg-primary/5"
                        >
                          Make Default
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-primary/20 bg-primary/5"
                        >
                          Edit
                        </Button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/50">
                      <Button
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2"
                      >
                        <span>Add Payment Method</span>
                        <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-medium">+</span>
                        </span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-8 overflow-hidden border-0 shadow-md">
                <CardHeader className="bg-secondary/5 border-b border-border/50">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Clock size={18} className="text-primary" />
                    Billing History
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border/50">
                            <th className="text-left font-medium text-muted-foreground py-2 px-1">
                              Date
                            </th>
                            <th className="text-left font-medium text-muted-foreground py-2 px-1">
                              Description
                            </th>
                            <th className="text-left font-medium text-muted-foreground py-2 px-1">
                              Amount
                            </th>
                            <th className="text-left font-medium text-muted-foreground py-2 px-1">
                              Status
                            </th>
                            <th className="text-right font-medium text-muted-foreground py-2 px-1">
                              Receipt
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-border/20">
                            <td className="py-3 px-1 text-sm">Apr 15, 2025</td>
                            <td className="py-3 px-1 text-sm">
                              Enterprise Plan Subscription
                            </td>
                            <td className="py-3 px-1 text-sm">$199.00</td>
                            <td className="py-3 px-1 text-sm">
                              <Badge className="bg-primary/10 text-primary border-0">
                                Paid
                              </Badge>
                            </td>
                            <td className="py-3 px-1 text-sm text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-1 text-primary"
                              >
                                Download
                              </Button>
                            </td>
                          </tr>
                          <tr className="border-b border-border/20">
                            <td className="py-3 px-1 text-sm">Mar 15, 2025</td>
                            <td className="py-3 px-1 text-sm">
                              Enterprise Plan Subscription
                            </td>
                            <td className="py-3 px-1 text-sm">$199.00</td>
                            <td className="py-3 px-1 text-sm">
                              <Badge className="bg-primary/10 text-primary border-0">
                                Paid
                              </Badge>
                            </td>
                            <td className="py-3 px-1 text-sm text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-1 text-primary"
                              >
                                Download
                              </Button>
                            </td>
                          </tr>
                          <tr className="border-b border-border/20">
                            <td className="py-3 px-1 text-sm">Feb 15, 2025</td>
                            <td className="py-3 px-1 text-sm">
                              Enterprise Plan Subscription
                            </td>
                            <td className="py-3 px-1 text-sm">$199.00</td>
                            <td className="py-3 px-1 text-sm">
                              <Badge className="bg-primary/10 text-primary border-0">
                                Paid
                              </Badge>
                            </td>
                            <td className="py-3 px-1 text-sm text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-1 text-primary"
                              >
                                Download
                              </Button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="flex justify-center">
                      <Button variant="outline" size="sm" className="mt-4">
                        View All Transactions
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="overflow-hidden border-0 shadow-md sticky top-8">
                <CardHeader className="bg-secondary/5 border-b border-border/50">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Briefcase size={18} className="text-primary" />
                    Current Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-lg">Enterprise Plan</h4>
                      <Badge className="bg-primary/20 text-primary border-primary/10">
                        Current
                      </Badge>
                    </div>

                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold">$199</span>
                      <span className="text-muted-foreground ml-1">/month</span>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Next billing date: May 15, 2025
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Current billing period: Apr 15 - May 15
                      </p>
                    </div>

                    <div className="border-t border-border/50 pt-4">
                      <h5 className="font-medium mb-3">Plan Features</h5>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle size={14} className="text-primary" />
                          Unlimited users
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle size={14} className="text-primary" />
                          Unlimited storage
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle size={14} className="text-primary" />
                          Advanced analytics
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle size={14} className="text-primary" />
                          24/7 priority support
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle size={14} className="text-primary" />
                          Custom integrations
                        </li>
                      </ul>
                    </div>

                    <div className="flex flex-col gap-3">
                      <Button>Manage Subscription</Button>
                      <Button variant="outline">View All Plans</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
