import Link from "next/link";

export default function Nav() {
    return (
    <>
        <nav className="flex items-center justify-between px-6 py-4">
            <div>
                <span></span>
            </div>


            <div className="flex items-center gap-3">
                <Link
                href="/login"
                className="rounded-full px-4 py-2 text-sm font-medium text-[var(--color-ink,#1a1a1a)] hover:bg-black/5 transition-colors"
                >
                Log in
                </Link>
                <Link
                href="/signup"
                className="rounded-full bg-[var(--color-ink,#1a1a1a)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                >
                Sign up
                </Link>
            </div>
        </nav>
    </>
  );
}