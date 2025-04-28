import { Briefcase, CheckCircle, Clock, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export default function BillingSection() {
  return (
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
                    <h4 className="font-medium">Mastercard ending in 8353</h4>
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
  );
}
