import { useState } from "react";
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
import { Bus, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { apiService } from "../services/apiService";
import { STORAGE_KEYS } from "../constants/constants";

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
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="absolute top-6 left-6">
        <Link to="/">
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="transport-icon">
              <Bus size={40} />
            </div>
            <span className="text-3xl font-bold hero-gradient">happYatra</span>
          </div>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
            <CardDescription>
              Join the future of intelligent transportation
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Success/Error Messages */}
            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {success}
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
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
                        className="pl-10"
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
                        className="pl-10"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full glow-effect"
                    disabled={isLoading}
                  >
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
                        className="pl-10"
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
                        className="pl-10"
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
                        className="pl-10"
                        required
                        minLength={6}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full glow-effect"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy
              Policy
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
