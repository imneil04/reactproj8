"use server";

//import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type LoginState = {
    error: string | null;
    success: boolean;
};

export async function login (
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {

  const supabase = await createClient();

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Please enter your email and password.", success: false };
  }
  
  const  { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  /*if (error) {
    return {

      error: "Sorry, you've entered wrong credentials please try again.",
      success: false,
    };
  } */

   if (error) {
    return {
      error:
        error.code === "invalid_credentials"
          ? "Sorry, you've entered wrong credentials please try again."
          : "Something went wrong on our side. Please try again in a moment.",
      success: false,
    };
  } 

  revalidatePath("/", "layout");
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