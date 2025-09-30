import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  updated_at: string | null;
  trial_ends_at: string | null;
  is_subscribed: boolean | null;
}

interface TrialStatus {
  isTrialActive: boolean;
  trialEndsAt: Date | null;
  isSubscribed: boolean;
  loading: boolean;
}

export const useTrialStatus = (userId: string | undefined): TrialStatus => {
  const [trialStatus, setTrialStatus] = useState<TrialStatus>({
    isTrialActive: false,
    trialEndsAt: null,
    isSubscribed: false,
    loading: true,
  });

  useEffect(() => {
    if (!userId) {
      setTrialStatus({
        isTrialActive: false,
        trialEndsAt: null,
        isSubscribed: false,
        loading: false,
      });
      return;
    }

    const fetchTrialStatus = async () => {
      setTrialStatus((prev) => ({ ...prev, loading: true }));
      const { data, error } = await supabase
        .from("profiles")
        .select("trial_ends_at, is_subscribed")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile for trial status:", error);
        showError("Failed to load trial status.");
        setTrialStatus({
          isTrialActive: false,
          trialEndsAt: null,
          isSubscribed: false,
          loading: false,
        });
        return;
      }

      if (data) {
        const trialEndsAt = data.trial_ends_at ? new Date(data.trial_ends_at) : null;
        const isSubscribed = data.is_subscribed || false;
        const now = new Date();
        const isTrialActive = !isSubscribed && trialEndsAt ? trialEndsAt > now : false;

        setTrialStatus({
          isTrialActive,
          trialEndsAt,
          isSubscribed,
          loading: false,
        });
      } else {
        setTrialStatus({
          isTrialActive: false,
          trialEndsAt: null,
          isSubscribed: false,
          loading: false,
        });
      }
    };

    fetchTrialStatus();
  }, [userId]);

  return trialStatus;
};