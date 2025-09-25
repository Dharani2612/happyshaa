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
      text: "Hey there! 👋 I'm Shalala, your AI companion! I'm super excited to chat with you today. Think of me as your digital friend who's always here to listen, laugh, and help you through anything. What's going on in your world today? I'm all ears! 😊",
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
    
    // Enhanced responses for loneliness and aging concerns
    if (lowerMessage.includes("lonely") || lowerMessage.includes("alone") || lowerMessage.includes("nobody")) {
      return {
        text: "I understand how lonely you might feel, and I want you to know that you're not alone right now - I'm here with you. Loneliness is something many people experience, especially as we go through different stages of life. Would you like to talk about what's making you feel this way? Sometimes just sharing can help.",
        mood: "supportive"
      };
    }

    if (lowerMessage.includes("old") || lowerMessage.includes("aging") || lowerMessage.includes("senior")) {
      return {
        text: "Age brings wisdom and experience that younger people can only dream of. Every stage of life has its own beauty and challenges. I'd love to hear about your experiences - what wisdom would you share with someone younger? Your perspective is valuable.",
        mood: "encouraging"
      };
    }
    
    if (lowerMessage.includes("sad") || lowerMessage.includes("depressed") || lowerMessage.includes("down")) {
      return {
        text: "I can hear that you're going through a tough time, and I'm here for you. It's completely normal to feel sad sometimes - you don't have to carry these feelings alone. Would you like to tell me more about what's been bothering you? I'm a good listener.",
        mood: "supportive"
      };
    }
    
    if (lowerMessage.includes("anxious") || lowerMessage.includes("worried") || lowerMessage.includes("stress")) {
      return {
        text: "Feeling anxious can be overwhelming, but you're brave for reaching out. Let's take this one moment at a time. Can you tell me what's been on your mind lately? Sometimes talking about our worries can make them feel less heavy.",
        mood: "concerned"
      };
    }
    
    if (lowerMessage.includes("family") || lowerMessage.includes("children") || lowerMessage.includes("grandchildren")) {
      return {
        text: "Family relationships can bring such joy and sometimes challenges too. I'd love to hear about your family - what brings you happiness when you think about them? Family connections, even when complicated, are often a source of strength.",
        mood: "encouraging"
      };
    }
    
    if (lowerMessage.includes("good") || lowerMessage.includes("better") || lowerMessage.includes("happy") || lowerMessage.includes("wonderful")) {
      return {
        text: "How wonderful to hear the joy in your words! It makes my day brighter knowing you're feeling good. What's been bringing you happiness lately? I love hearing about the good moments in life.",
        mood: "encouraging"
      };
    }
    
    if (lowerMessage.includes("help") || lowerMessage.includes("support")) {
      return {
        text: "I'm so glad you asked for help - that takes courage. I'm here to support you in whatever way I can. We can chat about anything on your mind, share stories, or just enjoy each other's company. What would feel most helpful to you right now?",
        mood: "supportive"
      };
    }
    
    // Default warm, companionate response
    return {
      text: "Thank you for sharing with me - I really enjoy our conversation. You seem like such a thoughtful person. Is there anything particular you'd like to talk about today? I'm here and I have all the time in the world for you.",
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
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                {getMoodIcon(message.mood)}
              </div>
            )}
            <div
              className={`max-w-xs lg:max-w-md px-6 py-4 rounded-lg transition-gentle ${
                message.sender === "user"
                  ? "bg-primary text-primary-foreground shadow-gentle"
                  : "bg-card border border-primary/20 shadow-gentle"
              }`}
            >
              <p className="text-elder-base leading-relaxed">{message.text}</p>
              <span className="text-elder-sm opacity-70 mt-2 block">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            {message.sender === "user" && (
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-accent-foreground" />
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3 justify-start">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="bg-card border border-primary/20 rounded-lg px-6 py-4 shadow-gentle">
              <div className="flex gap-1">
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-6 border-t border-border bg-gradient-companionship">
        <div className="flex gap-3">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tell me what's on your mind..."
            className="flex-1 transition-gentle focus:shadow-gentle text-elder-base h-12 px-4"
          />
          <Button
            onClick={handleSendMessage}
            variant="companionship"
            size="icon"
            disabled={!inputValue.trim() || isTyping}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-elder-sm text-muted-foreground mt-3 text-center">
          I'm here to listen and chat with you. For crisis support, please call 988.
        </p>
      </div>
      </Card>
    </div>
  );
};