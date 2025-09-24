"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export function BackButton({ children, className }) {
  const router = useRouter();

  return (
    <Button variant="ghost" onClick={() => router.back()} className={className}>
      {children}
    </Button>
  );
}

export function HomeButton({ children, className }) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      onClick={() => router.push("/")}
      className={className}
    >
      {children}
    </Button>
  );
}
