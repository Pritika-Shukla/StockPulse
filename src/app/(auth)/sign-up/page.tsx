"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from 'next/navigation';
const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
      
    password: "",
    confirmPassword: "",
    
  });

  const router = useRouter();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    
    // TODO: Implement user registration logic
    alert('User registration not implemented yet');
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
    <div className="minimal-auth-layout">
      <div className="minimal-auth-container">
    

        {/* Form */}
        <div className="minimal-form-container">
          <h1 className="minimal-title">Create account</h1>
          <p className="minimal-subtitle">Get started with your investing journey</p>
          
          <form onSubmit={handleSubmit} className="minimal-form">
            {/* Full Name */}
            <div className="minimal-input-group">
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="Full Name"
                className="minimal-input"
                required
              />
            </div>

            {/* Email */}
            <div className="minimal-input-group">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Email"
                className="minimal-input"
                required
              />
            </div>

            {/* Country */}
            <div className="minimal-input-group">
              <DropdownMenu>
                <DropdownMenuTrigger className="minimal-select">
                  <div className="flex items-center gap-2">
                    <span>
                      {countries.find((c) => c.name === formData.country)?.flag}
                    </span>
                    <span>{formData.country}</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="minimal-dropdown">
                  {countries.map((country) => (
                    <DropdownMenuItem
                      key={country.name}
                      onClick={() => handleInputChange("country", country.name)}
                      className="minimal-dropdown-item"
                    >
                      <span className="mr-2">{country.flag}</span>
                      {country.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Password */}
            <div className="minimal-input-group">
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Password"
                className="minimal-input"
                required
                minLength={6}
              />
            </div>

            {/* Confirm Password */}
            <div className="minimal-input-group">
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                placeholder="Confirm Password"
                className="minimal-input"
                required
              />
            </div>

            {/* Investment Goals */}
            <div className="minimal-input-group">
              <DropdownMenu>
                <DropdownMenuTrigger className="minimal-select">
                  <span>{formData.investmentGoals}</span>
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="minimal-dropdown">
                  {investmentGoals.map((goal) => (
                    <DropdownMenuItem
                      key={goal}
                      onClick={() => handleInputChange("investmentGoals", goal)}
                      className="minimal-dropdown-item"
                    >
                      {goal}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Risk Tolerance */}
            <div className="minimal-input-group">
              <DropdownMenu>
                <DropdownMenuTrigger className="minimal-select">
                  <span>
                    {formData.riskTolerance || "Select risk tolerance"}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="minimal-dropdown">
                  {riskTolerance.map((risk) => (
                    <DropdownMenuItem
                      key={risk}
                      onClick={() => handleInputChange("riskTolerance", risk)}
                      className="minimal-dropdown-item"
                    >
                      {risk}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Preferred Industry */}
            <div className="minimal-input-group">
              <DropdownMenu>
                <DropdownMenuTrigger className="minimal-select">
                  <span>
                    {formData.preferredIndustry || "Select preferred industry"}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="minimal-dropdown">
                  {industries.map((industry) => (
                    <DropdownMenuItem
                      key={industry}
                      onClick={() => handleInputChange("preferredIndustry", industry)}
                      className="minimal-dropdown-item"
                    >
                      {industry}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Button type="submit" className="minimal-btn">
              Create Account
            </Button>
          </form>

          <p className="minimal-link">
            Already have an account?{' '}
            <Link href="/sign-in" className="minimal-link-accent">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
