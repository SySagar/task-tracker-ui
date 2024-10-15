'use client';
import TaskBoard from "./components/TaskBoard";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";

export default function Home() {

  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <button onClick={logout} className="mb-4 p-2 bg-red-500 text-white rounded">
        Logout
      </button>
    <TaskBoard />
</div>
  );
}
