import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, UserCheck, Clock } from "lucide-react";
import Link from "next/link";
import { getMemberApplications, getDashboardStats } from "@/lib/actions/admin.actions";
import MemberApplicationsTable from "@/components/admin/MemberApplicationsTable";

export default async function AdminMembersPage() {
  const session = await auth();
  const t = await getTranslations("AdminPage");
  
  // Get member applications and stats
  const [memberApplications, stats] = await Promise.all([
    getMemberApplications(),
    getDashboardStats()
  ]);

  const pendingCount = memberApplications.filter(app => app.memberProfile && !app.memberProfile.isApproved).length;
  const approvedCount = memberApplications.filter(app => app.memberProfile?.isApproved).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Member Management</h1>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{memberApplications.length}</div>
            <p className="text-xs text-muted-foreground">
              All member applications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Members</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
            <p className="text-xs text-muted-foreground">
              Active co-operative members
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Member Applications Table */}
      <MemberApplicationsTable applications={memberApplications} />
    </div>
  );
}