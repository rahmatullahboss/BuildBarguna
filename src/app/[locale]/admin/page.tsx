import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, Building, TrendingUp, FileText, Award, UserCheck, Clock } from "lucide-react";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import MemberApplicationsTable from "@/components/admin/MemberApplicationsTable";

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
  
  // Import admin actions
  const { getMemberApplications } = await import("@/lib/actions/admin.actions");
  const memberApplications = await getMemberApplications();

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {t("welcomeBack")}, {session?.user?.name || session?.user?.email}
        </h1>
        <p className="text-muted-foreground mt-2">{t("dashboardSubtitle")}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-card border border-border shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("totalUsers")}
            </CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">{t("registeredUsers")}</p>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("approvedMembers")}
            </CardTitle>
            <Award className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.totalMembers}</div>
            <p className="text-xs text-muted-foreground mt-1">{t("activeMemberships")}</p>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("totalCourses")}
            </CardTitle>
            <BookOpen className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground mt-1">{t("trainingPrograms")}</p>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("totalVentures")}
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.totalVentures}</div>
            <p className="text-xs text-muted-foreground mt-1">{t("investmentProjects")}</p>
          </CardContent>
        </Card>

        <Card className="bg-card border border-red-200 dark:border-red-800 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-400">
              {t("pendingApplications")}
            </CardTitle>
            <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-900 dark:text-red-200">{stats.pendingApplications}</div>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">{t("awaitingReview")}</p>
          </CardContent>
        </Card>

        <Card className="bg-card border border-indigo-200 dark:border-indigo-800 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-indigo-700 dark:text-indigo-400">
              {t("totalBrands")}
            </CardTitle>
            <Building className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-900 dark:text-indigo-200">{stats.totalBrands}</div>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">{t("activeBrands")}</p>
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
                  <p className="text-sm font-medium text-foreground">{t("newMemberJoined")}</p>
                  <p className="text-xs text-muted-foreground">{t("fewMinutesAgo")}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{t("courseApplicationSubmitted")}</p>
                  <p className="text-xs text-muted-foreground">{t("oneHourAgo")}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{t("ventureProposalReceived")}</p>
                  <p className="text-xs text-muted-foreground">{t("twoDaysAgo")}</p>
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
              <a href="/admin/courses" className="block p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium text-blue-900 dark:text-blue-200">{t("manageCourses")}</span>
                </div>
              </a>
              <a href="/admin/members" className="block p-3 bg-green-50 dark:bg-green-950/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="font-medium text-green-900 dark:text-green-200">{t("reviewMembers")}</span>
                </div>
              </a>
              <a href="/admin/ventures" className="block p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <span className="font-medium text-purple-900 dark:text-purple-200">{t("reviewVentures")}</span>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
