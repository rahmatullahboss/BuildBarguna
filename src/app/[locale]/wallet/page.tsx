import { getTranslations, getLocale } from "next-intl/server";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet as WalletIcon, TrendingUp, Star, ArrowDownCircle, ArrowUpCircle, Gift } from "lucide-react";
import type { TransactionType } from "@prisma/client";

export default async function WalletPage() {
  const session = await auth();
  const locale = await getLocale();
  if (!session?.user?.id) redirect(`/${locale}/auth/signin`);

  const t = await getTranslations("WalletPage");

  let wallet = await prisma.wallet.findUnique({
    where: { userId: session.user.id },
    include: { transactions: { orderBy: { createdAt: "desc" }, take: 50 } },
  });

  if (!wallet) {
    const created = await prisma.wallet.create({
      data: { userId: session.user.id, balance: 0, points: 0 },
      include: { transactions: true },
    });
    wallet = created;
  }

  const typeIcon: Record<TransactionType, React.ReactNode> = {
    DIVIDEND: <TrendingUp className="h-4 w-4 text-green-600" />,
    TASK_REWARD: <Gift className="h-4 w-4 text-purple-600" />,
    WITHDRAWAL: <ArrowUpCircle className="h-4 w-4 text-red-500" />,
    SHARE_PURCHASE: <ArrowDownCircle className="h-4 w-4 text-blue-500" />,
  };

  const typeLabel: Record<TransactionType, string> = {
    DIVIDEND: t("typeDividend"),
    TASK_REWARD: t("typeTaskReward"),
    WITHDRAWAL: t("typeWithdrawal"),
    SHARE_PURCHASE: t("typeSharePurchase"),
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>

        {/* Balance cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <WalletIcon className="h-6 w-6 opacity-80" />
                <p className="text-sm opacity-80">{t("balance")}</p>
              </div>
              <p className="text-4xl font-bold">৳{wallet.balance.toFixed(2)}</p>
              <p className="text-sm opacity-70 mt-1">{t("balanceDesc")}</p>
            </CardContent>
          </Card>

          <Card className="bg-purple-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <Star className="h-6 w-6 opacity-80" />
                <p className="text-sm opacity-80">{t("points")}</p>
              </div>
              <p className="text-4xl font-bold">{wallet.points}</p>
              <p className="text-sm opacity-70 mt-1">{t("pointsDesc")}</p>
            </CardContent>
          </Card>
        </div>

        {/* Transaction history */}
        <Card>
          <CardHeader>
            <CardTitle>{t("transactions")}</CardTitle>
          </CardHeader>
          <CardContent>
            {wallet.transactions.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">{t("noTransactions")}</p>
            ) : (
              <div className="space-y-3">
                {wallet.transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between py-3 border-b last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-secondary rounded-full">
                        {typeIcon[tx.type]}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{typeLabel[tx.type]}</p>
                        <p className="text-xs text-muted-foreground">{tx.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(tx.createdAt).toLocaleDateString("en-GB")}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`font-bold text-sm ${
                        tx.amount > 0 ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {tx.amount > 0 ? "+" : ""}
                      {tx.type === "TASK_REWARD"
                        ? `${tx.amount} pts`
                        : `৳${Math.abs(tx.amount).toFixed(2)}`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
