"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="rounded-2xl shadow-2xl bg-white border border-border/60 overflow-hidden">
          {/* Decorative top bar */}
          <div className="h-1.5 gold-gradient" />

          <div className="p-8 sm:p-10">
            {/* Back link */}
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Back to Login
            </Link>

            {!sent ? (
              <>
                <div className="mb-8 text-center">
                  <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center mx-auto mb-4 shadow-md shadow-accent/20">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="font-heading text-3xl text-primary font-bold">
                    Forgot Password
                  </h1>
                  <p className="text-muted text-sm mt-2 max-w-xs mx-auto">
                    Enter your email and we&apos;ll send you an OTP to reset your
                    password.
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
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

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-12 text-base font-medium gold-gradient text-white hover:opacity-90 transition-all duration-300 shadow-md shadow-accent/20"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending OTP...
                      </span>
                    ) : (
                      "Send OTP"
                    )}
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center py-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="font-heading text-2xl text-primary font-bold mb-2">
                  OTP Sent!
                </h2>
                <p className="text-muted text-sm mb-2">
                  An OTP has been sent to{" "}
                  <span className="text-primary font-medium">{email}</span>
                </p>
                <p className="text-xs text-muted/70 mb-8">
                  Please check your inbox and spam folder.
                </p>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-2 text-secondary font-medium hover:text-secondary/80 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Bottom link */}
        <p className="mt-6 text-center text-sm text-muted">
          Remember your password?{" "}
          <Link
            href="/auth/login"
            className="text-secondary font-medium hover:text-secondary/80 transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
