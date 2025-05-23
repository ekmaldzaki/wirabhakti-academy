import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("sb-access-token")?.value;

  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = roleData?.role;

  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith("/siswa") && role !== "siswa") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname.startsWith("/pelatih") && role !== "pelatih") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/siswa/:path*",
    "/pelatih/:path*",
    "/admin/:path*",
    "/siswa",
    "/pelatih",
    "/admin",
  ],
};
