"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User as UserIcon,
  Briefcase,
  Calendar,
  Mail,
  CheckCircle,
  Dot,
  MessageCircle,
  UserPlus,
  UserCheck,
  UserMinus,
  Clock,
  Users,
  ArrowLeft,
  Share2,
  Globe,
  MapPin,
  School,
  Coffee,
  BookOpen,
  Heart,
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
import { formatDate } from "@/lib/utils";
import { OtherProfile, User } from "@/types/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import {
  cancelFriendRequest,
  respondFriendRequest,
  sendFriendRequest,
  useFriendRequests,
} from "@/hooks/useFriends";

const ViewUserProfile = ({
  profile,
  currentUser,
  loading,
  error,
}: {
  profile: OtherProfile | null;
  currentUser: User | null;
  loading: boolean | null;
  error: string | null;
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("about");
  const [friendStatus, setFriendStatus] = useState("none"); // none, pending, accepted
  const [showMessage, setShowMessage] = useState({
    message: "",
    status: false,
    type: "success", // success, error, warning
  });

  // Friend/connection mock data
  const [mutualFriends, setMutualFriends] = useState([
    {
      _id: "friend1",
      name: "Alex Johnson",
      avatar: "",
      jobTitle: "Product Designer",
    },
    {
      _id: "friend2",
      name: "Sam Carter",
      avatar: "",
      jobTitle: "Marketing Manager",
    },
    {
      _id: "friend3",
      name: "Taylor Smith",
      avatar: "",
      jobTitle: "Frontend Developer",
    },
  ]);

  // Determine friend status on component mount
  useEffect(() => {
    // In a real app, you would fetch this from your API
    if (profile && currentUser) {
      // Mock check if users are friends
      console.log(profile, currentUser);
      const status = currentUser.friends.some((f) => f._id === profile._id);
      console.log(status);
      if (status) setFriendStatus("accepted");
    }
  }, [profile, currentUser]);

  // Mock function to determine friendship status - in a real app, this would be an API call
  const getMockFriendshipStatus = (userId: string) => {
    // Simulate different friend statuses
    if (userId === "friend1" || userId === "friend2" || userId === "friend3") {
      return "accepted";
    } else if (userId === "pending1" || userId === "pending2") {
      return "pending";
    } else if (userId === "request1" || userId === "request2") {
      return "request"; // They sent you a request
    } else {
      return "none";
    }
  };

  // Handle friend request actions
  const handleFriendAction = (action: string) => {
    switch (action) {
      case "add":
        break;
      case "accept":
        setFriendStatus("accepted");
        showNotification("Friend request accepted!", "success");
        break;
      case "reject":
        setFriendStatus("none");
        showNotification("Friend request declined", "warning");
        break;
      case "remove":
        setFriendStatus("none");
        showNotification("Friend removed", "warning");
        break;
      case "cancel":
        break;
      default:
        break;
    }
  };

  const showNotification = (message: string, type: string) => {
    setShowMessage({
      message,
      status: true,
      type,
    });
    setTimeout(
      () => setShowMessage({ message: "", status: false, type: "success" }),
      3000
    );
  };

  // Check if user is online - in real app, this would use a proper online status system
  const { isOnline } = useOnlineStatus(profile?._id);

  const {
    incoming,
    outgoing,
    friendRequestError,
    friendRequestLoading,
    refresh,
  } = useFriendRequests(currentUser?._id);

  const handleSend = async (otherId: string) => {
    await sendFriendRequest(currentUser?._id, otherId);
    await refresh();
    setFriendStatus("pending");
    showNotification("Friend request sent!", "success");
  };
  const handleCancel = async (otherId: string) => {
    await cancelFriendRequest(currentUser?._id, otherId);
    await refresh();
    setFriendStatus("none");
    showNotification("Friend request cancelled", "warning");
  };
  const handleRespond = async (requester: string, accept: boolean) => {
    await respondFriendRequest(requester, currentUser?._id, accept);
    await refresh();
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading user profile...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Error loading profile: {error}
      </div>
    );
  if (!profile)
    return (
      <div className="flex items-center justify-center min-h-screen">
        User not found
      </div>
    );

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
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
              <AvatarImage src={profile?.avatar || ""} alt={profile?.name} />
              <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                {profile?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                <h1 className="text-3xl font-bold">{profile?.name}</h1>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant="default"
                    className="bg-primary/10 text-primary border-0"
                  >
                    {profile?.role}
                  </Badge>
                  {profile?.verified && (
                    <Badge
                      variant="outline"
                      className="bg-secondary/10 border-0 flex gap-1 items-center"
                    >
                      <CheckCircle size={12} className="text-primary" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>

              <div className="mb-2 text-muted-foreground">
                {isOnline ? (
                  <h4 className="text-green-500 flex items-center">
                    <Dot className="text-green-500" /> Online
                  </h4>
                ) : (
                  <h4 className="text-neutral-500">
                    {"Last online: " +
                      formatDate(profile?.lastActive || new Date())}
                  </h4>
                )}
              </div>

              <div className="text-muted-foreground">
                <span className="inline-flex items-center gap-1 mr-4">
                  <Briefcase size={14} /> {profile?.jobTitle}
                </span>
                {profile?.department && (
                  <span className="inline-flex items-center gap-1 mr-4">
                    <Globe size={14} /> {profile?.department}
                  </span>
                )}
                {/* {profile?.location && (
                  <span className="inline-flex items-center gap-1 mr-4">
                    <MapPin size={14} /> {profile?.location}
                  </span>
                )} */}
                <span className="inline-flex items-center gap-1 mr-4">
                  <Calendar size={14} /> Joined{" "}
                  {formatDate(profile?.createdAt || new Date())}
                </span>
                {mutualFriends.length > 0 && (
                  <span className="inline-flex items-center gap-1">
                    <Users size={14} /> {mutualFriends.length} mutual
                    connections
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 self-start w-full md:w-auto">
              {friendStatus === "none" && (
                <Button
                  onClick={() => handleSend(profile._id)}
                  className="w-full md:w-auto flex items-center gap-2"
                >
                  <UserPlus size={16} />
                  Add Friend
                </Button>
              )}

              {friendStatus === "pending" && (
                <Button
                  variant="outline"
                  onClick={() => handleCancel(profile._id)}
                  className="w-full md:w-auto flex items-center gap-2"
                >
                  <UserMinus size={16} />
                  Cancel Request
                </Button>
              )}

              {friendStatus === "request" && (
                <div className="flex flex-col gap-2 w-full md:w-auto">
                  <Button
                    onClick={() => handleFriendAction("accept")}
                    className="w-full flex items-center gap-2"
                  >
                    <UserCheck size={16} />
                    Accept Request
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleFriendAction("reject")}
                    className="w-full flex items-center gap-2"
                  >
                    <UserMinus size={16} />
                    Decline
                  </Button>
                </div>
              )}

              {friendStatus === "accepted" && (
                <div className="flex flex-col gap-2 w-full md:w-auto">
                  <Button
                    variant="default"
                    className="w-full flex items-center gap-2"
                  >
                    <MessageCircle size={16} />
                    Message
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleFriendAction("remove")}
                    className="w-full flex items-center gap-2"
                  >
                    <UserMinus size={16} />
                    Remove Friend
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="container max-w-6xl mx-auto py-8 px-4">
        {/* Notification */}
        {showMessage.status && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              showMessage.type === "success"
                ? "bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                : showMessage.type === "warning"
                ? "bg-amber-100 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
                : "bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
            }`}
          >
            {showMessage.type === "success" ? (
              <CheckCircle
                size={20}
                className="text-green-600 dark:text-green-400"
              />
            ) : (
              <div className="h-5 w-5 rounded-full border-2 border-amber-500 dark:border-amber-400 flex items-center justify-center">
                <span className="text-amber-500 dark:text-amber-400 font-bold">
                  !
                </span>
              </div>
            )}
            <p
              className={`${
                showMessage.type === "success"
                  ? "text-green-700 dark:text-green-300"
                  : showMessage.type === "warning"
                  ? "text-amber-700 dark:text-amber-300"
                  : "text-red-700 dark:text-red-300"
              }`}
            >
              {showMessage.message}
            </p>
          </div>
        )}

        {/* Profile Tabs */}
        <Tabs
          defaultValue="about"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 md:w-[400px] mb-8">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="friends">Friends</TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="overflow-hidden border-0 shadow-md">
                  <CardHeader className="bg-secondary/5 border-b border-border/50">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <UserIcon size={18} className="text-primary" />
                      About {profile.name.split(" ")[0]}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="">
                    {profile.bio ? (
                      <div className="prose dark:prose-invert max-w-none">
                        <p>{profile.bio}</p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic">
                        No bio available
                      </p>
                    )}

                    <Separator className="my-6" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-medium mb-3 flex items-center gap-2">
                          <School size={16} className="text-primary" />{" "}
                          Education
                        </h3>
                        <ul className="space-y-3">
                          {/* {profile.education ? (
                            profile.education.map((edu, index) => (
                              <li key={index} className="flex flex-col">
                                <span className="font-medium">
                                  {edu.institution}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {edu.degree}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {edu.years}
                                </span>
                              </li>
                            ))
                          ) : ( */}
                          <li className="text-muted-foreground italic">
                            No education info available
                          </li>
                          {/* )} */}
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-medium mb-3 flex items-center gap-2">
                          <Briefcase size={16} className="text-primary" />{" "}
                          Experience
                        </h3>
                        <ul className="space-y-3">
                          {/* {profile.experience ? (
                            profile.experience.map((exp, index) => (
                              <li key={index} className="flex flex-col">
                                <span className="font-medium">
                                  {exp.company}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {exp.position}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {exp.years}
                                </span>
                              </li>
                            ))
                          ) : ( */}
                          <li className="text-muted-foreground italic">
                            No experience info available
                          </li>
                          {/* )} */}
                        </ul>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div>
                      <h3 className="font-medium mb-3 flex items-center gap-2">
                        <Heart size={16} className="text-primary" /> Interests
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {/* {profile.interests ? (
                          profile.interests.map((interest, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="px-3 py-1"
                            >
                              {interest}
                            </Badge>
                          ))
                        ) : ( */}
                        <p className="text-muted-foreground italic">
                          No interests listed
                        </p>
                        {/* )} */}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="overflow-hidden border-0 shadow-md">
                  <CardHeader className="bg-secondary/5 border-b border-border/50">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Users size={18} className="text-primary" />
                      Mutual Connections
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="">
                    {mutualFriends.length > 0 ? (
                      <div className="space-y-4">
                        {mutualFriends.map((friend) => (
                          <div
                            key={friend._id}
                            className="flex items-center gap-3"
                          >
                            <Avatar className="h-9 w-9">
                              <AvatarImage
                                src={friend.avatar}
                                alt={friend.name}
                              />
                              <AvatarFallback className="text-xs">
                                {friend.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 overflow-hidden">
                              <p className="font-medium truncate">
                                {friend.name}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {friend.jobTitle}
                              </p>
                            </div>
                          </div>
                        ))}

                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-4"
                        >
                          View All Mutual Connections
                        </Button>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-2">
                        No mutual connections
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-0 shadow-md">
                  <CardHeader className="bg-secondary/5 border-b border-border/50">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Coffee size={18} className="text-primary" />
                      Let's Connect
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <p className="text-sm">
                        Connect with {profile.name.split(" ")[0]} on their
                        preferred platforms:
                      </p>

                      <div className="grid grid-cols-2 gap-2">
                        {/* {profile.socialLinks ? (
                          Object.entries(profile.socialLinks).map(
                            ([platform, url]) => (
                              <Button
                                key={platform}
                                variant="outline"
                                size="sm"
                                className="w-full justify-start"
                              >
                                <span className="capitalize">{platform}</span>
                              </Button>
                            )
                          )
                        ) : ( */}
                        <p className="text-muted-foreground col-span-2 text-center">
                          No social profiles shared
                        </p>
                        {/* )} */}
                      </div>

                      <div className="pt-2">
                        <Button
                          size="sm"
                          className="w-full flex gap-2 items-center"
                        >
                          <Share2 size={14} />
                          Share Profile
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Posts Tab */}
          <TabsContent value="posts">
            <Card className="border-0 shadow-md">
              <CardHeader className="bg-secondary/5 border-b border-border/50">
                <CardTitle className="text-xl flex items-center gap-2">
                  <BookOpen size={18} className="text-primary" />
                  Posts by {profile.name.split(" ")[0]}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="rounded-full bg-secondary/20 p-6 mb-4">
                    <BookOpen size={32} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Posts Yet</h3>
                  <p className="text-muted-foreground text-center max-w-sm">
                    {profile.name.split(" ")[0]} hasn't shared any posts yet.
                    Check back later for updates!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Friends Tab */}
          <TabsContent value="friends">
            <Card className="border-0 shadow-md">
              <CardHeader className="bg-secondary/5 border-b border-border/50">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Users size={18} className="text-primary" />
                  {profile.name.split(" ")[0]}'s Connections
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {/* {profile.friends ? (
                    profile.friends.map((friend) => (
                      <Card
                        key={friend._id}
                        className="overflow-hidden border border-border/50"
                      >
                        <div className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={friend.avatar}
                                alt={friend.name}
                              />
                              <AvatarFallback className="text-xs">
                                {friend.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-medium leading-none">
                                {friend.name}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {friend.jobTitle}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            View Profile
                          </Button>
                        </div>
                      </Card>
                    ))
                  ) : ( */}
                  <div className="col-span-full flex flex-col items-center justify-center py-12">
                    <div className="rounded-full bg-secondary/20 p-6 mb-4">
                      <Users size={32} className="text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No Connections</h3>
                    <p className="text-muted-foreground text-center max-w-sm">
                      {profile.name.split(" ")[0]} doesn't have any public
                      connections to display.
                    </p>
                  </div>
                  {/* )} */}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ViewUserProfile;
