"use server";

//import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type LoginState = {
    error: string | null;
    success: boolean;
};

export async function login (
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {

  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const  { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {

      error: "Sorry, you've entered wrong credentials please try again.",
      success: false,
    };
  }

  return { error: null, success: true };

}

/*export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
} */