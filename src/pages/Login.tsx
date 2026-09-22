import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Input,
} from '@/components/ui';
import {
  ArrowRight,
  Shield,
  Lock,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import { useAuth } from '@/auth/AuthProvider';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signInWithCredentials } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const result = await signInWithCredentials(email, password);
      if (!result.success) {
        setErrorMessage(result.error || 'Invalid credentials. Please check your registered email ID and password.');
        return;
      }

      setSuccessMessage(`Authentication successful. Redirecting to your official dashboard...`);
      setTimeout(() => {
        navigate(result.targetDashboard || '/government');
      }, 500);
    } catch (err) {
      setErrorMessage('An unexpected error occurred during authentication. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between relative selection:bg-blue-800 selection:text-white">
      {/* Tricolor National Top Accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-600 shadow-sm" />

      {/* Top Header Navigation */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>Return to National Portal Home</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">भारत सरकार</span>
            <span>|</span>
            <span>Government of India</span>
          </div>
        </div>
      </header>

      {/* Main Login Body */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 py-12">
        <div className="w-full max-w-md space-y-6">
          {/* Government Portal Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-navy-900 text-white shadow-md mb-1 ring-4 ring-blue-100">
              <Building2 className="h-7 w-7 text-blue-200" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Pragati AI
            </h1>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-900">
              National Innovation Procurement Portal
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              From Government Problems to Scalable Innovation • Compliant with GFR 2017 Rule 149(viii)
            </p>
          </div>

          {/* Secure Login Card */}
          <Card className="border border-slate-200 bg-white shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900">
                    Official Stakeholder Login
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 mt-0.5">
                    Sign in to access your authorized department, startup, or committee dashboard
                  </CardDescription>
                </div>
                <div className="p-2 rounded-lg bg-blue-50 text-blue-800">
                  <Lock className="w-4 h-4" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-5 pb-6">
              {/* Error Message Alert */}
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Success Message Alert */}
              {successMessage && !errorMessage && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Secure Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  label="Registered Email ID"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. officer@gov.in or registered email"
                  required
                  className="bg-white border-slate-300 text-slate-900 focus:border-blue-700"
                />

                <Input
                  label="Password / Security Token"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="bg-white border-slate-300 text-slate-900 focus:border-blue-700"
                />

                <Button
                  type="submit"
                  variant="navy"
                  size="lg"
                  className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold shadow-md shadow-navy-900/20 py-2.5"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Verifying Official Credentials...' : 'Sign In to Portal'}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="bg-slate-50/80 border-t border-slate-100 p-4 text-center block">
              <p className="text-[11px] text-slate-500">
                Government e-Marketplace (GeM) & DPIIT Integrated Authentication
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto space-y-1">
          <p className="font-semibold text-slate-700">
            Pragati AI — National Innovation Procurement Portal
          </p>
          <p className="text-[11px] text-slate-500">
            Designed for Government Departments, DPIIT-Recognized Startups, and Independent Technical Evaluators
          </p>
          <p className="text-[10px] text-slate-400 pt-1">
            © 2026 Government of India • Ministry of Electronics & IT (MeitY) • All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
};
