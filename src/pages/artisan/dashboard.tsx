import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import emptyTable from "@/assets/illustrations/empty-table.svg";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  Mail,
  Heart,
  Search,
  Info,
  MoreVertical,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import useRequest from "@/hooks/use-request";

export default function ArtisanDashboard() {
  const [dateRange, setDateRange] = useState("");
  const [activity, setActivity] = useState("all");
  const [dashboardData, setDashboardData] = useState<any>(null);

  const { makeRequest, loading } = useRequest("artisans/dashboard", true);

  useEffect(() => {
    makeRequest().then((res: any) => {
      if (res?.success) {
        setDashboardData(res);
      }
    });
  }, []);

  if (loading && !dashboardData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const stats = dashboardData?.stats || {
    skills: { total: 0, active: 0, pausedOrDraft: 0 },
    bookings: { total: 0, pending: 0, active: 0, completed: 0, cancelled: 0 },
    messages: { totalChats: 0, unread: 0 },
    earnings: { totalEarnings: 0, pendingEarnings: 0 },
    reviews: { averageRating: 0, totalReviews: 0 },
  };

  const allActivities = dashboardData?.activities || [];

  // Filter activities by selected category
  const filteredActivities = allActivities.filter((act: any) => {
    if (activity === "all" || !activity) return true;
    if (activity === "orders" && act.type === "booking") return true;
    if (activity === "skills" && act.type === "service") return true;
    if (activity === "reviews" && act.type === "review") return true;
    return false;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Page Title */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">
            Artisan Dashboard
          </h2>
          <a
            href="#"
            className="text-sm text-gray-600 underline hover:text-gray-900"
          >
            Learn more about this page
          </a>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 lg:grid-cols-3">
          {/* Available Funds */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-2 flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-900">
                Available funds
              </h3>
            </div>
            <div className="mb-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xs text-gray-600">
                  Total completed earnings
                </span>
                <Info className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                ₦{stats.earnings.totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="mb-4">
              <span className="text-xs text-gray-600 block">Pending/Active Escrow</span>
              <p className="text-lg font-semibold text-gray-700">
                ₦{stats.earnings.pendingEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
            <Button variant="outline" className="mb-2 w-full" disabled={stats.earnings.totalEarnings <= 0}>
              Withdraw balance
            </Button>
            <button className="w-full text-center text-sm text-gray-700 underline hover:text-gray-900">
              Manage payout methods
            </button>
          </div>

          {/* Bookings */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-900">
                  Bookings
                </h3>
                <Info className="h-4 w-4 text-gray-400" />
              </div>
              <Link to="/artisan/bookings">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-auto border-input bg-transparent p-2 py-1.5 text-sm font-normal"
                >
                  Manage Bookings
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </Button>
              </Link>
            </div>
            <div className="mb-6">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xs text-gray-600">Total bookings</span>
                <Info className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.bookings.total}</p>
            </div>
            <div className="grid grid-cols-2">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-xs text-gray-600">
                    Pending bookings
                  </span>
                  <Info className="h-4 w-4 text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.bookings.pending}</p>
              </div>
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-xs text-gray-600">Active bookings</span>
                  <Info className="h-4 w-4 text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.bookings.active}</p>
              </div>
            </div>
          </div>

          {/* Your Skills & Messages */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-900">
                  Your Skills
                </h3>
                <Info className="h-4 w-4 text-gray-400" />
              </div>
              <Link to="/artisan/skills">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-auto border-input bg-transparent p-2 py-1.5 text-sm font-normal"
                >
                  Manage Skills
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </Button>
              </Link>
            </div>
            <div className="mb-4 grid grid-cols-2">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-xs text-gray-600">
                    Active skills
                  </span>
                  <Info className="h-4 w-4 text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.skills.active}</p>
              </div>
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-xs text-gray-600">
                    Draft/Paused
                  </span>
                  <Info className="h-4 w-4 text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.skills.pausedOrDraft}</p>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-4 grid grid-cols-2">
              <div>
                <span className="text-xs text-gray-600 block">Total Chats</span>
                <p className="text-xl font-bold text-gray-900">{stats.messages.totalChats}</p>
              </div>
              <div>
                <span className="text-xs text-gray-600 block">Unread Messages</span>
                <p className="text-xl font-bold text-red-600">{stats.messages.unread}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          {/* Filters */}
          <div className="mb-6 flex items-center gap-4">
            <Select value={activity} onValueChange={setActivity}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Activity Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All activities</SelectItem>
                <SelectItem value="orders">Orders/Bookings</SelectItem>
                <SelectItem value="skills">Skills/Services</SelectItem>
                <SelectItem value="reviews">Reviews</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Activity List or Empty State */}
          <div className="py-8">
            <p className="mb-8 text-sm text-gray-600">
              Showing {filteredActivities.length} results.
            </p>

            {/* Table Header */}
            <div className="mb-6 grid grid-cols-6 gap-4 border-b border-gray-200 pb-3">
              <div className="text-xs font-semibold text-gray-700">Date</div>
              <div className="text-xs font-semibold text-gray-700">
                Activity
              </div>
              <div className="text-xs font-semibold text-gray-700">
                Description
              </div>
              <div className="text-xs font-semibold text-gray-700">From / Context</div>
              <div className="text-xs font-semibold text-gray-700">Link</div>
              <div className="text-right text-xs font-semibold text-gray-700">
                Amount
              </div>
            </div>

            {filteredActivities.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {filteredActivities.map((act: any) => (
                  <div key={act.id} className="grid grid-cols-6 gap-4 py-4 text-sm text-gray-600 items-center">
                    <div>{new Date(act.timestamp).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}</div>
                    <div className="font-semibold text-gray-900">{act.title}</div>
                    <div className="truncate" title={act.description}>{act.description}</div>
                    <div className="truncate">
                      {act.metadata?.customerName || act.metadata?.reviewerName || "-"}
                    </div>
                    <div>
                      {act.type === "booking" && (
                        <Link to="/artisan/bookings" className="text-primary hover:underline font-medium">
                          View Order
                        </Link>
                      )}
                      {act.type === "service" && (
                        <Link to="/artisan/skills" className="text-primary hover:underline font-medium">
                          View Service
                        </Link>
                      )}
                      {act.type === "review" && (
                        <span className="text-gray-400 font-medium">
                          {act.metadata?.rating} ★
                        </span>
                      )}
                    </div>
                    <div className="text-right font-semibold text-gray-900">
                      {act.metadata?.amount ? `₦${act.metadata.amount.toLocaleString()}` : "-"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty Illustration */
              <div className="flex flex-col items-center justify-center py-16">
                <img src={emptyTable} alt="No activity" className="mb-4" />
                <div className="space-y-4 text-center">
                  <h4 className="text-2xl font-bold">
                    Beginnings are so exciting!
                  </h4>
                  <p className="text-gray-600">
                    You’ll find all your stats and recent activities here once things get rolling.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Email Report */}
          <div className="flex items-center justify-end gap-2 border-t border-gray-200 pt-4">
            <Button variant="outline" className="gap-2">
              <Mail className="h-4 w-4" />
              Email activity report
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
