import LogoutButton from "@/components/LogoutButton";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data: profile } =  await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user!.id)
        .single();

    return (
        <>
            <main className="mx-auto max-w-4xl px-6 py-16">
                <div className="flex justify-between">
                    <div>
                        <h1 className="text-3xl tracking-tight">
                            Welcome back, {profile?.full_name ?? "traveler"}
                        </h1>
                    </div>
                    <div><LogoutButton /></div>
                </div>
                 <p className="mt-2 text-sm text-black/60">
                    Your saved destinations and recommendations will live here.
                </p>
            </main>
        </>
    );
}