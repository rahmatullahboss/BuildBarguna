"use client";

import { useState, useTransition } from "react";
import { updateShareOrderStatus } from "@/lib/actions/project.actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Order {
  id: string;
  quantity: number;
  pricePerShare: number;
  totalAmount: number;
  paymentMethod: string;
  paymentRef: string | null;
  status: string;
  adminNote: string | null;
  createdAt: Date;
  user: { id: string; name: string | null; email: string };
  project: { titleEn: string };
}

const statusIcon = {
  PENDING: <Clock className="h-4 w-4 text-yellow-500" />,
  APPROVED: <CheckCircle className="h-4 w-4 text-green-500" />,
  REJECTED: <XCircle className="h-4 w-4 text-red-500" />,
};

export function ShareOrdersTable({ orders: initial }: { orders: Order[] }) {
  const [orders, setOrders] = useState(initial);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const handleAction = (orderId: string, status: "APPROVED" | "REJECTED") => {
    startTransition(async () => {
      const result = await updateShareOrderStatus(orderId, status, notes[orderId]);
      if (result.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status, adminNote: notes[orderId] ?? null } : o))
        );
        toast({ title: result.message });
      } else {
        toast({ title: result.message, variant: "destructive" });
      }
    });
  };

  const pendingOrders = orders.filter((o) => o.status === "PENDING");
  const processedOrders = orders.filter((o) => o.status !== "PENDING");

  return (
    <div className="space-y-8">
      {/* Pending */}
      <div>
        <h2 className="text-lg font-semibold mb-3">⏳ Pending Orders ({pendingOrders.length})</h2>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Ref</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Admin Note</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingOrders.length === 0 && (
                <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">No pending orders.</TableCell></TableRow>
              )}
              {pendingOrders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>
                    <p className="font-medium">{o.user.name}</p>
                    <p className="text-xs text-muted-foreground">{o.user.email}</p>
                  </TableCell>
                  <TableCell className="font-medium">{o.project.titleEn}</TableCell>
                  <TableCell>{o.quantity}</TableCell>
                  <TableCell>৳{o.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>{o.paymentMethod}</TableCell>
                  <TableCell className="text-xs">{o.paymentRef || "—"}</TableCell>
                  <TableCell className="text-xs">{new Date(o.createdAt).toLocaleDateString("en-GB")}</TableCell>
                  <TableCell>
                    <Input
                      placeholder="Note..."
                      value={notes[o.id] ?? ""}
                      onChange={(e) => setNotes((prev) => ({ ...prev, [o.id]: e.target.value }))}
                      className="h-8 text-xs w-28"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 h-8 text-xs" onClick={() => handleAction(o.id, "APPROVED")} disabled={isPending}>
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive" className="h-8 text-xs" onClick={() => handleAction(o.id, "REJECTED")} disabled={isPending}>
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Processed */}
      <div>
        <h2 className="text-lg font-semibold mb-3">✅ Processed Orders ({processedOrders.length})</h2>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedOrders.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No processed orders yet.</TableCell></TableRow>
              )}
              {processedOrders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>
                    <p className="font-medium">{o.user.name}</p>
                    <p className="text-xs text-muted-foreground">{o.user.email}</p>
                  </TableCell>
                  <TableCell>{o.project.titleEn}</TableCell>
                  <TableCell>{o.quantity}</TableCell>
                  <TableCell>৳{o.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>{o.paymentMethod}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {statusIcon[o.status as keyof typeof statusIcon]}
                      <span className="text-xs font-medium">{o.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{o.adminNote || "—"}</TableCell>
                  <TableCell className="text-xs">{new Date(o.createdAt).toLocaleDateString("en-GB")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
