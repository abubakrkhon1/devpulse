import { Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Switch } from "../ui/switch";
import { Select } from "../ui/select";
import { Button } from "../ui/button";

export default function NotificationSection() {
  return (
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
            <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
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
            <h3 className="text-lg font-medium mb-4">Push Notifications</h3>
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
            <h3 className="text-lg font-medium mb-4">Notification Channels</h3>
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
            <h3 className="text-lg font-medium mb-4">Frequency Settings</h3>
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
  );
}
