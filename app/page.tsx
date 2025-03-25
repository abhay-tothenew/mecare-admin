"use client";

import { useState, useEffect, use } from "react";
import { useAuth } from "./utils/context/Authcontext";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    

    try {
      const response = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          admin_email: email,
          password: password,
        }),
      });

      const data = await response.json();
      console.log("data--->", data);

      if (!data.success) {
        throw new Error("Invalid Credentials");
      }

      login({
        id: data.admin.id,
        name: data.admin.name,
        email: data.email,
        token: data.token,
      });

      router.push("/dashboard/admin");
    } catch (error) {
      console.log("error while login", error);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Welcome to Mecare Admin Dashboard</h1>
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.loginButton}>
            Login
          </button>
        </form>
      </main>
    </div>
  );
}
