"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Crown, ChevronRight, Mail, Lock, CheckCircle2, Percent } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  useEffect(() => {
  if (status === "authenticated") {
    if (!showSuccess) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        router.push(callbackUrl);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }
}, [status, callbackUrl, router, showSuccess]);

  const handleLoginSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => {
      router.push(callbackUrl);
    }, 2000);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      handleLoginSuccess();
    }
  };

  const handleGoogleLogin = async () => {
    signIn("google", { callbackUrl });
  };

  return (
    <div className="min-h-screen bg-white flex overflow-hidden relative pt-10">
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#1C1C1C] p-10 rounded-[2.5rem] shadow-2xl text-center max-w-sm w-full mx-4 border border-white/10"
            >
              <motion.div
                initial={{ rotate: -45, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#D4AF37]/20"
              >
                <CheckCircle2 size={40} className="text-black" />
              </motion.div>
              <h2 className="text-white text-3xl font-serif mb-2">
                Welcome to Bannira
              </h2>
              <p className="text-[#D4AF37] font-medium tracking-widest uppercase text-[10px] mb-6 px-4">
                {session?.user?.name || email.split("@")[0] || "Guest"}
              </p>
              <div className="flex justify-center gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      delay: i * 0.2,
                    }}
                    className="w-1.5 h-1.5 bg-white/30 rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Side - Image Section */}
      <div className="hidden lg:flex lg:w-[55%] relative bg-[#0D0D0D] items-center justify-center overflow-hidden">
        <motion.div
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "mirror" }}
          className="absolute inset-0 z-0"
        >
          <img
            src="/assets/cat-western.jpg"
            className="w-full h-full object-cover opacity-50 shadow-inner"
            alt="Bannira Collection"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/40 to-transparent z-10" />
        <div className="relative z-20 p-20 w-full h-full flex flex-col justify-between text-white">
          <div className="flex items-center gap-3">
            {/* <div className="w-10 h-[1px] bg-[#D4AF37]" />
            <span className="font-serif tracking-[0.4em] uppercase text-sm">
              Bannira
            </span> */}
          </div>
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-3 px-5 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full">
                <Percent size={16} className="text-[#D4AF37]" />
                <span className="text-[11px] text-[#D4AF37] font-bold tracking-[0.2em] uppercase">
                  New Arrival Sale
                </span>
              </div>
              <h2 className="text-7xl font-serif leading-[1.1]">
                Heritage <br />{" "}
                <span className="italic font-light text-[#D4AF37]">
                  Meets Modern
                </span>
              </h2>
            </motion.div>
          </div>
          <div className="flex items-center gap-8 text-[10px] tracking-[0.3em] uppercase text-stone-500 font-medium">
            <span>2026 Collection</span>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 md:p-24 bg-[#FAF9F6]">
        <div className="w-full max-w-[400px]">
          <div className="mb-5">
            <div className="w-12 h-12 bg-[#1C1C1C] rounded-full flex items-center justify-center mb-2 shadow-xl border border-white/5">
              <Crown size={20} className="text-[#D4AF37]" />
            </div>
            <h3 className="text-4xl font-serif text-[#1C1C1C] mb-3">
              Welcome Back
            </h3>
            <p className="text-stone-500 text-sm font-light">
              Sign in to your Bannira account
            </p>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full h-14 border border-stone-200 bg-white rounded-xl flex items-center justify-center gap-3 text-sm font-medium hover:bg-stone-50 hover:border-stone-300 transition-all mb-8 shadow-sm cursor-pointer hover:scale-105"
          >
            <img
              src="https://authjs.dev/img/providers/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-stone-200"></span>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest text-stone-400">
              <span className="bg-[#FAF9F6] px-4">Or use Email</span>
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="group">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-2 ml-1">
                  Email Address
                </label>
                <div className="flex items-center border-b border-stone-200 group-focus-within:border-[#7B2D0A] py-2 transition-all">
                  <Mail size={18} className="text-stone-300 mr-3" />
                  <input
                    type="email"
                    className="bg-transparent w-full outline-none font-light text-lg"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="group">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-2 ml-1">
                  Password
                </label>
                <div className="flex items-center border-b border-stone-200 group-focus-within:border-[#7B2D0A] py-2 transition-all">
                  <Lock size={18} className="text-stone-300 mr-3" />
                  <input
                    type="password"
                    className="bg-transparent w-full outline-none font-light text-lg"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[#7B2D0A] text-xs font-bold text-center uppercase tracking-tighter"
              >
                {error}
              </motion.p>
            )}

            <button
              disabled={loading}
              className="w-full h-16 bg-[#1C1C1C] text-white rounded-2xl font-bold uppercase text-[11px] tracking-[0.4em] hover:bg-[#7B2D0A] transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95 disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  Sign In <ChevronRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-stone-500 font-light">
            New to Bannira?{" "}
            <Link
              href="/register"
              className="text-black font-medium border-b border-black hover:text-[#7B2D0A] hover:border-[#7B2D0A] transition-colors"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}