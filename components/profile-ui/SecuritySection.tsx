"use client";
import { AlertTriangle, CheckCircle, Lock, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { Select } from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState } from "react";
import { updatePassword } from "@/lib/dbActions";
import { useUser } from "@/hooks/useAuthedUser";

export default function SecuritySection() {
  const [form, setForm] = useState({ password: "", newPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  const handleNewPass = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setOpen(true);

    if (form.password.length < 8 || form.newPassword.length < 8) {
      setError("Passwords should be 8 characters long!");
      return;
    } else {
      const res = await fetch("/api/profile/updatePassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?._id,
          password: form.password,
          newPassword: form.newPassword,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message);
        setOpen(false);
      } else {
        setError(data.message);
      }
      setForm({ password: "", newPassword: "" });
    }
  };

  return (
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

                <Dialog open={open}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-primary/20 bg-primary/5"
                      onClick={() => setOpen(true)}
                    >
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit password</DialogTitle>
                      <DialogDescription>
                        Make changes to your password here. Click save when
                        you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Current Password
                        </Label>
                        <Input
                          id="password"
                          className="col-span-3"
                          value={form.password}
                          onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                          New Password
                        </Label>
                        <Input
                          id="newPassword"
                          className="col-span-3"
                          value={form.newPassword}
                          onChange={(e) =>
                            setForm({ ...form, newPassword: e.target.value })
                          }
                        />
                      </div>
                      {error && (
                        <h4 className="text-red-500 text-sm">{error}</h4>
                      )}
                      {success && (
                        <h4 className="text-emerald-500 text-sm">{success}</h4>
                      )}
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={handleNewPass}>
                        Save changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
                  <span className="text-sm font-medium">a****@gmail.com</span>
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
                  <span className="text-sm font-medium">Overall Security</span>
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
                <h4 className="text-sm font-medium">Security Checklist</h4>
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
                    Your account security is reviewed regularly. Last security
                    scan: <span className="font-medium">April 20, 2025</span>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
