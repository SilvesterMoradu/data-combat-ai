import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/integrations/firebase/firebase";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client"; // Keep Supabase client for database operations

interface FirebaseAuthContextType {
  user: User | null;
  loading: boolean;
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType | undefined>(undefined);

export const FirebaseAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        // If user is logged in via Firebase, ensure their profile exists in Supabase
        // This is a hybrid approach: Firebase for auth, Supabase for profiles/data
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", currentUser.uid)
          .single();

        if (profileError && profileError.code === 'PGRST116') { // No rows found
          // Create profile if it doesn't exist
          const { error: insertError } = await supabase.from("profiles").insert({
            id: currentUser.uid,
            first_name: currentUser.displayName?.split(' ')[0] || null,
            last_name: currentUser.displayName?.split(' ').slice(1).join(' ') || null,
            avatar_url: currentUser.photoURL || null,
            trial_ends_at: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15-day trial
            is_subscribed: false,
          });
          if (insertError) {
            console.error("Error creating Supabase profile for new Firebase user:", insertError);
          }
        } else if (profileError) {
          console.error("Error checking Supabase profile for Firebase user:", profileError);
        }

        if (location.pathname === "/login") {
          navigate("/");
        }
      } else {
        if (location.pathname !== "/login") {
          navigate("/login");
        }
      }
    });

    return () => unsubscribe();
  }, [navigate, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading authentication...</p>
      </div>
    );
  }

  return (
    <FirebaseAuthContext.Provider value={{ user, loading }}>
      {children}
    </FirebaseAuthContext.Provider>
  );
};

export const useFirebaseUser = () => {
  const context = useContext(FirebaseAuthContext);
  if (context === undefined) {
    throw new Error("useFirebaseUser must be used within a FirebaseAuthProvider");
  }
  return context;
};