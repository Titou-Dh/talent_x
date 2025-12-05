"use client";
import { useState } from "react";
import { useRouter } from "@/navigation";
import { RetroCard } from "@/components/RetroCard";
import { RetroButton } from "@/components/RetroButton";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();
  const t = useTranslations("Auth");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    if (res.ok) {
      router.push("/login");
    } else {
      alert("Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <RetroCard>
        <h2 className="text-5xl text-white mb-10 text-center border-b-4 border-white pb-4 tracking-tighter">
          {t("register")}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-xl uppercase mb-2 text-gray-400 tracking-widest">
              {t("name")}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black border-2 border-gray-700 p-4 text-white text-2xl focus:border-white focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xl uppercase mb-2 text-gray-400 tracking-widest">
              {t("email")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border-2 border-gray-700 p-4 text-white text-2xl focus:border-white focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xl uppercase mb-2 text-gray-400 tracking-widest">
              {t("password")}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border-2 border-gray-700 p-4 text-white text-2xl focus:border-white focus:outline-none"
              required
            />
          </div>
          <RetroButton
            type="submit"
            className="w-full text-2xl py-4"
            variant="primary"
          >
            {t("submit")}
          </RetroButton>
          <div className="text-center pt-4">
            <Link
              href="/login"
              className="text-gray-500 hover:text-white underline decoration-dotted underline-offset-4"
            >
              {t("hasAccount")}
            </Link>
          </div>
        </form>
      </RetroCard>
    </div>
  );
}
