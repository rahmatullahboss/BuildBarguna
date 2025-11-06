import { getTranslations } from "next-intl/server";

export default async function GovernancePage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations("GovernancePage");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          {t("title")}
        </h1>
        
        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {t("boardOfDirectors")}
            </h2>
            <p className="text-gray-600 mb-4">
              {t("boardDescription")}
            </p>
            {/* Board members can be added here */}
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {t("policies")}
            </h2>
            <p className="text-gray-600 mb-4">
              {t("policiesDescription")}
            </p>
            {/* Policy documents can be listed here */}
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {t("transparency")}
            </h2>
            <p className="text-gray-600 mb-4">
              {t("transparencyDescription")}
            </p>
            {/* Financial reports and transparency documents */}
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {t("meetings")}
            </h2>
            <p className="text-gray-600 mb-4">
              {t("meetingsDescription")}
            </p>
            {/* Meeting schedules and minutes */}
          </section>
        </div>
      </div>
    </div>
  );
}