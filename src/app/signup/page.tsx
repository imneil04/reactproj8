"use client"

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { signup } from "./actions";

export default function SignupPage() {

    const [ showPassword, setShowPassword ] = useState(false);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6 py-16">
      <h1 className="font-[family-name:var(--font-fraunces)] text-3xl tracking-tight">
        Sign up
      </h1>
      <p className="mt-2 text-sm text-black/60">
        Create an account to start saving destinations.
      </p>

      <div className="mt-3 rounded-3xl border border-black/10 bg-white/30 p-6 backdrop-blur-md shadow-sm">
        <form action={signup} className="mt-8 flex flex-col gap-3">

          <input
            type="text"
            name="fullName"
            placeholder="Name"
            disabled
            className="rounded-full border border-black/10 px-4 py-3 text-sm placeholder:text-black/40"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            disabled
            className="rounded-full border border-black/10 px-4 py-3 text-sm placeholder:text-black/40"
          />
          <input 
            type="tel"
            name="phone"
            placeholder="Phone Number"
            disabled
            className="rounded-full border border-black/10 px-4 py-3 text-sm placeholder:text-black/40"
          />
             <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    disabled
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
            disabled
            className="mt-2 rounded-full bg-[var(--color-ink,#1a1a1a)] px-4 py-3 text-sm font-medium text-white opacity-50"
          >
            Sign up
          </button>
        </form>
      </div>

      <p className="mt-6 text-sm text-black/60">
        Already have an account?{" "}
        <Link href="/login" className="underline underline-offset-2">
          Log in
        </Link>
      </p>
    </main>
  );
}