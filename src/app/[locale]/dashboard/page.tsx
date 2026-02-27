import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getLocale } from "next-intl/server";
import Link from "next/link";
import { 
  CreditCard, 
  User, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Wallet,
  TrendingUp,
  Star,
  ExternalLink,
  CheckSquare,
} from "lucide-react";

export default async function DashboardPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const session = await auth();

  if (!session?.user) {
    redirect(`/${locale}/auth/signin`);
  }

  const [user, wallet, shareOrders] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      include: { memberProfile: true },
    }),
    prisma.wallet.findUnique({
      where: { userId: session.user.id },
    }),
    prisma.shareOrder.findMany({
      where: { userId: session.user.id, status: "APPROVED" },
      include: {
        project: { select: { titleEn: true, titleBn: true, pricePerShare: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!user) {
    redirect(`/${locale}/auth/signin`);
  }

  const [t, currentLocale] = await Promise.all([
    getTranslations("Dashboard"),
    getLocale(),
  ]);

  const member = user.memberProfile;

  // Group share orders by project
  const sharesByProject = shareOrders.reduce<
    Record<string, { titleEn: string; titleBn: string; pricePerShare: number; totalShares: number; totalAmount: number }>
  >((acc, order) => {
    const pid = order.projectId;
    if (!acc[pid]) {
      acc[pid] = {
        titleEn: order.project.titleEn,
        titleBn: order.project.titleBn,
        pricePerShare: order.project.pricePerShare,
        totalShares: 0,
        totalAmount: 0,
      };
    }
    acc[pid].totalShares += order.quantity;
    acc[pid].totalAmount += order.totalAmount;
    return acc;
  }, {});

  const shareGroups = Object.values(sharesByProject);
  const grandTotalInvested = shareGroups.reduce((sum, g) => sum + g.totalAmount, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {t("welcome")}, {user.name}
              </h1>
              <p className="mt-2 text-gray-600">
                {t("memberSince")} {new Date(user.createdAt).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
              member?.isApproved 
                ? "bg-green-100 text-green-700" 
                : "bg-yellow-100 text-yellow-700"
            }`}>
              {member?.isApproved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  {t("statusApproved")}
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4" />
                  {t("statusPending")}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Application Status Alert */}
        {!member?.isApproved && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  {t("pendingMessage")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Wallet Summary + Share Portfolio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Wallet Summary Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-emerald-50 border-b border-emerald-100 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-900">{t("walletBalance")}</h2>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{t("walletBalance")}</p>
                  <p className="text-3xl font-bold text-emerald-600 mt-1">
                    ৳{(wallet?.balance ?? 0).toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div>
                  <p className="text-sm text-gray-500">{t("points")}</p>
                  <p className="text-2xl font-bold text-amber-500 mt-1">
                    {(wallet?.points ?? 0).toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <Star className="w-6 h-6 text-amber-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Share Portfolio Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-blue-50 border-b border-blue-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">{t("myShares")}</h2>
            </div>
            <div className="p-6">
              {shareGroups.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <TrendingUp className="w-10 h-10 text-gray-300 mb-3" />
                  <p className="text-sm text-gray-500">{t("noShares")}</p>
                  <Link
                    href={`/${locale}/projects`}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    {t("buyShares")}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {shareGroups.map((group, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div className="min-w-0 flex-1 pr-3">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {currentLocale === "bn" ? group.titleBn : group.titleEn}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{group.totalShares} shares</p>
                      </div>
                      <p className="text-sm font-semibold text-blue-600 shrink-0">
                        ৳{group.totalAmount.toLocaleString()}
                      </p>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <p className="text-sm font-semibold text-gray-700">{t("totalInvested")}</p>
                    <p className="text-base font-bold text-blue-700">৳{grandTotalInvested.toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">{t("quickLinks")}</h2>
          </div>
          <div className="p-6 flex flex-wrap gap-3">
            <Link
              href={`/${locale}/projects`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <TrendingUp className="w-4 h-4" />
              {t("buyShares")}
            </Link>
            <Link
              href={`/${locale}/wallet`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
            >
              <Wallet className="w-4 h-4" />
              {t("goToWallet")}
            </Link>
            <Link
              href={`/${locale}/daily-tasks`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors"
            >
              <CheckSquare className="w-4 h-4" />
              {t("dailyTasks")}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
              <User className="w-5 h-5 text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-900">{t("personalInfo")}</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">{t("address")}</p>
                  <p className="text-gray-900">{member?.address || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">{t("phone")}</p>
                  <p className="text-gray-900">{member?.phone || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">{t("nationalId")}</p>
                  <p className="text-gray-900">{member?.nationalId || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-900">{t("paymentInfo")}</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500">{t("paymentMethod")}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-medium text-pink-600">bKash</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t("bkashNumber")}</p>
                <p className="text-gray-900 font-mono">{member?.bkashNumber || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t("transactionId")}</p>
                <p className="text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                  {member?.transactionId || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Nominee Information */}
          {member?.nomineeName && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden md:col-span-2">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-900">{t("nomineeInfo")}</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">{t("nomineeName")}</p>
                  <p className="text-gray-900">{member.nomineeName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t("relation")}</p>
                  <p className="text-gray-900">{member.nomineeRelation || "N/A"}</p>
                </div>
                {member.nomineePhone && (
                  <div>
                    <p className="text-sm text-gray-500">{t("nomineePhone")}</p>
                    <p className="text-gray-900">{member.nomineePhone}</p>
                  </div>
                )}
                {member.nomineeNationalId && (
                  <div>
                    <p className="text-sm text-gray-500">{t("nomineeNid")}</p>
                    <p className="text-gray-900">{member.nomineeNationalId}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
