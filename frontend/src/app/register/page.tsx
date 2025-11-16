import { RegisterForm } from "@/components/common/register-form"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-6 md:p-10">
      
      <div className="w-full max-w-md">
        
        {/*titulo*/}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-primary">
            IF Pergunta
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Crie sua conta para participar da comunidade.
          </p>
        </div>

        {/*formulario*/}
        <RegisterForm />
      </div>
    </div>
  );
}