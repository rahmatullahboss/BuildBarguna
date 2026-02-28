"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { CheckCircle, XCircle, Eye, Phone, FileText, Users } from "lucide-react";
import { approveMemberApplication, rejectMemberApplication, removeApprovedMember } from "@/lib/actions/admin.actions";

interface MemberApplication {
  id: string;
  name: string | null;
  email: string;
  createdAt: Date;
  memberProfile: {
    phone: string;
    isApproved: boolean;
    policyConsent: boolean;
  } | null;
}

interface Props {
  applications: MemberApplication[];
}

export default function MemberApplicationsTable({ applications }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<MemberApplication | null>(null);
  const [optimisticallyRemoved, setOptimisticallyRemoved] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const handleApprove = async (userId: string) => {
    if (!confirm("Approve this member application?")) return;
    setLoading(userId);
    try {
      const result = await approveMemberApplication(userId);
      if (result?.success) {
        window.location.reload();
      } else if (result?.message) {
        alert(result.message);
      }
    } catch (e) {
      alert("Failed to approve member");
    } finally {
      setLoading(null);
    }
  };


  const handleRemove = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this approved member? This action cannot be undone.")) return;
    setLoading(userId);
    try {
      const result = await removeApprovedMember(userId);
      // handle result if needed
    } finally {
      setLoading(null);
    }
  };

  const handleReject = async (userId: string) => {
    if (!confirm("Are you sure you want to reject this application? This will delete the user permanently.")) {
      return;
    }
    
    setLoading(userId);
    try {
      const result = await rejectMemberApplication(userId);
      if (result.success) {
        // Refresh the page or update state
        window.location.reload();
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("Failed to reject member");
    } finally {
      setLoading(null);
    }
  };

  const handlePrintPDF = (member: MemberApplication) => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print the member certificate');
      return;
    }

    const currentDate = new Date().toLocaleDateString();
    const memberSince = new Date(member.createdAt).toLocaleDateString();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Member Certificate - ${member.name}</title>
        <style>
          @page {
            size: A4;
            margin: 0;
          }

          :root {
            --ink: #1b1b1b;
            --muted: #6b7280;
            --gold: #bfa158;
            --gold-dark: #9f8645;
            --border: #e5e7eb;
          }

          html, body { height: 100%; }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            color: var(--ink);
            font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
            background: #ffffff;
            display: block;
            margin: 0;
          }

          .page {
            width: 210mm;
            min-height: 297mm;
            background: white;
            position: relative;
            margin: 0 auto;
            padding: 20mm 15mm;
            border: 6px double var(--gold);
            box-shadow: 0 0 0 10px rgba(191,161,88,0.15) inset;
          }

          /* Corner ornaments */
          .page:before, .page:after {
            content: "";
            position: absolute;
            inset: 16px;
            border: 1px solid var(--gold);
            pointer-events: none;
          }

          .header {
            text-align: center;
            padding-bottom: 18px;
            margin-bottom: 22px;
            border-bottom: 2px solid var(--border);
          }
          .brand {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            font-weight: 700;
            letter-spacing: 0.04em;
          }
          .emblem {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: radial-gradient(circle at 30% 30%, #fff, #f7f3e7 60%, #efe6cb 100%);
            border: 2px solid var(--gold);
            box-shadow: 0 0 0 3px rgba(191,161,88,0.25) inset;
            display: grid;
            place-items: center;
            font-size: 18px;
            color: var(--gold-dark);
          }
          .subtitle {
            margin-top: 6px;
            color: var(--muted);
            font-size: 13px;
          }

          .title {
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 0.14em;
            font-weight: 800;
            font-size: 26px;
            color: var(--ink);
            margin: 14px 0 6px 0;
          }
          .ribbon {
            text-align: center;
            color: var(--gold-dark);
            font-size: 12px;
            letter-spacing: 0.18em;
          }

          .declaration {
            text-align: center;
            margin: 14px 0 22px 0;
            color: #374151;
          }

          .section {
            margin: 10px 0 18px 0;
            border: 1px solid var(--border);
            background: linear-gradient(180deg, #ffffff, #faf9f6);
            border-radius: 8px;
            overflow: hidden;
          }
          .rows { padding: 8px 12px; }
          .row {
            display: grid;
            grid-template-columns: 220px 1fr;
            gap: 12px;
            padding: 10px 6px;
            border-bottom: 1px dashed #e6e2d9;
          }
          .row:last-child { border-bottom: 0; }
          .label {
            font-variant-caps: all-small-caps;
            letter-spacing: 0.06em;
            color: #6b6151;
            font-weight: 700;
          }
          .value { color: #1f2937; }

          .status {
            display: inline-block;
            padding: 6px 10px;
            background: #ecfdf5;
            color: #047857;
            border: 1px solid #a7f3d0;
            border-radius: 999px;
            font-weight: 700;
            letter-spacing: 0.04em;
            font-size: 12px;
          }

          .signatures {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-top: 36px;
          }
          .sig {
            text-align: center;
            padding-top: 48px;
            position: relative;
          }
          .sig:before {
            content: "";
            position: absolute;
            left: 10%; right: 10%; bottom: 36px;
            border-top: 1px solid #111827;
            opacity: 0.8;
          }
          .sig small { color: var(--muted); letter-spacing: 0.06em; }

          .footer {
            margin-top: 28px;
            text-align: center;
            color: var(--muted);
            font-size: 12px;
          }

          .seal {
            position: absolute;
            right: 36px;
            bottom: 120px;
            width: 110px; height: 110px;
            border-radius: 50%;
            border: 3px solid var(--gold);
            color: var(--gold-dark);
            display: grid; place-items: center;
            transform: rotate(-8deg);
            box-shadow: 0 0 0 6px rgba(191,161,88,0.2) inset;
          }
          .seal span {
            font-weight: 800;
            text-transform: uppercase;
            font-size: 10px;
            letter-spacing: 0.18em;
            text-align: center;
          }

          .actions { text-align: center; margin-top: 18px; }
          .btn {
            background: #111827; color: #fff;
            border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;
          }
          .btn.muted { background: #6b7280; margin-left: 8px; }

          @media print {
            .no-print { display: none !important; }
            html, body { height: auto; margin: 0; background: #ffffff !important; }
          }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="header">
            <div class="brand">
              <div class="emblem">BB</div>
              <div>
                <div>BUILD BARGUNA INITIATIVE</div>
                <div class="subtitle">স্বচ্ছ ভিত্তি গঠন • একসাথে মূলধন, একসাথে উন্নয়ন</div>
              </div>
            </div>
          </div>

          <div class="title">Founding Member Certificate</div>
          <div class="ribbon">Community • Initiative • Transparency</div>
          <div class="declaration">This is to certify that the following member has been formally approved.</div>

          <div class="section">
            <div class="rows">
              <div class="row"><div class="label">Member Name</div><div class="value">${member.name || 'N/A'}</div></div>
              <div class="row"><div class="label">Phone Number</div><div class="value">${member.memberProfile?.phone || 'N/A'}</div></div>
            </div>
          </div>

          <div class="section">
            <div class="rows">
              <div class="row"><div class="label">Member Since</div><div class="value">${memberSince}</div></div>
              <div class="row"><div class="label">Status</div><div class="value"><span class="status">APPROVED • FOUNDING MEMBER</span></div></div>
            </div>
          </div>

          <div class="signatures">
            <div class="sig">
              <strong>Chairman</strong><br />
              <small>Build Barguna Initiative</small>
            </div>
            <div class="sig">
              <strong>Secretary</strong><br />
              <small>Build Barguna Initiative</small>
            </div>
          </div>

          <div class=\"seal\" aria-label=\"Seal placeholder\"></div>

          <div class="footer">
            <p><strong>Certificate Issue Date:</strong> ${currentDate}</p>
            <p>This certificate is issued by Build Barguna Initiative • info@buildbarguna.org</p>
          </div>

          <div class="actions no-print">
            <button class="btn" onclick="window.print()">Print Certificate</button>
            <button class="btn muted" onclick="window.close()">Close</button>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const pendingApplications = applications.filter(app => app.memberProfile && !app.memberProfile.isApproved);
  const approvedMembers = applications.filter(app => app.memberProfile?.isApproved);

  return (
    <div className="space-y-6">
      {/* Pending Applications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              {pendingApplications.length}
            </Badge>
            Pending Member Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingApplications.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No pending applications</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className="font-medium">{application.name}</TableCell>
                    <TableCell>{application.email}</TableCell>
                    <TableCell>{application.memberProfile?.phone}</TableCell>
                    <TableCell>{new Date(application.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedMember(application)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:text-green-700"
                          onClick={() => handleApprove(application.id)}
                          disabled={loading === application.id}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleReject(application.id)}
                          disabled={loading === application.id}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Approved Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {approvedMembers.length}
            </Badge>
            Approved Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          {approvedMembers.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No approved members yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Approved Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvedMembers.filter(m => !optimisticallyRemoved.has(m.id)).map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.memberProfile?.phone}</TableCell>
                    <TableCell>{new Date(member.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Approved</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedMember(member)}
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePrintPDF(member)}
                          className="text-blue-600 hover:text-blue-700"
                          title="Print certificate"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          title="Remove approved member"
                          disabled={isPending || loading === member.id}
                          onClick={() => {
                            if (!confirm("Remove this approved member? This cannot be undone.")) return;
                            setOptimisticallyRemoved(prev => new Set(prev).add(member.id));
                            setLoading(member.id);
                            startTransition(async () => {
                              try {
                                await removeApprovedMember(member.id);
                              } catch (e) {
                                // Revert optimistic update on failure
                                setOptimisticallyRemoved(prev => {
                                  const next = new Set(prev);
                                  next.delete(member.id);
                                  return next;
                                });
                                alert("Failed to remove member");
                              } finally {
                                setLoading(null);
                              }
                            });
                          }}
                        >
                          <XCircle className="h-4 w-4 mr-1" /> Remove
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Member Details Modal */}
      {selectedMember && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSelectedMember(null)}
          ></div>
          
          {/* Modal Content */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="pointer-events-auto w-full max-w-2xl max-h-[90vh] overflow-hidden">
              <Card className="bg-white dark:bg-gray-900 shadow-2xl text-gray-900 dark:text-gray-100">
                <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <span>Member Application Details</span>
                    <button 
                      onClick={() => setSelectedMember(null)}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-1 transition-colors"
                      type="button"
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                  </CardTitle>
                </CardHeader>
                <div className="max-h-[70vh] overflow-y-auto">
            <CardContent className="space-y-6">
              {/* Personal Information */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Full Name</label>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">{selectedMember.name || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Application Date</label>
                    <p className="text-gray-900 dark:text-gray-100">{new Date(selectedMember.createdAt).toLocaleDateString('en-BD', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-blue-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Contact Information
                </h4>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone Number</label>
                    <p className="text-gray-900 dark:text-gray-100">{selectedMember.memberProfile?.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Application Status */}
              <div className="bg-green-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Application Status
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Current Status</label>
                    <div className="mt-1">
                      <Badge className={selectedMember.memberProfile?.isApproved ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"}>
                        {selectedMember.memberProfile?.isApproved ? "✅ Approved" : "⏳ Pending Review"}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Policy Consent</label>
                    <p className={`font-medium ${selectedMember.memberProfile?.policyConsent ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {selectedMember.memberProfile?.policyConsent ? "✅ Agreed to Terms" : "❌ Not Agreed"}
                    </p>
                  </div>
                </div>
                
                {selectedMember.memberProfile?.isApproved && (
                  <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-md">
                    <p className="text-green-800 dark:text-green-300 text-sm">
                      <strong>🎉 This member has been approved!</strong> They can now access all founding member benefits and participate in initiative activities.
                    </p>
                  </div>
                )}
              </div>

                  <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 m-[-1.5rem] mt-6 p-6">
                    {selectedMember.memberProfile?.isApproved && (
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => handlePrintPDF(selectedMember)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Print PDF
                      </Button>
                    )}
                    {!selectedMember.memberProfile?.isApproved && (
                      <>
                        <Button
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white dark:bg-green-600 dark:hover:bg-green-500"
                          onClick={() => {
                            handleApprove(selectedMember.id);
                            setSelectedMember(null);
                          }}
                          disabled={loading === selectedMember.id}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                          onClick={() => {
                            handleReject(selectedMember.id);
                            setSelectedMember(null);
                          }}
                          disabled={loading === selectedMember.id}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => setSelectedMember(null)}
                      className="px-6"
                    >
                      Close
                    </Button>
                  </div>
                </CardContent>
                </div>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}