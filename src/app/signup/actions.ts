"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isValidFullName } from "@/lib/validation";

export async function signup(formData: FormData) {

  const fullName = (formData.get("fullName") as string)?.trim();
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;

  //check full name does not contain digits
  if (!isValidFullName(fullName)) {
    redirect(
      `/signup?error=${encodeURIComponent(
        "Name can only contain letters, spaces, hyphens, and apostrophes."
      )}`
    );
  }

  //initialize supabase client function
  const supabase = await createClient();

  //details to pass in supabase auth() signup call
  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
        data: {
            full_name: fullName,
        },
    },
  });

  //check if user is correct
  if (signUpError || !data.user) {
    redirect(
      `/signup?error=${encodeURIComponent(
        signUpError?.message ?? "Something went wrong. Please try again."
      )}`
    );
  }

  //data to insert
  const { error: profileError } = await supabase.from("profiles").insert({
    id: data.user.id,
    full_name: fullName,
    email,
    phone,
    role: "regular_user",
  });

  if (profileError) {
    redirect(
      `/signup?error=${encodeURIComponent(
        "Account created, but profile setup failed. Please contact support."
      )}`
    );
  }

  redirect("/dashboard");
}