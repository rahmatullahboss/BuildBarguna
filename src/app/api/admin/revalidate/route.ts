import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let body: any = {};
    if (contentType.includes("application/json")) {
      body = await req.json();
    } else if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      body = Object.fromEntries(form.entries());
    }

    const path = String(body.path || "");
    if (!path.startsWith("/")) {
      return NextResponse.json({ error: "Path must start with /" }, { status: 400 });
    }

    revalidatePath(path);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Failed to revalidate path", e);
    return NextResponse.json({ error: "Failed to revalidate" }, { status: 500 });
  }
}
