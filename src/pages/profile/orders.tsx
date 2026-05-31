import { useState, useEffect } from "react";
import useRequest from "@/hooks/use-request";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Calendar,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowUpDown,
  User,
  MapPin,
  ChevronRight,
  Info,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatMoney } from "@/lib/utils";

interface Order {
  _id: string;
  service: {
    _id: string;
    title: string;
    description: string;
    artisan: string;
  } | null;
  artisan: {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    username?: string;
  } | null;
  customer: string;
  offering: {
    title: string;
    price: number;
  };
  amount: number;
  status: "pending" | "active" | "completed" | "cancelled";
  cancelled_by?: string | null;
  cancellation_reason?: string | null;
  completed_at?: string | null;
  createdAt: string;
  updatedAt: string;
  initial_message?: {
    name?: string;
    location?: string;
    service_description?: string;
  } | null;
}

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<
    "date-desc" | "date-asc" | "status-desc" | "status-asc"
  >("date-desc");

  // Cancellation form state
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const {
    data,
    loading,
    error,
    makeRequest: fetchOrders,
  } = useRequest<any>("orders/customer-history", true);

  const { makeRequest: cancelOrderRequest, loading: cancelLoading } =
    useRequest<any>("", true);

  const getOrders = async () => {
    try {
      const res = await fetchOrders();
      if (res && res.success) {
        setOrders(res.data || []);
      }
    } catch (err) {
      console.error("Failed to load orders", err);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  // Filter and sort logic
  useEffect(() => {
    let result = [...orders];

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((order) => order.status === statusFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "date-desc") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else if (sortBy === "date-asc") {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      } else if (sortBy === "status-desc") {
        return b.status.localeCompare(a.status);
      } else {
        return a.status.localeCompare(b.status);
      }
    });

    setFilteredOrders(result);
  }, [orders, statusFilter, sortBy]);

  const handleCancelOrder = async () => {
    if (!selectedOrder) return;
    if (!cancelReason.trim()) {
      toast.error("Please enter a reason for cancellation");
      return;
    }

    try {
      const res = await cancelOrderRequest(
        { cancellation_reason: cancelReason },
        "PATCH",
        "application/json",
        `orders/${selectedOrder._id}/cancel`,
      );

      if (res && res.success) {
        toast.success("Booking cancelled successfully");
        setIsCancelling(false);
        setCancelReason("");
        setIsDetailOpen(false);
        setSelectedOrder(null);
        getOrders(); // Refresh order history
      } else {
        toast.error("Failed to cancel order");
      }
    } catch (err: any) {
      toast.error(err?.error || "Error cancelling order");
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateStr));
  };

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="flex items-center gap-1 border-emerald-200 bg-emerald-50 font-semibold text-emerald-700 hover:bg-emerald-100">
            <CheckCircle2 size={12} />
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="flex items-center gap-1 border-rose-200 bg-rose-50 font-semibold text-rose-700 hover:bg-rose-100">
            <XCircle size={12} />
            Cancelled
          </Badge>
        );
      case "active":
        return (
          <Badge className="flex items-center gap-1 border-blue-200 bg-blue-50 font-semibold text-blue-700 hover:bg-blue-100">
            <Clock size={12} className="animate-pulse" />
            Active
          </Badge>
        );
      case "pending":
      default:
        return (
          <Badge className="flex items-center gap-1 border-amber-200 bg-amber-50 font-semibold text-amber-700 hover:bg-amber-100">
            <AlertCircle size={12} />
            Pending
          </Badge>
        );
    }
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
    setIsCancelling(false);
    setCancelReason("");
  };

  return (
    <div className="space-y-6">
      {/* Header and Explanation */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-heading">
          My Booked Services
        </h1>
        <p className="max-w-2xl leading-relaxed text-muted-foreground">
          Manage and track services you have requested from artisans.
        </p>

        {/* Obvious indicator showing these are customer bookings */}
        <div className="mt-2 flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 text-primary">
          <Info className="mt-0.5 size-5 shrink-0" />
          <div className="space-y-1">
            <p className="font-semibold">Viewing Placed Orders Only</p>
            <p className="text-primary/90">
              This page lists only the bookings you initiated as a customer. If
              you want to manage jobs assigned to you as an artisan, please
              navigate to your{" "}
              <button
                onClick={() => navigate("/artisan/dashboard")}
                className="inline-flex items-center gap-0.5 font-bold underline hover:text-dark"
              >
                Artisan Dashboard <ExternalLink size={10} />
              </button>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Filtering and Sorting Row */}
      <div className="flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Status Pills */}
        <div className="flex flex-wrap gap-2">
          {["all", "pending", "active", "completed", "cancelled"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-full border px-4 py-1.5 font-semibold capitalize transition-all ${
                  statusFilter === status
                    ? "border-dark bg-dark text-white"
                    : "border-border bg-white text-muted-foreground hover:bg-muted"
                }`}
              >
                {status}
              </button>
            ),
          )}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <ArrowUpDown size={14} className="text-muted-foreground" />
          <span className="font-medium text-muted-foreground">
            Sort by:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="cursor-pointer rounded-md border border-border bg-white px-3 py-1.5 font-medium text-dark focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="date-desc">Date (Newest First)</option>
            <option value="date-asc">Date (Oldest First)</option>
            <option value="status-desc">Status (A-Z)</option>
            <option value="status-asc">Status (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Orders Grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((n) => (
            <Card key={n} className="animate-pulse">
              <CardContent className="h-44" />
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center text-destructive">
          <AlertCircle className="mx-auto mb-2 size-8" />
          <p className="font-semibold">Failed to fetch order history</p>
          <p className="mt-1">
            {error?.message ||
              "An unexpected error occurred. Please try again."}
          </p>
          <Button
            onClick={getOrders}
            size="sm"
            variant="outline"
            className="mt-4 border-destructive hover:bg-destructive/10"
          >
            Retry
          </Button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-border bg-white p-12 text-center">
          <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
            <Calendar size={24} />
          </div>
          <h3 className="text-lg font-bold text-heading">No bookings found</h3>
          <p className="mx-auto mt-1 max-w-sm text-muted-foreground">
            {statusFilter === "all"
              ? "You haven't requested any services yet. Explore services in our home page to hire your first artisan!"
              : `You don't have any ${statusFilter} service bookings.`}
          </p>
          {statusFilter === "all" && (
            <Button
              onClick={() => navigate("/")}
              className="mt-6 rounded-full bg-dark font-semibold hover:bg-dark/90"
            >
              Explore Services
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredOrders.map((order) => (
            <Card
              key={order._id}
              onClick={() => openOrderDetails(order)}
              className="group flex cursor-pointer flex-col justify-between border border-border bg-white shadow-sm transition-all duration-300 hover:border-dark hover:shadow-md"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="font-extrabold uppercase tracking-wider text-primary">
                      {order.offering?.title}
                    </span>
                    <CardTitle className="line-clamp-1 text-base font-bold transition-colors group-hover:text-primary">
                      {order.service?.title || "Unknown Service"}
                    </CardTitle>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pb-4">
                {/* Artisan Info */}
                <div className="flex items-center gap-2 font-semibold text-dark">
                  <div className="grid size-6 place-items-center rounded-full bg-muted text-muted-foreground">
                    <User size={12} />
                  </div>
                  <span>
                    Artisan:{" "}
                    {order.artisan
                      ? `${order.artisan.first_name} ${order.artisan.last_name}`
                      : "N/A"}
                  </span>
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-dashed pt-3">
                  <div className="flex flex-col">
                    <span className="font-bold uppercase text-muted-foreground">
                      Ordered On
                    </span>
                    <span className="font-medium text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block font-bold uppercase text-muted-foreground">
                      Amount
                    </span>
                    <span className="text-base font-extrabold text-dark">
                      {formatMoney(order.amount)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Details Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <div className="mt-2 flex items-center justify-between pr-4">
                  <span className="font-mono text-muted-foreground"></span>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <DialogTitle className="mt-2 text-xl font-extrabold text-heading">
                  {selectedOrder.service?.title || "Service Details"}
                </DialogTitle>
                <DialogDescription>
                  Detailed report for your booked service order.
                </DialogDescription>
              </DialogHeader>

              <div className="my-4 space-y-6">
                {/* Status-specific warning or cancel reason */}
                {selectedOrder.status === "cancelled" && (
                  <div className="space-y-1 rounded-lg border border-rose-200 bg-rose-50 p-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-rose-800">
                      <XCircle size={16} />
                      Booking Cancelled
                    </div>
                    {selectedOrder.cancellation_reason && (
                      <p className="font-semibold leading-relaxed text-rose-700">
                        Reason: "{selectedOrder.cancellation_reason}"
                      </p>
                    )}
                  </div>
                )}

                {/* Service & Offering Summary */}
                <div className="space-y-3 rounded-lg bg-muted p-4">
                  <h4 className="font-extrabold uppercase tracking-wider text-muted-foreground">
                    Service Plan & Amount
                  </h4>
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-bold text-dark">
                        {selectedOrder.offering?.title}
                      </p>
                      <p className="text-muted-foreground">
                        Chosen Tier
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-extrabold text-primary">
                        {formatMoney(selectedOrder.amount)}
                      </p>
                      <p className="text-muted-foreground">
                        Total Price
                      </p>
                    </div>
                  </div>
                  {selectedOrder.service?.description && (
                    <p className="line-clamp-3 leading-relaxed text-muted-foreground">
                      {selectedOrder.service.description}
                    </p>
                  )}
                </div>

                {/* Artisan Card */}
                <div className="space-y-2">
                  <h4 className="font-extrabold uppercase tracking-wider text-muted-foreground">
                    Artisan Information
                  </h4>
                  <div className="flex items-start gap-3 rounded-lg border bg-white p-4">
                    <div className="grid size-10 shrink-0 place-items-center rounded-full bg-dark text-sm font-extrabold text-white">
                      {selectedOrder.artisan
                        ? (selectedOrder.artisan.first_name?.[0] || "") +
                          (selectedOrder.artisan.last_name?.[0] || "")
                        : "A"}
                    </div>
                    <div className="space-y-1 font-semibold text-dark">
                      <p className="font-bold">
                        {selectedOrder.artisan
                          ? `${selectedOrder.artisan.first_name} ${selectedOrder.artisan.last_name}`
                          : "N/A"}
                      </p>
                      {selectedOrder.artisan?.username && (
                        <p className="text-muted-foreground">
                          @{selectedOrder.artisan.username}
                        </p>
                      )}
                      <p className="font-normal text-muted-foreground">
                        Email: {selectedOrder.artisan?.email || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Initial message / Requirements */}
                {selectedOrder.initial_message && (
                  <div className="space-y-2">
                    <h4 className="font-extrabold uppercase tracking-wider text-muted-foreground">
                      Your Request & Requirements
                    </h4>
                    <div className="space-y-3 rounded-lg border bg-white p-4">
                      <div className="grid grid-cols-2 gap-4">
                        {selectedOrder.initial_message.name && (
                          <div>
                            <span className="block font-semibold text-muted-foreground">
                              Contact Name
                            </span>
                            <span className="font-bold text-dark">
                              {selectedOrder.initial_message.name}
                            </span>
                          </div>
                        )}
                        {selectedOrder.initial_message.location && (
                          <div className="flex items-start gap-1">
                            <MapPin
                              size={12}
                              className="mt-0.5 text-muted-foreground"
                            />
                            <div>
                              <span className="block font-semibold text-muted-foreground">
                                Location
                              </span>
                              <span className="font-bold text-dark">
                                {selectedOrder.initial_message.location}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      {selectedOrder.initial_message.service_description && (
                        <div className="border-t pt-3">
                          <span className="mb-1 block font-semibold text-muted-foreground">
                            Problem/Service Description
                          </span>
                          <p className="rounded-md bg-muted/30 p-2.5 font-semibold italic leading-relaxed text-dark">
                            "{selectedOrder.initial_message.service_description}
                            "
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Timeline info */}
                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                  <div>
                    <span className="block font-semibold text-muted-foreground">
                      Ordered On
                    </span>
                    <span className="font-bold text-dark">
                      {formatDate(selectedOrder.createdAt)}
                    </span>
                  </div>
                  {selectedOrder.completed_at && (
                    <div>
                      <span className="block font-semibold text-muted-foreground">
                        Completed On
                      </span>
                      <span className="font-bold text-dark">
                        {formatDate(selectedOrder.completed_at)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Inline cancellation form inside Dialog */}
                {isCancelling && (
                  <div className="space-y-3 border-t pt-4 duration-200 animate-in fade-in-50">
                    <h4 className="font-extrabold uppercase tracking-wider text-rose-600">
                      Cancellation Reason
                    </h4>
                    <Textarea
                      placeholder="Please explain why you need to cancel this service request..."
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="border-rose-200 font-semibold focus-visible:ring-rose-500"
                      rows={3}
                      disabled={cancelLoading}
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsCancelling(false)}
                        disabled={cancelLoading}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={handleCancelOrder}
                        disabled={cancelLoading}
                      >
                        {cancelLoading
                          ? "Processing..."
                          : "Confirm Cancellation"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                {!isCancelling && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setIsDetailOpen(false)}
                      className="rounded-full font-semibold"
                    >
                      Close
                    </Button>
                    {(selectedOrder.status === "pending" ||
                      selectedOrder.status === "active") && (
                      <Button
                        variant="destructive"
                        onClick={() => setIsCancelling(true)}
                        className="rounded-full font-semibold"
                      >
                        Cancel Booking
                      </Button>
                    )}
                  </>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
