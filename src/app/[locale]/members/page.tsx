// src/app/[locale]/members/page.tsx
import { useTranslations } from "next-intl";
import { JoinMemberForm } from "@/components/forms/JoinMemberForm";

export default function MembersPage() {
  const t = useTranslations("MembersPage");

  return (
    <div className="bg-stone-50">
      <div className="container mx-auto py-16 px-4">
        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* Left Column: Information */}
          <div className="text-stone-700 space-y-6">
            <h1 className="text-4xl font-bold text-stone-800">{t("title")}</h1>
            <p className="text-lg">{t("intro")}</p>
            <div>
              <h2 className="text-2xl font-semibold text-stone-800">{t("benefitsTitle")}</h2>
              <ul className="mt-4 list-disc list-inside space-y-2">
                <li>{t("benefit1")}</li>
                <li>{t("benefit2")}</li>
                <li>{t("benefit3")}</li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-stone-800">{t("howItWorksTitle")}</h2>
              <p className="mt-2">{t("howItWorksDesc")}</p>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-center text-stone-800 mb-6">{t("formTitle")}</h2>
            <JoinMemberForm />
          </div>

        </div>
      </div>
    </div>
  );
}
