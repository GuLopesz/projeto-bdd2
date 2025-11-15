"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  // Estado para alternar entre Login e Registro
  const [isRegisterView, setIsRegisterView] = useState(false);

  // Campos para ambos os formulários
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); // Apenas para registro
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState(""); // Apenas para registro

  // Controlo de UI
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  // --- 1. LÓGICA DE LOGIN ---
  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username, // O Simple JWT usa 'username' por padrão
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Falha no login. Verifique usuário e senha.");
      }

      // SUCESSO! Guarda os tokens no localStorage
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);

      // Redireciona para a página principal
      router.push("/");
      // Força um refresh para o Header (se houver) atualizar
      router.refresh(); 

    } catch (err) {
      setError(err instanceof Error ? err.message : "Um erro ocorreu.");
      setIsLoading(false);
    }
    // Não definimos o isLoading como false no sucesso, pois o redirect acontece
  };

  // --- 2. LÓGICA DE REGISTRO ---
  const handleRegister = async () => {
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
          // 'first_name' e 'last_name' são opcionais por agora
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Tenta encontrar a primeira mensagem de erro da API do Django
        const firstErrorKey = Object.keys(data)[0];
        const errorMessage = data[firstErrorKey][0]; // Ex: data.email[0]
        throw new Error(errorMessage || "Falha ao registrar.");
      }

      // Sucesso!
      alert("Conta criada com sucesso! Por favor, faça o login.");
      setIsRegisterView(false); // Volta para a tela de login
      setError(null);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Um erro ocorreu.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- 3. SUBMISSÃO DO FORMULÁRIO ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegisterView) {
      handleRegister();
    } else {
      handleLogin();
    }
  };

  // --- 4. O JSX (A TELA) ---
  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm border border-gray-700 text-white">
      
      <h1 className="text-2xl font-bold mb-6 text-center">
        {isRegisterView ? "Criar Conta" : "Login"}
      </h1>
      
      {/* Mensagem de Erro Universal */}
      {error && (
        <div className="bg-red-900 text-red-100 p-3 rounded-md mb-4 border border-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Campo de Usuário (Username) */}
      <div className="mb-4">
        <label className="block mb-1 text-sm">Usuário:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Campos que SÓ aparecem no Registro */}
      {isRegisterView && (
        <>
          <div className="mb-4">
            <label className="block mb-1 text-sm">Email (IFSP):</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded border border-gray-600"
              placeholder="exemplo@aluno.ifsp.edu.br"
              required
            />
          </div>
        </>
      )}

      {/* Campo de Senha */}
      <div className="mb-4">
        <label className="block mb-1 text-sm">Senha:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 bg-gray-700 rounded border border-gray-600"
          required
        />
      </div>

      {/* Campo de Confirmar Senha (SÓ no Registro) */}
      {isRegisterView && (
        <div className="mb-6">
          <label className="block mb-1 text-sm">Confirmar Senha:</label>
          <input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded border border-gray-600"
            required
          />
        </div>
      )}
      
      {/* Botão de Submissão */}
      <button
        type="submit"
        className="w-full bg-blue-600 p-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
        disabled={isLoading}
      >
        {isLoading ? "Aguarde..." : (isRegisterView ? "Criar Conta" : "Entrar")}
      </button>

      {/* Botão para Alternar */}
      <div className="text-center mt-6">
        <button
          type="button" // Impede que este botão envie o formulário
          onClick={() => {
            setIsRegisterView(!isRegisterView);
            setError(null); // Limpa erros ao alternar
          }}
          className="text-blue-400 hover:text-blue-300 text-sm"
        >
          {isRegisterView
            ? "Já tem uma conta? Fazer Login"
            : "Não tem uma conta? Criar agora"}
        </button>
      </div>

    </form>
  );
}