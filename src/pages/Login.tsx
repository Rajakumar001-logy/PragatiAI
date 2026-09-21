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
  Badge,
} from '@/components/ui';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Briefcase,
  GraduationCap,
  ShieldAlert,
  CheckCircle2,
  Lock,
  ArrowLeft,
  AlertCircle,
  KeyRound,
  Copy,
  Check,
} from 'lucide-react';
import { useAuth, AUTHORIZED_CREDENTIALS, PrototypeCredential } from '@/auth/AuthProvider';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signInWithCredentials } = useAuth();

  const [email, setEmail] = useState('gov1123@gmail.com');
  const [password, setPassword] = useState('Ironman@1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleSelectCredential = (cred: PrototypeCredential, idx: number) => {
    setEmail(cred.email);
    setPassword(cred.password);
    setErrorMessage('');
    setSuccessMessage(`Loaded ${cred.roleLabel} credentials.`);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const result = await signInWithCredentials(email, password);
      if (!result.success) {
        setErrorMessage(result.error || 'Invalid credentials. Access denied.');
        return;
      }

      setSuccessMessage(`Authenticated as ${result.user?.name} (${result.user?.role.toUpperCase()})! Redirecting...`);
      setTimeout(() => {
        navigate(result.targetDashboard || '/government');
      }, 600);
    } catch (err) {
      setErrorMessage('An unexpected error occurred during authentication.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-navy-950 to-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d15_1px,transparent_1px),linear-gradient(to_bottom,#1f293d15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Return to Public Home */}
      <div className="absolute top-4 left-4 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Public Home</span>
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-xl space-y-6 pt-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-navy-600 to-indigo-600 text-white shadow-2xl shadow-blue-500/30 mb-2 ring-1 ring-white/20">
            <Sparkles className="h-7 w-7 text-blue-200" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Pragati AI
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Government Innovation Procurement Platform
          </p>
          <div className="pt-1 flex items-center justify-center gap-2">
            <span className="text-[11px] text-blue-300 font-semibold px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30">
              Prototype Access Controlled
            </span>
            <span className="text-[11px] text-emerald-300 font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30">
              GFR 2017 Rule 149(viii)
            </span>
          </div>
        </div>

        {/* Login Card */}
        <Card className="border-slate-800 bg-white shadow-2xl overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base sm:text-lg">Prototype Stakeholder Login</CardTitle>
                <CardDescription className="text-xs">
                  Access is strictly restricted to the 4 designated prototype stakeholder accounts.
                </CardDescription>
              </div>
              <Lock className="w-5 h-5 text-slate-400" />
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-4">
            {/* 4 Designated Prototype Credentials Card */}
            <div className="p-3.5 rounded-xl bg-slate-900 text-white border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  <span>Authorized Prototype Credentials</span>
                </span>
                <span className="text-[10px] text-slate-400">Click any card to auto-fill</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {AUTHORIZED_CREDENTIALS.map((cred, idx) => {
                  const isSelected = email.toLowerCase() === cred.email.toLowerCase();
                  return (
                    <button
                      key={cred.email}
                      type="button"
                      onClick={() => handleSelectCredential(cred, idx)}
                      className={`p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-blue-600/30 border-blue-400 ring-1 ring-blue-400 text-white'
                          : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <Badge
                          variant={
                            cred.role === 'government'
                              ? 'primary'
                              : cred.role === 'startup'
                              ? 'success'
                              : cred.role === 'expert'
                              ? 'warning'
                              : 'danger'
                          }
                          size="sm"
                        >
                          {cred.roleLabel}
                        </Badge>
                        {copiedIndex === idx ? (
                          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Selected
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500">Auto-fill</span>
                        )}
                      </div>
                      <p className="text-xs font-mono font-bold text-slate-200 truncate">{cred.email}</p>
                      <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                        Password: <span className="text-amber-300 font-semibold">{cred.password}</span>
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Alert */}
            {errorMessage && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-300 text-red-800 text-xs font-semibold flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Alert */}
            {successMessage && !errorMessage && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-3.5">
              <Input
                label="Registered Stakeholder Email ID"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. gov1123@gmail.com"
                required
              />

              <Input
                label="Stakeholder Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
              />

              <Button
                type="submit"
                variant="navy"
                className="w-full"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Authenticating with Secure Gateway...' : 'Sign In to Authorized Dashboard'}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="bg-slate-50 border-t border-slate-100 p-3.5 text-center block">
            <p className="text-[11px] text-slate-500">
              Only users with authorized prototype credentials can access the system.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
