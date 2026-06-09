import { useState, useEffect } from "react";
import useRequest from "@/hooks/use-request";
import {
  Card,
  CardHeader,
  CardTitle,
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
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowUpDown,
  User,
  MapPin,
  MessageCircle,
  PhoneCall,
  AlertTriangle,
  CheckCheck,
  Ban,
} from "lucide-react";
import { formatMoney } from "@/lib/utils";

interface Order {
  _id: string;
  service: {
    _id: string;
    title: string;
    description: string;
  } | null;
  customer: {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    username?: string;
  } | null;
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

export default function ArtisanBookings() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<
    "date-desc" | "date-asc" | "status-desc" | "status-asc"
  >("date-desc");
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  // Track which card is being actioned (for inline card buttons)
  const [actioningId, setActioningId] = useState<string | null>(null);

  const {
    loading,
    error,
    makeRequest: fetchOrders,
  } = useRequest<any>("orders/artisan-history", true);

  const { makeRequest: cancelOrderRequest, loading: cancelLoading } =
    useRequest<any>("", true);

  const { makeRequest: completeOrderRequest, loading: completeLoading } =
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

  useEffect(() => {
    let result = [...orders];
    if (statusFilter !== "all") {
      result = result.filter((order) => order.status === statusFilter);
    }
    result.sort((a, b) => {
      if (sortBy === "date-desc")
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "date-asc")
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === "status-desc") return b.status.localeCompare(a.status);
      return a.status.localeCompare(b.status);
    });
    setFilteredOrders(result);
  }, [orders, statusFilter, sortBy]);

  const handleCancelOrder = async (order: Order) => {
    if (!cancelReason.trim()) {
      toast.error("Please enter a reason for cancellation");
      return;
    }
    try {
      const res = await cancelOrderRequest(
        { cancellation_reason: cancelReason },
        "PATCH",
        "application/json",
        `orders/${order._id}/cancel`,
      );
      if (res && res.success) {
        toast.success("Booking cancelled successfully");
        setIsCancelling(false);
        setCancelReason("");
        setIsDetailOpen(false);
        setSelectedOrder(null);
        setActioningId(null);
        getOrders();
      } else {
        toast.error("Failed to cancel order");
      }
    } catch (err: any) {
      toast.error(err?.error || "Error cancelling order");
    }
  };

  const handleCompleteOrder = async (order: Order) => {
    try {
      const res = await completeOrderRequest(
        {},
        "PATCH",
        "application/json",
        `orders/${order._id}/complete`,
      );
      if (res && res.success) {
        toast.success("Booking marked as completed");
        setIsDetailOpen(false);
        setSelectedOrder(null);
        setActioningId(null);
        getOrders();
      } else {
        toast.error("Failed to complete order");
      }
    } catch (err: any) {
      toast.error(err?.error || "Error completing order");
    }
  };

  const handleAcceptOrder = () => {
    toast.success("Order accepted and is now active (mock)");
  };

  const handleMessageCustomer = () => {
    toast.info("Navigating to messages...");
  };

  const handleCallCustomer = () => {
    toast.info("Opening phone dialer...");
  };

  const handleReportIssue = () => {
    toast.success("Issue reported to support team.");
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
            <CheckCircle2 size={12} /> Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="flex items-center gap-1 border-rose-200 bg-rose-50 font-semibold text-rose-700 hover:bg-rose-100">
            <XCircle size={12} /> Cancelled
          </Badge>
        );
      case "active":
        return (
          <Badge className="flex items-center gap-1 border-blue-200 bg-blue-50 font-semibold text-blue-700 hover:bg-blue-100">
            <Clock size={12} className="animate-pulse" /> Active
          </Badge>
        );
      default:
        return (
          <Badge className="flex items-center gap-1 border-amber-200 bg-amber-50 font-semibold text-amber-700 hover:bg-amber-100">
            <AlertCircle size={12} /> Pending
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

  // Stop card-button clicks from bubbling to card's onClick
  const stopProp = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold text-heading">Received Bookings</h1>
        <p className="max-w-2xl leading-relaxed text-muted-foreground">
          Manage and track service requests you have received from customers.
        </p>
      </div>

      {/* Filtering and Sorting Row */}
      <div className="flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {["all", "pending", "active", "completed", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold capitalize transition-all ${
                statusFilter === status
                  ? "border-dark bg-dark text-white"
                  : "border-border bg-white text-muted-foreground hover:bg-muted"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown size={14} className="text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="cursor-pointer rounded-md border border-border bg-white px-3 py-1.5 text-sm font-medium text-dark focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
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
              <CardContent className="h-52" />
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center text-destructive">
          <AlertCircle className="mx-auto mb-2 size-8" />
          <p className="font-semibold">Failed to fetch order history</p>
          <p className="mt-1">{error?.message || "An unexpected error occurred. Please try again."}</p>
          <Button onClick={getOrders} size="sm" variant="outline" className="mt-4 border-destructive hover:bg-destructive/10">
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
              ? "You haven't received any service requests yet."
              : `You don't have any ${statusFilter} bookings.`}
          </p>
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
                  <div className="space-y-0.5">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
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
                {/* Customer Info */}
                <div className="flex items-center gap-2 text-sm font-semibold text-dark">
                  <div className="grid size-6 place-items-center rounded-full bg-muted text-muted-foreground">
                    <User size={12} />
                  </div>
                  <span>
                    {order.customer
                      ? `${order.customer.first_name} ${order.customer.last_name}`
                      : "N/A"}
                  </span>
                </div>

                {/* Date + Amount row */}
                <div className="flex items-center justify-between border-t border-dashed pt-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase text-muted-foreground">Ordered On</span>
                    <span className="text-sm font-medium text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs font-bold uppercase text-muted-foreground">Amount</span>
                    <span className="text-base font-extrabold text-dark">{formatMoney(order.amount)}</span>
                  </div>
                </div>

                {/* Inline CTA Buttons — always visible on card */}
                <div
                  className="flex flex-wrap gap-2 border-t border-dashed pt-3"
                  onClick={stopProp}
                >
                  {/* Contact actions — always shown */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleMessageCustomer}
                    className="h-8 rounded-full px-3 text-xs font-semibold"
                  >
                    <MessageCircle size={12} className="mr-1" /> Message
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCallCustomer}
                    className="h-8 rounded-full px-3 text-xs font-semibold"
                  >
                    <PhoneCall size={12} className="mr-1" /> Call
                  </Button>

                  {/* Accept — pending only */}
                  {order.status === "pending" && (
                    <Button
                      size="sm"
                      onClick={handleAcceptOrder}
                      className="h-8 rounded-full bg-blue-600 px-3 text-xs font-semibold text-white hover:bg-blue-700"
                    >
                      Accept
                    </Button>
                  )}

                  {/* Request Completion — active only */}
                  {order.status === "active" && (
                    <Button
                      size="sm"
                      disabled={completeLoading && actioningId === order._id}
                      onClick={() => {
                        setActioningId(order._id);
                        handleCompleteOrder(order);
                      }}
                      className="h-8 rounded-full bg-emerald-600 px-3 text-xs font-semibold text-white hover:bg-emerald-700"
                    >
                      <CheckCheck size={12} className="mr-1" />
                      {completeLoading && actioningId === order._id ? "..." : "Complete"}
                    </Button>
                  )}

                  {/* Cancel — pending or active */}
                  {(order.status === "pending" || order.status === "active") && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        stopProp(e);
                        setSelectedOrder(order);
                        setIsCancelling(true);
                        setIsDetailOpen(true);
                      }}
                      className="h-8 rounded-full px-3 text-xs font-semibold"
                    >
                      <Ban size={12} className="mr-1" /> Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Details Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={(open) => {
        setIsDetailOpen(open);
        if (!open) { setIsCancelling(false); setCancelReason(""); }
      }}>
        <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <div className="mt-2 flex items-center justify-between pr-4">
                  <span className="font-mono text-muted-foreground" />
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <DialogTitle className="mt-2 text-xl font-extrabold text-heading">
                  {selectedOrder.service?.title || "Service Details"}
                </DialogTitle>
                <DialogDescription>
                  Detailed report for this customer booking.
                </DialogDescription>
              </DialogHeader>

              <div className="my-4 space-y-6">
                {/* Cancelled warning */}
                {selectedOrder.status === "cancelled" && (
                  <div className="space-y-1 rounded-lg border border-rose-200 bg-rose-50 p-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-rose-800">
                      <XCircle size={16} /> Booking Cancelled
                    </div>
                    {selectedOrder.cancellation_reason && (
                      <p className="font-semibold leading-relaxed text-rose-700">
                        Reason: "{selectedOrder.cancellation_reason}"
                      </p>
                    )}
                  </div>
                )}

                {/* Service & Offering */}
                <div className="space-y-3 rounded-lg bg-muted p-4">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                    Service Plan & Amount
                  </h4>
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-bold text-dark">{selectedOrder.offering?.title}</p>
                      <p className="text-sm text-muted-foreground">Chosen Tier</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-extrabold text-primary">{formatMoney(selectedOrder.amount)}</p>
                      <p className="text-sm text-muted-foreground">Total Price</p>
                    </div>
                  </div>
                  {selectedOrder.service?.description && (
                    <p className="line-clamp-3 leading-relaxed text-muted-foreground">
                      {selectedOrder.service.description}
                    </p>
                  )}
                </div>

                {/* Customer Card */}
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                    Customer Information
                  </h4>
                  <div className="flex items-start gap-3 rounded-lg border bg-white p-4">
                    <div className="grid size-10 shrink-0 place-items-center rounded-full bg-dark text-sm font-extrabold text-white">
                      {selectedOrder.customer
                        ? (selectedOrder.customer.first_name?.[0] || "") +
                          (selectedOrder.customer.last_name?.[0] || "")
                        : "C"}
                    </div>
                    <div className="space-y-1 font-semibold text-dark">
                      <p className="font-bold">
                        {selectedOrder.customer
                          ? `${selectedOrder.customer.first_name} ${selectedOrder.customer.last_name}`
                          : "N/A"}
                      </p>
                      <p className="font-normal text-muted-foreground">
                        {selectedOrder.customer?.email || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                {selectedOrder.initial_message && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                      Customer Request & Requirements
                    </h4>
                    <div className="space-y-3 rounded-lg border bg-white p-4">
                      <div className="grid grid-cols-2 gap-4">
                        {selectedOrder.initial_message.name && (
                          <div>
                            <span className="block text-sm font-semibold text-muted-foreground">Contact Name</span>
                            <span className="font-bold text-dark">{selectedOrder.initial_message.name}</span>
                          </div>
                        )}
                        {selectedOrder.initial_message.location && (
                          <div className="flex items-start gap-1">
                            <MapPin size={12} className="mt-0.5 text-muted-foreground" />
                            <div>
                              <span className="block text-sm font-semibold text-muted-foreground">Location</span>
                              <span className="font-bold text-dark">{selectedOrder.initial_message.location}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      {selectedOrder.initial_message.service_description && (
                        <div className="border-t pt-3">
                          <span className="mb-1 block text-sm font-semibold text-muted-foreground">
                            Problem / Service Description
                          </span>
                          <p className="rounded-md bg-muted/30 p-2.5 font-semibold italic leading-relaxed text-dark">
                            "{selectedOrder.initial_message.service_description}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                  <div>
                    <span className="block text-sm font-semibold text-muted-foreground">Ordered On</span>
                    <span className="font-bold text-dark">{formatDate(selectedOrder.createdAt)}</span>
                  </div>
                  {selectedOrder.completed_at && (
                    <div>
                      <span className="block text-sm font-semibold text-muted-foreground">Completed On</span>
                      <span className="font-bold text-dark">{formatDate(selectedOrder.completed_at)}</span>
                    </div>
                  )}
                </div>

                {/* Cancellation form */}
                {isCancelling && (
                  <div className="space-y-3 rounded-lg border border-rose-200 bg-rose-50 p-4 duration-200 animate-in fade-in-50">
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
                      <Button size="sm" variant="ghost" onClick={() => setIsCancelling(false)} disabled={cancelLoading}>
                        Back
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleCancelOrder(selectedOrder)}
                        disabled={cancelLoading}
                      >
                        {cancelLoading ? "Processing..." : "Confirm Cancellation"}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Dialog action buttons */}
                {!isCancelling && (
                  <div className="space-y-3 border-t pt-4">
                    {/* Primary actions */}
                    <div className="flex flex-wrap gap-2">
                      {selectedOrder.status === "pending" && (
                        <Button
                          onClick={handleAcceptOrder}
                          className="flex-1 rounded-full bg-blue-600 font-semibold text-white hover:bg-blue-700"
                        >
                          Accept Order
                        </Button>
                      )}
                      {selectedOrder.status === "active" && (
                        <Button
                          onClick={() => handleCompleteOrder(selectedOrder)}
                          disabled={completeLoading}
                          className="flex-1 rounded-full bg-emerald-600 font-semibold text-white hover:bg-emerald-700"
                        >
                          <CheckCheck size={15} className="mr-1" />
                          {completeLoading ? "Completing..." : "Request Completion"}
                        </Button>
                      )}
                      {(selectedOrder.status === "pending" || selectedOrder.status === "active") && (
                        <Button
                          variant="destructive"
                          onClick={() => setIsCancelling(true)}
                          className="flex-1 rounded-full font-semibold"
                        >
                          <Ban size={15} className="mr-1" /> Cancel Order
                        </Button>
                      )}
                    </div>

                    {/* Secondary actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        onClick={handleMessageCustomer}
                        className="flex-1 rounded-full font-semibold"
                      >
                        <MessageCircle size={14} className="mr-1.5" /> Message
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCallCustomer}
                        className="flex-1 rounded-full font-semibold"
                      >
                        <PhoneCall size={14} className="mr-1.5" /> Call
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleReportIssue}
                        className="flex-1 rounded-full font-semibold text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700"
                      >
                        <AlertTriangle size={14} className="mr-1.5" /> Report Issue
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
