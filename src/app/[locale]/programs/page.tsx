// src/app/[locale]/programs/page.tsx
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  PiggyBank, 
  Building, 
  Truck, 
  Shield, 
  Calculator,
  Clock,
  FileText,
  MapPin
} from "lucide-react";

const programs = [
  {
    id: 1,
    icon: GraduationCap,
    status: "planning",
    statusIcon: Clock
  },
  {
    id: 2,
    icon: PiggyBank,
    status: "draft",
    statusIcon: FileText
  },
  {
    id: 3,
    icon: Building,
    status: "blueprint",
    statusIcon: FileText
  },
  {
    id: 4,
    icon: Truck,
    status: "mapping",
    statusIcon: MapPin
  },
  {
    id: 5,
    icon: Shield,
    status: "framework",
    statusIcon: FileText
  },
  {
    id: 6,
    icon: Calculator,
    status: "preparation",
    statusIcon: Clock
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "planning":
      return <Badge className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">পরিকল্পনাধীন</Badge>;
    case "draft":
      return <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">ড্রাফট নীতি</Badge>;
    case "blueprint":
      return <Badge className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">ব্লুপ্রিন্ট</Badge>;
    case "mapping":
      return <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">ম্যাপিং-চলমান</Badge>;
    case "framework":
      return <Badge className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200">ফ্রেমওয়ার্ক-ড্রাফট</Badge>;
    case "preparation":
      return <Badge className="bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200">পাইলট-প্রস্তুতি</Badge>;
    default:
      return <Badge className="bg-secondary text-secondary-foreground">{status}</Badge>;
  }
};

export default async function ProgramsPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations("ProgramsPage");

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">{t("title")}</h1>
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-muted-foreground mb-6">{t("statusKey")}</p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">পরিকল্পনাধীন</Badge>
              <span className="text-muted-foreground">→</span>
              <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">পাইলট</Badge>
              <span className="text-muted-foreground">→</span>
              <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">স্কেলে</Badge>
            </div>
          </div>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program) => {
            const Icon = program.icon;
            const StatusIcon = program.statusIcon;
            
            return (
              <Card key={program.id} className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary rounded-lg">
                        <Icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusIcon className="h-4 w-4 text-muted-foreground" />
                        {getStatusBadge(program.status)}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {t(`program${program.id}Title`)}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t(`program${program.id}Desc`)}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                আগ্রহী হলে যোগাযোগ করুন
              </h2>
              <p className="text-muted-foreground mb-6">
                আমাদের প্রোগ্রামগুলো সম্পর্কে আরও জানতে বা পাইলট প্রোগ্রামে অংশগ্রহণের জন্য আগ্রহ প্রকাশ করুন।
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href={`/${locale}/join-member`}
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  সদস্য হোন
                </a>
                <a 
                  href={`/${locale}/contact`}
                  className="border border-primary text-primary px-6 py-3 rounded-lg font-medium hover:bg-secondary transition-colors"
                >
                  যোগাযোগ করুন
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
