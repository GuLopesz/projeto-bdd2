import { LoginForm } from "@/components/login-form"

export default function Home() {
  return (
    <>
      <div className="h-30 w-fit text-5xl block mx-auto pt-8">Duvida ai</div>

    <div className="flex h-150 w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>

    </>
  );
}
