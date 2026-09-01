import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Wallet,
  Lock,
  Mail,
  User,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  ExternalLink,
  RefreshCw,
  ArrowLeft,
  Inbox
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { login, register, resendConfirmation, loginAsDemo } = useAuth();
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Email confirmation state
  const [isRegisteredSuccess, setIsRegisteredSuccess] = useState<boolean>(false);
  const [registeredEmail, setRegisteredEmail] = useState<string>('');
  const [isResending, setIsResending] = useState<boolean>(false);
  const [resendStatus, setResendStatus] = useState<string>('');
  const [resendCooldown, setResendCooldown] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Email wajib diisi.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      if (isRegister) {
        const res = await register(email, password, name);
        if (res?.error) {
          setError(res.error);
        } else {
          setRegisteredEmail(email);
          setIsRegisteredSuccess(true);
          setResendStatus('');
        }
      } else {
        const res = await login(email, password);
        if (res?.error) setError(res.error);
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan autentikasi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenGmail = () => {
    window.open('https://mail.google.com/', '_blank', 'noopener,noreferrer');
  };

  const getEmailProviderLink = (emailAddr: string) => {
    const domain = emailAddr.split('@')[1]?.toLowerCase() || '';
    if (domain.includes('yahoo')) {
      return { name: 'Yahoo Mail', url: 'https://mail.yahoo.com/' };
    }
    if (domain.includes('outlook') || domain.includes('hotmail') || domain.includes('live')) {
      return { name: 'Outlook / Hotmail', url: 'https://outlook.live.com/mail/' };
    }
    if (domain.includes('icloud')) {
      return { name: 'iCloud Mail', url: 'https://www.icloud.com/mail' };
    }
    return null;
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    setResendStatus('');
    try {
      const res = await resendConfirmation(registeredEmail);
      if (res?.error) {
        setResendStatus(`Gagal: ${res.error}`);
      } else {
        setResendStatus('Email verifikasi baru berhasil dikirim!');
        setResendCooldown(30);
        const timer = setInterval(() => {
          setResendCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (err: any) {
      setResendStatus(err.message || 'Gagal mengirim ulang email.');
    } finally {
      setIsResending(false);
    }
  };

  const emailProvider = getEmailProviderLink(registeredEmail);

  return (
    <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10 animate-fade-in">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-glow-emerald mb-2">
            <Wallet className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Money<span className="text-emerald-400">Tracker</span>
          </h1>
          <p className="text-sm text-slate-400 max-w-xs mx-auto">
            Track your money without making money tracking complicated.
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-3xl glass-modal p-7 border border-slate-800 shadow-2xl space-y-6">
          {isRegisteredSuccess ? (
            /* Registration Success & Confirm Email Screen */
            <div className="space-y-5 animate-scale-in text-center">
              {/* Success Badge Icon */}
              <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-glow-emerald">
                <Mail className="w-8 h-8" />
                <div className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-md">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>

              {/* Title & Info */}
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Verifikasi Email Terkirim!
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Kami telah mengirimkan tautan konfirmasi pendaftaran ke:
                </p>
                <div className="inline-block px-3 py-1.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-semibold max-w-full truncate">
                  {registeredEmail}
                </div>
                <p className="text-xs text-slate-400 pt-1">
                  Silakan buka email Anda dan klik tombol atau tautan konfirmasi untuk mengaktifkan akun.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                {/* DIRECT TO GMAIL BUTTON */}
                <button
                  type="button"
                  onClick={handleOpenGmail}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-emerald-600 hover:from-red-500 hover:to-emerald-500 text-white font-bold text-sm shadow-lg shadow-red-950/40 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2.5 group"
                >
                  {/* Gmail Colored Icon */}
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path fill="#EA4335" d="M12 13.5L2 6.5V18a2 2 0 002 2h16a2 2 0 002-2V6.5L12 13.5z" />
                    <path fill="#4285F4" d="M22 6.5L12 13.5 2 6.5V6a2 2 0 012-2h16a2 2 0 012 2v.5z" />
                  </svg>
                  <span>Buka Gmail Langsung</span>
                  <ExternalLink className="w-4 h-4 ml-auto opacity-80 group-hover:opacity-100 transition-opacity" />
                </button>

                {/* Optional Alternative Provider Button */}
                {emailProvider && (
                  <a
                    href={emailProvider.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center justify-center gap-2 transition-all"
                  >
                    <Inbox className="w-4 h-4 text-slate-400" />
                    <span>Buka {emailProvider.name}</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-auto text-slate-400" />
                  </a>
                )}

                {/* Resend Status / Feedback */}
                {resendStatus && (
                  <p className={`text-xs p-2.5 rounded-xl border ${resendStatus.startsWith('Gagal')
                    ? 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300 font-medium'
                    }`}>
                    {resendStatus}
                  </p>
                )}

                {/* Resend Button */}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending || resendCooldown > 0}
                  className="w-full py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-xs border border-slate-800 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${isResending ? 'animate-spin' : ''}`} />
                  <span>
                    {isResending
                      ? 'Mengirim ulang...'
                      : resendCooldown > 0
                        ? `Kirim Ulang (${resendCooldown}s)`
                        : 'Belum terima email? Kirim Ulang'}
                  </span>
                </button>
              </div>

              {/* Return to Sign In */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisteredSuccess(false);
                    setIsRegister(false);
                    setError('');
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-emerald-400 font-semibold text-xs border border-emerald-500/30 flex items-center justify-center gap-2 transition-all"
                >
                  <span>Sudah Konfirmasi? Masuk ke Akun</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisteredSuccess(false);
                    setError('');
                  }}
                  className="text-xs text-slate-400 hover:text-slate-200 transition-colors inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Gunakan email lain</span>
                </button>
              </div>
            </div>
          ) : (
            /* Normal Login / Register Form */
            <>
              {/* Tab Switcher */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900/90 rounded-2xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(false);
                    setError('');
                  }}
                  className={`py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${!isRegister
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                    }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(true);
                    setError('');
                  }}
                  className={`py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${isRegister
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                    }`}
                >
                  Register
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {isRegister && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dfaalt"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/60 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-600"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/60 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-3.5 pr-11 py-2.5 bg-slate-900/90 border border-slate-700/60 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-600"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors focus:outline-none"
                      title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-slate-300" />
                      ) : (
                        <Eye className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl font-medium">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/50 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <span>{isLoading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Quick Demo Login Option */}
              <div className="pt-2 border-t border-slate-800 space-y-3 text-center">
                <p className="text-xs text-slate-400">Ingin langsung mencoba fitur aplikasi?</p>
                <button
                  type="button"
                  onClick={loginAsDemo}
                  className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-emerald-400 font-semibold text-xs border border-emerald-500/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                >
                  <span>Explore as Demo User (Instant)</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-slate-400">
          <div className="flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Fast CRUD</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Live Budget</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Visual Charts</span>
          </div>
        </div>
      </div>
    </div>
  );
};
