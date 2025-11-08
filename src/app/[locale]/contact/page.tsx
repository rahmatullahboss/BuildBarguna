import { getTranslations } from "next-intl/server";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactForm } from "@/components/forms/ContactForm";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("ContactPage");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-fuchsia-500 dark:to-fuchsia-400">{t("title")}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                {t("getInTouch")}
              </h2>
              <div className="space-y-6">
                <Card className="shadow-lg hover:shadow-xl transition-shadow border border-border">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary p-3 rounded-full">
                        <MapPin className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{t("address")}</h3>
                        <p className="text-muted-foreground">{t("addressDetails")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg hover:shadow-xl transition-shadow border border-border">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary p-3 rounded-full">
                        <Phone className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{t("phone")}</h3>
                        <p className="text-muted-foreground">{t("phoneNumber")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg hover:shadow-xl transition-shadow border border-border">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary p-3 rounded-full">
                        <Mail className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{t("email")}</h3>
                        <p className="text-muted-foreground">{t("emailAddress")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg hover:shadow-xl transition-shadow border border-border">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary p-3 rounded-full">
                        <Clock className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{t("workingHours")}</h3>
                        <p className="text-muted-foreground">{t("workingHoursDetails")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="shadow-2xl bg-card/90 rounded-2xl border border-border/60">
            <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
              <CardTitle className="text-2xl">{t("sendMessage")}</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <ContactForm />
            </CardContent>
          </Card>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <Card className="shadow-2xl overflow-hidden bg-card/90 rounded-2xl border border-border/60">
            <CardHeader className="bg-primary text-primary-foreground">
              <CardTitle className="text-2xl text-center">{t("findUs")}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full h-96 bg-secondary flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">{t("mapPlaceholder")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}