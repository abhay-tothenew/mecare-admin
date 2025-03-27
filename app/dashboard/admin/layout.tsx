"use client";
import React from "react";
import Sidebar from "@/app/components/Sidebar";
import { useAuth } from "@/app/utils/context/Authcontext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import styles from "@/app/styles/AdminLayout.module.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);


  if (!user) {
    return null;
  }

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
} 