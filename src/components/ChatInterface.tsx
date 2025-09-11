import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  mood?: "supportive" | "concerned" | "encouraging";
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi there! I'm your mental wellness companion. How are you feeling today? I'm here to listen and support you.",
      sender: "bot",
      timestamp: new Date(),
      mood: "supportive"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): { text: string; mood: "supportive" | "concerned" | "encouraging" } => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Simple sentiment analysis and response generation
    if (lowerMessage.includes("sad") || lowerMessage.includes("depressed") || lowerMessage.includes("down")) {
      return {
        text: "I hear that you're going through a difficult time. It's okay to feel sad sometimes - your feelings are valid. Would you like to try a breathing exercise or talk about what's contributing to these feelings?",
        mood: "supportive"
      };
    }
    
    if (lowerMessage.includes("anxious") || lowerMessage.includes("worried") || lowerMessage.includes("stress")) {
      return {
        text: "Anxiety can be really challenging. Let's work through this together. Try taking a slow, deep breath with me. What specific thoughts or situations are making you feel anxious right now?",
        mood: "concerned"
      };
    }
    
    if (lowerMessage.includes("good") || lowerMessage.includes("better") || lowerMessage.includes("happy")) {
      return {
        text: "That's wonderful to hear! I'm so glad you're feeling positive. What's been going well for you today? It's important to celebrate these moments.",
        mood: "encouraging"
      };
    }
    
    if (lowerMessage.includes("help") || lowerMessage.includes("support")) {
      return {
        text: "I'm here to help in any way I can. We can explore coping strategies, practice mindfulness exercises, or simply talk about what's on your mind. What kind of support would be most helpful right now?",
        mood: "supportive"
      };
    }
    
    // Default supportive response
    return {
      text: "Thank you for sharing that with me. I'm here to listen and support you. Can you tell me more about how you're feeling or what's on your mind today?",
      mood: "supportive"
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const { text, mood } = generateBotResponse(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text,
        sender: "bot",
        timestamp: new Date(),
        mood
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      // Show supportive toast for user engagement
      toast({
        title: "Wellness Check",
        description: "Remember to practice self-care today ❤️",
      });
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMoodIcon = (mood?: string) => {
    switch (mood) {
      case "supportive":
        return <Heart className="w-4 h-4 text-primary" />;
      case "concerned":
        return <Sparkles className="w-4 h-4 text-accent-foreground" />;
      case "encouraging":
        return <Sparkles className="w-4 h-4 text-primary" />;
      default:
        return <Bot className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-therapeutic border-primary/10">
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.sender === "bot" && (
                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                  {getMoodIcon(message.mood)}
                </div>
              )}
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg transition-gentle ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground shadow-gentle"
                    : "bg-card border border-primary/20 shadow-gentle"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              {message.sender === "user" && (
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-accent-foreground" />
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="bg-card border border-primary/20 rounded-lg px-4 py-3 shadow-gentle">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-6 border-t border-border/50 bg-gradient-healing">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share how you're feeling today..."
              className="flex-1 transition-gentle focus:shadow-gentle"
            />
            <Button
              onClick={handleSendMessage}
              variant="therapeutic"
              size="icon"
              disabled={!inputValue.trim() || isTyping}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            This is a supportive conversation space. For emergencies, please contact a crisis helpline.
          </p>
        </div>
      </Card>
    </div>
  );
};