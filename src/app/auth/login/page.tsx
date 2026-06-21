"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Gem,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Chrome,
  Store,
  User,
  Zap,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, googleLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [useOtp, setUseOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Please enter your email");
      return;
    }
    if (!useOtp && !password) {
      setError("Please enter your password");
      return;
    }
    if (useOtp && !otp) {
      setError("Please enter the OTP");
      return;
    }
    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) router.push("/");
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      router.push("/");
    } catch {
      setError("Google login failed. Please try again.");
    }
  };

  const handleDemoLogin = async (role: "customer" | "seller") => {
    setLoading(true);
    setError("");
    try {
      const demoEmail = role === "seller" ? "ajjram@admin.com" : "customer@demo.com";
      await login(demoEmail, "demo123");
      router.push(role === "seller" ? "/seller" : "/");
    } catch {
      setError("Demo login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = () => {
    if (!email) {
      setError("Please enter your email first");
      return;
    }
    setOtpSent(true);
    setError("");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-2xl bg-white border border-border/60">
        {/* Left — Brand Panel */}
        <div className="hidden lg:flex lg:w-5/12 relative brass-gradient flex-col items-center justify-center p-10 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div
              className="w-full h-full"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 25% 25%, #C9A86A 1px, transparent 1px), radial-gradient(circle at 75% 75%, #C9A86A 1px, transparent 1px)",
                backgroundSize: "60px 60px",
              }}
            />
          </div>
          <div className="absolute top-8 left-8 w-16 h-16 rounded-full border border-accent/20 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-accent/10" />
          </div>
          <div className="absolute bottom-12 right-12 w-24 h-24 rounded-full border border-accent/10" />
          <div className="absolute top-1/3 right-8 w-px h-32 bg-gradient-to-b from-accent/0 via-accent/30 to-accent/0" />

          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-full gold-gradient flex items-center justify-center shadow-lg shadow-accent/20">
              <Gem className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-heading text-4xl text-white font-bold tracking-wide">
              Ajjram Brass
            </h1>
            <p className="text-accent/80 text-sm max-w-xs leading-relaxed">
              Timeless elegance crafted in brass — heritage meets modern luxury.
            </p>
            <div className="flex gap-2 mt-4">
              <span className="w-2 h-2 rounded-full bg-accent/60" />
              <span className="w-8 h-2 rounded-full bg-accent" />
              <span className="w-2 h-2 rounded-full bg-accent/60" />
            </div>
          </div>
        </div>

        {/* Right — Form Panel */}
        <div className="w-full lg:w-7/12 p-8 sm:p-10 lg:p-12 bg-white">
          <div className="max-w-md mx-auto">
            {/* Mobile brand mark */}
            <div className="flex lg:hidden items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center">
                <Gem className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading text-xl font-bold text-primary">
                Ajjram Brass
              </span>
            </div>

            <div className="mb-8">
              <h2 className="font-heading text-3xl text-primary font-bold">
                Welcome Back
              </h2>
              <p className="text-muted text-sm mt-1">
                Sign in to your account to continue
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2 animate-in fade-in">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-text">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 bg-background/50 border-border focus:bg-white"
                  />
                </div>
              </div>

              {!useOtp ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-text">
                      Password
                    </Label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-xs text-secondary hover:text-secondary/80 transition-colors"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-12 bg-background/50 border-border focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="otp" className="text-text">
                      OTP
                    </Label>
                    {otpSent ? (
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        OTP sent
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-xs text-secondary hover:text-secondary/80 transition-colors"
                      >
                        Send OTP
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="pl-10 h-12 bg-background/50 border-border focus:bg-white tracking-[0.3em] text-center font-mono"
                      maxLength={6}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded border-border accent-primary"
                  />
                  <span className="text-sm text-muted group-hover:text-text transition-colors">
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setUseOtp(!useOtp);
                    setOtp("");
                    setOtpSent(false);
                    setError("");
                  }}
                  className="text-xs text-secondary hover:text-secondary/80 transition-colors"
                >
                  {useOtp ? "Login with Password" : "Login with OTP"}
                </button>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full h-12 text-base font-medium gold-gradient text-white hover:opacity-90 transition-all duration-300 shadow-md shadow-accent/20"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : useOtp ? (
                  "Verify OTP"
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-muted">OR</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full h-12 text-base border-border bg-background/50 hover:bg-background text-text"
              onClick={handleGoogleLogin}
            >
              <Chrome className="w-5 h-5 mr-2" />
              Continue with Google
            </Button>

            {/* Demo Quick Access */}
            <div className="mt-8 pt-6 border-t border-border/60">
              <p className="text-xs text-muted text-center mb-3 uppercase tracking-wider font-medium">
                Quick Demo Access
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleDemoLogin("customer")}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all text-sm font-medium text-primary"
                >
                  <User className="h-4 w-4" />
                  Login as Customer
                </button>
                <button
                  onClick={() => handleDemoLogin("seller")}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-accent/30 bg-accent/5 hover:bg-accent/10 hover:border-accent/50 transition-all text-sm font-medium text-accent"
                >
                  <Store className="h-4 w-4" />
                  Login as Seller
                </button>
              </div>
              <p className="text-[10px] text-muted/60 text-center mt-2">
                One-click access — no password needed. Seller lands on dashboard.
              </p>
            </div>

            <p className="mt-6 text-center text-sm text-muted">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-secondary font-medium hover:text-secondary/80 transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
