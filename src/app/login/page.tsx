"use client"

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useActionState, useEffect } from "react";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react"; //animations
import { login, type LoginState } from "./actions"; 


const initialState: LoginState = { error: null, success: false };

export default function LoginPage() {

    const [ showPassword, setShowPassword ] = useState(false);
    const [ state, formAction, isPending ] = useActionState(login, initialState);
    const router = useRouter();
    const [ validationError, setValidationError ] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const [ showLogoutMessage, setShowLogoutMessage ] = useState(false);

    //to consolidate three separate conditions into single derived "message"
    //priority order, so only one msg banner at a time can be rendered
    type BannerType = "validation" | "error" | "success" | "logout";
    let banner: { type: BannerType; message: string } | null = null;

    if (validationError) {
      banner = { type: "validation", message: validationError };
    }
    else if (state.success) {
      banner = { type: "success", message: "Logged In - taking you to your dashboard." };
    }
    else if (state.error) {
      banner = { type: "error", message: state.error };
    }
    else if (showLogoutMessage) {
      banner = { type: "logout", message: "You have successfully logged out. See you again."};
    }

    //client-side action, checks if both fields are empty then it stops server action from being called
    //at all. A separate validation banner shows - distinct from red server-error banner
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {

      const formData = new FormData(e.currentTarget);
      const email = (formData.get("email") as string)?.trim();
      const password = (formData.get("password") as string);

      if (!email || !password) {

        e.preventDefault();
        setValidationError("Please fill in both fields before logging in.");

        return;
      }

      setValidationError(null);
      setShowLogoutMessage(false);
    }

    //for logout
    useEffect(() => {
      if (searchParams.get("logout") === "success") {
        setShowLogoutMessage(true);
        router.replace("/login");

      }
    }, [searchParams, router]);

    //to ensure proper flow in redirect
    useEffect(() => {
      if (state.success) {
        const timer = setTimeout(() => {
          
          router.push("/dashboard");
        }, 1500);
        return () => clearTimeout(timer);
      }
    }, [state.success, router]);

    
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6 py-16">
      <h1 className="font-[family-name:var(--font-fraunces)] text-3xl tracking-tight">
        Log in
      </h1>
      <p className="mt-2 text-sm text-black/60">
        Welcome back to <Link href="/" className="text-ink/80 font-medium tracking-light">Waypoint</Link>.
      </p>

      <div className="mt-3 rounded-3xl border border-black/10 bg-white/30 p-6 backdrop-blur-md shadow-sm">
        
        <form action={formAction} onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3">

            <AnimatePresence mode="wait">
              {banner && (
                <motion.div
                  key={banner.type}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className={
                    banner.type === "validation"
                    ? "rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700"
                    : banner.type === "success"
                    ? "flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                    : banner.type === "logout"
                    ? "flex items-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700"
                    : "rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  }
                >
                  {(banner.type === "success" || banner.type === "logout") && <CheckCircle2 size={16} />}
                  {banner.message}
                </motion.div>
              )}
            </AnimatePresence>
            <input
            type="email"
            name="email"
            placeholder="Email"
            disabled={isPending || state.success}
            className="rounded-full border border-black/10 px-4 py-3 text-sm placeholder:text-black/40"
            />
           
            <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    disabled={isPending || state.success}
                    className="w-full rounded-full border border-black/10 px-4 py-3 text-sm placeholder:text-black/40"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black/70"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}   
                </button>
            </div>
            <button
            type="submit"
            disabled={isPending || state.success}
            className="mt-2 flex items-center justify-center rounded-full bg-[var(--color-ink,#1a1a1a)] px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-70"
            >
              {isPending ? <Loader2 size={18} className="animate-spin" /> : "Log in"}
            </button>
        </form>
      </div>

      <p className="mt-6 text-sm text-black/60">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="underline underline-offset-2">
          Sign up
        </Link>
      </p>
    </main>
  );
}