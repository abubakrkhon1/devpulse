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
import { useUser } from "@/hooks/useUser";
import { UserOnlineContext } from "@/hooks/useUserOnlineContext";
import { useTheme } from "next-themes";
import SecuritySection from "@/components/profile-ui/SecuritySection";
import NotificationSection from "@/components/profile-ui/NotificationSection";
import BillingSection from "@/components/profile-ui/BillingSection";
import { formatDate } from "@/lib/utils";

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
  const { setTheme, theme } = useTheme();
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

  let currentDeviceIndex = 0;

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
                    variant="default"
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
                    {"Last online: " +
                      formatDate(user?.lastActive || new Date())}
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
                  {formatDate(user?.createdAt || new Date())}
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
                          <span className="text-green-500 pl-1">
                            Active now
                          </span>
                        ) : (
                          formatDate(user?.lastActive || new Date())
                        )}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">Login Devices</span>
                      <div className="flex flex-col gap-3 mt-2">
                        {user?.loginDevices.map((device, index) => {
                          const isCurrentDevice = index === currentDeviceIndex;

                          return (
                            <div
                              key={index}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="flex items-center gap-2">
                                <div
                                  className={`h-2 w-2 rounded-full ${
                                    isCurrentDevice
                                      ? "bg-primary"
                                      : "bg-muted-foreground"
                                  }`}
                                ></div>
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
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
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
                              const isCurrentDevice =
                                index === currentDeviceIndex;

                              return (
                                <div
                                  key={index}
                                  className="flex items-center justify-between text-sm"
                                >
                                  <span className="flex items-center gap-2">
                                    <div
                                      className={`h-2 w-2 rounded-full ${
                                        isCurrentDevice
                                          ? "bg-primary"
                                          : "bg-muted-foreground"
                                      }`}
                                    ></div>
                                    {device.browser} • {device.os}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {formatDate(
                                      device.loggedInAt || new Date()
                                    )}
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
        )}

        {/* Security Section */}
        {activeSection === "security" && <SecuritySection />}

        {/* Notifications Section */}
        {activeSection === "notifications" && <NotificationSection />}

        {/* Billing Section */}
        {activeSection === "billing" && <BillingSection />}
      </div>
    </div>
  );
}
