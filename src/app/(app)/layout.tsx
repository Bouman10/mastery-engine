import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileMenu from "@/components/ui/ProfileMenu";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch profile name if set
  const { data: profile } = await supabase
    .from("profiles")
    .select("name, avatar_url")
    .eq("id", user.id)
    .single();

  const displayName = profile?.name || user.email?.split("@")[0] || "You";
  const avatarUrl = profile?.avatar_url || null;

  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="border-b border-stone-200 bg-white sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-6 h-12 flex items-center justify-between">
          <span className="font-serif text-lg text-stone-900">Mastery</span>
          <ProfileMenu displayName={displayName} avatarUrl={avatarUrl} email={user.email ?? ""} />
        </div>
      </nav>
      {children}
    </div>
  );
}