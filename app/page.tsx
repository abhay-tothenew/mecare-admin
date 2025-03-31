"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./utils/context/Authcontext";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { API_ENDPOINTS } from "./utils/config";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard/admin");
    }
  }, [user,]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
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
    } finally {
      setIsLoading(false);
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>
          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={isLoading}
          >
            {isLoading && <span className={styles.loadingSpinner} />}
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </main>
    </div>
  );
}