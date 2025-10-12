'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
const SignInPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const router = useRouter();

const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement authentication logic
    alert('Authentication not implemented yet');
  };

  return (
    <div className="minimal-auth-layout">
      <div className="minimal-auth-container">
        {/* Logo */}
        <div className="minimal-logo">
          <Link href="/">
            <Image
              src="/assets/images/logo.png"
              alt="logo"
              width={80}
              height={80}
            />
          </Link>
        </div>

        {/* Form */}
        <div className="minimal-form-container">
          <h1 className="minimal-title">Welcome back</h1>
          <p className="minimal-subtitle">Sign in to your account</p>
          
          <form onSubmit={handleSubmit} className="minimal-form">
            <div className="minimal-input-group">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Email"
                className="minimal-input"
                required
              />
            </div>

            <div className="minimal-input-group">
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Password"
                className="minimal-input"
                required
              />
            </div>

            <Button type="submit" className="minimal-btn">
              Sign In
            </Button>
          </form>

          <p className="minimal-link">
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" className="minimal-link-accent">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
