"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function FoodieLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", { email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-pink-600 to-pink-500 flex flex-col items-center justify-center px-4 py-8">
      {/* Logo and Tagline */}
      <div className="text-center mb-8 space-y-4">
        <div className="flex flex-col items-center space-y-2">
          {/* Chef Hat Icon */}
          <div className="w-16 h-16 relative">
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              {/* Chef Hat */}
              <path
                d="M50 20C55 20 60 22 63 26C68 22 75 22 80 26C85 30 85 38 82 44H18C15 38 15 30 20 26C25 22 32 22 37 26C40 22 45 20 50 20Z"
                fill="white"
              />
              <path
                d="M20 44H80V55C80 58 77 60 75 60H25C22 60 20 58 20 55V44Z"
                fill="white"
              />
              {/* Heart with fork and spoon */}
              <path
                d="M50 65C55 65 60 70 60 75C60 82 50 90 50 90C50 90 40 82 40 75C40 70 45 65 50 65Z"
                fill="white"
                stroke="white"
                strokeWidth="2"
              />
              <line x1="48" y1="72" x2="48" y2="80" stroke="pink" strokeWidth="1.5" />
              <line x1="48" y1="72" x2="46" y2="74" stroke="pink" strokeWidth="1.5" />
              <line x1="48" y1="72" x2="50" y2="74" stroke="pink" strokeWidth="1.5" />
              <circle cx="52" cy="76" r="1.5" fill="pink" />
              <line x1="52" y1="77" x2="52" y2="80" stroke="pink" strokeWidth="1.5" />
            </svg>
          </div>

          {/* FOODIE Text */}
          <div className="text-white font-bold text-4xl tracking-wider flex items-center gap-1">
            <span>F</span>
            <span className="inline-flex items-center justify-center w-8 h-8 bg-white rounded-full">
              <span className="text-pink-500 text-2xl">😊</span>
            </span>
            <span className="inline-flex items-center justify-center w-8 h-8 bg-white rounded-full">
              <span className="text-pink-500 text-2xl">😊</span>
            </span>
            <span>DIE</span>
          </div>
        </div>

        <h1 className="text-white text-2xl font-medium">
          Your Favourite Food
        </h1>
      </div>

      {/* Login Form Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-900">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="w-full pl-12 pr-4 py-4 bg-gray-100 border-none rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-12 pr-12 py-4 bg-gray-100 border-none rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-gray-600" />
              ) : (
                <Eye className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>

          {/* Forget Password Link */}
          <div className="text-right">
            <button
              type="button"
              className="text-gray-600 text-sm hover:text-gray-900 transition-colors"
            >
              Forget Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 rounded-xl transition-colors duration-200 shadow-lg"
          >
            Login
          </button>

          {/* Divider */}
          <div className="text-center text-gray-500 text-sm">Or</div>

          {/* Social Login Buttons */}
          <div className="flex justify-center gap-4">
            <button
              type="button"
              className="w-12 h-12 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:border-pink-500 transition-colors"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </button>
            <button
              type="button"
              className="w-12 h-12 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:border-pink-500 transition-colors"
            >
              <svg className="w-6 h-6" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* Register Link */}
      <div className="mt-6 text-center">
        <p className="text-gray-900 text-base">
          Don't have an account?{" "}
          <button className="text-pink-600 font-bold hover:text-pink-700 transition-colors">
            REGISTER
          </button>
        </p>
      </div>

      {/* Back to Home Link */}
      <div className="mt-4">
        <Link
          href="/"
          className="text-white text-sm hover:underline inline-flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
