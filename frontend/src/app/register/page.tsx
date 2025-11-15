"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Importa os componentes shadcn/ui
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  // Estados para todos os campos do formulário
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

    // 1. Validação local primeiro
    if (password !== passwordConfirm) {
      setError("As senhas não coincidem.");
      setIsLoading(false);
      return;
    }

    try {
      // 2. Envia para o endpoint de registo
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
        // 3. Tenta encontrar a primeira mensagem de erro da API do Django
        //    (Ex: "email: Este email já existe.")
        const firstErrorKey = Object.keys(data)[0];
        const errorMessage = data[firstErrorKey][0];
        throw new Error(errorMessage || "Falha ao registar.");
      }

      // 4. Sucesso!
      alert("Conta criada com sucesso! Por favor, faça o login.");
      router.push("/"); // Redireciona para a página de login (a raiz)

    } catch (err) {
      setError(err instanceof Error ? err.message : "Um erro ocorreu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Layout da página (centralizado e com fundo escuro)
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gray-900">
      
      {/* O Card do formulário */}
      <Card className="w-full max-w-sm bg-gray-800 border-gray-700 text-white">
        <CardHeader>
          <CardTitle>Crie a sua conta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">

              {/* Bloco de Erro */}
              {error && (
                <div className="bg-red-900 text-red-100 p-3 rounded-md border border-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Campo Usuário */}
              <div className="grid gap-3">
                <Label htmlFor="username">Usuário</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="seu.usuario"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              {/* Campo Email */}
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

              {/* Campo Senha */}
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

              {/* Campo Confirmar Senha */}
              <div className="grid gap-3">
                <Label htmlFor="passwordConfirm">Confirmar Senha</Label>
                <Input 
                  id="passwordConfirm" 
                  type="password" 
                  required 
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              
              {/* Botão de Submissão */}
              <div className="flex flex-col gap-3">
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700" 
                  disabled={isLoading}
                >
                  {isLoading ? "A criar..." : "Criar Conta"}
                </Button>
              </div>
            </div>

            {/* Link para voltar ao Login */}
            <div className="mt-4 text-center text-sm">
              Já tem uma conta?{" "}
              <Link href="/" className="underline underline-offset-4 text-blue-400 hover:text-blue-300">
                Fazer Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
      
    </div>
  );
}