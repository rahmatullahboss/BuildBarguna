// src/components/layout/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-stone-100 border-t border-stone-200">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-stone-800">Build Barguna Co-op</h3>
            <p className="mt-2 text-stone-600 text-sm">Train. Co-invest. Build Barguna.</p>
          </div>
          <div>
            <h4 className="font-semibold text-stone-700">Quick Links</h4>
            <ul className="mt-2 space-y-2 text-sm">
              <li><Link href="/about" className="text-stone-600 hover:text-stone-900">About Us</Link></li>
              <li><Link href="/programs" className="text-stone-600 hover:text-stone-900">Programs</Link></li>
              <li><Link href="/members" className="text-stone-600 hover:text-stone-900">Become a Member</Link></li>
              <li><Link href="/contact" className="text-stone-600 hover:text-stone-900">Contact</Link></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h4 className="font-semibold text-stone-700">Legal Compliance</h4>
            <p className="mt-2 text-xs text-stone-500">
              Build Barguna Co-operative is a Primary, non-credit co-operative. We do not accept public deposits or provide microcredit. All venture investments are member-only and governed by approved by-laws and term sheets.
            </p>
            <p className="mt-2 text-xs text-stone-500">
              Domestic donations are voluntary, non-refundable, and create no financial return or membership rights. Foreign donations are not accepted by the Co-operative.
            </p>
            <p className="mt-2 text-xs text-stone-500">
              Each featured brand is owned by the co-operative or its assigned unit; invoices and receipts show the legal entity: Build Barguna Co-operative.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-stone-200 text-center text-xs text-stone-500">
          <p>&copy; {new Date().getFullYear()} Build Barguna Co-operative. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
