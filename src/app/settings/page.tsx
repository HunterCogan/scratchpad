import { verifySession } from "@/lib/dal";
import UsernameForm from "./_components/UsernameForm";

export default async function SettingsPage() {
  const session = await verifySession();

  return (
    <div className="w-full font-sans">
      <main className="max-w-3xl mx-auto px-6 py-8 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>

          <p className="text-sm mt-1">Manage your account settings</p>
        </div>

        <UsernameForm initialName={session.name} />
      </main>
    </div>
  );
}
