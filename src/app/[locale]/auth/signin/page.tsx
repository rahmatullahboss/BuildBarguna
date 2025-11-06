import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInForm } from "@/components/auth/SignInForm";

export default async function SignInPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations("AuthPage");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">BB</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{t("welcomeBack")}</h1>
          <p className="text-gray-600 mt-2">{t("signInSubtitle")}</p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center">{t("signIn")}</CardTitle>
          </CardHeader>
          <CardContent>
            <SignInForm />
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-600 mt-6">
          {t("noAccount")}{" "}
          <a href="/contact" className="text-blue-600 hover:text-blue-800 font-medium">
            {t("contactUs")}
          </a>
        </p>
      </div>
    </div>
  );
}