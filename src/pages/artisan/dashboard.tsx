import React, { useState } from "react";
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
} from "lucide-react";
import { Link } from "react-router-dom";

export default function ArtisanDashboard() {
  const [dateRange, setDateRange] = useState("");
  const [activity, setActivity] = useState("");

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
                  Balance available for use
                </span>
                <Info className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-gray-900">₦0.00</p>
            </div>
            <Button variant="outline" className="mb-2 w-full" disabled>
              Withdraw balance
            </Button>
            <button className="w-full text-center text-sm text-gray-700 underline hover:text-gray-900">
              Manage payout methods
            </button>
          </div>

          {/* SKills & Expenses */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-900">
                  Earnings & expenses
                </h3>
                <Info className="h-4 w-4 text-gray-400" />
              </div>
              <Select defaultValue="since-joining">
                <SelectTrigger className="h-8 w-32 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="since-joining">Since joining</SelectItem>
                  <SelectItem value="this-month">This month</SelectItem>
                  <SelectItem value="last-month">Last month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mb-6">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xs text-gray-600">Earnings to date</span>
                <Info className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">₦0.00</p>
              <p className="mt-1 text-xs text-gray-500">
                Your earnings since joining.
              </p>
            </div>
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xs text-gray-600">Expenses to date</span>
                <Info className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">₦0.00</p>
              <p className="mt-1 text-xs text-gray-500">
                Earnings spent on purchases since joining.
              </p>
            </div>
          </div>
          {/* Future Payments */}
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
                  <ChevronRight className="opacity-50" />
                </Button>
              </Link>
            </div>
            <div className="mb-6">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xs text-gray-600">
                  Active skills published
                </span>
                <Info className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xs text-gray-600">
                  Skills pending approval
                </span>
                <Info className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
          </div>
        </div>

        {/* Activity Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          {/* Filters */}
          <div className="mb-6 flex items-center gap-4">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This week</SelectItem>
                <SelectItem value="month">This month</SelectItem>
                <SelectItem value="year">This year</SelectItem>
              </SelectContent>
            </Select>
            <Select value={activity} onValueChange={setActivity}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Activity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All activities</SelectItem>
                <SelectItem value="orders">Orders</SelectItem>
                <SelectItem value="payments">Payments</SelectItem>
                <SelectItem value="withdrawals">Withdrawals</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Empty State */}
          <div className="py-8">
            <p className="mb-8 text-sm text-gray-600">Showing 0 results.</p>

            {/* Table Header */}
            <div className="mb-6 grid grid-cols-6 gap-4 border-b border-gray-200 pb-3">
              <div className="text-xs font-semibold text-gray-700">Date</div>
              <div className="text-xs font-semibold text-gray-700">
                Activity
              </div>
              <div className="text-xs font-semibold text-gray-700">
                Description
              </div>
              <div className="text-xs font-semibold text-gray-700">From</div>
              <div className="text-xs font-semibold text-gray-700">Order</div>
              <div className="text-right text-xs font-semibold text-gray-700">
                Amount
              </div>
            </div>

            {/* Empty Illustration */}
            <div className="flex flex-col items-center justify-center py-16">
              <img src={emptyTable} alt="No activity" className="" />
              <div className="space-y-4 text-center">
                <h4 className="text-2xl font-bold">
                  Beginnings are so exciting!
                </h4>
                <p>
                  You’ll find all your earnings info here once you complete your
                  first order.
                </p>
              </div>
            </div>
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
