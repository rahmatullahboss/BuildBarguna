// src/app/[locale]/partners/page.tsx
import { useTranslations } from "next-intl";
import { PartnerInquiryForm } from "@/components/forms/PartnerInquiryForm";

export default function PartnersPage() {
  const t = useTranslations("PartnersPage");

  return (
    <div className="bg-background">
      <div className="container mx-auto py-16 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-fuchsia-500 dark:to-fuchsia-400">{t("title")}</span>
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="mt-12 max-w-2xl mx-auto bg-card/90 p-8 rounded-2xl shadow-xl border border-border/60">
          <h2 className="text-3xl font-bold text-center text-foreground mb-6">{t("formTitle")}</h2>
          <PartnerInquiryForm />
        </div>
      </div>
    </div>
  );
}
