"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { buyShareAction } from "@/lib/actions/project.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, AlertCircle, CheckCircle } from "lucide-react";
import { useState } from "react";

interface Project {
  id: string;
  pricePerShare: number;
  availableShares: number;
  totalShares: number;
}

export function BuyShareForm({ project }: { project: Project }) {
  const t = useTranslations("ProjectsPage");
  const [state, formAction, isPending] = useActionState(buyShareAction, {
    success: false,
    message: "",
  });
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("BKASH");

  const totalAmount = quantity * project.pricePerShare;

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="text-lg">{t("buyShares")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="projectId" value={project.id} />

          {/* Quantity */}
          <div className="space-y-1.5">
            <Label htmlFor="quantity">{t("quantity")}</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min={1}
              max={project.availableShares}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              required
            />
            {state.errors?.quantity && (
              <p className="text-xs text-red-500">{state.errors.quantity[0]}</p>
            )}
          </div>

          {/* Total amount display */}
          <div className="bg-secondary rounded-lg p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("pricePerShare")}:</span>
              <span>৳{project.pricePerShare.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-base mt-1 pt-1 border-t">
              <span>{t("totalAmount")}:</span>
              <span>৳{totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment method */}
          <div className="space-y-1.5">
            <Label>{t("paymentMethod")}</Label>
            <Select
              name="paymentMethod"
              value={paymentMethod}
              onValueChange={setPaymentMethod}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BKASH">bKash</SelectItem>
                <SelectItem value="NAGAD">Nagad</SelectItem>
                <SelectItem value="ONLINE_GATEWAY">{t("onlineGateway")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payment instructions for manual methods */}
          {(paymentMethod === "BKASH" || paymentMethod === "NAGAD") && (
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm space-y-1">
              <p className="font-semibold text-blue-800 dark:text-blue-200">{t("paymentInstructions")}</p>
              <p className="text-blue-700 dark:text-blue-300">
                {paymentMethod === "BKASH" ? "bKash" : "Nagad"} → Send Money → <strong>01739416661</strong>
              </p>
              <p className="text-blue-700 dark:text-blue-300">{t("amount")}: <strong>৳{totalAmount.toLocaleString()}</strong></p>
              <p className="text-blue-700 dark:text-blue-300">{t("enterRefBelow")}</p>
            </div>
          )}

          {/* Payment ref */}
          <div className="space-y-1.5">
            <Label htmlFor="paymentRef">{t("paymentRef")} {paymentMethod !== "ONLINE_GATEWAY" ? "" : t("optional")}</Label>
            <Input
              id="paymentRef"
              name="paymentRef"
              placeholder={t("paymentRefPlaceholder")}
            />
          </div>

          {/* State messages */}
          {state.message && (
            <div
              className={`flex items-start gap-2 p-3 rounded-lg text-sm ${
                state.success
                  ? "bg-green-50 text-green-800 border border-green-200 dark:bg-green-950/20 dark:text-green-200"
                  : "bg-red-50 text-red-800 border border-red-200 dark:bg-red-950/20 dark:text-red-200"
              }`}
            >
              {state.success ? (
                <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              )}
              <p>{state.message}</p>
            </div>
          )}

          <Button type="submit" className="w-full gap-2" disabled={isPending || state.success}>
            <ShoppingCart className="h-4 w-4" />
            {isPending ? t("submitting") : t("confirmOrder")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
