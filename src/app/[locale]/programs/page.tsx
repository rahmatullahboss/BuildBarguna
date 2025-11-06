// src/app/[locale]/programs/page.tsx
import { useTranslations } from "next-intl";
import { PrismaClient, UserRole } from "@prisma/client";
import { ApplyForTrainingForm } from "@/components/forms/ApplyForTrainingForm";
import { ProposeVentureForm } from "@/components/forms/ProposeVentureForm";
import { GatedContent } from "@/components/GatedContent";

const prisma = new PrismaClient();

async function getCourses() {
  const courses = await prisma.course.findMany({
    orderBy: { startDate: "asc" },
  });
  return courses;
}

export default async function ProgramsPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations("ProgramsPage");
  const courses = await getCourses();

  return (
    <div className="bg-stone-50">
      <div className="container mx-auto py-16 px-4">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-stone-800">{t("title")}</h1>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Left Side: Training Info */}
          <div className="lg:col-span-3 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold text-stone-700">{t("trainingTitle")}</h2>
            <p className="mt-4 text-stone-600">{t("trainingDescription")}</p>
            {/* We can list courses here as well */}
          </div>

          {/* Right Side: Application Form */}
          <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center text-stone-800 mb-6">{t("formTitle")}</h2>
            <ApplyForTrainingForm courses={courses} />
          </div>
        </div>

        {/* JIPs Section can be added below */}
        <div className="mt-16">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-stone-800">{t("jipTitle")}</h2>
                <p className="mt-4 max-w-3xl mx-auto text-stone-600">{t("jipDescription")}</p>
            </div>
            <GatedContent allowedRoles={[UserRole.MEMBER]} locale={locale}>
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                    <h3 className="text-2xl font-bold text-center text-stone-800 mb-6">{t("proposeVentureTitle")}</h3>
                    <ProposeVentureForm />
                </div>
            </GatedContent>
        </div>
      </div>
    </div>
  );
}
