// src/middleware.ts
import createMiddleware from "next-intl/middleware";
import { locales } from "./i18n";

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
  defaultLocale: "bn",
});

export const config = {
  // Skip all paths that should not be internationalized. This example skips the
  // folders containing files folder, although this can be customized.
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
