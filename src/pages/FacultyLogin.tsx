import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import authService from "@/services/authService";

const FacultyLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login({ email, password });

      if (response.role !== "FACULTY") {
        authService.logout();
        toast({
          title: "Access Denied",
          description: "This login is for faculty members only. Please use the student login.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Welcome!",
        description: "Successfully logged in as faculty.",
      });

      navigate("/faculty-dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      
      let errorMessage = "Invalid credentials. Please check your email and password.";
      
      if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
        errorMessage = "Cannot connect to server. Make sure the backend is running on http://localhost:9091";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Faculty Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the faculty dashboard
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="faculty@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>New faculty members, use:</p>
              <p className="font-mono text-xs mt-1">Password: FacultyTemp123!</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            <div className="flex flex-col space-y-2 text-sm text-center w-full">
              <Link to="/reset-password" className="text-primary hover:underline">
                Forgot password?
              </Link>
              <Link to="/signup" className="text-primary hover:underline">
                Apply for faculty access
              </Link>
              <Link to="/login" className="text-muted-foreground hover:underline">
                Student login
              </Link>
              <Link to="/" className="text-muted-foreground hover:underline">
                Back to home
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default FacultyLogin;
