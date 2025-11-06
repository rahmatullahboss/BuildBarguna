// src/app/[locale]/about/page.tsx
import { useTranslations } from "next-intl";

export default function AboutPage() {
  const t = useTranslations("AboutPage");

  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-stone-800 text-center">{t("title")}</h1>
      <div className="mt-8 max-w-3xl mx-auto text-lg text-stone-700 space-y-6">
        <p>{t("paragraph1")}</p>
        <p>{t("paragraph2")}</p>
      </div>
    </div>
  );
}
