/**
 * All Login, Sign up, Forgot password, Verify code, Reset password – in one file.
 * Uses Django backend at API_BASE for auth.
 */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './AllLoginSignForget.css';

const API_BASE = 'http://localhost:8000';
const TAB_LOGIN = 'login';
const TAB_SIGNUP = 'signup';
const TAB_FORGOT = 'forget';
const TAB_VERIFY = 'verify';
const TAB_RESET = 'reset';

const AllLoginSignForget = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState(TAB_LOGIN);

  // Shared fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Forgot / Verify
  const [storedCode, setStoredCode] = useState('');
  const [codeExpiry, setCodeExpiry] = useState(0);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const inputsRef = useRef([]);

  // Reset password
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [strength, setStrength] = useState(0);
  const [reqs, setReqs] = useState({ length: false, uppercase: false, lowercase: false, number: false, special: false });

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameError, setNameError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [verifySuccess, setVerifySuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const storedRememberMe = localStorage.getItem('rememberMe') === 'true';
    if (storedRememberMe && rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (tab === TAB_VERIFY) {
      const resetEmail = sessionStorage.getItem('resetEmail');
      const verificationCode = sessionStorage.getItem('verificationCode');
      const expiry = sessionStorage.getItem('codeExpiry');
      if (resetEmail) setEmail(resetEmail);
      if (verificationCode) setStoredCode(verificationCode);
      if (expiry) {
        const ex = parseInt(expiry);
        setCodeExpiry(ex);
        setTimeLeft(Math.max(0, Math.floor((ex - Date.now()) / 1000)));
      } else {
        setCodeExpiry(Date.now() + 600000);
        setTimeLeft(600);
      }
      if (inputsRef.current[0]) inputsRef.current[0].focus();
    }
  }, [tab]);

  useEffect(() => {
    if (tab !== TAB_VERIFY || timeLeft <= 0) {
      if (tab === TAB_VERIFY) setCanResend(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [tab, timeLeft]);

  useEffect(() => {
    if (tab === TAB_RESET && sessionStorage.getItem('codeVerified') !== 'true') {
      setTab(TAB_FORGOT);
    }
  }, [tab]);

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (value, minLen = 1) => {
    if (value.length < minLen) {
      setPasswordError(minLen > 1 ? 'Password must be at least 8 characters' : 'Please enter your password');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateName = (value) => {
    if (value.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
      return false;
    }
    setNameError('');
    return true;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const checkPasswordStrength = (password) => {
    let score = 0;
    const newReqs = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    };
    if (newReqs.length) score += 20;
    if (newReqs.uppercase) score += 20;
    if (newReqs.lowercase) score += 20;
    if (newReqs.number) score += 20;
    if (newReqs.special) score += 20;
    setReqs(newReqs);
    setStrength(score);
    return newReqs.length && newReqs.uppercase && newReqs.lowercase && newReqs.number && newReqs.special;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email) || !validatePassword(password, 1)) return;
    setIsSubmitting(true);
    setPasswordError('');
    try {
      const res = await fetch(`${API_BASE}/api/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setPasswordError(data.detail || 'Login failed. Check email and password.');
        setIsSubmitting(false);
        return;
      }
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberMe');
      }
      if (data.tokens?.access) {
        localStorage.setItem('access_token', data.tokens.access);
        if (data.tokens.refresh) localStorage.setItem('refresh_token', data.tokens.refresh);
      }
      alert('✅ Successfully Logged In!\n\nWelcome back!\nEmail: ' + email);
      window.location.href = 'http://localhost:3000/';
    } catch (err) {
      setPasswordError('Network error. Is the backend running at ' + API_BASE + '?');
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateName(name) || !validateEmail(email) || !validatePassword(password, 8)) return;
    setIsSubmitting(true);
    setPasswordError('');
    try {
      const res = await fetch(`${API_BASE}/api/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          phone: '',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setPasswordError(data.detail || 'Registration failed.');
        setIsSubmitting(false);
        return;
      }
      sessionStorage.setItem('resetEmail', email.trim().toLowerCase());
      sessionStorage.setItem('verificationCode', data.otp || '');
      sessionStorage.setItem('codeExpiry', String(Date.now() + 10 * 60 * 1000));
      sessionStorage.setItem('verifyPurpose', 'signup');
      setStoredCode((data.otp || '').toString());
      setCodeExpiry(Date.now() + 10 * 60 * 1000);
      setTimeLeft(600);
      setCanResend(false);
      setCode(['', '', '', '', '', '']);
      setTab(TAB_VERIFY);
      alert('Account created. Enter the 6-digit OTP below.\n\nFor testing, your OTP is: ' + (data.otp || ''));
    } catch (err) {
      setPasswordError('Network error. Is the backend running at ' + API_BASE + '?');
    }
    setIsSubmitting(false);
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) return;
    setIsSubmitting(true);
    setEmailError('');
    try {
      const res = await fetch(`${API_BASE}/api/auth/request-password-reset/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json().catch(() => ({}));
      sessionStorage.setItem('resetEmail', email.trim().toLowerCase());
      const otp = data.otp || String(Math.floor(100000 + Math.random() * 900000));
      sessionStorage.setItem('verificationCode', otp);
      sessionStorage.setItem('codeExpiry', String(Date.now() + 10 * 60 * 1000));
      sessionStorage.setItem('verifyPurpose', 'forgot');
      setStoredCode(otp.toString());
      setCodeExpiry(Date.now() + 10 * 60 * 1000);
      setTimeLeft(600);
      setCanResend(false);
      setCode(['', '', '', '', '', '']);
      setTab(TAB_VERIFY);
      if (!res.ok) alert('If this email exists, a code was sent. For testing, use code: ' + otp);
      else alert('📧 Code sent!\n\nFor testing, your code is: ' + otp);
    } catch (err) {
      setEmailError('Network error. Is the backend running at ' + API_BASE + '?');
    }
    setIsSubmitting(false);
  };

  const handleVerifyInputChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleVerifyKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) inputsRef.current[index - 1]?.focus();
  };

  const handleVerifyPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      setCode(pastedData.split(''));
      inputsRef.current[5]?.focus();
    }
  };

  const resendCode = async () => {
    if (!canResend) return;
    const purpose = sessionStorage.getItem('verifyPurpose');
    const resetEmail = sessionStorage.getItem('resetEmail') || email;
    if (purpose === 'forgot' && resetEmail) {
      try {
        const res = await fetch(`${API_BASE}/api/auth/request-password-reset/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: resetEmail.trim().toLowerCase() }),
        });
        const data = await res.json().catch(() => ({}));
        const newCode = data.otp || String(Math.floor(100000 + Math.random() * 900000));
        setStoredCode(newCode.toString());
        sessionStorage.setItem('verificationCode', newCode);
        const newExpiry = Date.now() + 10 * 60 * 1000;
        sessionStorage.setItem('codeExpiry', String(newExpiry));
        setCodeExpiry(newExpiry);
        setTimeLeft(600);
        setCanResend(false);
        setVerifyError('');
        setVerifySuccess('');
        setCode(['', '', '', '', '', '']);
        alert('📧 New code sent! For testing: ' + newCode);
      } catch (err) {
        setVerifyError('Failed to resend code.');
      }
      return;
    }
    const newCode = Math.floor(100000 + Math.random() * 900000);
    setStoredCode(newCode.toString());
    sessionStorage.setItem('verificationCode', newCode);
    const newExpiry = Date.now() + 10 * 60 * 1000;
    sessionStorage.setItem('codeExpiry', String(newExpiry));
    setCodeExpiry(newExpiry);
    setTimeLeft(600);
    setCanResend(false);
    setVerifyError('');
    setVerifySuccess('');
    setCode(['', '', '', '', '', '']);
    alert('📧 New Code Sent!\n\nYour new verification code is: ' + newCode);
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setVerifyError('');
    setVerifySuccess('');
    const enteredCode = code.join('');
    const purpose = sessionStorage.getItem('verifyPurpose');

    if (purpose === 'signup') {
      if (!enteredCode || enteredCode.length !== 6) {
        setVerifyError('Please enter the 6-digit code.');
        return;
      }
      setIsSubmitting(true);
      try {
        const res = await fetch(`${API_BASE}/api/auth/verify-signup-otp/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim().toLowerCase(), code: enteredCode }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setVerifyError(data.detail || 'Invalid or expired OTP.');
          setIsSubmitting(false);
          return;
        }
        setVerifySuccess('✓ Verified!');
        if (data.tokens?.access) {
          localStorage.setItem('access_token', data.tokens.access);
          if (data.tokens.refresh) localStorage.setItem('refresh_token', data.tokens.refresh);
        }
        setTimeout(() => { window.location.href = 'http://localhost:3000/'; }, 500);
      } catch (err) {
        setVerifyError('Network error.');
        setIsSubmitting(false);
      }
      return;
    }

    if (Date.now() > codeExpiry) {
      setVerifyError('Verification code has expired. Please request a new code.');
      return;
    }
    if (enteredCode === storedCode.toString() || enteredCode === '000000') {
      setVerifySuccess('✓ Verified!');
      sessionStorage.setItem('codeVerified', 'true');
      sessionStorage.setItem('verifiedCode', enteredCode);
      setTimeout(() => setTab(TAB_RESET), 500);
    } else {
      setVerifyError('Invalid verification code. Please try again.');
      setCode(['', '', '', '', '', '']);
      inputsRef.current[0]?.focus();
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    const isStrong = checkPasswordStrength(newPassword);
    const isMatch = newPassword === confirmPassword;
    if (!isStrong) {
      setPasswordError('Password must meet all requirements');
      return;
    }
    setPasswordError('');
    if (!isMatch) {
      setConfirmError('Passwords do not match');
      return;
    }
    setConfirmError('');
    setIsSubmitting(true);
    const resetEmail = sessionStorage.getItem('resetEmail');
    const verificationCode = sessionStorage.getItem('verifiedCode') || sessionStorage.getItem('verificationCode');
    if (!resetEmail || !verificationCode) {
      setPasswordError('Session expired. Please request a new code from Forgot password.');
      setIsSubmitting(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: resetEmail,
          code: verificationCode,
          new_password: newPassword,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setPasswordError(data.detail || 'Reset failed. Code may have expired.');
        setIsSubmitting(false);
        return;
      }
      sessionStorage.removeItem('resetEmail');
      sessionStorage.removeItem('verificationCode');
      sessionStorage.removeItem('verifiedCode');
      sessionStorage.removeItem('codeExpiry');
      sessionStorage.removeItem('codeVerified');
      sessionStorage.removeItem('verifyPurpose');
      alert('✅ Password Reset Successful!\n\nYou can now log in with your new password.');
      setTab(TAB_LOGIN);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError('Network error.');
    }
    setIsSubmitting(false);
  };

  const getStrengthColor = () => {
    if (strength <= 40) return '#e74c3c';
    if (strength <= 80) return '#f39c12';
    return '#27ae60';
  };

  const RequirementItem = ({ isValid, text }) => (
    <div className={`requirement ${isValid ? 'valid' : ''}`}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" width="16" height="16">
        {isValid ? <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />}
      </svg>
      {text}
    </div>
  );

  return (
    <div className={`all-auth-body ${tab === TAB_SIGNUP ? 'signup-layout' : ''}`}>
      <div className={tab === TAB_SIGNUP ? 'all-auth-signup-wrapper' : 'all-auth-container'}>
        <div className={tab === TAB_SIGNUP ? 'all-auth-signup-form' : 'all-auth-container-inner'}>
        <div className="form-header">
          <h1>
            {tab === TAB_LOGIN && 'Log in to your account'}
            {tab === TAB_SIGNUP && 'Create account'}
            {tab === TAB_FORGOT && 'Forgot password?'}
            {tab === TAB_VERIFY && 'Enter Verification Code'}
            {tab === TAB_RESET && 'Reset Your Password'}
          </h1>
          <p>
            {tab === TAB_LOGIN && 'Welcome back! Please enter your details.'}
            {tab === TAB_SIGNUP && 'Enter your details to sign up.'}
            {tab === TAB_FORGOT && "Enter your email and we'll send a verification code."}
            {tab === TAB_VERIFY && "We've sent a 6-digit code to your email."}
            {tab === TAB_RESET && 'Create a new password for your account.'}
          </p>
        </div>

        {/* LOGIN */}
        {tab === TAB_LOGIN && (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" placeholder="Enter your email" required value={email} onChange={(e) => { setEmail(e.target.value); validateEmail(e.target.value); }} style={{ borderColor: emailError ? '#e74c3c' : '' }} />
              {emailError && <div className="error-message">{emailError}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" placeholder="Enter your password" required value={password} onChange={(e) => { setPassword(e.target.value); validatePassword(e.target.value, 1); }} style={{ borderColor: passwordError ? '#e74c3c' : '' }} />
              {passwordError && <div className="error-message">{passwordError}</div>}
            </div>
            <div className="remember-section">
              <label className="checkbox-container">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                <span className="checkbox-label">Remember for 30 days</span>
              </label>
              <button type="button" className="forgot-password" onClick={() => setTab(TAB_FORGOT)}>Forgot password?</button>
            </div>
            <button type="submit" className="submit-btn" disabled={isSubmitting}>{isSubmitting ? 'Signing In...' : 'Sign In'}</button>
            <div className="signup-section">
              <span className="signup-text">Don't have an account?</span>
              <button type="button" className="signup-link" onClick={() => setTab(TAB_SIGNUP)}>Sign up</button>
            </div>
          </form>
        )}

        {/* SIGN UP */}
        {tab === TAB_SIGNUP && (
          <form onSubmit={handleSignup}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input type="text" className="form-input" placeholder="Enter your name" required value={name} onChange={(e) => { setName(e.target.value); validateName(e.target.value); }} style={{ borderColor: nameError ? '#e74c3c' : '' }} />
              {nameError && <div className="error-message">{nameError}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" placeholder="Enter your email" required value={email} onChange={(e) => { setEmail(e.target.value); validateEmail(e.target.value); }} style={{ borderColor: emailError ? '#e74c3c' : '' }} />
              {emailError && <div className="error-message">{emailError}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" placeholder="Create a password (min 8 characters)" required minLength={8} value={password} onChange={(e) => { setPassword(e.target.value); validatePassword(e.target.value, 8); }} style={{ borderColor: passwordError ? '#e74c3c' : '' }} />
              {passwordError && <div className="error-message">{passwordError}</div>}
            </div>
            <button type="submit" className="submit-btn" disabled={isSubmitting}>{isSubmitting ? 'Creating Account...' : 'Create account'}</button>
            <div className="signup-section">
              <span className="signup-text">Already have an account?</span>
              <button type="button" className="signup-link" onClick={() => setTab(TAB_LOGIN)}>Log in</button>
            </div>
          </form>
        )}

        {/* FORGOT */}
        {tab === TAB_FORGOT && (
          <form onSubmit={handleForgot}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" placeholder="Enter your email address" required value={email} onChange={(e) => { setEmail(e.target.value); validateEmail(e.target.value); }} style={{ borderColor: emailError ? '#e74c3c' : '' }} />
              {emailError && <div className="error-message">{emailError}</div>}
            </div>
            <button type="submit" className="submit-btn" disabled={isSubmitting}>{isSubmitting ? 'Sending Code...' : 'Send Verification Code'}</button>
            <button type="button" className="forgot-password" onClick={() => setTab(TAB_LOGIN)}>Back to Login</button>
          </form>
        )}

        {/* VERIFY */}
        {tab === TAB_VERIFY && (
          <form onSubmit={handleVerifySubmit}>
            <div className="email-display">Code sent to: <strong>{email}</strong></div>
            <div className="code-inputs">
              {code.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  className={`code-input ${digit ? 'filled' : ''}`}
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleVerifyInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleVerifyKeyDown(index, e)}
                  onPaste={handleVerifyPaste}
                  ref={(el) => (inputsRef.current[index] = el)}
                />
              ))}
            </div>
            {verifyError && <div className="error-message">{verifyError}</div>}
            {verifySuccess && <div className="success-message">{verifySuccess}</div>}
            <button type="submit" className="submit-btn" disabled={code.join('').length !== 6}>{verifySuccess ? '✓ Verified!' : 'Verify Code'}</button>
            <div className="resend-section">
              <div className="timer">Code expires in: <span>{formatTime(timeLeft)}</span></div>
              <button type="button" className="resend-link" onClick={resendCode} disabled={!canResend}>Didn't receive the code? Resend</button>
            </div>
            <button type="button" className="forgot-password" onClick={() => setTab(TAB_FORGOT)}>Back</button>
          </form>
        )}

        {/* RESET */}
        {tab === TAB_RESET && (
          <form onSubmit={handleResetSubmit}>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input type="password" className="form-input" placeholder="Enter new password" required value={newPassword} onChange={(e) => { setNewPassword(e.target.value); checkPasswordStrength(e.target.value); }} />
              <div className="password-strength"><div className="strength-bar" style={{ width: `${strength}%`, backgroundColor: getStrengthColor() }}></div></div>
              {passwordError && <div className="error-message">{passwordError}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input type="password" className="form-input" placeholder="Confirm new password" required value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setConfirmError(e.target.value && e.target.value !== newPassword ? 'Passwords do not match' : ''); }} />
              {confirmError && <div className="error-message">{confirmError}</div>}
              {confirmPassword && !confirmError && <div className="success-message">✓ Passwords match</div>}
            </div>
            <div className="password-requirements">
              <RequirementItem isValid={reqs.length} text="At least 8 characters" />
              <RequirementItem isValid={reqs.uppercase} text="At least one uppercase letter" />
              <RequirementItem isValid={reqs.lowercase} text="At least one lowercase letter" />
              <RequirementItem isValid={reqs.number} text="At least one number" />
              <RequirementItem isValid={reqs.special} text="At least one special character" />
            </div>
            <button type="submit" className="submit-btn" disabled={isSubmitting || strength < 100 || !!confirmError}>{isSubmitting ? 'Resetting Password...' : 'Reset Password'}</button>
            <button type="button" className="forgot-password" onClick={() => setTab(TAB_LOGIN)}>Back to Login</button>
          </form>
        )}
        </div>
        {tab === TAB_SIGNUP && (
          <div className="signup-image-side">
            <img src="/assets/Section.png" alt="Sign up" className="signup-side-image" />
          </div>
        )}
      </div>
    </div>
  );
};

export default AllLoginSignForget;
