import { LoginForm } from "@/components/common/login-form"

export default function Home() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-6 md:p-10">
      
      <div className="w-full max-w-md">
        
        {/*titulo e subtitulo*/}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-primary">
            IF Pergunta
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Entre para visualizar e publicar dúvidas da comunidade IFSP.
          </p>
        </div>

        {/*formulario*/}
        <LoginForm />
      </div>
    </div>
  );
}