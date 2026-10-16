"use client";
import Link from "next/link";
import { Scissors } from "lucide-react";
import clsx from "clsx";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className={clsx("logo", light && "logo-light")} aria-label="BarbApp — início">
      <span className="logo-mark">
        <Scissors size={23} strokeWidth={1.8} />
      </span>
      <span>
        barb<span className="logo-accent">app</span>
        <span className="logo-dot">.</span>
      </span>
    </Link>
  );
}
