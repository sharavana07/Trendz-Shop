"use client";

import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Mail, LogOut, Chrome, Loader2, AlertCircle, CheckCircle } from "lucide-react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError("");
      await signIn("google");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="border-b border-blue-500/20 bg-slate-900/50 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <h1 className="text-lg font-bold text-white">Trendz-Shop</h1>
              </div>
              <nav className="flex items-center gap-6">
                <a href="#" className="text-slate-300 hover:text-white transition text-sm">Docs</a>
                <a href="#" className="text-slate-300 hover:text-white transition text-sm">Support</a>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            {/* Card Container */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-blue-500/20 rounded-2xl shadow-2xl overflow-hidden">
              {/* Card Header */}
              <div className="px-8 pt-8 pb-6 text-center border-b border-blue-500/10">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl mb-4 mx-auto">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-slate-400 text-sm">Sign in to your account to continue</p>
              </div>

              {/* Card Body */}
              <div className="px-8 py-8">
                {status === "loading" ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 text-blue-400 animate-spin mb-3" />
                    <p className="text-slate-300 text-sm">Checking session...</p>
                  </div>
                ) : session ? (
                  <div className="space-y-6">
                    {/* Session Info */}
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-400 mb-1">Logged in</p>
                        <p className="text-sm text-slate-300 break-all">{session.user?.email}</p>
                      </div>
                    </div>

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-medium rounded-lg transition duration-200 shadow-lg hover:shadow-red-500/50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Logging out...
                        </>
                      ) : (
                        <>
                          <LogOut className="w-4 h-4" />
                          Logout
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Login Button */}
                    <button
                      onClick={handleGoogleLogin}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-medium rounded-lg transition duration-200 shadow-lg hover:shadow-blue-500/50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        <>
                          <Chrome className="w-4 h-4" />
                          Sign in with Google
                        </>
                      )}
                    </button>

                    {/* Divider */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-600"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-slate-800 text-slate-400">or continue with</span>
                      </div>
                    </div>

                    {/* Social Placeholders */}
                    <div className="grid grid-cols-2 gap-3">
                      <button className="px-3 py-2 border border-slate-600 hover:border-slate-500 rounded-lg text-slate-300 hover:text-white text-sm font-medium transition">
                        GitHub
                      </button>
                      <button className="px-3 py-2 border border-slate-600 hover:border-slate-500 rounded-lg text-slate-300 hover:text-white text-sm font-medium transition">
                        Microsoft
                      </button>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mt-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="px-8 py-4 border-t border-blue-500/10 bg-slate-900/30">
                <p className="text-xs text-slate-400 text-center">
                  By signing in, you agree to our <a href="#" className="text-blue-400 hover:text-blue-300 transition">Terms</a> and <a href="#" className="text-blue-400 hover:text-blue-300 transition">Privacy Policy</a>
                </p>
              </div>
            </div>

            {/* Footer Text */}
            <p className="text-center text-slate-400 text-sm mt-6">
              Don&apos;t have an account? <a href="#" className="text-blue-400 hover:text-blue-300 transition font-medium">Contact support</a>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}