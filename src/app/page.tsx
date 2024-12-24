"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { LanguageSwitcher } from "@/components/language-switcher";
import Link from "next/link";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {t("dashboard.title")}
          </h1>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {t("dashboard.signOut")}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            {t("dashboard.welcome")},{" "}
            {session.user?.name || session.user?.email}
          </h2>
          {session.user?.role && (
            <p className="text-gray-600 mb-4">
              {t("dashboard.role")}: {session.user.role}
            </p>
          )}

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/gramam"
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-indigo-500 transition-colors"
            >
              <h3 className="text-lg font-medium text-gray-900">
                {t("gramam.title")}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {t("gramam.description")}
              </p>
            </Link>

            <Link
              href="/vedam"
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-indigo-500 transition-colors"
            >
              <h3 className="text-lg font-medium text-gray-900">
                {t("vedam.title")}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {t("vedam.description")}
              </p>
            </Link>

            <Link
              href="/gothram"
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-indigo-500 transition-colors"
            >
              <h3 className="text-lg font-medium text-gray-900">
                {t("gothram.title")}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {t("gothram.description")}
              </p>
            </Link>

            <Link
              href="/illam"
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-indigo-500 transition-colors"
            >
              <h3 className="text-lg font-medium text-gray-900">
                {t("illam.title")}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {t("illam.description")}
              </p>
            </Link>

            <Link
              href="/namboodiri"
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-indigo-500 transition-colors"
            >
              <h3 className="text-lg font-medium text-gray-900">
                {t("namboodiri.title")}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {t("namboodiri.description")}
              </p>
            </Link>

            <Link
              href="/profession"
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-indigo-500 transition-colors"
            >
              <h3 className="text-lg font-medium text-gray-900">
                {t("profession.title")}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {t("profession.description")}
              </p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
