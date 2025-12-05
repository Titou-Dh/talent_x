"use client";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/navigation";
import { ChangeEvent, useTransition } from "react";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <select
      defaultValue={locale}
      onChange={onSelectChange}
      disabled={isPending}
      className="bg-black text-white border border-gray-700 text-sm p-1 ml-4"
    >
      <option value="fr">FR</option>
      <option value="en">EN</option>
    </select>
  );
}
