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
import { CheckCircle, XCircle, Eye, Phone, Mail, MapPin, FileText, Users } from "lucide-react";
import { approveMemberApplication, rejectMemberApplication, removeApprovedMember } from "@/lib/actions/admin.actions";

interface MemberApplication {
  id: string;
  name: string | null;
  email: string;
  createdAt: Date;
  memberProfile: {
    nationalId: string;
    phone: string;
    address: string;
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
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
            background: white;
            color: black;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #000;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .certificate-title {
            font-size: 28px;
            font-weight: bold;
            margin: 20px 0;
            text-transform: uppercase;
          }
          .member-info {
            margin: 30px 0;
            line-height: 1.8;
          }
          .info-row {
            display: flex;
            margin-bottom: 10px;
            border-bottom: 1px dotted #ccc;
            padding-bottom: 8px;
          }
          .info-label {
            font-weight: bold;
            width: 180px;
            flex-shrink: 0;
          }
          .info-value {
            flex-grow: 1;
          }
          .footer {
            margin-top: 50px;
            border-top: 2px solid #000;
            padding-top: 20px;
            text-align: center;
          }
          .signature-section {
            display: flex;
            justify-content: space-between;
            margin-top: 60px;
          }
          .signature-box {
            text-align: center;
            width: 200px;
          }
          .signature-line {
            border-top: 1px solid #000;
            margin-top: 50px;
            padding-top: 10px;
          }
          @media print {
            body { padding: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">BUILD BARGUNA CO-OPERATIVE</div>
          <p>স্বচ্ছ ভিত্তি গঠন | একসাথে মূলধন, একসাথে উন্নয়ন</p>
        </div>

        <div class="certificate-title">FOUNDING MEMBER CERTIFICATE</div>

        <div style="text-align: center; margin: 20px 0;">
          <p>This is to certify that</p>
        </div>

        <div class="member-info">
          <div class="info-row">
            <span class="info-label">Member Name:</span>
            <span class="info-value">${member.name || 'N/A'}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Email Address:</span>
            <span class="info-value">${member.email}</span>
          </div>
          <div class="info-row">
            <span class="info-label">National ID:</span>
            <span class="info-value">${member.memberProfile?.nationalId || 'N/A'}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Phone Number:</span>
            <span class="info-value">${member.memberProfile?.phone || 'N/A'}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Address:</span>
            <span class="info-value">${member.memberProfile?.address || 'N/A'}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Member Since:</span>
            <span class="info-value">${memberSince}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Status:</span>
            <span class="info-value">APPROVED FOUNDING MEMBER</span>
          </div>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <p>has been accepted as a <strong>Founding Member</strong> of Build Barguna Co-operative Society and is entitled to all rights and privileges as outlined in our constitution.</p>
        </div>

        <div class="signature-section">
          <div class="signature-box">
            <div class="signature-line">Chairman</div>
          </div>
          <div class="signature-box">
            <div class="signature-line">Secretary</div>
          </div>
        </div>

        <div class="footer">
          <p><strong>Certificate Issue Date:</strong> ${currentDate}</p>
          <p style="font-size: 12px; margin-top: 20px;">
            This certificate is issued by Build Barguna Co-operative Society<br>
            For verification, contact: info@buildbarguna.coop
          </p>
        </div>

        <div class="no-print" style="text-align: center; margin-top: 30px;">
          <button onclick="window.print()" style="background: #000; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Print Certificate</button>
          <button onclick="window.close()" style="background: #666; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-left: 10px;">Close</button>
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
              <Card className="bg-white shadow-2xl">
                <CardHeader className="border-b bg-gray-50">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <span>Member Application Details</span>
                    <button 
                      onClick={() => setSelectedMember(null)}
                      className="text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full p-1 transition-colors"
                      type="button"
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                  </CardTitle>
                </CardHeader>
                <div className="max-h-[70vh] overflow-y-auto">
            <CardContent className="space-y-6">
              {/* Personal Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Full Name</label>
                    <p className="text-gray-900 font-medium">{selectedMember.name || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email Address</label>
                    <p className="text-gray-900">{selectedMember.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">National ID</label>
                    <p className="text-gray-900 font-mono">{selectedMember.memberProfile?.nationalId || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Application Date</label>
                    <p className="text-gray-900">{new Date(selectedMember.createdAt).toLocaleDateString('en-BD', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                  </div>
                </div>
              </div>
              
              {/* Contact Information */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Contact Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <div>
                      <label className="text-sm font-medium text-gray-600">Phone Number</label>
                      <p className="text-gray-900">{selectedMember.memberProfile?.phone || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="text-gray-900">{selectedMember.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                    <div>
                      <label className="text-sm font-medium text-gray-600">Address</label>
                      <p className="text-gray-900">{selectedMember.memberProfile?.address || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Application Status */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Application Status
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Current Status</label>
                    <div className="mt-1">
                      <Badge className={selectedMember.memberProfile?.isApproved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                        {selectedMember.memberProfile?.isApproved ? "✅ Approved" : "⏳ Pending Review"}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Policy Consent</label>
                    <p className={`font-medium ${selectedMember.memberProfile?.policyConsent ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedMember.memberProfile?.policyConsent ? "✅ Agreed to Terms" : "❌ Not Agreed"}
                    </p>
                  </div>
                </div>
                
                {selectedMember.memberProfile?.isApproved && (
                  <div className="mt-4 p-3 bg-green-100 rounded-md">
                    <p className="text-green-800 text-sm">
                      <strong>🎉 This member has been approved!</strong> They can now access all founding member benefits and participate in co-operative activities.
                    </p>
                  </div>
                )}
              </div>

                  <div className="flex gap-3 pt-6 border-t bg-gray-50 m-[-1.5rem] mt-6 p-6">
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
                          className="flex-1 bg-black hover:bg-gray-800"
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