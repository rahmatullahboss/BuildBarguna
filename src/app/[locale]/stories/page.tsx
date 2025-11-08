import { getTranslations } from "next-intl/server";

export default async function StoriesPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations("StoriesPage");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-foreground">
          {t("title")}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Success Story 1 */}
          <div className="bg-card rounded-lg shadow-md overflow-hidden border border-border">
            <div className="h-48 bg-secondary flex items-center justify-center">
              <span className="text-muted-foreground">{t("imagePlaceholder")}</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                {t("story1Title")}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t("story1Description")}
              </p>
              <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                {t("readMore")}
              </button>
            </div>
          </div>

          {/* Success Story 2 */}
          <div className="bg-card rounded-lg shadow-md overflow-hidden border border-border">
            <div className="h-48 bg-secondary flex items-center justify-center">
              <span className="text-muted-foreground">{t("imagePlaceholder")}</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                {t("story2Title")}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t("story2Description")}
              </p>
              <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                {t("readMore")}
              </button>
            </div>
          </div>

          {/* Success Story 3 */}
          <div className="bg-card rounded-lg shadow-md overflow-hidden border border-border">
            <div className="h-48 bg-secondary flex items-center justify-center">
              <span className="text-muted-foreground">{t("imagePlaceholder")}</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                {t("story3Title")}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t("story3Description")}
              </p>
              <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                {t("readMore")}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            {t("shareYourStory")}
          </h2>
          <p className="text-muted-foreground mb-6">
            {t("shareDescription")}
          </p>
          <button className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
            {t("submitStory")}
          </button>
        </div>
      </div>
    </div>
  );
}