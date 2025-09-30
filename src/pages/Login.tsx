import React from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/components/theme/ThemeProvider";

const Login = () => {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md p-8 bg-card rounded-lg shadow-lg border border-border">
        <h1 className="text-3xl font-bold mb-2 text-center text-primary">Unleash Your Data Power.</h1>
        <p className="text-lg text-muted-foreground mb-6 text-center">Join Data Combat for Free!</p>
        <Auth
          key={theme}
          supabaseClient={supabase}
          providers={["google", "linkedin"]}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: "hsl(var(--primary))",
                  brandAccent: "hsl(var(--primary-foreground))",
                  inputPlaceholder: "hsl(var(--primary))",
                },
              },
              dark: {
                colors: {
                  inputBackground: "hsl(var(--input))",
                  inputText: "hsl(var(--foreground))", // Consistent with global foreground
                  inputBorder: "hsl(var(--border))",
                  inputFocusBorder: "hsl(var(--ring))",
                  inputPlaceholder: "hsl(var(--primary))",
                  text: "hsl(var(--foreground))",
                },
              },
            },
          }}
          theme={theme === "dark" ? "dark" : "light"}
          redirectTo={window.location.origin}
          localization={{
            variables: {
              sign_up: {
                email_label: "Email address",
                password_label: "Create a Password",
                email_input_placeholder: "Your email address",
                password_input_placeholder: "Your Password",
                button_label: "Sign Up",
                social_provider_text: "Sign up with {{provider}}",
                link_text: "Don't have an account? Sign Up",
                confirmation_message: "Check your email for the confirmation link.",
              },
              sign_in: {
                email_label: "Email address",
                password_label: "Your Password",
                email_input_placeholder: "Your email address",
                password_input_placeholder: "Your Password",
                button_label: "Sign In",
                social_provider_text: "Sign in with {{provider}}",
                link_text: "Already have an account? Sign In",
              },
            },
          }}
          defaultView="sign_in"
        />
        <p className="text-center text-sm text-muted-foreground mt-4">
          Start your 15-day free trial today! No credit card required.
        </p>
      </div>
    </div>
  );
};

export default Login;