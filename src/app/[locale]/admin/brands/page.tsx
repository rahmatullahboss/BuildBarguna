import { PrismaClient } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const prisma = new PrismaClient();

async function getBrands() {
  return prisma.brand.findMany({ orderBy: { createdAt: "desc" } });
}

export default async function AdminBrandsPage() {
  const brands = await getBrands();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Brands</CardTitle>
          <form action="/api/admin/brands" method="post" className="flex gap-2">
            <input name="slug" placeholder="slug" className="border px-2 py-1 rounded" required />
            <input name="nameEn" placeholder="Name (EN)" className="border px-2 py-1 rounded" required />
            <input name="nameBn" placeholder="Name (BN)" className="border px-2 py-1 rounded" required />
            <input name="descriptionEn" placeholder="Description (EN)" className="border px-2 py-1 rounded w-48" required />
            <input name="descriptionBn" placeholder="Description (BN)" className="border px-2 py-1 rounded w-48" required />
            <input name="logoUrl" placeholder="Logo URL (optional)" className="border px-2 py-1 rounded w-48" />
            <Button type="submit" className="bg-black hover:bg-gray-800">Create</Button>
          </form>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Slug</TableHead>
                  <TableHead>Name (EN)</TableHead>
                  <TableHead>Name (BN)</TableHead>
                  <TableHead>Description (EN)</TableHead>
                  <TableHead>Description (BN)</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {brands.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>{b.slug}</TableCell>
                    <TableCell>{b.nameEn}</TableCell>
                    <TableCell>{b.nameBn}</TableCell>
                    <TableCell className="max-w-[280px] truncate">{b.descriptionEn}</TableCell>
                    <TableCell className="max-w-[280px] truncate">{b.descriptionBn}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={async () => {
                            'use server'
                          }}
                        >Edit</Button>
                        <form action={`/api/admin/brands/${b.id}`} method="post">
                          <input type="hidden" name="_method" value="DELETE" />
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {brands.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-gray-500">No brands yet</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
