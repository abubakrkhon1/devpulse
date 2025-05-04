"use client";

import { useState, useEffect, SetStateAction } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Bell,
  LogOut,
  User as UserIcon,
  Briefcase,
  CreditCard,
  Shield,
  Calendar,
  Mail,
  CheckCircle,
  Clock,
  Globe,
  Share2,
  CircleX,
  LucideIcon,
  Dot,
  ArrowLeft,
  Contact,
  UserPlus,
  UserMinus,
  UserCheck,
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
import { useTheme } from "next-themes";
import SecuritySection from "@/components/profile-ui/SecuritySection";
import NotificationSection from "@/components/profile-ui/NotificationSection";
import BillingSection from "@/components/profile-ui/BillingSection";
import { formatDate } from "@/lib/utils";
import { Friend, User } from "@/types/types";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  cancelFriendRequest,
  respondFriendRequest,
  useFriendRequests,
} from "@/hooks/useFriends";

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

export default function UserProfile({
  user,
  loading,
  error,
}: {
  user: User | null;
  loading: boolean;
  error: string | null;
}) {
  const { setTheme, theme } = useTheme();
  const [activeSection, setActiveSection] = useState<string>("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [showMessage, setShowMessage] = useState<{
    message: string;
    status: boolean;
    icon: LucideIcon;
  }>({
    message: "",
    status: false,
    icon: CheckCircle,
  });

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

  const { isOnline, onlineUsers } = useOnlineStatus(user?._id);

  const [tab, setTab] = useState("all");
  const friends = user?.friends;

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

  let currentDeviceIndex = 0;

  const router = useRouter();

  const {
    incoming,
    outgoing,
    friendRequestError,
    friendRequestLoading,
    refresh,
  } = useFriendRequests(user?._id);

  const handleCancel = async (otherId: string) => {
    await cancelFriendRequest(user?._id, otherId);
    await refresh();
  };
  const handleRespond = async (requester: string, accept: boolean) => {
    await respondFriendRequest(requester, user!._id, accept);
    await refresh();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5">
      {/* Header with user overview */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 backdrop-blur-sm z-0"></div>
        <div className="container max-w-6xl mx-auto pt-8 pb-12 px-4 relative z-10">
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

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
                {isOnline ? (
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

              {/* Friends & Requests Tab */}
              <Card className="mt-8 overflow-hidden border-0 shadow-md">
                <CardHeader className="bg-secondary/5 border-b border-border/50">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <UserIcon size={18} className="text-primary" />
                    Friends & Requests
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <Tabs
                    value={tab}
                    onValueChange={(value: string) => setTab(value)}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                      <TabsTrigger value="all">All Friends</TabsTrigger>
                      <TabsTrigger value="incoming">Incoming</TabsTrigger>
                      <TabsTrigger value="outgoing">Sent</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="mt-0">
                      {friends && friends.length > 0 ? (
                        <div className="space-y-4">
                          {friends.map((friend: Friend) => (
                            <div
                              key={
                                typeof friend === "object" ? friend._id : friend
                              }
                              className="flex items-center gap-3 p-3 rounded-md border border-border/50 bg-secondary/5"
                            >
                              <Avatar className="h-10 w-10">
                                {typeof friend === "object" && friend.avatar ? (
                                  <AvatarImage
                                    src={friend.avatar}
                                    alt={friend.name}
                                  />
                                ) : (
                                  <AvatarFallback>
                                    {typeof friend === "object" && friend.name
                                      ? friend.name[0]
                                      : "?"}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <div className="flex-1">
                                <div className="font-medium">
                                  {typeof friend === "object"
                                    ? friend.name
                                    : `User ${friend}`}
                                </div>
                                {typeof friend === "object" &&
                                  friend.jobTitle && (
                                    <div className="text-xs text-muted-foreground">
                                      {friend.jobTitle}
                                    </div>
                                  )}
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="ml-auto"
                                onClick={() =>
                                  router.push(
                                    `/profiles/${friend._id as string}`
                                  )
                                }
                              >
                                View Profile
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                          <UserIcon
                            size={48}
                            className="text-muted-foreground/40 mb-3"
                          />
                          <p className="text-muted-foreground mb-2">
                            No friends yet
                          </p>
                          <p className="text-sm text-muted-foreground max-w-md">
                            Connect with other users by sending friend requests
                            or accepting incoming requests
                          </p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="incoming" className="mt-0">
                      {incoming && incoming.length > 0 ? (
                        <div className="space-y-4">
                          {incoming.map((request) => {
                            // Extract the ID from the request object or use directly if it's a string
                            const id =
                              typeof request === "object"
                                ? request._id || request.requester
                                : request;
                            const name =
                              typeof request === "object" && request.requester
                                ? request.requester
                                : `User ${id.slice(-5)}`;

                            return (
                              <div
                                key={id}
                                className="flex items-center gap-3 p-3 rounded-md border border-border/50 bg-secondary/5"
                              >
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback>
                                    {typeof name === "string" ? name[0] : "?"}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="font-medium">{name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    Wants to connect with you
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      handleRespond(request.requester, true)
                                    }
                                    className="flex items-center gap-1"
                                  >
                                    <UserCheck size={14} />
                                    <span>Accept</span>
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleRespond(request.requester, false)
                                    }
                                    className="flex items-center gap-1"
                                  >
                                    <UserMinus size={14} />
                                    <span>Decline</span>
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                          <Mail
                            size={48}
                            className="text-muted-foreground/40 mb-3"
                          />
                          <p className="text-muted-foreground mb-2">
                            No incoming requests
                          </p>
                          <p className="text-sm text-muted-foreground max-w-md">
                            You don't have any pending friend requests at the
                            moment
                          </p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="outgoing" className="mt-0">
                      {outgoing && outgoing.length > 0 ? (
                        <div className="space-y-4">
                          {outgoing.map((request) => {
                            // Extract the ID from the request object or use directly if it's a string
                            const id =
                              typeof request === "object"
                                ? request._id || request.recipient
                                : request;
                            const name =
                              typeof request === "object" && request.recipient
                                ? request.recipient
                                : `User ${id.slice(-5)}`;

                            return (
                              <div
                                key={id}
                                className="flex items-center gap-3 p-3 rounded-md border border-border/50 bg-secondary/5"
                              >
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback>
                                    {typeof name === "string" ? name[0] : "?"}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="font-medium">{name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    Request sent
                                  </div>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleCancel(request.recipient)
                                  }
                                  className="flex items-center gap-1"
                                >
                                  <CircleX size={14} />
                                  <span>Cancel</span>
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                          <UserPlus
                            size={48}
                            className="text-muted-foreground/40 mb-3"
                          />
                          <p className="text-muted-foreground mb-2">
                            No outgoing requests
                          </p>
                          <p className="text-sm text-muted-foreground max-w-md">
                            You haven't sent any friend requests yet
                          </p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
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
                            isOnline ? "bg-green-500" : "bg-primary"
                          } h-2 w-2 rounded-full`}
                        ></div>
                        {isOnline ? (
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
