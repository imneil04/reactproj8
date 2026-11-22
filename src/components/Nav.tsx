import Link from "next/link";
import LogoutButton from "./LogoutButton"; // adjust to wherever your LogoutButton lives
import { createClient } from "@/lib/supabase/server";

export default async function Nav() {
  
    const supabase = await createClient();
  
    const {
    data: { user },
    } = await supabase.auth.getUser();

    return (
    <>
        <nav className="flex items-center justify-between px-6 py-4">
            <div>
                <span></span>
            </div>

            <div className="flex items-center gap-3">
                {user ? (
                <>
                    <Link
                    href="/dashboard"
                    className="rounded-full px-4 py-2 text-sm font-medium text-[var(--color-ink,#1a1a1a)] hover:bg-black/5 transition-colors"
                    >
                    My Dashboard
                    </Link>
                    <LogoutButton />
                </>
                ) : (
                <>
                {/* your existing "Log in" and "Sign up" Links stay exactly as they are */}
                    <nav className="flex items-center justify-between px-6 py-4">
                        <div>
                            <span></span>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link
                            href="/login"
                            className="cursor-pointer rounded-full px-4 py-2 text-sm font-medium text-[var(--color-ink,#1a1a1a)] hover:bg-black/5 transition-colors"
                            >
                            Log in
                            </Link>
                            <Link
                            href="/signup"
                            className="cursor-pointer rounded-full border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/5 transition-colors"
                            >
                            Sign up
                            </Link>
                        </div>
                    </nav>
                </>
                )}
            </div>
        </nav>
    </>
  );
}