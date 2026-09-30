import React, { useState } from 'react';
import { TargetClass, StudyGroup, UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const AuthScreen: React.FC = () => {
  const { loginStudent, loginAdmin, registerStudent } = useAuth();

  const [role, setRole] = useState<UserRole>('student');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('student@bise-sindh.edu.pk');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Admin form state
  const [adminEmail, setAdminEmail] = useState('admin@school.bise.edu.pk');
  const [adminKeyphrase, setAdminKeyphrase] = useState('admin_secret_key');
  const [showAdminPass, setShowAdminPass] = useState(false);

  // Register form state
  const [regFullName, setRegFullName] = useState('Khansa Tariq');
  const [regEmail, setRegEmail] = useState('khansa@email.com');
  const [regPassword, setRegPassword] = useState('pass123456');
  const [regConfirmPassword, setRegConfirmPassword] = useState('pass123456');
  const [regClass, setRegClass] = useState<TargetClass>('9th');
  const [regGroup, setRegGroup] = useState<StudyGroup>('biology');
  const [agreeGuidelines, setAgreeGuidelines] = useState(true);

  // Error & loading states
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!loginEmail || !loginPassword) {
      setErrorMessage('Please fill in both student email and password.');
      return;
    }
    setIsSubmitting(true);
    try {
      await loginStudent(loginEmail, loginPassword);
    } catch {
      setErrorMessage('Login failed. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!adminEmail || !adminKeyphrase) {
      setErrorMessage('Please enter both administrative identifier and security keyphrase.');
      return;
    }
    setIsSubmitting(true);
    try {
      await loginAdmin(adminEmail, adminKeyphrase);
    } catch {
      setErrorMessage('Institutional authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!regFullName.trim()) {
      setErrorMessage('Please enter your full name as registered with BISE.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (regPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Password and Confirm Password do not match.');
      return;
    }
    if (!agreeGuidelines) {
      setErrorMessage('You must agree to the academic integrity guidelines to continue.');
      return;
    }

    setIsSubmitting(true);
    try {
      await registerStudent({
        fullName: regFullName.trim(),
        email: regEmail.trim(),
        targetClass: regClass,
        studyGroup: regGroup,
      });
    } catch {
      setErrorMessage('Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col justify-between antialiased">
      {/* Brand Header */}
      <header className="w-full pt-8 flex flex-col items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#2563eb] text-white flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-[19px]">school</span>
          </div>
          <span className="font-bold text-lg text-[#0b1c30] tracking-tight">StudyMate AI</span>
        </div>
      </header>

      {/* Main Form Center Box */}
      <main className="w-full max-w-xl mx-auto px-4 flex-1 flex flex-col justify-center py-8">
        <div className="w-full max-w-[500px] mx-auto bg-white rounded-xl shadow-xs border border-[#c3c6d7]/30 p-6 sm:p-8 flex flex-col gap-6">
          {/* ================= REGISTER VIEW ================= */}
          {authMode === 'register' ? (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setErrorMessage('');
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#565e74] hover:text-[#004ac6] transition-colors w-fit"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  <span>Back to Login</span>
                </button>
                <div className="mt-1 flex flex-col gap-1">
                  <h1 className="text-2xl font-bold text-[#0b1c30] tracking-tight">
                    Create your StudyMate AI account
                  </h1>
                  <p className="text-xs sm:text-sm text-[#565e74]">
                    Set up your student profile to access curriculum-aligned textbooks and exam
                    practice.
                  </p>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-[#ffdad6] border border-[#ba1a1a]/30 rounded-lg text-xs text-[#93000a] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleRegister} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#0b1c30]">Full Name</label>
                    <input
                      type="text"
                      required
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="e.g. Khansa Tariq"
                      className="h-10 px-3 bg-white text-[#0b1c30] text-sm rounded-lg border border-[#c3c6d7] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 outline-none transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#0b1c30]">Email Address</label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="e.g. khansa@email.com"
                      className="h-10 px-3 bg-white text-[#0b1c30] text-sm rounded-lg border border-[#c3c6d7] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#0b1c30]">Password</label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="h-10 px-3 bg-white text-[#0b1c30] text-sm rounded-lg border border-[#c3c6d7] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 outline-none transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#0b1c30]">Confirm Password</label>
                    <input
                      type="password"
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="h-10 px-3 bg-white text-[#0b1c30] text-sm rounded-lg border border-[#c3c6d7] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 outline-none transition"
                    />
                  </div>
                </div>

                {/* Target Class Selection */}
                <div className="flex flex-col gap-1 pt-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-semibold text-[#0b1c30]">Target Class (BISE Sindh)</span>
                    <span className="text-[11px] text-[#565e74]">Determines syllabus</span>
                  </div>
                  <p className="text-[11px] text-[#565e74]">
                    Select your current academic standard for Sindh Board examinations.
                  </p>
                  <div className="grid grid-cols-2 gap-3 mt-1.5">
                    <button
                      type="button"
                      onClick={() => setRegClass('9th')}
                      className={`relative flex items-center justify-between p-3.5 rounded-lg border text-left transition-all ${
                        regClass === '9th'
                          ? 'border-[#2563eb] bg-[#eff4ff] ring-1 ring-[#2563eb]'
                          : 'border-[#c3c6d7]/60 bg-white hover:bg-[#f8f9ff]'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-[#0b1c30]">Class 9th</span>
                        <span className="text-[11px] text-[#565e74]">SSC Part I</span>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          regClass === '9th'
                            ? 'bg-[#2563eb] text-white'
                            : 'bg-transparent border border-[#c3c6d7]'
                        }`}
                      >
                        {regClass === '9th' && (
                          <span className="material-symbols-outlined text-[14px]">check</span>
                        )}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRegClass('10th')}
                      className={`relative flex items-center justify-between p-3.5 rounded-lg border text-left transition-all ${
                        regClass === '10th'
                          ? 'border-[#2563eb] bg-[#eff4ff] ring-1 ring-[#2563eb]'
                          : 'border-[#c3c6d7]/60 bg-white hover:bg-[#f8f9ff]'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-[#0b1c30]">Class 10th</span>
                        <span className="text-[11px] text-[#565e74]">SSC Part II</span>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          regClass === '10th'
                            ? 'bg-[#2563eb] text-white'
                            : 'bg-transparent border border-[#c3c6d7]'
                        }`}
                      >
                        {regClass === '10th' && (
                          <span className="material-symbols-outlined text-[14px]">check</span>
                        )}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Study Group Selection */}
                <div className="flex flex-col gap-1 pt-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-semibold text-[#0b1c30]">Study Group</span>
                    <span className="text-[11px] text-[#565e74]">Determines electives</span>
                  </div>
                  <p className="text-[11px] text-[#565e74]">
                    Configures curriculum-aligned subjects, question banks, and mock sets.
                  </p>
                  <div className="grid grid-cols-2 gap-3 mt-1.5">
                    <button
                      type="button"
                      onClick={() => setRegGroup('biology')}
                      className={`relative flex flex-col gap-1 p-3.5 rounded-lg border text-left transition-all ${
                        regGroup === 'biology'
                          ? 'border-[#2563eb] bg-[#eff4ff] ring-1 ring-[#2563eb]'
                          : 'border-[#c3c6d7]/60 bg-white hover:bg-[#f8f9ff]'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[18px] text-[#004ac6]">
                            biotech
                          </span>
                          <span className="font-semibold text-sm text-[#0b1c30]">Biology</span>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            regGroup === 'biology'
                              ? 'bg-[#2563eb] text-white'
                              : 'bg-transparent border border-[#c3c6d7]'
                          }`}
                        >
                          {regGroup === 'biology' && (
                            <span className="material-symbols-outlined text-[14px]">check</span>
                          )}
                        </div>
                      </div>
                      <span className="text-[11px] text-[#565e74]">
                        Physics, Chemistry, Biology, Math
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRegGroup('computer_science')}
                      className={`relative flex flex-col gap-1 p-3.5 rounded-lg border text-left transition-all ${
                        regGroup === 'computer_science'
                          ? 'border-[#2563eb] bg-[#eff4ff] ring-1 ring-[#2563eb]'
                          : 'border-[#c3c6d7]/60 bg-white hover:bg-[#f8f9ff]'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[18px] text-[#565e74]">
                            terminal
                          </span>
                          <span className="font-semibold text-sm text-[#0b1c30]">Computer Science</span>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            regGroup === 'computer_science'
                              ? 'bg-[#2563eb] text-white'
                              : 'bg-transparent border border-[#c3c6d7]'
                          }`}
                        >
                          {regGroup === 'computer_science' && (
                            <span className="material-symbols-outlined text-[14px]">check</span>
                          )}
                        </div>
                      </div>
                      <span className="text-[11px] text-[#565e74]">
                        Physics, Chemistry, CS, Math
                      </span>
                    </button>
                  </div>
                </div>

                {/* Helpful info callout */}
                <div className="flex items-start gap-2.5 p-3 bg-[#eff4ff] rounded-lg text-[#565e74]">
                  <span className="material-symbols-outlined text-[18px] text-[#004ac6] shrink-0 mt-0.5">
                    info
                  </span>
                  <span className="text-xs leading-relaxed">
                    Your Class and Group selection configures your textbooks, quizzes, and mock exams.
                  </span>
                </div>

                {/* Academic guidelines checkbox */}
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeGuidelines}
                    onChange={(e) => setAgreeGuidelines(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-[#2563eb] accent-[#2563eb] cursor-pointer"
                  />
                  <span className="text-xs text-[#565e74] leading-relaxed">
                    I agree to the academic integrity guidelines and confirm these details match my
                    BISE registration.
                  </span>
                </label>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-[#2563eb] hover:bg-[#004ac6] text-white font-semibold text-sm rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Configuring Profile...' : 'Create Account'}</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>

                <div className="text-center">
                  <span className="text-xs text-[#565e74]">
                    Already registered?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('login');
                        setErrorMessage('');
                      }}
                      className="text-[#004ac6] font-semibold hover:underline ml-1"
                    >
                      Log in
                    </button>
                  </span>
                </div>
              </form>
            </div>
          ) : (
            /* ================= LOGIN VIEW ================= */
            <div className="flex flex-col gap-6">
              {/* Header with System Identity */}
              <div className="flex flex-col items-center text-center gap-1">
                <div className="w-12 h-12 rounded-xl bg-[#eff4ff] flex items-center justify-center mb-1 text-[#2563eb]">
                  <span className="material-symbols-outlined text-[28px]">school</span>
                </div>
                <span className="text-[11px] uppercase tracking-wider text-[#004ac6] font-bold">
                  BISE Sindh Matriculation
                </span>
                <p className="text-xs text-[#434655] max-w-xs leading-tight">
                  Grade 9 & 10 AI Learning and Exam Preparation System
                </p>
              </div>

              {/* Role Selection Selector */}
              <div className="flex flex-col gap-2">
                <div className="flex flex-col">
                  <h2 className="text-sm font-semibold text-[#0b1c30]">How would you like to continue?</h2>
                  <p className="text-xs text-[#434655]">Select your role to access the platform</p>
                </div>
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  {/* Student Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setRole('student');
                      setErrorMessage('');
                    }}
                    className={`relative flex flex-col items-start text-left p-3 rounded-xl border transition-all ${
                      role === 'student'
                        ? 'border-[#2563eb] bg-[#eff4ff] ring-1 ring-[#2563eb]'
                        : 'border-[#c3c6d7]/50 bg-white hover:bg-[#f8f9ff]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="material-symbols-outlined text-[#004ac6] text-xl">school</span>
                      {role === 'student' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#dbe1ff] text-[#00174b] font-bold">
                          Active
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-[#0b1c30]">Student Portal</span>
                    <span className="text-[11px] text-[#434655] line-clamp-1 mt-0.5">
                      Prepare for BISE Sindh exams
                    </span>
                  </button>

                  {/* Admin Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setRole('admin');
                      setErrorMessage('');
                    }}
                    className={`relative flex flex-col items-start text-left p-3 rounded-xl border transition-all ${
                      role === 'admin'
                        ? 'border-[#2563eb] bg-[#eff4ff] ring-1 ring-[#2563eb]'
                        : 'border-[#c3c6d7]/50 bg-white hover:bg-[#f8f9ff]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="material-symbols-outlined text-[#565e74] text-xl">
                        admin_panel_settings
                      </span>
                      {role === 'admin' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#dbe1ff] text-[#00174b] font-bold">
                          Active
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-[#0b1c30]">Administrator</span>
                    <span className="text-[11px] text-[#434655] line-clamp-1 mt-0.5">
                      Manage institutional tools
                    </span>
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-[#ffdad6] border border-[#ba1a1a]/30 rounded-lg text-xs text-[#93000a] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Student Auth Form */}
              {role === 'student' ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0b1c30]">Student Sign In</span>
                    <span className="text-[11px] text-[#005b7c] font-semibold">Class IX - X Portal</span>
                  </div>

                  <form onSubmit={handleStudentLogin} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-[#0b1c30]">
                        Institutional / Student Email
                      </label>
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="student@bise-sindh.edu.pk"
                        className="w-full h-10 px-3 bg-[#eff4ff]/60 border border-[#c3c6d7]/70 text-[#0b1c30] rounded-lg text-sm placeholder:text-[#737686] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004ac6]/20 transition"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-[#0b1c30]">Password</label>
                      <div className="relative flex items-center">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full h-10 pl-3 pr-10 bg-[#eff4ff]/60 border border-[#c3c6d7]/70 text-[#0b1c30] rounded-lg text-sm placeholder:text-[#737686] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004ac6]/20 transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 text-[#737686] hover:text-[#0b1c30] focus:outline-none"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {showPassword ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded text-[#004ac6] accent-[#004ac6] cursor-pointer"
                        />
                        <span className="text-[#434655]">Remember me</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotModalOpen(true);
                          setForgotEmail(loginEmail);
                          setForgotSuccess(false);
                        }}
                        className="text-[#004ac6] font-semibold hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-10 bg-[#004ac6] hover:bg-[#2563eb] text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                    >
                      <span>{isSubmitting ? 'Authenticating...' : 'Login to Student Portal'}</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </form>

                  <div className="text-center pt-1">
                    <p className="text-xs text-[#434655]">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('register');
                          setErrorMessage('');
                        }}
                        className="font-semibold text-[#004ac6] hover:underline"
                      >
                        Create an account
                      </button>
                    </p>
                  </div>
                </div>
              ) : (
                /* Admin Auth Form */
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0b1c30]">Institutional Administrator</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#d3e4fe] text-[#0b1c30] font-semibold">
                      Protected
                    </span>
                  </div>

                  <form onSubmit={handleAdminLogin} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-[#0b1c30]">
                        Administrator Identifier
                      </label>
                      <input
                        type="email"
                        required
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        placeholder="admin@school.bise.edu.pk"
                        className="w-full h-10 px-3 bg-[#eff4ff]/60 border border-[#c3c6d7]/70 text-[#0b1c30] rounded-lg text-sm placeholder:text-[#737686] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004ac6]/20 transition"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-[#0b1c30]">Secure Keyphrase</label>
                      <div className="relative flex items-center">
                        <input
                          type={showAdminPass ? 'text' : 'password'}
                          required
                          value={adminKeyphrase}
                          onChange={(e) => setAdminKeyphrase(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full h-10 pl-3 pr-10 bg-[#eff4ff]/60 border border-[#c3c6d7]/70 text-[#0b1c30] rounded-lg text-sm placeholder:text-[#737686] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004ac6]/20 transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowAdminPass(!showAdminPass)}
                          className="absolute right-3 text-[#737686] hover:text-[#0b1c30] focus:outline-none"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {showAdminPass ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-[#eff4ff] flex items-start gap-2 text-[#434655]">
                      <span className="material-symbols-outlined text-[#565e74] text-sm mt-0.5">
                        info
                      </span>
                      <p className="text-[11px] leading-relaxed">
                        Admin access requires verified Sindh Education Department institutional
                        credentials. No public self-registration.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-10 bg-[#565e74] hover:bg-[#3f465c] text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                    >
                      <span>{isSubmitting ? 'Authenticating...' : 'Authenticate as Admin'}</span>
                      <span className="material-symbols-outlined text-sm">lock_open</span>
                    </button>
                  </form>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        alert(
                          'Institutional delegation requests must be formally submitted to BISE Sindh Examination Directorate.'
                        )
                      }
                      className="text-xs text-[#434655] hover:text-[#004ac6] transition-colors"
                    >
                      Request Institutional Authority Delegation
                    </button>
                  </div>
                </div>
              )}

              {/* Diagnostic System Status Pill */}
              <div className="pt-2 flex items-center justify-center gap-2 text-[#737686]">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#004ac6]"></span>
                <span className="text-[11px]">Sindh Academic Cloud • Active Session Gate</span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-[#c3c6d7]/50 max-w-sm w-full p-6 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-[#0b1c30] mb-2">Reset Portal Password</h3>
            {forgotSuccess ? (
              <div>
                <p className="text-xs text-[#059669] mb-4">
                  Password reset link sent to <strong>{forgotEmail}</strong>. Follow the instructions to
                  regain access.
                </p>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(false)}
                  className="w-full py-2 bg-[#2563eb] text-white rounded-lg text-xs font-semibold"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <div>
                <p className="text-xs text-[#565e74] mb-3">
                  Enter your student or institutional email to receive recovery instructions.
                </p>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="student@bise-sindh.edu.pk"
                  className="w-full h-9 px-3 border border-[#c3c6d7] rounded-lg text-xs mb-4 outline-none focus:border-[#2563eb]"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="px-3 py-1.5 rounded-lg border border-[#c3c6d7] text-xs font-medium text-[#565e74]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setForgotSuccess(true)}
                    className="px-4 py-1.5 rounded-lg bg-[#2563eb] text-white text-xs font-semibold"
                  >
                    Send Recovery Link
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full pb-6 text-center px-4">
        <p className="text-[11px] text-[#434655]">
          StudyMate AI v1.0 • BISE Sindh Academic Platform
        </p>
      </footer>
    </div>
  );
};
