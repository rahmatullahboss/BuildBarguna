import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Building, TrendingUp, FileText, Award } from "lucide-react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getDashboardStats() {
  try {
    const [
      totalUsers,
      totalMembers,
      totalCourses,
      totalVentures,
      pendingApplications,
      totalBrands
    ] = await Promise.all([
      prisma.user.count(),
      prisma.memberProfile.count({ where: { isApproved: true } }),
      prisma.course.count(),
      prisma.venture.count(),
      prisma.courseApplication.count({ where: { status: "PENDING" } }),
      prisma.brand.count()
    ]);

    return {
      totalUsers,
      totalMembers,
      totalCourses,
      totalVentures,
      pendingApplications,
      totalBrands
    };
  } catch (error) {
    return {
      totalUsers: 0,
      totalMembers: 0,
      totalCourses: 0,
      totalVentures: 0,
      pendingApplications: 0,
      totalBrands: 0
    };
  }
}

export default async function AdminDashboardPage() {
  const session = await auth();
  const t = await getTranslations("AdminPage");
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {t("welcomeBack")}, {session?.user?.name || session?.user?.email}
        </h1>
        <p className="text-gray-600 mt-2">{t("dashboardSubtitle")}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">
              {t("totalUsers")}
            </CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">{stats.totalUsers}</div>
            <p className="text-xs text-blue-600 mt-1">{t("registeredUsers")}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              {t("approvedMembers")}
            </CardTitle>
            <Award className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">{stats.totalMembers}</div>
            <p className="text-xs text-green-600 mt-1">{t("activeMemberships")}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">
              {t("totalCourses")}
            </CardTitle>
            <BookOpen className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">{stats.totalCourses}</div>
            <p className="text-xs text-purple-600 mt-1">{t("trainingPrograms")}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">
              {t("totalVentures")}
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900">{stats.totalVentures}</div>
            <p className="text-xs text-orange-600 mt-1">{t("investmentProjects")}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700">
              {t("pendingApplications")}
            </CardTitle>
            <FileText className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-900">{stats.pendingApplications}</div>
            <p className="text-xs text-red-600 mt-1">{t("awaitingReview")}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-indigo-700">
              {t("totalBrands")}
            </CardTitle>
            <Building className="h-5 w-5 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-900">{stats.totalBrands}</div>
            <p className="text-xs text-indigo-600 mt-1">{t("activeBrands")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{t("recentActivity")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{t("newMemberJoined")}</p>
                  <p className="text-xs text-gray-500">{t("fewMinutesAgo")}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{t("courseApplicationSubmitted")}</p>
                  <p className="text-xs text-gray-500">{t("oneHourAgo")}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{t("ventureProposalReceived")}</p>
                  <p className="text-xs text-gray-500">{t("twoDaysAgo")}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{t("quickActions")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <a href="/admin/courses" className="block p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-900">{t("manageCourses")}</span>
                </div>
              </a>
              <a href="/admin/members" className="block p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-900">{t("reviewMembers")}</span>
                </div>
              </a>
              <a href="/admin/ventures" className="block p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-purple-900">{t("reviewVentures")}</span>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
