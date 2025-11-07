import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Download, 
  Calendar, 
  Shield, 
  Users, 
  DollarSign,
  Building,
  MessageSquare,
  Eye,
  AlertTriangle,
  Clock
} from "lucide-react";

export default async function NitimalaPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations("NitimalaPage");

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white shadow-xl">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,white,transparent_25%),radial-gradient(circle_at_80%_0%,white,transparent_30%)]" />
            <div className="relative px-6 py-10 sm:px-10">
              <div className="flex flex-col items-center text-center gap-4">
                <Badge className="bg-white/10 text-white border border-white/20">{t("version")}</Badge>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">{t("title")}</h1>
                <p className="max-w-3xl text-white/80 text-sm sm:text-base leading-relaxed">{t("intro")}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm">
                  <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20">{t("effectiveDate")}</span>
                  <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20">{t("approver")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table of Contents */}
        <Card className="mb-10">
          <CardHeader>
            <CardTitle>{t("toc.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
              <a href="#purpose" className="hover:underline text-gray-700">{t("purpose.cardTitle")}</a>
              <a href="#governance" className="hover:underline text-gray-700">{t("governance.cardTitle")}</a>
              <a href="#membership" className="hover:underline text-gray-700">{t("membership.cardTitle")}</a>
              <a href="#finance" className="hover:underline text-gray-700">{t("finance.cardTitle")}</a>
              <a href="#ccp" className="hover:underline text-gray-700">{t("ccp.cardTitle")}</a>
              <a href="#procurement" className="hover:underline text-gray-700">{t("procurement.cardTitle")}</a>
              <a href="#brand" className="hover:underline text-gray-700">{t("brand.cardTitle")}</a>
              <a href="#privacy" className="hover:underline text-gray-700">{t("privacy.cardTitle")}</a>
              <a href="#safeguarding" className="hover:underline text-gray-700">{t("safeguarding.cardTitle")}</a>
              <a href="#grievance" className="hover:underline text-gray-700">{t("grievance.cardTitle")}</a>
              <a href="#others" className="hover:underline text-gray-700">{t("others.cardTitle")}</a>
              <a href="#annexes" className="hover:underline text-gray-700">{t("annexes.cardTitle")}</a>
            </div>
          </CardContent>
        </Card>

        {/* Legal Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
              {t("legalCardTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-900 leading-relaxed">{t("legalRef")}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-900 leading-relaxed">{t("disclaimer")}</p>
            </div>
            <div className="text-center">
              <button className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 mx-auto">
                <Download className="h-5 w-5" />
                {t("downloadPdf")}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Purpose, Scope & Definitions */}
        <Card id="purpose" className="mb-8 scroll-mt-24">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-black rounded-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              {t("purpose.cardTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("purpose.purposeTitle")}</h4>
              <p className="text-gray-700">{t("purpose.purposeText")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("purpose.scopeTitle")}</h4>
              <p className="text-gray-700">{t("purpose.scopeText")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("purpose.definitionsTitle")}</h4>
              <ul className="space-y-2 text-gray-700">
                <li>{t.rich("purpose.definition1", { strong: (chunks) => <strong>{chunks}</strong> })}</li>
                <li>{t.rich("purpose.definition2", { strong: (chunks) => <strong>{chunks}</strong> })}</li>
                <li>{t.rich("purpose.definition3", { strong: (chunks) => <strong>{chunks}</strong> })}</li>
                <li>{t.rich("purpose.definition4", { strong: (chunks) => <strong>{chunks}</strong> })}</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Governance */}
        <Card id="governance" className="mb-8 scroll-mt-24">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-black rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              {t("governance.cardTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("governance.structureTitle")}</h4>
              <ul className="space-y-1 text-gray-700 ml-4">
                <li>• {t("governance.structure1")}</li>
                <li>• {t("governance.structure2")}</li>
                <li>• {t("governance.structure3")}</li>
                <li>• {t("governance.structure4")}</li>
                <li>• {t("governance.structure5")}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("governance.meetingsTitle")}</h4>
              <ul className="space-y-1 text-gray-700 ml-4">
                <li>• {t("governance.meetings1")}</li>
                <li>• {t("governance.meetings2")}</li>
                <li>• {t("governance.meetings3")}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("governance.electionTitle")}</h4>
              <ul className="space-y-1 text-gray-700 ml-4">
                <li>• {t("governance.election1")}</li>
                <li>• {t("governance.election2")}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("governance.coiTitle")}</h4>
              <ul className="space-y-1 text-gray-700 ml-4">
                <li>• {t("governance.coi1")}</li>
                <li>• {t("governance.coi2")}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("governance.amendTitle")}</h4>
              <p className="text-gray-700">{t("governance.amendText")}</p>
            </div>
          </CardContent>
        </Card>

        {/* Membership Policy */}
        <Card id="membership" className="mb-8 scroll-mt-24">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-black rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              {t("membership.cardTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("membership.classTitle")}</h4>
              <p className="text-gray-700">{t("membership.classText")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("membership.eligibilityTitle")}</h4>
              <p className="text-gray-700">{t("membership.eligibilityText")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("membership.processTitle")}</h4>
              <p className="text-gray-700">{t("membership.processText")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("membership.feesTitle")}</h4>
              <p className="text-gray-700">{t("membership.feesText")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("membership.rightsTitle")}</h4>
              <p className="text-gray-700">{t("membership.rightsText")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("membership.suspensionTitle")}</h4>
              <p className="text-gray-700">{t("membership.suspensionText")}</p>
            </div>
          </CardContent>
        </Card>

        {/* Financial Policy */}
        <Card id="finance" className="mb-8 scroll-mt-24">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-black rounded-lg">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              {t("finance.cardTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("finance.bankingTitle")}</h4>
              <ul className="space-y-1 text-gray-700 ml-4">
                <li>• {t("finance.banking1")}</li>
                <li>• {t("finance.banking2")}</li>
                <li>• {t("finance.banking3")}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("finance.budgetTitle")}</h4>
              <ul className="space-y-1 text-gray-700 ml-4">
                <li>• {t("finance.budget1")}</li>
                <li>• {t("finance.budget2")}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("finance.authorityTitle")}</h4>
              <ul className="space-y-1 text-gray-700 ml-4">
                <li>• {t("finance.authority1")}</li>
                <li>• {t("finance.authority2")}</li>
                <li>• {t("finance.authority3")}</li>
                <li>• {t("finance.authority4")}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("finance.pettyCashTitle")}</h4>
              <p className="text-gray-700">{t("finance.pettyCashText")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("finance.grantsTitle")}</h4>
              <p className="text-gray-700">{t("finance.grantsText")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("finance.transparencyTitle")}</h4>
              <p className="text-gray-700">{t("finance.transparencyText")}</p>
            </div>
          </CardContent>
        </Card>

        {/* Community Capital Pool (CCP) Policy */}
        <Card id="ccp" className="mb-8 scroll-mt-24">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-black rounded-lg">
                <Building className="h-5 w-5 text-white" />
              </div>
              {t("ccp.cardTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("ccp.purposeTitle")}</h4>
              <p className="text-gray-700">{t("ccp.purposeText")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("ccp.sourceTitle")}</h4>
              <p className="text-gray-700">{t("ccp.sourceText")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("ccp.eligibilityTitle")}</h4>
              <ul className="space-y-1 text-gray-700 ml-4">
                <li>• {t("ccp.eligibility1")}</li>
                <li>• {t("ccp.eligibility2")}</li>
                <li>• {t("ccp.eligibility3")}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("ccp.approvalTitle")}</h4>
              <p className="text-gray-700">{t("ccp.approvalText")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("ccp.disbursementTitle")}</h4>
              <p className="text-gray-700">{t("ccp.disbursementText")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("ccp.securityTitle")}</h4>
              <p className="text-gray-700">{t("ccp.securityText")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("ccp.monitoringTitle")}</h4>
              <p className="text-gray-700">{t("ccp.monitoringText")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("ccp.defaultTitle")}</h4>
              <p className="text-gray-700">{t("ccp.defaultText")}</p>
            </div>
          </CardContent>
        </Card>

        {/* Procurement Policy */}
        <Card id="procurement" className="mb-8 scroll-mt-24">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-black rounded-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              {t("procurement.cardTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("procurement.principlesTitle")}</h4>
              <p className="text-gray-700">{t("procurement.principlesText")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("procurement.thresholdsTitle")}</h4>
              <ul className="space-y-1 text-gray-700 ml-4">
                <li>• {t("procurement.thresholds1")}</li>
                <li>• {t("procurement.thresholds2")}</li>
                <li>• {t("procurement.thresholds3")}</li>
                
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("procurement.vendorTitle")}</h4>
              <p className="text-gray-700">{t("procurement.vendorText")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("procurement.docsTitle")}</h4>
              <p className="text-gray-700">{t("procurement.docsText")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("procurement.emergencyTitle")}</h4>
              <p className="text-gray-700">{t("procurement.emergencyText")}</p>
            </div>
          </CardContent>
        </Card>

        {/* Brand, IP & Communications Policy */}
        <Card id="brand" className="mb-8 scroll-mt-24">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-black rounded-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              {t("brand.cardTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("brand.ownershipTitle")}</h4>
              <p className="text-gray-700">{t("brand.ownershipText")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("brand.qualityTitle")}</h4>
              <p className="text-gray-700">{t("brand.qualityText")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("brand.commsTitle")}</h4>
              <p className="text-gray-700">{t("brand.commsText")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("brand.contentRightsTitle")}</h4>
              <p className="text-gray-700">{t("brand.contentRightsText")}</p>
            </div>
          </CardContent>
        </Card>

        {/* Information & Data Protection */}
        <Card id="privacy" className="mb-8 scroll-mt-24">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-black rounded-lg">
                <Eye className="h-5 w-5 text-white" />
              </div>
              {t("privacy.cardTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("privacy.collectTitle")}</h4>
              <p className="text-gray-700">{t("privacy.collectText")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("privacy.storeTitle")}</h4>
              <p className="text-gray-700">{t("privacy.storeText")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("privacy.useTitle")}</h4>
              <p className="text-gray-700">{t("privacy.useText")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("privacy.retentionTitle")}</h4>
              <p className="text-gray-700">{t("privacy.retentionText")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("privacy.incidentTitle")}</h4>
              <p className="text-gray-700">{t("privacy.incidentText")}</p>
            </div>
          </CardContent>
        </Card>

        {/* Safeguarding, Gender & Code of Conduct */}
        <Card id="safeguarding" className="mb-8 scroll-mt-24">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-black rounded-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              {t("safeguarding.cardTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("safeguarding.childTitle")}</h4>
              <p className="text-gray-700">{t("safeguarding.childText")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("safeguarding.harassmentTitle")}</h4>
              <p className="text-gray-700">{t("safeguarding.harassmentText")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("safeguarding.inclusionTitle")}</h4>
              <p className="text-gray-700">{t("safeguarding.inclusionText")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("safeguarding.codeTitle")}</h4>
              <p className="text-gray-700">{t("safeguarding.codeText")}</p>
            </div>
          </CardContent>
        </Card>

        {/* Grievance Redress & Whistleblowing */}
        <Card id="grievance" className="mb-8 scroll-mt-24">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-black rounded-lg">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              {t("grievance.cardTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("grievance.channelsTitle")}</h4>
              <p className="text-gray-700">{t("grievance.channelsText")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("grievance.slaTitle")}</h4>
              <p className="text-gray-700">{t("grievance.slaText")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("grievance.confidentialityTitle")}</h4>
              <p className="text-gray-700">{t("grievance.confidentialityText")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("grievance.appealTitle")}</h4>
              <p className="text-gray-700">{t("grievance.appealText")}</p>
            </div>
          </CardContent>
        </Card>

        {/* Other Important Policies */}
        <Card id="others" className="mb-8 scroll-mt-24">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-black rounded-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              {t("others.cardTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("others.p11Title")}</h4>
              <p className="text-gray-700">{t("others.p11Text")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("others.p12Title")}</h4>
              <p className="text-gray-700">{t("others.p12Text")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("others.p13Title")}</h4>
              <p className="text-gray-700">{t("others.p13Text")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("others.p14Title")}</h4>
              <p className="text-gray-700">{t("others.p14Text")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("others.p15Title")}</h4>
              <p className="text-gray-700">{t("others.p15Text")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("others.p16Title")}</h4>
              <p className="text-gray-700">{t("others.p16Text")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("others.p17Title")}</h4>
              <p className="text-gray-700">{t("others.p17Text")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("others.p18Title")}</h4>
              <p className="text-gray-700">{t("others.p18Text")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("others.p19Title")}</h4>
              <p className="text-gray-700">{t("others.p19Text")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t("others.p20Title")}</h4>
              <p className="text-gray-700">{t("others.p20Text")}</p>
            </div>
          </CardContent>
        </Card>

        {/* Annexes */}
        <Card id="annexes" className="mb-8 scroll-mt-24">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-black rounded-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              {t("annexes.cardTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• {t("annexes.left1")}</li>
                <li>• {t("annexes.left2")}</li>
                <li>• {t("annexes.left3")}</li>
                <li>• {t("annexes.left4")}</li>
                <li>• {t("annexes.left5")}</li>
              </ul>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• {t("annexes.right1")}</li>
                <li>• {t("annexes.right2")}</li>
                <li>• {t("annexes.right3")}</li>
                <li>• {t("annexes.right4")}</li>
                <li>• {t("annexes.right5")}</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Key Highlights */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-black" />
              {t("highlights.cardTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <h4 className="font-semibold text-blue-900">{t("highlights.membershipTitle")}</h4>
                <p className="text-sm text-blue-700">{t("highlights.membershipText")}</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <h4 className="font-semibold text-green-900">{t("highlights.financeTitle")}</h4>
                <p className="text-sm text-green-700">{t("highlights.financeText")}</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Shield className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <h4 className="font-semibold text-purple-900">{t("highlights.riskTitle")}</h4>
                <p className="text-sm text-purple-700">{t("highlights.riskText")}</p>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <Eye className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                <h4 className="font-semibold text-orange-900">{t("highlights.transparencyTitle")}</h4>
                <p className="text-sm text-orange-700">{t("highlights.transparencyText")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status & Updates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-black" />
              {t("status.cardTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t("status.current")}</h4>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    {t("status.desc")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-yellow-100 text-yellow-800">{t("status.badge1")}</Badge>
                    <Badge className="bg-blue-100 text-blue-800">{t("status.badge2")}</Badge>
                    <Badge className="bg-green-100 text-green-800">{t("status.lastUpdatedPrefix")}: January 2024</Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-4">
                {t("cta.feedbackPrompt")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href={`/${locale}/contact`}
                  className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  {t("cta.feedback")}
                </a>
                <a 
                  href={`/${locale}/join-member`}
                  className="border border-black text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  {t("cta.becomeMember")}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
