import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAllShareOrders } from "@/lib/actions/project.actions";
import { ShareOrdersTable } from "./_components/ShareOrdersTable";

export default async function AdminShareOrdersPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/en/auth/signin");

  const orders = await getAllShareOrders();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Share Orders</h1>
        <p className="text-muted-foreground">Approve or reject member share purchase requests</p>
      </div>
      <ShareOrdersTable orders={orders} />
    </div>
  );
}
