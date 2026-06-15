import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="border-b border-stone-200 bg-stone-50/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-6 h-12 flex items-center justify-between">
          <span className="font-serif text-lg text-stone-900">Mastery</span>
          <span className="text-xs text-stone-400">{user.email}</span>
        </div>
      </nav>
      {children}
    </div>
  );
}
