"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function CourseDialog({ onCreated }: { onCreated?: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to create course");
      onCreated?.();
      setOpen(false);
    } catch (e) {
      alert("Failed to create course");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>Create Course</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Course</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <Label>Title (English)</Label>
            <Input name="titleEn" required />
          </div>
          <div>
            <Label>Title (Bengali)</Label>
            <Input name="titleBn" required />
          </div>
          <div>
            <Label>Description (English)</Label>
            <Input name="descriptionEn" />
          </div>
          <div>
            <Label>Description (Bengali)</Label>
            <Input name="descriptionBn" />
          </div>
          <div>
            <Label>Fee (BDT)</Label>
            <Input name="fee" type="number" min="0" step="0.01" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Date</Label>
              <Input name="startDate" type="date" required />
            </div>
            <div>
              <Label>End Date</Label>
              <Input name="endDate" type="date" required />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="bg-black hover:bg-gray-800">
              {loading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
