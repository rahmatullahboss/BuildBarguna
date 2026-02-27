"use client";

import { useState, useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, AlertCircle, CheckCircle } from "lucide-react";
import { createProjectAction, deleteProjectAction, updateProjectAction, type ProjectFormState } from "@/lib/actions/project.actions";

interface Project {
  id: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  totalCapital: number;
  totalShares: number;
  pricePerShare: number;
  availableShares: number;
  status: string;
  imageUrl: string | null;
  createdAt: Date;
  _count: { shareOrders: number };
}

const statusColors: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  CLOSED: "bg-red-100 text-red-700",
  PAUSED: "bg-yellow-100 text-yellow-700",
};

const initialState: ProjectFormState = { success: false, message: "" };

function ProjectForm({
  project,
  onSuccess,
}: {
  project?: Project;
  onSuccess: () => void;
}) {
  const isEdit = !!project;

  const action = isEdit
    ? updateProjectAction.bind(null, project.id, initialState)
    : createProjectAction;

  const [state, formAction, isPending] = useActionState(
    async (prev: ProjectFormState, fd: FormData) => {
      const result = isEdit
        ? await updateProjectAction(project!.id, prev, fd)
        : await createProjectAction(prev, fd);
      if (result.success) onSuccess();
      return result;
    },
    initialState
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Title (English)</Label>
          <Input name="titleEn" defaultValue={project?.titleEn} required />
          {state.errors?.titleEn && <p className="text-xs text-red-500">{state.errors.titleEn[0]}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>শিরোনাম (বাংলা)</Label>
          <Input name="titleBn" defaultValue={project?.titleBn} required />
          {state.errors?.titleBn && <p className="text-xs text-red-500">{state.errors.titleBn[0]}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Description (English)</Label>
          <Textarea name="descriptionEn" defaultValue={project?.descriptionEn} rows={3} required />
        </div>
        <div className="space-y-1.5">
          <Label>বিবরণ (বাংলা)</Label>
          <Textarea name="descriptionBn" defaultValue={project?.descriptionBn} rows={3} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Total Capital (৳)</Label>
          <Input name="totalCapital" type="number" min={1} defaultValue={project?.totalCapital} required />
        </div>
        <div className="space-y-1.5">
          <Label>Total Shares</Label>
          <Input name="totalShares" type="number" min={1} defaultValue={project?.totalShares} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Image URL (optional)</Label>
          <Input name="imageUrl" type="url" defaultValue={project?.imageUrl ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select name="status" defaultValue={project?.status ?? "ACTIVE"}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="PAUSED">Paused</SelectItem>
              <SelectItem value="CLOSED">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {state.message && (
        <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${state.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
          {state.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {state.message}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Saving..." : isEdit ? "Update Project" : "Create Project"}
      </Button>
    </form>
  );
}

export function ProjectsAdminTable({ projects: initial }: { projects: Project[] }) {
  const [projects, setProjects] = useState(initial);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | undefined>();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const openCreate = () => { setEditProject(undefined); setDialogOpen(true); };
  const openEdit = (p: Project) => { setEditProject(p); setDialogOpen(true); };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this project?")) return;
    startTransition(async () => {
      await deleteProjectAction(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    });
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" /> New Project
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Capital</TableHead>
              <TableHead>Shares</TableHead>
              <TableHead>Price/Share</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 && (
              <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No projects yet.</TableCell></TableRow>
            )}
            {projects.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.titleEn}</TableCell>
                <TableCell>৳{p.totalCapital.toLocaleString()}</TableCell>
                <TableCell>{p.totalShares}</TableCell>
                <TableCell>৳{p.pricePerShare.toLocaleString()}</TableCell>
                <TableCell>{p.availableShares}</TableCell>
                <TableCell>{p._count.shareOrders}</TableCell>
                <TableCell>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[p.status]}`}>
                    {p.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" aria-label="Edit project" onClick={() => openEdit(p)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" aria-label="Delete project" className="text-red-500" onClick={() => handleDelete(p.id)} disabled={isPending}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editProject ? "Edit Project" : "Create New Project"}</DialogTitle>
          </DialogHeader>
          <ProjectForm project={editProject} onSuccess={() => { setDialogOpen(false); router.refresh(); }} />
        </DialogContent>
      </Dialog>
    </>
  );
}
