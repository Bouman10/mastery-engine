import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// This route handles the OAuth redirect from Google back to your app.
// Supabase sends a ?code= param here — we exchange it for a session,
// then redirect the user to the right page.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code  = searchParams.get("code");
  const next  = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Session established — send to dashboard or onboarding
      return NextResponse.redirect(`${origin}${next}`);
    }

    console.error("OAuth code exchange error:", error.message);
  }

  // Something went wrong — send back to login with error hint
  return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
}