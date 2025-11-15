"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; 

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  
  // --- MUDANÇA 1: Estado para 'email' ---
  const [email, setEmail] = useState(""); // Em vez de 'username'
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // --- MUDANÇA 2: Envia o 'email' no campo 'username' ---
          username: email, // O backend espera a chave 'username'
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Falha no login. Verifique os dados.");
      }

      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);

      router.push("/home");
      router.refresh(); 

    } catch (err) {
      setError(err instanceof Error ? err.message : "Um erro ocorreu.");
      setIsLoading(false);
    }
  };


  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="bg-gray-800 border-gray-700 text-white">
        <CardHeader>
          <CardTitle>Entre na sua conta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">

              {error && (
                <div className="bg-red-900 text-red-100 p-3 rounded-md border border-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* --- MUDANÇA 3: O formulário pede Email --- */}
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nome@aluno.ifsp.edu.br"
                  required
                  autoFocus={false}
                  value={email} // Liga ao estado 'email'
                  onChange={(e) => setEmail(e.target.value)} // Atualiza o estado 'email'
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-gray-400"
                  >
                    Esqueceu a senha?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700" 
                  disabled={isLoading}
                >
                  {isLoading ? "Aguarde..." : "Login"}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Não tem uma conta?{" "}
              <Link href="/register" className="underline underline-offset-4 text-blue-400 hover:text-blue-300">
                Crie a sua conta
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}