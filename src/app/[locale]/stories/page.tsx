import { getTranslations } from "next-intl/server";

export default async function StoriesPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations("StoriesPage");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          {t("title")}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Success Story 1 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">{t("imagePlaceholder")}</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">
                {t("story1Title")}
              </h3>
              <p className="text-gray-600 mb-4">
                {t("story1Description")}
              </p>
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                {t("readMore")}
              </button>
            </div>
          </div>

          {/* Success Story 2 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">{t("imagePlaceholder")}</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">
                {t("story2Title")}
              </h3>
              <p className="text-gray-600 mb-4">
                {t("story2Description")}
              </p>
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                {t("readMore")}
              </button>
            </div>
          </div>

          {/* Success Story 3 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">{t("imagePlaceholder")}</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">
                {t("story3Title")}
              </h3>
              <p className="text-gray-600 mb-4">
                {t("story3Description")}
              </p>
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                {t("readMore")}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">
            {t("shareYourStory")}
          </h2>
          <p className="text-gray-600 mb-6">
            {t("shareDescription")}
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            {t("submitStory")}
          </button>
        </div>
      </div>
    </div>
  );
}