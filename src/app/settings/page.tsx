import { verifySession } from "@/lib/dal";
import User from "@/models/User";
import connectDB from "@/lib/db";
import ProfilePictureForm from "./_components/ProfilePictureForm";
import UsernameForm from "./_components/UsernameForm";
import DeleteAccountForm from "./_components/DeleteAccountForm";
import PasswordForm from "./_components/PasswordForm";

export default async function SettingsPage() {
  const session = await verifySession();

  await connectDB();

  const user = await User.findById(session.userId).lean();

  return (
    <div className="w-full font-sans">
      <main className="max-w-3xl mx-auto px-6 py-8 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>

          <p className="text-sm mt-1">Manage your account settings</p>
        </div>

        <ProfilePictureForm initialAvatarUrl={user?.avatarUrl} />

        <UsernameForm initialName={session.name} />

        <PasswordForm />

        <DeleteAccountForm />
      </main>
    </div>
  );
}
