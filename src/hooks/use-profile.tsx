import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  trial_ends_at: string | null;
  is_subscribed: boolean | null;
  updated_at: string | null;
}

interface UseProfileResult {
  profile: Profile | null;
  isLoading: boolean;
  isTrialActive: boolean;
  isTrialExpired: boolean;
  isSubscribed: boolean;
  trialRemainingDays: number | null;
  refetchProfile: () => void;
}

export const useProfile = (): UseProfileResult => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTrialActive, setIsTrialActive] = useState(false);
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [trialRemainingDays, setTrialRemainingDays] = useState<number | null>(null);

  const fetchProfile = async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      showError("Failed to load user profile.");
      setProfile(null);
    } else if (data) {
      setProfile(data);

      const now = new Date();
      const trialEndsAt = data.trial_ends_at ? new Date(data.trial_ends_at) : null;
      const subscribed = data.is_subscribed ?? false;

      setIsSubscribed(subscribed);

      if (subscribed) {
        setIsTrialActive(false);
        setIsTrialExpired(false);
        setTrialRemainingDays(null);
      } else if (trialEndsAt) {
        const diffTime = trialEndsAt.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 0) {
          setIsTrialActive(true);
          setIsTrialExpired(false);
          setTrialRemainingDays(diffDays);
        } else {
          setIsTrialActive(false);
          setIsTrialExpired(true);
          setTrialRemainingDays(0);
        }
      } else {
        // No trial_ends_at means no trial or trial not initiated
        setIsTrialActive(false);
        setIsTrialExpired(true); // Treat as expired if no trial date and not subscribed
        setTrialRemainingDays(0);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProfile();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchProfile();
      } else {
        setProfile(null);
        setIsLoading(false);
        setIsTrialActive(false);
        setIsTrialExpired(true);
        setIsSubscribed(false);
        setTrialRemainingDays(0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    profile,
    isLoading,
    isTrialActive,
    isTrialExpired,
    isSubscribed,
    trialRemainingDays,
    refetchProfile: fetchProfile,
  };
};