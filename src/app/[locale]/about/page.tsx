// src/app/[locale]/about/page.tsx
"use client";
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

export default function AboutPage() {
  const t = useTranslations("AboutPage");

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">{t("title")}</h1>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 leading-relaxed">
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
                <div className="p-2 bg-black rounded-lg">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <span>ভিশন</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {t("vision")}
              </p>
            </CardContent>
          </Card>

          {/* Mission */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-black rounded-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <span>{t("missionLabel")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed font-mono text-sm">
                {t("mission")}
              </p>
            </CardContent>
          </Card>

          {/* Values */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-black rounded-lg">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <span>মূল্যবোধ</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {t("values")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Governance Structure */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-black rounded-lg">
                <Building className="h-6 w-6 text-white" />
              </div>
              {t("governanceTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Governance Item 1 */}
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    {t("governance1")}
                  </h4>
                  <Badge className="bg-blue-100 text-blue-800">নেতৃত্ব</Badge>
                </div>
              </div>

              {/* Governance Item 2 */}
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    {t("governance2")}
                  </h4>
                  <Badge className="bg-green-100 text-green-800">নীতিমালা</Badge>
                </div>
              </div>

              {/* Governance Item 3 */}
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Shield className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    {t("governance3")}
                  </h4>
                  <Badge className="bg-red-100 text-red-800">নিরাপত্তা</Badge>
                </div>
              </div>

              {/* Governance Item 4 */}
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MessageCircle className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    {t("governance4")}
                  </h4>
                  <Badge className="bg-purple-100 text-purple-800">অংশগ্রহণ</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                আমাদের যাত্রায় যোগ দিন
              </h2>
              <p className="text-gray-600 mb-6">
                স্বচ্ছ ও ন্যায্য সমবায় গড়তে আমাদের সাথে থাকুন। প্রতিষ্ঠাতা সদস্য হয়ে এই নতুন উদ্যোগের অংশ হন।
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/join-member"
                  className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  প্রতিষ্ঠাতা সদস্য হোন
                </a>
                <a 
                  href="/contact"
                  className="border border-black text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  আরও জানুন
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
