import { PrismaClient } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const prisma = new PrismaClient();

async function getStories() {
  return prisma.story.findMany({ orderBy: { createdAt: "desc" } });
}

export default async function AdminStoriesPage() {
  const stories = await getStories();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Stories</CardTitle>
          <form action="/api/admin/stories" method="post" className="flex gap-2">
            <input name="slug" placeholder="slug" className="border px-2 py-1 rounded" required />
            <input name="titleEn" placeholder="Title (EN)" className="border px-2 py-1 rounded" required />
            <input name="titleBn" placeholder="Title (BN)" className="border px-2 py-1 rounded" required />
            <input name="bodyEn" placeholder="Body (EN)" className="border px-2 py-1 rounded w-64" required />
            <input name="bodyBn" placeholder="Body (BN)" className="border px-2 py-1 rounded w-64" required />
            <Button type="submit" className="bg-black hover:bg-gray-800">Create</Button>
          </form>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Slug</TableHead>
                  <TableHead>Title (EN)</TableHead>
                  <TableHead>Title (BN)</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stories.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.slug}</TableCell>
                    <TableCell>{s.titleEn}</TableCell>
                    <TableCell>{s.titleBn}</TableCell>
                    <TableCell>{s.publishedAt ? new Date(s.publishedAt).toLocaleDateString() : '—'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={async () => {
                            'use server'
                          }}
                        >Edit</Button>
                        <form action={`/api/admin/stories/${s.id}`} method="post">
                          <input type="hidden" name="_method" value="DELETE" />
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {stories.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-gray-500">No stories yet</TableCell>
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
