import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JoinMemberForm } from "@/components/forms/JoinMemberForm";
import { CheckCircle, Users, Shield, FileText } from "lucide-react";

export default async function JoinMemberPage() {
  const t = await getTranslations("MembersPage");

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-fuchsia-500 dark:to-fuchsia-400">{t('joinTitle')}</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('joinDescription')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Benefits Section */}
            <div className="lg:col-span-1">
              <Card className="h-fit bg-card/90 border border-border/60 rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {t('foundingBenefitsTitle')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-foreground">{t('benefit1Title')}</h4>
                      <p className="text-sm text-muted-foreground">{t('benefit1Desc')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-foreground">{t('benefit2Title')}</h4>
                      <p className="text-sm text-muted-foreground">{t('benefit2Desc')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-foreground">{t('benefit3Title')}</h4>
                      <p className="text-sm text-muted-foreground">{t('benefit3Desc')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-foreground">{t('benefit4Title')}</h4>
                      <p className="text-sm text-muted-foreground">{t('benefit4Desc')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card className="mt-6 bg-card/90 border border-border/60 rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    {t('requirementsTitle')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{t('req1')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{t('req2')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{t('req3')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{t('req4')}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Application Form */}
            <div className="lg:col-span-2">
              <Card className="bg-card/90 border border-border/60 rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle>{t('applicationTitle')}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {t('applicationDesc')}
                  </p>
                </CardHeader>
                <CardContent>
                  <JoinMemberForm />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Process Timeline */}
          <Card className="mt-12 bg-card/90 border border-border/60 rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle className="text-center">{t('processTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold mb-2">1</div>
                  <h4 className="font-medium text-foreground">{t('step1Title')}</h4>
                  <p className="text-sm text-muted-foreground">{t('step1Desc')}</p>
                </div>
                
                <div className="hidden md:block w-16 h-0.5 bg-border"></div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold mb-2">2</div>
                  <h4 className="font-medium text-foreground">{t('step2Title')}</h4>
                  <p className="text-sm text-muted-foreground">{t('step2Desc')}</p>
                </div>
                
                <div className="hidden md:block w-16 h-0.5 bg-border"></div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold mb-2">3</div>
                  <h4 className="font-medium text-foreground">{t('step3Title')}</h4>
                  <p className="text-sm text-muted-foreground">{t('step3Desc')}</p>
                </div>
                
                <div className="hidden md:block w-16 h-0.5 bg-border"></div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold mb-2">4</div>
                  <h4 className="font-medium text-foreground">{t('step4Title')}</h4>
                  <p className="text-sm text-muted-foreground">{t('step4Desc')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}