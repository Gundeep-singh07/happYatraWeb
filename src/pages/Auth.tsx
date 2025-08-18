import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Add this import
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bus,
  Mail,
  Lock,
  User,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import apiService from "../services/apiService";
import { STORAGE_KEYS } from "../constants/constants";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await apiService.login({ email, password });
      if (result.success) {
        // Store user data in localStorage
        if (result.user) {
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(result.user));
        }
        if (result.token) {
          localStorage.setItem(STORAGE_KEYS.TOKEN, result.token);
        }

        setSuccess("Login successful! Redirecting...");
        setTimeout(() => {
          navigate("/dashboard"); // Use React Router navigation
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await apiService.register({ fullName, email, password });
      if (result.success) {
        // Store user data in localStorage
        if (result.user) {
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(result.user));
        }
        if (result.token) {
          localStorage.setItem(STORAGE_KEYS.TOKEN, result.token);
        }

        setSuccess("Account created successfully! Redirecting...");
        setTimeout(() => {
          navigate("/dashboard"); // Use React Router navigation
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute top-6 left-6"
      >
        <Link to="/">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Button>
        </Link>
      </motion.div>

      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center mb-8"
        >
          <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-2xl backdrop-blur-md border border-white/10">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="text-blue-400"
            >
              <Bus size={40} />
            </motion.div>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              happYatra
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gray-900/40 backdrop-blur-xl border-white/10 shadow-2xl">
            <CardHeader className="text-center space-y-1">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-gray-400">
                Experience seamless transportation with happYatra
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Alert
                      variant="default"
                      className="mb-4 bg-green-500/10 border-green-500/30 text-green-400"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <AlertTitle>Success</AlertTitle>
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Alert
                      variant="destructive"
                      className="mb-4 bg-red-500/10 border-red-500/30"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-800/50">
                  <TabsTrigger
                    value="login"
                    className="data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <div className="relative">
                        <Mail
                          size={18}
                          className="absolute left-3 top-3 text-muted-foreground"
                        />
                        <Input
                          id="login-email"
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10 bg-gray-800/50 border-gray-700 focus:border-blue-500 transition-colors"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Lock
                          size={18}
                          className="absolute left-3 top-3 text-muted-foreground"
                        />
                        <Input
                          id="login-password"
                          name="password"
                          type="password"
                          placeholder="Enter your password"
                          className="pl-10 bg-gray-800/50 border-gray-700 focus:border-blue-500 transition-colors"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-blue-500 hover:bg-blue-600 transition-colors"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      {isLoading ? "Signing In..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <div className="relative">
                        <User
                          size={18}
                          className="absolute left-3 top-3 text-muted-foreground"
                        />
                        <Input
                          id="signup-name"
                          name="fullName"
                          type="text"
                          placeholder="Enter your full name"
                          className="pl-10 bg-gray-800/50 border-gray-700 focus:border-blue-500 transition-colors"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative">
                        <Mail
                          size={18}
                          className="absolute left-3 top-3 text-muted-foreground"
                        />
                        <Input
                          id="signup-email"
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10 bg-gray-800/50 border-gray-700 focus:border-blue-500 transition-colors"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock
                          size={18}
                          className="absolute left-3 top-3 text-muted-foreground"
                        />
                        <Input
                          id="signup-password"
                          name="password"
                          type="password"
                          placeholder="Create a password (min 6 characters)"
                          className="pl-10 bg-gray-800/50 border-gray-700 focus:border-blue-500 transition-colors"
                          required
                          minLength={6}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-blue-500 hover:bg-blue-600 transition-colors"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-center text-sm text-gray-400"
              >
                By continuing, you agree to our{" "}
                <Link
                  to="/terms"
                  className="text-blue-400 hover:text-blue-300 transition-colors hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-blue-400 hover:text-blue-300 transition-colors hover:underline"
                >
                  Privacy Policy
                </Link>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Auth;
