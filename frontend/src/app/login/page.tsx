import { LoginForm } from "@/components/ui/login-form"

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-100 max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
