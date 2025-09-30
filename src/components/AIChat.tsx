import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";

const AIChat = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, `You: ${input}`]);
      // Simulate AI response
      setTimeout(() => {
        setMessages((prev) => [...prev, `AI: Thinking...`]);
        setTimeout(() => {
          setMessages((prev) => prev.map((msg, i) => i === prev.length - 1 ? `AI: How can I help you with your data today?` : msg));
        }, 1000);
      }, 500);
      setInput("");
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
      </ScrollArea>
      <div className="flex space-x-2">
        <Input
          placeholder="Ask your data assistant..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          className="flex-1"
        />
        <Button onClick={handleSendMessage} size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AIChat;