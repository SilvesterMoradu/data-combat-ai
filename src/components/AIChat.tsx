import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import { useTrialStatus } from "@/hooks/use-trial-status";
import { Card, CardContent } from "@/components/ui/card";
import { useFirebaseUser } from "@/components/auth/FirebaseAuthProvider"; // Import Firebase user hook

interface AIChatProps {
  projectId: string;
}

const AIChat: React.FC<AIChatProps> = ({ projectId }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { user, loading: userLoading } = useFirebaseUser(); // Get Firebase user
  const { isTrialActive, trialEndsAt, isSubscribed, loading: trialLoading } = useTrialStatus(user?.uid); // Pass Firebase user ID

  const handleSendMessage = async () => {
    if (input.trim() === "" || loading || !isTrialActive || userLoading) {
      return;
    }

    const userMessage = `You: ${input}`;
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Track feature usage (simple console log for now)
    console.log(`AI Chat feature used by user ${user?.uid} for project ${projectId} with query: "${input}"`);

    try {
      const { data, error } = await supabase.functions.invoke("ai-analyze", {
        body: JSON.stringify({ projectId, query: input }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (error) {
        console.error("Error invoking AI function:", error);
        showError("Failed to get AI response. Please try again.");
        setMessages((prev) => [...prev, `AI: Sorry, I encountered an error.`]);
      } else if (data && data.response) {
        setMessages((prev) => [...prev, `AI: ${data.response}`]);
      } else {
        setMessages((prev) => [...prev, `AI: I didn't get a clear response. Can you rephrase?`]);
      }
    } catch (err: any) {
      console.error("Network or unexpected error:", err);
      showError(`An unexpected error occurred: ${err.message}`);
      setMessages((prev) => [...prev, `AI: An unexpected error occurred.`]);
    } finally {
      setLoading(false);
    }
  };

  const isFeatureRestricted = !isTrialActive && !isSubscribed;
  const trialEndDateString = trialEndsAt ? trialEndsAt.toLocaleDateString() : "N/A";

  return (
    <div className="flex flex-col h-full bg-card rounded-lg shadow-lg border border-border p-4 animate-in fade-in duration-500">
      <h2 className="text-xl font-semibold mb-4 text-primary">AI Chat</h2>
      <ScrollArea className="flex-1 p-2 mb-4 border rounded-md bg-background">
        {messages.length === 0 && !trialLoading && !isFeatureRestricted && !userLoading ? (
          <p className="text-muted-foreground text-center mt-4">Start chatting with your data assistant!</p>
        ) : (
          messages.map((msg, index) => (
            <p key={index} className="mb-2 text-sm">
              {msg.startsWith("You:") ? <span className="font-medium text-foreground">{msg}</span> : <span className="text-muted-foreground">{msg}</span>}
            </p>
          ))
        )}
        {(loading || trialLoading || userLoading) && (
          <div className="flex items-center justify-center mt-4">
            <Loader2 className="h-4 w-4 animate-spin mr-2 text-primary" />
            <span className="text-muted-foreground text-sm">
              {userLoading ? "Authenticating..." : trialLoading ? "Checking trial status..." : "AI is thinking..."}
            </span>
          </div>
        )}
        {isFeatureRestricted && !trialLoading && !userLoading && (
          <Card className="mt-4 bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200">
            <CardContent className="p-4 flex items-center">
              <Lock className="h-5 w-5 mr-3" />
              <div>
                <p className="font-semibold">AI Chat is a premium feature.</p>
                <p className="text-sm">Your free trial ended on {trialEndDateString}. Please upgrade to continue using advanced AI features.</p>
                <Button variant="link" className="p-0 h-auto text-red-800 dark:text-red-200">Upgrade Now</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </ScrollArea>
      <div className="flex space-x-2">
        <Input
          placeholder={isFeatureRestricted ? "Upgrade to use AI Chat" : "Ask your data assistant..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          className="flex-1"
          disabled={loading || trialLoading || isFeatureRestricted || userLoading}
        />
        <Button onClick={handleSendMessage} size="icon" disabled={loading || trialLoading || isFeatureRestricted || userLoading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default AIChat;