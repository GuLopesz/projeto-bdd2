import { Search } from "lucide-react";
import { Input } from "../ui/input";

export default function Header() {
  return (
    <header className="flex justify-center py-4 border-b border-primary/30 bg-background/70 backdrop-blur-md w-full fixed top-0 z-50">

      <div className="mx-auto flex items-center justify-between gap-16">
        <a href="#" className="text-2xl font-bold text-primary">
          IF Pergunta
        </a>

        <nav className="flex items-center gap-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Pesquisar dúvidas..."
              className="w-full md:w-[250px] lg:w-[300px] pl-10 border-primary"
            />
          </div>
        </nav>
      </div>

    </header>
  );
}
