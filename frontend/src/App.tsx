import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landing-page/landing-page";
import RegisterForm from "./pages/auth/sign-up";
import SignInPage from "./pages/auth/sign-in";
import VerificationSuccess from "./pages/auth/verification/verification-successful";
import VerificationFailed from "./pages/auth/verification/verification-failed";
import VerifyEmailGate from "./pages/auth/verification/VerifyEmailGate";
import Dashboard from "./pages/dashboard/dashboard";
import ForgotPassword from "./pages/auth/password-reset/forgot-password";
import ResetPassword from "./pages/auth/password-reset/reset-password";
import AdminLogin from "./pages/admin/admin-signin";
import Profile from "./pages/dashboard/profile";
import RequireAuth from "./router/RequireAuth";


export default function App() {
  return (
    <Routes>
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/login" element={<SignInPage />} />
      <Route path="/verify" element={<VerifyEmailGate />} />
      <Route path="/verify/success" element={<VerificationSuccess />} />
      <Route path="/verify/failed" element={<VerificationFailed />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />

    </Routes>
  );
}
