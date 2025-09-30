import React from "react";
import { signInWithGoogle } from "@/integrations/firebase/authFunctions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Chrome } from "lucide-react"; // Using Chrome icon for Google

const Login = () => {
  const handleGoogleLogin = async () => {
    await signInWithGoogle();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Unleash Your Data Power.</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">Join Data Combat for Free!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center py-6 text-lg"
            variant="outline"
          >
            <Chrome className="mr-3 h-6 w-6" /> Sign in with Google
          </Button>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Start your 15-day free trial today! No credit card required.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;