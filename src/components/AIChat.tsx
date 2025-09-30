import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2 } from "lucide-react"; // Import Loader2 for loading state
import { supabase } from "@/integrations/supabase/client"; // Import supabase client
import { showError } from "@/utils/toast";

interface AIChatProps {
  projectId: string;
}

const AIChat: React.FC<AIChatProps> = ({ projectId }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState(false); // Add loading state

  const handleSendMessage = async () => {
    if (input.trim() === "" || loading) {
      return;
    }

    const userMessage = `You: ${input}`;
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true); // Set loading true

    try {
      // Invoke the Supabase Edge Function
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
      setLoading(false); // Set loading false
    }
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-lg shadow-lg border border-border p-4 animate-in fade-in duration-500">
      <h2 className="text-xl font-semibold mb-4 text-primary">AI Chat</h2>
      <ScrollArea className="flex-1 p-2 mb-4 border rounded-md bg-background">
        {messages.length === 0 ? (
          <p className="text-muted-foreground text-center mt-4">Start chatting with your data assistant!</p>
        ) : (
          messages.map((msg, index) => (
            <p key={index} className="mb-2 text-sm">
              {msg.startsWith("You:") ? <span className="font-medium text-foreground">{msg}</span> : <span className="text-muted-foreground">{msg}</span>}
            </p>
          ))
        )}
        {loading && (
          <div className="flex items-center justify-center mt-4">
            <Loader2 className="h-4 w-4 animate-spin mr-2 text-primary" />
            <span className="text-muted-foreground text-sm">AI is thinking...</span>
          </div>
        )}
      </ScrollArea>
      <div className="flex space-x-2">
        <Input
          placeholder="Ask your data assistant..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          className="flex-1"
          disabled={loading}
        />
        <Button onClick={handleSendMessage} size="icon" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default AIChat;