// src/app/[locale]/admin/courses/page.tsx
import { PrismaClient } from "@prisma/client";
import { CoursesDataTable } from "./_components/courses-data-table";
import { columns } from "./_components/columns";

const prisma = new PrismaClient();

async function getCourses() {
  const courses = await prisma.course.findMany();
  return courses;
}

export default async function AdminCoursesPage() {
  const courses = await getCourses();

  return (
    <div>
      <h1 className="text-3xl font-bold text-stone-800 mb-6">Manage Courses</h1>
      <CoursesDataTable columns={columns} data={courses} />
    </div>
  );
}
