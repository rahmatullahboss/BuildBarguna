// src/app/[locale]/brands/page.tsx
import { useTranslations } from "next-intl";
import Link from "next/link";
// Mock data - this will be replaced with data fetched from Prisma
const mockBrands = [
  { slug: "barguna-foods", name: "Barguna Foods" },
  { slug: "delta-crafts", name: "Delta Crafts" },
  { slug: "seashore-services", name: "Seashore Services" },
  { slug: "barguna-digital-hub", name: "Barguna Digital Hub" },
];

export default function BrandsPage() {
  const t = useTranslations("BrandsPage");

  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-center">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-fuchsia-500 dark:to-fuchsia-400">{t("title")}</span>
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-center text-muted-foreground">{t("subtitle")}</p>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {mockBrands.map((brand) => (
          <Link href={`/brands/${brand.slug}`} key={brand.slug}>
            <div className="block bg-card/90 p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-border/60">
              <h3 className="text-xl font-semibold text-foreground">{brand.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
