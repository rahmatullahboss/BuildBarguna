"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Lock, ArrowRight, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
// import { useRouter } from "next/navigation"; // Not needed with window.location

export function SignInForm() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const t = useTranslations("AuthPage");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const result = await signIn("credentials", {
        userId,
        password,
        redirect: false,
      });

      if (result?.error) {
        console.error("Sign in error:", result.error);
        setMessage(t("invalidCredentials"));
      } else if (result?.ok) {
        setMessage(t("signInSuccess"));
        // Wait a moment for session to be established
        setTimeout(() => {
          window.location.href = "/admin";
        }, 500);
      }
    } catch (error) {
      console.error("Sign in exception:", error);
      setMessage(t("somethingWentWrong"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
          {t("userId")}
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            id="userId"
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder={t("enterUserId")}
            className="pl-10 border-gray-300 focus:ring-black focus:border-black"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          {t("password")}
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("enterPassword")}
            className="pl-10 border-gray-300 focus:ring-black focus:border-black"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg text-sm ${
          message.includes("Check") 
            ? "bg-green-50 text-green-700 border border-green-200" 
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {message}
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            {t("signingIn")}
          </>
        ) : (
          <>
            {t("signIn")}
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </Button>
    </form>
  );
}