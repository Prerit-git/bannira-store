"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Crown, ChevronRight, Mail, Lock, User, AlertCircle, CheckCircle2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      setIsSuccess(true);
      setTimeout(async () => {
        await signIn("credentials", { email, password, callbackUrl: "/" });
      }, 1500);

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-white flex overflow-hidden selection:bg-[#7B2D0A] selection:text-white pt-10">
      {/* LEFT SECTION - Fixed Height */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-[#0D0D0D] items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="/assets/cat-western.jpg"
            className="w-full h-full object-cover opacity-40 transition-transform duration-[20s] scale-110 hover:scale-100"
            alt="Bannira Regal Collection"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
        </div>
        
        <div className="relative z-20 p-12 w-full h-full flex flex-col justify-between">
          <Link href="/" className="inline-block group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-[1px] bg-[#D4AF37] group-hover:w-12 transition-all" />
              <span className="font-serif tracking-[0.4em] uppercase text-[10px] text-white">Bannira</span>
            </div>
          </Link>
          
          <div className="max-w-md">
            <h2 className="text-6xl font-serif text-white leading-tight mb-4">
              Join The <br />
              <span className="italic font-light text-[#D4AF37]">Inner Circle</span>
            </h2>
            <p className="text-stone-400 text-xs font-light tracking-wide leading-relaxed">
              Experience the fusion of heritage and high-fashion.
            </p>
          </div>

        </div>
      </div>

      {/* RIGHT SECTION - Scroll-free Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 md:p-12 bg-[#FAF9F6] relative">
        <div className="w-full max-w-[540px]">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="register-content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Header Section - Compact */}
                <div className="flex items-center justify-between items-end mb-5">
                  <div className="space-y-1">
                    <div className="w-8 h-8 bg-[#1C1C1C] rounded-full flex items-center justify-center mb-2">
                      <Crown size={14} className="text-[#D4AF37]" />
                    </div>
                    <h3 className="text-3xl font-serif text-[#1C1C1C]">Create Account</h3>
                    <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest">Sign up with your credentials</p>
                  </div>
                  <Link href="/login" className=" flex flex-col md:flex-row gap-1 items-center">
                    <span className="text-stone-600 font-normal text-[9px]">Already a member? </span>
                    <span className="text-[12px] font-black uppercase tracking-widest text-[#7B2D0A] border-b border-[#7B2D0A] pb-1">Sign in</span>
                  </Link>
                </div>

                <button
                  onClick={() => signIn("google", { callbackUrl: "/" })}
                  className="w-auto h-12 border border-stone-200 bg-white rounded-full flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:shadow-md transition-all px-4 mx-auto"
                >
                  <img src="https://authjs.dev/img/providers/google.svg" alt="Google" className="w-4 h-4" />
                  Continue with Google
                </button>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-stone-100"></div>
                  <span className="flex-shrink mx-4 text-[8px] font-black uppercase tracking-[0.3em] text-stone-300">Or use email</span>
                  <div className="flex-grow border-t border-stone-100"></div>
                </div>

                <form onSubmit={handleRegister} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="group relative">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-transparent border-b border-stone-200 py-3 outline-none focus:border-[#7B2D0A] transition-colors peer text-sm"
                        placeholder=" "
                        required
                      />
                      <label className="absolute left-0 top-3 text-stone-400 text-[9px] uppercase font-bold tracking-widest transition-all peer-focus:-top-4 peer-focus:text-[#7B2D0A] peer-[:not(:placeholder-shown)]:-top-4">
                        Full Name
                      </label>
                      <User size={14} className="absolute right-0 top-3 text-stone-200 group-focus-within:text-[#7B2D0A]" />
                    </div>

                    <div className="group relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-transparent border-b border-stone-200 py-3 outline-none focus:border-[#7B2D0A] transition-colors peer text-sm"
                        placeholder=" "
                        required
                      />
                      <label className="absolute left-0 top-3 text-stone-400 text-[9px] uppercase font-bold tracking-widest transition-all peer-focus:-top-4 peer-focus:text-[#7B2D0A] peer-[:not(:placeholder-shown)]:-top-4">
                        Email Address
                      </label>
                      <Mail size={14} className="absolute right-0 top-3 text-stone-200 group-focus-within:text-[#7B2D0A]" />
                    </div>

                    <div className="group relative">
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-transparent border-b border-stone-200 py-3 outline-none focus:border-[#7B2D0A] transition-colors peer text-sm"
                        placeholder=" "
                        required
                        minLength={8}
                      />
                      <label className="absolute left-0 top-3 text-stone-400 text-[9px] uppercase font-bold tracking-widest transition-all peer-focus:-top-4 peer-focus:text-[#7B2D0A] peer-[:not(:placeholder-shown)]:-top-4">
                        Password
                      </label>
                      <Lock size={14} className="absolute right-0 top-3 text-stone-200 group-focus-within:text-[#7B2D0A]" />
                    </div>

                    <div className="group relative">
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-transparent border-b border-stone-200 py-3 outline-none focus:border-[#7B2D0A] transition-colors peer text-sm"
                        placeholder=" "
                        required
                      />
                      <label className="absolute left-0 top-3 text-stone-400 text-[9px] uppercase font-bold tracking-widest transition-all peer-focus:-top-4 peer-focus:text-[#7B2D0A] peer-[:not(:placeholder-shown)]:-top-4">
                        Confirm Password
                      </label>
                      <Lock size={14} className="absolute right-0 top-3 text-stone-200 group-focus-within:text-[#7B2D0A]" />
                    </div>
                  </div>

                  {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-[#7B2D0A] text-[9px] font-black uppercase tracking-widest justify-center">
                      <AlertCircle size={12} /> {error}
                    </motion.div>
                  )}

                  <button
                    disabled={loading}
                    className="w-full h-14 bg-[#1C1C1C] text-white rounded-full font-black uppercase text-[10px] tracking-[0.3em] hover:bg-[#7B2D0A] transition-all flex items-center justify-center gap-4 shadow-xl active:scale-95 disabled:opacity-70 mt-2"
                  >
                    {loading ? <Loader2 className="animate-spin" size={16} /> : <>Create Account <ChevronRight size={14} /></>}
                  </button>
                </form>
              </motion.div>
            ) : (
              // SUCCESS ANIMATION (Same Height)
              <motion.div key="success-content" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-green-100">
                  <CheckCircle2 size={32} />
                </div>
                <h2 className="text-4xl font-serif text-[#1C1C1C] mb-2">Welcome to Bannira</h2>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}