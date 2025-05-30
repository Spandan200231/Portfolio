import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Shield } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { setAuthToken } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().default(false),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [error, setError] = useState<string>("");

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await apiRequest("POST", "/api/auth/login", {
        email: data.email,
        password: data.password,
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.token) {
        setAuthToken(data.token);
        setLocation("/admin/dashboard");
      } else {
        setError("Login failed. No token received.");
      }
    },
    onError: (error: any) => {
      setError(error.message || "Login failed. Please check your credentials.");
    },
  });

  const onSubmit = (data: LoginForm) => {
    setError("");
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-accent/10 rounded-full">
              <Shield className="h-8 w-8 text-accent" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-contrast">Admin Login</CardTitle>
          <CardDescription className="text-contrast-secondary">
            Access the portfolio admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-contrast">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="form-input"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-contrast">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="form-input"
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={form.watch("rememberMe")}
                onCheckedChange={(checked) => 
                  form.setValue("rememberMe", checked as boolean)
                }
              />
              <Label htmlFor="rememberMe" className="text-sm text-contrast-secondary">
                Remember me
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full btn-primary"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-contrast-secondary">
            <p>Demo credentials:</p>
            <p className="font-mono text-xs mt-1">
              spandan.majumder0231@gmail.com / Spandan@200231
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
