import Link from "next/link";
import { useTranslations } from "next-intl";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-teal-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">BB</span>
              </div>
              <span className="text-xl font-bold">Build Barguna</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {t("description")}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-teal-primary rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-coral-accent rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-teal-primary rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">{t("quickLinks")}</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">{t("about")}</Link></li>
              <li><Link href="/programs" className="text-gray-300 hover:text-white transition-colors">{t("programs")}</Link></li>
              <li><Link href="/brands" className="text-gray-300 hover:text-white transition-colors">{t("brands")}</Link></li>
              <li><Link href="/stories" className="text-gray-300 hover:text-white transition-colors">{t("stories")}</Link></li>
              <li><Link href="/governance" className="text-gray-300 hover:text-white transition-colors">{t("governance")}</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">{t("services")}</h4>
            <ul className="space-y-3">
              <li><Link href="/members" className="text-gray-300 hover:text-white transition-colors">{t("membership")}</Link></li>
              <li><Link href="/programs" className="text-gray-300 hover:text-white transition-colors">{t("training")}</Link></li>
              <li><Link href="/partners" className="text-gray-300 hover:text-white transition-colors">{t("partnerships")}</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">{t("contact")}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">{t("contactInfo")}</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  {t("address")}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  {t("phone")}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-purple-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  {t("email")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Compliance Section */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4 text-yellow-400">{t("legalTitle")}</h4>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-400">
              <p className="leading-relaxed">
                {t("legal1")}
              </p>
              <p className="leading-relaxed">
                {t("legal2")}
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
