// src/app/[locale]/about/page.tsx
"use client";
import { use } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  Eye, 
  Target, 
  Heart, 
  Users, 
  FileText, 
  Shield, 
  MessageCircle 
} from "lucide-react";

export default function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations("AboutPage");

  return (
    <div className="relative min-h-screen bg-background py-12 overflow-hidden">
      {/* Background accents */}
      <div className="pointer-events-none absolute -top-20 left-10 h-48 w-48 rounded-full bg-primary/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-24 right-10 h-56 w-56 rounded-full bg-primary/10 blur-2xl" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-fuchsia-500 dark:to-fuchsia-400">{t("title")}</span>
          </h1>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("introduction")}
            </p>
          </div>
        </div>

        {/* Vision, Mission, Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Vision */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-primary rounded-lg">
                  <Eye className="h-6 w-6 text-primary-foreground" />
                </div>
                <span>{t("visionTitle")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {t("vision")}
              </p>
            </CardContent>
          </Card>

          {/* Mission */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-primary rounded-lg">
                  <Target className="h-6 w-6 text-primary-foreground" />
                </div>
                <span>{t("missionLabel")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed font-mono text-sm">
                {t("mission")}
              </p>
            </CardContent>
          </Card>

          {/* Values */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-primary rounded-lg">
                  <Heart className="h-6 w-6 text-primary-foreground" />
                </div>
                <span>{t("valuesTitle")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {t("values")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Governance Structure */}
        <Card className="max-w-4xl mx-auto bg-card/90 border border-border/60 rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-primary rounded-lg">
                <Building className="h-6 w-6 text-primary-foreground" />
              </div>
              {t("governanceTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Governance Item 1 */}
              <div className="flex items-start gap-3 p-4 bg-secondary rounded-lg">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">
                    {t("governance1")}
                  </h4>
                  <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">{t("governanceBadge1")}</Badge>
                </div>
              </div>

              {/* Governance Item 2 */}
              <div className="flex items-start gap-3 p-4 bg-secondary rounded-lg">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">
                    {t("governance2")}
                  </h4>
                  <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">{t("governanceBadge2")}</Badge>
                </div>
              </div>

              {/* Governance Item 3 */}
              <div className="flex items-start gap-3 p-4 bg-secondary rounded-lg">
                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                  <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">
                    {t("governance3")}
                  </h4>
                  <Badge className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">{t("governanceBadge3")}</Badge>
                </div>
              </div>

              {/* Governance Item 4 */}
              <div className="flex items-start gap-3 p-4 bg-secondary rounded-lg">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <MessageCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">
                    {t("governance4")}
                  </h4>
                  <Badge className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">{t("governanceBadge4")}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {t("ctaTitle")}
              </h2>
              <p className="text-muted-foreground mb-6">
                {t("ctaDescription")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href={`/${locale}/join-member`}
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  {t("ctaBecomeMember")}
                </a>
                <a 
                  href={`/${locale}/contact`}
                  className="border border-primary text-primary px-6 py-3 rounded-lg font-medium hover:bg-secondary transition-colors"
                >
                  {t("ctaLearnMore")}
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
