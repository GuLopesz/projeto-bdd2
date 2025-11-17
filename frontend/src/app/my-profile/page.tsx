"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Header from "@/components/common/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { getInitial, getAvatarColor } from "@/lib/avatar-fallback";

interface UserProfile {
  id: number;
  username?: string;
  email: string;
  first_name?: string;
  last_name?: string;
  user_type: "aluno" | "professor" | string;
  date_joined: string;
}

export default function MyProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      const userId = decoded.user_id;

      fetch(`http://127.0.0.1:8000/api/users/${userId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        if (!res.ok) throw new Error("Falha ao buscar dados.");
        return res.json();
      })
      .then(data => {
        setUser(data);
      })
      .catch(err => {
        console.error(err);
        setError("Erro ao carregar perfil.");
      })
      .finally(() => {
        setLoading(false);
      });

    } catch (e) {
      console.error("Token inválido", e);
      router.push("/");
    }
  }, [router]);

  const formatDateJoined = (isoDate: string) => {
    if (!isoDate) return "...";
    return new Date(isoDate).toLocaleDateString("pt-BR", {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  };

  const displayUsername = user?.username || user?.email.split('@')[0] || "...";
  
  const displayName = (user?.first_name && user?.last_name) 
    ? `${user.first_name} ${user.last_name}` 
    : displayUsername;

  const initial = getInitial(displayName);
  const color = getAvatarColor(displayName);
  const userTypeDisplay = user?.user_type === "professor" ? "Professor" : "Aluno";

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="flex justify-center">
        <Header />
      </div>

      <main className="max-w-xl mx-auto pt-32 px-4">
        
        {loading ? (
          <p className="text-center text-gray-400">Carregando perfil...</p>
        ) : (
          <Card className="w-full bg-gray-800 border-gray-700 text-white">
            
            <CardHeader className="flex flex-col items-center text-center pb-2">
              
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg border-4 border-gray-900 mb-4"
                style={{ backgroundColor: color }}
                title={displayName}
              >
                {initial}
              </div>

              <CardTitle className="text-2xl">{displayName}</CardTitle>
              
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mt-2 border border-primary/20">
                {userTypeDisplay}
              </span>

            </CardHeader>

            <CardContent className="space-y-4 pt-6">
              
              {error && (
                <div className="p-3 bg-red-900/50 border border-red-800 rounded text-red-200 text-sm text-center">
                  {error}
                </div>
              )}

              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                <Label className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1 block">
                  Username
                </Label>
                <p className="text-lg text-gray-200 font-mono">@{displayUsername}</p>
              </div>

              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                <Label className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1 block">
                  Email
                </Label>
                <p className="text-lg text-gray-200">{user?.email}</p>
              </div>

              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                <Label className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1 block">
                  Membro Desde
                </Label>
                <p className="text-lg text-gray-200">{user ? formatDateJoined(user.date_joined) : "..."}</p>
              </div>

            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}