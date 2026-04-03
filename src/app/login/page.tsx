"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Check, Crown, Percent, ChevronRight, RotateCcw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login, redirectPath, setRedirectPath, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<"input" | "otp">("input");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  
  const otpInputRef = useRef<HTMLInputElement>(null);

  // 1. ROUTE GUARD: Agar user already logged in hai toh back aane par homepage bhej do
  useEffect(() => {
    if (!isLoading && isLoggedIn && !isSuccess) {
      router.replace("/"); 
    }
  }, [isLoggedIn, isLoading, isSuccess, router]);

  // 2. SUCCESS REDIRECT: Login successful hone par
  useEffect(() => {
    if (isSuccess) {
      const t = setTimeout(() => {
        router.replace(redirectPath || "/");
        setRedirectPath(null);
      }, 2000); 
      return () => clearTimeout(t);
    }
  }, [isSuccess, router, redirectPath, setRedirectPath]);

  // 3. AUTO-FOCUS OTP
  useEffect(() => {
    if (step === "otp") {
      const focusTarget = () => otpInputRef.current?.focus();
      focusTarget();
      const t = setTimeout(focusTarget, 150); 
      return () => clearTimeout(t);
    }
  }, [step]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === "otp" && timer > 0) {
      interval = setInterval(() => setTimer((p) => p - 1), 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return setError("Enter a valid number");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
      setError("");
      setTimer(30);
      setCanResend(false);
    }, 800);
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length <= 4) {
      setOtp(val);
      if (val.length === 4) {
        setLoading(true);
        setTimeout(() => {
          if (login(phone, val)) {
            setIsSuccess(true);
          } else {
            setError("Verification failed. Try again");
            setOtp("");
            setLoading(false);
            otpInputRef.current?.focus();
          }
        }, 1200);
      }
    }
  };

  // FIX: Blank screen ki jagah loader dikhayein jab redirection ho raha ho
  if (isLoading || (isLoggedIn && !isSuccess)) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#FAF9F6] gap-4">
        <Loader2 className="animate-spin text-[#7B2D0A]" size={40} strokeWidth={1} />
        <p className="font-serif italic text-stone-400 animate-pulse">Authenticating...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      
      {/* LEFT SIDE: Immersive Sale Experience */}
      <div className="hidden lg:flex lg:w-[55%] relative bg-[#0D0D0D] items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.2 }} 
          animate={{ scale: 1 }} 
          transition={{ duration: 20, repeat: Infinity, repeatType: "mirror" }} 
          className="absolute inset-0 z-0"
        >
          <img src="/assets/cat-western.jpg" className="w-full h-full object-cover opacity-50 shadow-inner" alt="Bannira Collection" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/40 to-transparent z-10" />
        <div className="relative z-20 p-20 w-full h-full flex flex-col justify-between text-white">
          <div className="flex items-center gap-3">
             <div className="w-10 h-[1px] bg-[#D4AF37]" />
             <span className="font-serif tracking-[0.4em] uppercase text-sm">Bannira Atelier</span>
          </div>
          <div className="max-w-xl">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-6">
              <div className="inline-flex items-center gap-3 px-5 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full">
                <Percent size={16} className="text-[#D4AF37]" />
                <span className="text-[11px] text-[#D4AF37] font-bold tracking-[0.2em] uppercase">Private Sale</span>
              </div>
              <h2 className="text-7xl font-serif leading-[1.1]">Heritage <br /> <span className="italic font-light text-[#D4AF37]">Meets Modern</span></h2>
            </motion.div>
          </div>
          <div className="flex items-center gap-8 text-[10px] tracking-[0.3em] uppercase text-stone-500 font-medium">
            <span>2026 Collection</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Minimalist Login Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 md:p-24 bg-[#FAF9F6]">
        <div className="w-full max-w-[400px]">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div 
                key={step} 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }} 
                transition={{ duration: 0.4, ease: "circOut" }}
                onAnimationComplete={() => { if(step === "otp") otpInputRef.current?.focus(); }}
              >
                <div className="mb-12">
                  <div className="w-12 h-12 bg-[#1C1C1C] rounded-full flex items-center justify-center mb-6 shadow-xl">
                    <Crown size={20} className="text-[#D4AF37]" />
                  </div>
                  <h3 className="text-4xl font-serif text-[#1C1C1C] mb-3">{step === "input" ? "Sign In" : "Verify Code"}</h3>
                  <p className="text-stone-500 text-sm font-light">
                    {step === "input" ? "Access your account via mobile number." : `Enter 4-digit code sent to +91 ${phone}`}
                  </p>
                </div>

                <form onSubmit={handleSendOTP} className="space-y-10">
                  {step === "input" ? (
                    <div className="space-y-8">
                      <div className="group relative">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] block mb-4 ml-1">Mobile number</label>
                        <div className="flex items-center border-b-[1px] border-stone-200 group-focus-within:border-[#7B2D0A] transition-all py-3">
                          <span className="text-stone-400 text-xl font-light mr-4">+91</span>
                          <input type="tel" placeholder="00000 00000" className="bg-transparent w-full text-2xl outline-none font-light" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} maxLength={10} required />
                        </div>
                      </div>
                      <button disabled={loading} className="w-full h-16 bg-[#1C1C1C] text-white rounded-2xl font-bold uppercase text-[11px] tracking-[0.4em] hover:bg-[#7B2D0A] transition-all flex items-center justify-center gap-3">
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <>Continue <ChevronRight size={16} /></>}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-10">
                      <div className="relative flex justify-between gap-4 px-1 cursor-text" onClick={() => otpInputRef.current?.focus()}>
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className={`w-16 h-20 border rounded-2xl flex items-center justify-center text-3xl font-serif transition-all duration-500 ${otp.length === i ? "border-[#7B2D0A] bg-white ring-4 ring-[#7B2D0A]/5 shadow-sm" : "border-stone-200 bg-stone-50 text-stone-300"}`}>
                            {otp[i] || ""}
                            {otp.length === i && <motion.div layoutId="cursor" className="w-[1px] h-8 bg-[#7B2D0A] absolute animate-pulse" />}
                          </div>
                        ))}
                        <input ref={otpInputRef} type="tel" maxLength={4} inputMode="numeric" className="absolute inset-0 opacity-0 cursor-default" value={otp} onChange={handleOtpChange} />
                      </div>
                      {error && <p className="text-[#7B2D0A] text-[10px] text-center font-bold tracking-widest uppercase animate-shake">{error}</p>}
                      <div className="flex flex-col items-center gap-6">
                        <button type="button" disabled={!canResend} onClick={() => { setTimer(30); setCanResend(false); setOtp(""); }} className={`text-[11px] font-bold tracking-[0.2em] uppercase transition-all ${canResend ? "text-black hover:text-[#7B2D0A]" : "text-stone-300 cursor-not-allowed"}`}>
                          <RotateCcw size={14} className="inline mr-2" /> {canResend ? "Resend OTP" : `Resend in ${timer}s`}
                        </button>
                        <button type="button" onClick={() => { setStep("input"); setOtp(""); setError(""); }} className="text-[10px] text-stone-400 hover:text-black font-bold uppercase tracking-widest transition-all">← Change Number</button>
                      </div>
                    </div>
                  )}
                </form>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-10">
                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-10 border border-green-100"><Check size={40} /></div>
                <h2 className="text-4xl font-serif text-[#1C1C1C] mb-4">Welcome Back</h2>
                <p className="text-stone-400 text-sm font-light italic">"Redirecting..."</p>
                <div className="mt-12 h-[2px] w-12 bg-[#D4AF37] mx-auto overflow-hidden">
                   <motion.div initial={{ x: -50 }} animate={{ x: 50 }} transition={{ duration: 1.5, repeat: Infinity }} className="w-full h-full bg-black" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}