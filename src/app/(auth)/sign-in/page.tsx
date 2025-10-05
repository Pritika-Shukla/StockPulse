'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Star } from 'lucide-react';

const SignInPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="auth-layout">
  
      <div className="auth-left-section">
        <div className="mb-4 sm:mb-6 pt-18">
        <Image
          src="/assets/images/logo.png"
          alt="logo"
            width={140}
            height={140}
          />
        </div>

        <div className="flex-1 flex items-center">
          <form className="space-y-6 w-full max-w-md">
          <h1 className="form-title">Welcome Back</h1>
          {/* Email */}
          <div>
            <label className="form-label block mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email"
              className="form-input w-full"
            />
          </div>

          {/* Password */}
          <div>
            <label className="form-label block mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Enter your password"
              className="form-input w-full"
            />
          </div>

          {/* Submit Button */}
          <Button className="yellow-btn w-full">
            Sign In
          </Button>

          {/* Sign Up Link */}
          <p className="text-center text-white">
            Don&apos;t have an account? <span className="font-semibold cursor-pointer hover:text-yellow-400">Sign Up</span>
          </p>
          </form>
        </div>
      </div>

      {/* Right Panel - Dashboard Preview */}
      <div className="auth-right-section">
        {/* Testimonial */}
        <div className="mb-8">
          <blockquote className="auth-blockquote">
            &ldquo;Signalist turned my watchlist into a winning list. The alerts
            are spot-on, and I feel more confident making moves in the
            market.&rdquo;
          </blockquote>
          <div className="flex items-center gap-4">
            <cite className="auth-testimonial-author not-italic">
              — Ethan R.
            </cite>
            <span className="text-sm text-gray-500">Retail Investor</span>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < 4 ? "fill-white text-white" : "text-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="flex-1 bg-gray-800 rounded-xl p-6 space-y-6">
          <Image
            src="/assets/images/dashboard.png"
            alt="dashboard"
            width={1000}
            height={1000}
          />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
