import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building, Eye, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { getVentureProposals } from "@/lib/actions/admin.actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminVenturesPage() {
  const session = await auth();
  const t = await getTranslations("AdminPage");
  
  // Get venture proposals
  const ventures = await getVentureProposals();

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'proposed':
        return <Badge className="bg-yellow-100 text-yellow-800">Proposed</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'active':
        return <Badge className="bg-blue-100 text-blue-800">Active</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

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
          <h1 className="text-3xl font-bold">Venture Proposals</h1>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Proposals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ventures.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {ventures.filter(v => v.status.toLowerCase() === 'proposed').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {ventures.filter(v => v.status.toLowerCase() === 'approved').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {ventures.filter(v => v.status.toLowerCase() === 'active').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ventures Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Venture Proposals</CardTitle>
        </CardHeader>
        <CardContent>
          {ventures.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No venture proposals yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Proposer</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ventures.map((venture) => (
                  <TableRow key={venture.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{venture.titleEn}</p>
                        <p className="text-sm text-gray-500">{venture.titleBn}</p>
                      </div>
                    </TableCell>
                    <TableCell>{venture.proposer.name || venture.proposer.email}</TableCell>
                    <TableCell>৳{venture.budget.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(venture.status)}</TableCell>
                    <TableCell>{new Date(venture.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {venture.status.toLowerCase() === 'proposed' && (
                          <>
                            <form action={`/api/admin/ventures/${venture.id}/status`} method="post">
                              <input type="hidden" name="status" value="approved" />
                              <Button type="submit" variant="outline" size="sm" className="text-green-600">
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            </form>
                            <form action={`/api/admin/ventures/${venture.id}/status`} method="post">
                              <input type="hidden" name="status" value="rejected" />
                              <Button type="submit" variant="outline" size="sm" className="text-red-600">
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </form>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}