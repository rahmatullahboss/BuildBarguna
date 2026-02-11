import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const kpis = await prisma.kPI.findMany({ orderBy: { updatedAt: "desc" } });

  async function revalidate(formData: FormData) {
    'use server'
    const path = String(formData.get('path') || '/');
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/admin/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path }),
    });
  }

  return (
    <div className="space-y-6">
      {/* Revalidate */}
      <Card>
        <CardHeader>
          <CardTitle>Revalidate Path</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={revalidate} className="flex items-end gap-3">
            <div className="flex-1">
              <Label>Path</Label>
              <Input name="path" placeholder="/en" defaultValue="/" />
            </div>
            <Button type="submit" className="bg-black hover:bg-gray-800">Revalidate</Button>
          </form>
        </CardContent>
      </Card>

      {/* KPIs */}
      <Card>
        <CardHeader>
          <CardTitle>KPIs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {kpis.length === 0 && <p className="text-sm text-gray-500">No KPIs yet</p>}
            {kpis.map((kpi) => (
              <form
                key={kpi.id}
                action={`/api/admin/kpis/${encodeURIComponent(kpi.metric)}`}
                method="post"
                className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end border p-3 rounded"
              >
                <div>
                  <Label>Metric</Label>
                  <Input defaultValue={kpi.metric} disabled />
                </div>
                <div>
                  <Label>Value</Label>
                  <Input name="value" type="number" step="0.01" defaultValue={kpi.value} />
                </div>
                <div>
                  <Label>Label (EN)</Label>
                  <Input name="labelEn" defaultValue={kpi.labelEn} />
                </div>
                <div>
                  <Label>Label (BN)</Label>
                  <Input name="labelBn" defaultValue={kpi.labelBn} />
                </div>
                <div className="md:col-span-4 text-right">
                  <Button type="submit" className="bg-black hover:bg-gray-800">Save</Button>
                </div>
              </form>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Environment */}
      <Card>
        <CardHeader>
          <CardTitle>Environment Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">NODE_ENV</p>
              <p className="font-medium">{process.env.NODE_ENV}</p>
            </div>
            <div>
              <p className="text-gray-500">DATABASE_URL</p>
              <p className="font-medium">{process.env.DATABASE_URL ? '********' : 'not set'}</p>
            </div>
            <div>
              <p className="text-gray-500">NEXTAUTH_URL</p>
              <p className="font-medium">{process.env.NEXTAUTH_URL || 'not set'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
