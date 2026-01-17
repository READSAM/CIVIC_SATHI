"use client";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
export default function LoginPage() {
  const { user, googleSignIn } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.error("Login failed", error);
    }
  };
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-2">Welcome to Civic Sathi</h1>
        <p className="text-gray-500 mb-6">Sign in to report issues and track progress.</p>
        
        <Button onClick={handleLogin} className="w-full">
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}
