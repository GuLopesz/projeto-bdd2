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

export function RegisterForm() {
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState(""); 

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== passwordConfirm) {
      setError("As senhas não coincidem.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/users/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
          password_confirm: passwordConfirm,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Lida com erros do backend (ex: email já existe)
        const firstErrorKey = Object.keys(data)[0];
        const errorMessage = data[firstErrorKey][0];
        throw new Error(errorMessage || "Falha ao registrar.");
      }

      // Conta criada com sucesso
      alert("Conta criada com sucesso! Você será redirecionado para o Login.");
      router.push("/"); // Redireciona para a página de Login
      router.refresh(); 

    } catch (err) {
      setError(err instanceof Error ? err.message : "Um erro ocorreu.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="bg-gray-800 border-gray-700 text-white">
        <CardHeader>
          <CardTitle>Crie sua conta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">

              {error && (
                <div className="bg-red-900 text-red-100 p-3 rounded-md mb-4 border border-red-700 text-sm">
                  {error}
                </div>
              )}

              {/*user*/}
              <div className="grid gap-3">
                <Label htmlFor="username">Usuário</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Seu nome de usuário"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              {/*email*/}
              <div className="grid gap-3">
                <Label htmlFor="email">Email (IFSP)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nome@aluno.ifsp.edu.br"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              
              {/*senha*/}
              <div className="grid gap-3">
                <Label htmlFor="password">Senha</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              {/*senha2*/}
              <div className="grid gap-3">
                <Label htmlFor="password-confirm">Confirmar Senha</Label>
                <Input 
                  id="password-confirm" 
                  type="password" 
                  required 
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              
              {/*botao*/}
              <div className="flex flex-col gap-3">
                <Button 
                  type="submit" 
                  className="w-full bg-primary p-3 rounded-lg font-semibold text-white hover:bg-primary/90 disabled:opacity-50 transition-colors" 
                  disabled={isLoading}
                >
                  {isLoading ? "Aguarde..." : "Criar Conta"}
                </Button>
              </div>
            </div>
            
            {/*link login*/}
            <div className="mt-4 text-center text-sm">
              Já tem uma conta?{" "}
              <Link href="/" className="underline underline-offset-4 text-primary hover:text-primary/80">
                Fazer Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}