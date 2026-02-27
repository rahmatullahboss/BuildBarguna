"use client";

import { useState, useActionState, useTransition } from "react";
import { createDividendAction, distributeDividendAction, type DividendFormState } from "@/lib/actions/wallet.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Send } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Project { id: string; titleEn: string; titleBn: string; }
interface Dividend {
  id: string;
  month: number;
  year: number;
  percentage: number;
  totalAmount: number;
  isDistributed: boolean;
  note: string | null;
  createdAt: Date;
  project: { titleEn: string; titleBn: string };
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const initialState: DividendFormState = { success: false, message: "" };

export function DividendsManager({ dividends: initial, projects }: { dividends: Dividend[]; projects: Project[] }) {
  const [dividends, setDividends] = useState(initial);
  const [isPending, startTransition] = useTransition();

  const [state, formAction, isFormPending] = useActionState(
    async (prev: DividendFormState, fd: FormData) => {
      const result = await createDividendAction(prev, fd);
      if (result.success) window.location.reload();
      return result;
    },
    initialState
  );

  const handleDistribute = (id: string) => {
    if (!confirm("Distribute this dividend to all shareholders? This cannot be undone.")) return;
    startTransition(async () => {
      const result = await distributeDividendAction(id);
      if (result.success) {
        setDividends((prev) => prev.map((d) => d.id === id ? { ...d, isDistributed: true } : d));
        toast({ title: result.message });
      } else {
        toast({ title: result.message, variant: "destructive" });
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Create form */}
      <Card>
        <CardHeader><CardTitle>Create Dividend Record</CardTitle></CardHeader>
        <CardContent>
          <form action={formAction} className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Project</Label>
              <Select name="projectId" required>
                <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                <SelectContent>
                  {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.titleEn}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Month</Label>
              <Select name="month" required>
                <SelectTrigger><SelectValue placeholder="Month" /></SelectTrigger>
                <SelectContent>
                  {MONTHS.map((m, i) => <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Year</Label>
              <Input name="year" type="number" defaultValue={new Date().getFullYear()} min={2024} required />
            </div>
            <div className="space-y-1.5">
              <Label>Profit % distributed</Label>
              <Input name="percentage" type="number" step="0.01" min={0.01} placeholder="e.g. 5.5" required />
            </div>
            <div className="space-y-1.5">
              <Label>Total Amount (৳)</Label>
              <Input name="totalAmount" type="number" step="0.01" min={0.01} placeholder="Total dividend pool" required />
            </div>
            <div className="space-y-1.5">
              <Label>Note (optional)</Label>
              <Input name="note" placeholder="Any note..." />
            </div>

            {state.message && (
              <div className={`col-span-full flex items-center gap-2 p-3 rounded-lg text-sm ${state.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
                {state.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                {state.message}
              </div>
            )}

            <div className="col-span-full">
              <Button type="submit" disabled={isFormPending}>
                {isFormPending ? "Creating..." : "Create Dividend Record"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>%</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Note</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dividends.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No dividends yet.</TableCell></TableRow>
            )}
            {dividends.map((d) => (
              <TableRow key={d.id}>
                <TableCell className="font-medium">{d.project.titleEn}</TableCell>
                <TableCell>{MONTHS[d.month - 1]} {d.year}</TableCell>
                <TableCell>{d.percentage}%</TableCell>
                <TableCell>৳{d.totalAmount.toLocaleString()}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{d.note || "—"}</TableCell>
                <TableCell>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${d.isDistributed ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {d.isDistributed ? "Distributed" : "Pending"}
                  </span>
                </TableCell>
                <TableCell>
                  {!d.isDistributed && (
                    <Button size="sm" className="gap-1 h-8 text-xs" onClick={() => handleDistribute(d.id)} disabled={isPending}>
                      <Send className="h-3 w-3" /> Distribute
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
