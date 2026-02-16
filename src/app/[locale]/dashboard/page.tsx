import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { 
  Building2, 
  CreditCard, 
  FileText, 
  User, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  XCircle,
  AlertCircle 
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

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      memberProfile: true,
    },
  });

  if (!user) {
    redirect(`/${locale}/auth/signin`);
  }

  const t = await getTranslations("Dashboard");
  const member = user.memberProfile;

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
