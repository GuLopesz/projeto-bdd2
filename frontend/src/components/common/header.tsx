"use client";

import { useState } from "react";
import { Search, User, LogOut, FileText, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface HeaderProps {
  onSearch?: (term: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/");
  };

  return (
    <header className="flex justify-center py-4 border-b border-primary bg-transparent backdrop-blur-lg w-full fixed top-0 z-50">
      <div className="mx-auto flex items-center justify-between gap-16 px-4 max-w-6xl w-full">
        <Link href="/home" className="text-2xl font-bold text-primary">
          IF Pergunta
        </Link>

        <div className="flex items-center gap-4 flex-1 justify-center">
            {onSearch && (
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                    type="search"
                    placeholder="Pesquisar dúvidas..."
                    className="w-[250px] pl-10 border-primary bg-gray-900/50 text-white"
                    onChange={(e) => onSearch(e.target.value)}
                    />
                </div>
            )}
        </div>

        <div className="flex items-center">
            <div className="relative">
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors focus:outline-none"
                >
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                        EU
                    </div>
                    <ChevronDown className="w-4 h-4" />
                </button>

                {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg py-1 z-50">
                        <button 
                            onClick={() => router.push("/profile")}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                        >
                            <User className="mr-2 h-4 w-4" /> Ver Perfil
                        </button>
                        
                        <button 
                            onClick={() => router.push("/my-questions")}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                        >
                            <FileText className="mr-2 h-4 w-4" /> Minhas Perguntas
                        </button>
                        
                        <div className="border-t border-gray-700 my-1"></div>
                        
                        <button 
                            onClick={handleLogout}
                            className="flex w-full items-center px-4 py-2 text-sm text-red-400 hover:bg-red-900/20"
                        >
                            <LogOut className="mr-2 h-4 w-4" /> Sair
                        </button>
                    </div>
                )}
                
                {isMenuOpen && (
                    <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsMenuOpen(false)}
                    />
                )}
            </div>
        </div>
      </div>
    </header>
  );
}