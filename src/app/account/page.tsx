import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBookmarks } from "@/app/actions/bookmarks";
import { signOut } from "@/app/actions/auth";
import AccountClient from "./AccountClient";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const bookmarks = await getBookmarks();

  return (
    <AccountClient
      email={user.email ?? ""}
      createdAt={user.created_at}
      bookmarks={bookmarks}
      signOut={signOut}
    />
  );
}
