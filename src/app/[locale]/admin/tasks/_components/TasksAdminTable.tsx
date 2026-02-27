"use client";

import { useState, useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createTaskAction, deleteTaskAction, updateTaskAction, type TaskFormState } from "@/lib/actions/task.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, AlertCircle, CheckCircle, ExternalLink } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Task {
  id: string;
  titleEn: string;
  titleBn: string;
  platform: string;
  url: string;
  pointReward: number;
  isActive: boolean;
  _count: { completions: number };
}

const initialState: TaskFormState = { success: false, message: "" };

function TaskForm({ task, onSuccess }: { task?: Task; onSuccess: () => void }) {
  const isEdit = !!task;

  const [state, formAction, isPending] = useActionState(
    async (prev: TaskFormState, fd: FormData) => {
      const result = isEdit
        ? await updateTaskAction(task!.id, prev, fd)
        : await createTaskAction(prev, fd);
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
          <Input name="titleEn" defaultValue={task?.titleEn} required />
          {state.errors?.titleEn && <p className="text-xs text-red-500">{state.errors.titleEn[0]}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>শিরোনাম (বাংলা)</Label>
          <Input name="titleBn" defaultValue={task?.titleBn} required />
          {state.errors?.titleBn && <p className="text-xs text-red-500">{state.errors.titleBn[0]}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Platform</Label>
          <Input name="platform" defaultValue={task?.platform} placeholder="e.g. Facebook, YouTube" required />
        </div>
        <div className="space-y-1.5">
          <Label>Points Reward</Label>
          <Input name="pointReward" type="number" min={1} defaultValue={task?.pointReward ?? 10} required />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>URL</Label>
        <Input name="url" type="url" defaultValue={task?.url} placeholder="https://..." required />
        {state.errors?.url && <p className="text-xs text-red-500">{state.errors.url[0]}</p>}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isActive"
          value="true"
          id="isActive"
          defaultChecked={task?.isActive ?? true}
          className="rounded"
        />
        <Label htmlFor="isActive">Active</Label>
        <input type="hidden" name="isActive" value="false" />
      </div>

      {state.message && (
        <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${state.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
          {state.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {state.message}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Saving..." : isEdit ? "Update Task" : "Create Task"}
      </Button>
    </form>
  );
}

export function TasksAdminTable({ tasks: initial }: { tasks: Task[] }) {
  const [tasks, setTasks] = useState(initial);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | undefined>();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const openCreate = () => { setEditTask(undefined); setDialogOpen(true); };
  const openEdit = (t: Task) => { setEditTask(t); setDialogOpen(true); };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this task?")) return;
    startTransition(async () => {
      const result = await deleteTaskAction(id);
      if (result.success) {
        setTasks((prev) => prev.filter((t) => t.id !== id));
        toast({ title: "Task deleted." });
      } else {
        toast({ title: result.message, variant: "destructive" });
      }
    });
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" /> New Task
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Completions</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">No tasks yet.</TableCell>
              </TableRow>
            )}
            {tasks.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.titleEn}</TableCell>
                <TableCell>{t.platform}</TableCell>
                <TableCell>
                  <a href={t.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline text-sm">
                    <ExternalLink className="h-3 w-3" /> Link
                  </a>
                </TableCell>
                <TableCell>+{t.pointReward} pts</TableCell>
                <TableCell>{t._count.completions}</TableCell>
                <TableCell>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${t.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                    {t.isActive ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" aria-label="Edit task" onClick={() => openEdit(t)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" aria-label="Delete task" className="text-red-500" onClick={() => handleDelete(t.id)} disabled={isPending}>
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editTask ? "Edit Task" : "Create New Task"}</DialogTitle>
          </DialogHeader>
          <TaskForm task={editTask} onSuccess={() => { setDialogOpen(false); router.refresh(); }} />
        </DialogContent>
      </Dialog>
    </>
  );
}
