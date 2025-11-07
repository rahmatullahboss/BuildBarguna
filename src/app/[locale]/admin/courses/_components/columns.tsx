// src/app/[locale]/admin/courses/_components/columns.tsx
"use client";

import { Course } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "titleEn",
    header: "Title (English)",
  },
  {
    accessorKey: "titleBn",
    header: "Title (Bengali)",
  },
  {
    accessorKey: "fee",
    header: "Fee (BDT)",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("fee"));
      const formatted = new Intl.NumberFormat("en-US").format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => {
        return new Date(row.getValue("startDate")).toLocaleDateString();
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const course = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(course.id)}
            >
              Copy Course ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                const titleEn = prompt("New English title", course.titleEn);
                if (titleEn === null) return;
                fetch(`/api/admin/courses/${course.id}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ titleEn }),
                }).then(() => window.location.reload());
              }}
            >
              Edit Course
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => {
                if (!confirm("Delete this course?")) return;
                fetch(`/api/admin/courses/${course.id}`, {
                  method: "DELETE",
                }).then(() => window.location.reload());
              }}
            >
              Delete Course
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
