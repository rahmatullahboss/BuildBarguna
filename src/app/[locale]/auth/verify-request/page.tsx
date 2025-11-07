import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function VerifyRequestPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("AuthPage");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Mail className="text-white h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{t("checkYourEmail")}</h1>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-1 pb-4">
            <CardTitle className="text-xl">{t("emailSent")}</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Mail className="h-10 w-10 text-green-600" />
              </div>
              
              <div className="space-y-2">
                <p className="text-gray-600">
                  {t("magicLinkSent")}
                </p>
                <p className="text-sm text-gray-500">
                  {t("clickLinkToSignIn")}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>{t("didntReceiveEmail")}</strong>
              </p>
              <p className="text-xs text-blue-600 mt-2">
                {t("checkSpamFolder")}
              </p>
            </div>

            <Button asChild variant="outline" className="w-full">
              <Link href={`/${locale}/auth/signin`} className="flex items-center justify-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("backToSignIn")}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}