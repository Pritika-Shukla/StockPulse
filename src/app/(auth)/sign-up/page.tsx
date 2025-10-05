"use client";

import { useState } from "react";
import { ChevronDown, Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Image from "next/image";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullName: "Adrian Hajdin",
    email: "",
    country: "Australia",
    password: "",
    investmentGoals: "Growth",
    riskTolerance: "",
    preferredIndustry: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const countries = [
    { name: "Australia", flag: "🇦🇺" },
    { name: "United States", flag: "🇺🇸" },
    { name: "United Kingdom", flag: "🇬🇧" },
    { name: "Canada", flag: "🇨🇦" },
    { name: "Germany", flag: "🇩🇪" },
    { name: "France", flag: "🇫🇷" },
    { name: "Japan", flag: "🇯🇵" },
    { name: "India", flag: "🇮🇳" },
  ];

  const investmentGoals = ["Growth", "Income", "Balanced", "Conservative"];
  const riskTolerance = ["Low", "Medium", "High", "Very High"];
  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Energy",
    "Consumer Goods",
    "Real Estate",
  ];

  return (
    <div className="auth-layout">
      {/* Left Panel - Sign Up Form */}
      <div className="auth-left-section">
        <div className="mb-4 sm:mb-6 p-2">
          <Link href="/">
            <Image
              src="/assets/images/logo.png"
              alt="logo"
              width={140}
              height={140}
            />
          </Link>
        </div>
        <form className="space-y-4 flex-1">
          {/* Email */}
          <div>
            <label className="form-label block mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter your email"
              className="form-input w-full"
            />
          </div>

          {/* Country */}
          <div>
            <label className="form-label block mb-2">Country</label>
            <DropdownMenu>
              <DropdownMenuTrigger className="country-select-trigger flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <span>
                    {countries.find((c) => c.name === formData.country)?.flag}
                  </span>
                  <span>{formData.country}</span>
                </div>
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="country-select-input w-full bg-gray-800 border-gray-600">
                {countries.map((country) => (
                  <DropdownMenuItem
                    key={country.name}
                    onClick={() => handleInputChange("country", country.name)}
                    className="country-select-item"
                  >
                    <span className="mr-2">{country.flag}</span>
                    {country.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <p className="text-xs text-gray-500 mt-1">
              Helps us show market data and news relevant to you.
            </p>
          </div>

          {/* Password */}
          <div>
            <label className="form-label block mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="Enter a strong password"
              className="form-input w-full"
            />
          </div>

          {/* Investment Goals */}
          <div>
            <label className="form-label block mb-2">Investment Goals</label>
            <DropdownMenu>
              <DropdownMenuTrigger className="select-trigger flex items-center justify-between w-full">
                <span>{formData.investmentGoals}</span>
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full bg-gray-800 border-gray-600">
                {investmentGoals.map((goal) => (
                  <DropdownMenuItem
                    key={goal}
                    onClick={() => handleInputChange("investmentGoals", goal)}
                    className="country-select-item"
                  >
                    {goal}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Risk Tolerance */}
          <div>
            <label className="form-label block mb-2">Risk Tolerance</label>
            <DropdownMenu>
              <DropdownMenuTrigger className="select-trigger flex items-center justify-between w-full">
                <span>
                  {formData.riskTolerance || "Select your risk level"}
                </span>
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full bg-gray-800 border-gray-600">
                {riskTolerance.map((risk) => (
                  <DropdownMenuItem
                    key={risk}
                    onClick={() => handleInputChange("riskTolerance", risk)}
                    className="country-select-item"
                  >
                    {risk}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Preferred Industry */}
          <div>
            <label className="form-label block mb-2">Preferred Industry</label>
            <DropdownMenu>
              <DropdownMenuTrigger className="select-trigger flex items-center justify-between w-full">
                <span>
                  {formData.preferredIndustry ||
                    "Select your preferred industry"}
                </span>
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full bg-gray-800 border-gray-600">
                {industries.map((industry) => (
                  <DropdownMenuItem
                    key={industry}
                    onClick={() =>
                      handleInputChange("preferredIndustry", industry)
                    }
                    className="country-select-item"
                  >
                    {industry}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Submit Button */}
          <Button className="yellow-btn w-full mt-6">
            Start Your Investing Journey
          </Button>

          {/* Login Link */}
          <p className="text-center text-white text-sm mt-4">
            Already have an account?{" "}
            <span className="font-semibold cursor-pointer hover:text-yellow-400">
              Log In
            </span>
          </p>
        </form>
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

export default SignUpPage;
