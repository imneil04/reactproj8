"use client";

import { logout } from "@/app/logout/actions";

export default function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="cursor-pointer rounded-full border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/5 transition-colors"
      >
        Log out
      </button>
    </form>
  );
}