"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Get all member applications
export async function getMemberApplications() {
  try {
    const applications = await prisma.user.findMany({
      where: {
        role: "MEMBER",
        memberProfile: {
          isNot: null
        }
      },
      include: {
        memberProfile: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    
    return applications;
  } catch (error) {
    console.error("Error fetching member applications:", error);
    return [];
  }
}

// Approve member application
export async function approveMemberApplication(userId: string) {
  try {
    await prisma.memberProfile.update({
      where: { userId },
      data: { isApproved: true }
    });
    
    revalidatePath("/admin");
    return { success: true, message: "Member approved successfully!" };
  } catch (error) {
    console.error("Error approving member:", error);
    return { success: false, message: "Failed to approve member." };
  }
}

// Reject member application
export async function rejectMemberApplication(userId: string) {
  try {
    // You can either delete or mark as rejected
    // For now, let's delete the application
    await prisma.user.delete({
      where: { id: userId }
    });
    
    revalidatePath("/admin");
    return { success: true, message: "Member application rejected and removed." };
  } catch (error) {
    console.error("Error rejecting member:", error);
    return { success: false, message: "Failed to reject member application." };
  }
}

// Remove an approved member (admin action)
export async function removeApprovedMember(userId: string): Promise<void> {
  try {
    // Delete dependent records first to satisfy FK constraints
    await prisma.memberProfile.deleteMany({ where: { userId } });

    // Delete the user
    await prisma.user.delete({ where: { id: userId } });

    // Try to return user back to the same page (works in form actions)
    try {
      const { headers } = await import("next/headers");
      const { redirect } = await import("next/navigation");
      const referer = headers().get("referer");
      if (referer) {
        redirect(referer);
      }
    } catch (e) {
      // Fall back to cache revalidation if redirect is not available
      revalidatePath("/admin/members");
      revalidatePath("/en/admin/members");
      revalidatePath("/bn/admin/members");
    }

    return;
  } catch (error) {
    console.error("Error removing approved member:", error);
  }
}

export async function removeApprovedMemberAction(formData: FormData): Promise<void> {
  const userId = String(formData.get("userId") || "");
  if (!userId) return;
  await removeApprovedMember(userId);
}

// Get dashboard statistics
export async function getDashboardStats() {
  try {
    const [
      totalMembers,
      pendingApplications,
      approvedMembers,
      totalCourses,
      totalVentures
    ] = await Promise.all([
      prisma.user.count({ where: { role: "MEMBER" } }),
      prisma.memberProfile.count({ where: { isApproved: false } }),
      prisma.memberProfile.count({ where: { isApproved: true } }),
      prisma.course.count(),
      prisma.venture.count()
    ]);

    return {
      totalMembers,
      pendingApplications,
      approvedMembers,
      totalCourses,
      totalVentures
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalMembers: 0,
      pendingApplications: 0,
      approvedMembers: 0,
      totalCourses: 0,
      totalVentures: 0
    };
  }
}

// Get all course applications
export async function getCourseApplications() {
  try {
    const applications = await prisma.courseApplication.findMany({
      include: {
        user: true,
        course: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    
    return applications;
  } catch (error) {
    console.error("Error fetching course applications:", error);
    return [];
  }
}

// Get all venture proposals
export async function getVentureProposals() {
  try {
    const ventures = await prisma.venture.findMany({
      include: {
        proposer: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    
    return ventures;
  } catch (error) {
    console.error("Error fetching venture proposals:", error);
    return [];
  }
}

// Update venture status
export async function updateVentureStatus(ventureId: string, status: string) {
  try {
    await prisma.venture.update({
      where: { id: ventureId },
      data: { status }
    });
    
    revalidatePath("/admin");
    return { success: true, message: "Venture status updated successfully!" };
  } catch (error) {
    console.error("Error updating venture status:", error);
    return { success: false, message: "Failed to update venture status." };
  }
}