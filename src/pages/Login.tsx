import React from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/components/theme/ThemeProvider"; // Import useTheme

const Login = () => {
  const { theme } = useTheme(); // Get the current theme

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md p-8 bg-card rounded-lg shadow-lg border border-border">
        <h1 className="text-3xl font-bold mb-2 text-center text-primary">Unleash Your Data Power.</h1>
        <p className="text-lg text-muted-foreground mb-6 text-center">Join Data Combat for Free!</p>
        <Auth
          supabaseClient={supabase}
          providers={["google", "linkedin"]}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: "hsl(var(--primary))",
                  brandAccent: "hsl(var(--primary-foreground))",
                },
              },
              dark: { // Specific overrides for dark theme inputs using hardcoded HSL values
                colors: {
                  // General text color for the entire Auth component
                  text: "hsl(210 40% 98%)", // Corresponds to --foreground
                  // Input specific colors
                  inputBackground: "hsl(217.2 32.6% 25%)", // Corresponds to --input
                  inputText: "hsl(210 40% 98%)", // Corresponds to --foreground
                  inputBorder: "hsl(217.2 32.6% 25%)", // Corresponds to --border (using input color for consistency)
                  inputPlaceholder: "hsl(210 40% 80%)", // Corresponds to --muted-foreground
                },
              },
            },
          }}
          theme={theme === "dark" ? "dark" : "light"} // Dynamically set theme
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
        />
        <p className="text-center text-sm text-muted-foreground mt-4">
          Start your 15-day free trial today! No credit card required.
        </p>
      </div>
    </div>
  );
};

export default Login;