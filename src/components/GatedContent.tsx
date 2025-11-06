// src/components/GatedContent.tsx
import { auth } from "@/auth";
import Link from "next/link";
import { UserRole } from "@prisma/client";

type GatedContentProps = {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  locale: string;
  message?: string;
};

export async function GatedContent({
  allowedRoles,
  children,
  locale,
  message,
}: GatedContentProps) {
  const session = await auth();

  if (!session || !allowedRoles.includes(session.user?.role)) {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md">
        <h3 className="font-bold">Access Denied</h3>
        <p>
          {message || "This content is only available to registered members."}{" "}
          <Link href={`/${locale}/auth/signin`} className="underline font-semibold">
            Please sign in.
          </Link>
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
