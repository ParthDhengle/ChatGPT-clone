import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogIn, AlertCircle } from "lucide-react";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleEmailLogin = async () => {
    try {
      await signInWithEmail(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Login</h2>
        {error && (
          <div className="flex items-center text-red-600 dark:text-red-400 mb-4">
            <AlertCircle size={16} className="mr-2" />
            <p className="text-sm">{error}</p>
          </div>
        )}
        <div className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button onClick={handleEmailLogin} className="w-full">
            <LogIn size={16} className="mr-2" />
            Login with Email
          </Button>
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full border-gray-300 dark:border-gray-600"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12.24 10.4V14.8H16.72C16.48 16.24 15.76 17.44 14.64 18.24L18.48 21.28C20.88 19.04 22.24 15.76 22.24 12C22.24 11.12 22.16 10.32 22.08 9.6H12.24V10.4Z"
              />
              <path
                fill="currentColor"
                d="M12 22C15.76 22 18.88 20.64 21.28 18.48L17.44 15.44C16.4 16.24 14.96 16.8 12 16.8C8.64 16.8 5.84 14.56 4.88 11.52L1.12 14.64C3.52 18.88 7.76 22 12 22Z"
              />
              <path
                fill="currentColor"
                d="M4.88 11.52C4.64 10.72 4.48 9.84 4.48 9C4.48 8.16 4.64 7.28 4.88 6.48L1.12 3.36C0.4 4.88 0 6.56 0 9C0 11.44 0.4 13.12 1.12 14.64L4.88 11.52Z"
              />
              <path
                fill="currentColor"
                d="M12 1.2C9.04 1.2 6.4 2.56 4.88 4.48L8.64 7.52C9.6 5.28 10.96 4.2 12 4.2C14.96 4.2 16.4 5.76 17.44 6.56L21.28 3.52C18.88 1.36 15.76 1.2 12 1.2Z"
              />
            </svg>
            Login with Google
          </Button>
          <Button variant="link" onClick={() => navigate("/signup")} className="w-full">
            Don’t have an account? Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;