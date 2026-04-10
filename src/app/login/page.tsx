import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <Suspense 
      fallback={
        <div className="h-screen w-full flex items-center justify-center bg-[#FAF9F6]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-[#7B2D0A]" size={40} />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">
              Please Wait
            </p>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}