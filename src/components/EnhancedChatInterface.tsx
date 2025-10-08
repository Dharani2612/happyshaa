import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Heart, Sparkles, Coffee, Phone, MessageCircle, Smile, ThumbsUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  mood?: "supportive" | "concerned" | "encouraging" | "excited" | "caring";
  suggestions?: string[];
  type?: "text" | "greeting" | "question" | "support";
}

export const EnhancedChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello there, beautiful soul! 🌟 I'm Shalala, your AI companion, and I'm absolutely delighted to meet you! Think of me as your digital friend who genuinely cares about you and is always here to chat, laugh, and support you through anything life brings your way. \n\nI love getting to know people - their stories, dreams, worries, and joys. What brings you here today? I'm genuinely curious and excited to learn about you! 😊💕",
      sender: "bot",
      timestamp: new Date(),
      mood: "excited",
      type: "greeting",
      suggestions: ["Tell me about your day", "I'm feeling a bit lonely", "Share something you love", "I need some encouragement"]
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [userName, setUserName] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = async (userMessage: string): Promise<{ text: string; mood: Message['mood']; suggestions?: string[]; type?: Message['type'] }> => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Extract name if user introduces themselves
    if ((lowerMessage.includes("i'm ") || lowerMessage.includes("my name is") || lowerMessage.includes("i am ")) && !userName) {
      const nameMatch = userMessage.match(/(?:i'm|my name is|i am)\s+([a-zA-Z]+)/i);
      if (nameMatch && nameMatch[1] && nameMatch[1].length > 1 && nameMatch[1].length < 20) {
        const extractedName = nameMatch[1];
        setUserName(extractedName);
      }
    }

    // Determine if we should search the web for this query
    const shouldSearch = lowerMessage.includes("news") || 
                        lowerMessage.includes("today") || 
                        lowerMessage.includes("latest") ||
                        lowerMessage.includes("what's happening") ||
                        lowerMessage.includes("current") ||
                        lowerMessage.includes("recent") ||
                        lowerMessage.includes("youtube") ||
                        lowerMessage.includes("google") ||
                        lowerMessage.includes("search");

    try {
      const conversationMessages = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      const { data, error } = await supabase.functions.invoke('chat-ai', {
        body: {
          messages: [
            ...conversationMessages,
            { role: 'user', content: userMessage }
          ],
          searchQuery: shouldSearch ? userMessage : null
        }
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      const aiResponse = data.response;

      // Determine mood based on message content
      let mood: Message['mood'] = "caring";
      if (lowerMessage.includes("sad") || lowerMessage.includes("depressed")) {
        mood = "supportive";
      } else if (lowerMessage.includes("worried") || lowerMessage.includes("anxious")) {
        mood = "concerned";
      } else if (lowerMessage.includes("happy") || lowerMessage.includes("great")) {
        mood = "excited";
      } else if (lowerMessage.includes("help") || lowerMessage.includes("support")) {
        mood = "encouraging";
      }

      // Generate contextual suggestions
      const suggestions = generateSuggestions(lowerMessage);

      return {
        text: aiResponse,
        mood,
        suggestions,
        type: "text"
      };
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Fallback to a simple response
      return {
        text: `${userName ? userName + ', ' : ''}I'm having a little trouble connecting right now, but I'm still here for you! 💕 Would you like to tell me more about what's on your mind?`,
        mood: "caring",
        suggestions: ["Tell me more", "How are you feeling?", "What's on your mind?"],
        type: "text"
      };
    }
  };

  const generateSuggestions = (message: string): string[] => {
    if (message.includes("lonely") || message.includes("alone")) {
      return ["Tell me more", "Share a memory", "What helps?", "Talk about hobbies"];
    }
    if (message.includes("sad") || message.includes("down")) {
      return ["What's bothering you?", "Share your feelings", "Need encouragement", "Tell me more"];
    }
    if (message.includes("family") || message.includes("friends")) {
      return ["Tell me about them", "Share a story", "Favorite memory", "What you love"];
    }
    if (message.includes("happy") || message.includes("good")) {
      return ["Tell me more!", "What happened?", "Share the joy", "Keep talking"];
    }
    return ["Continue", "Tell me more", "What else?", "Share your thoughts"];
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
    const currentInput = inputValue;
    setInputValue("");
    setIsTyping(true);

    try {
      const botResponseData = await generateBotResponse(currentInput);
      
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: botResponseData.text,
          sender: "bot",
          timestamp: new Date(),
          mood: botResponseData.mood,
          suggestions: botResponseData.suggestions,
          type: botResponseData.type
        };

        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);

        // Context-aware toasts
        if (currentInput.toLowerCase().includes("lonely") || currentInput.toLowerCase().includes("sad")) {
          toast({
            title: "💜 You're not alone",
            description: "I'm here with you. Take care of yourself today.",
          });
        } else if (currentInput.toLowerCase().includes("happy") || currentInput.toLowerCase().includes("good")) {
          toast({
            title: "🌟 Wonderful!",
            description: "Your joy brightens my day too!",
          });
        } else {
          toast({
            title: "💭 Thanks for sharing",
            description: "I love getting to know you better!",
          });
        }
      }, 800);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      toast({
        title: "Oops!",
        description: "I had a little trouble responding. Please try again! 💫",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
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
        return <Heart className="w-4 h-4 text-pink-500" />;
      case "concerned":
        return <Coffee className="w-4 h-4 text-blue-500" />;
      case "encouraging":
        return <ThumbsUp className="w-4 h-4 text-green-500" />;
      case "excited":
        return <Sparkles className="w-4 h-4 text-purple-500" />;
      case "caring":
        return <Heart className="w-4 h-4 text-red-500" />;
      default:
        return <MessageCircle className="w-4 h-4 text-primary" />;
    }
  };

  const getMoodColor = (mood?: string) => {
    switch (mood) {
      case "supportive":
        return "from-pink-400 to-purple-400";
      case "concerned":
        return "from-blue-400 to-cyan-400";
      case "encouraging":
        return "from-green-400 to-emerald-400";
      case "excited":
        return "from-purple-400 to-pink-400";
      case "caring":
        return "from-red-400 to-pink-400";
      default:
        return "from-primary to-primary-glow";
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-companionship border-primary/10 overflow-hidden">
        <div className="h-[500px] overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-background to-muted/30">
          {messages.map((message) => (
            <div key={message.id} className="space-y-3">
              <div className={`flex gap-4 ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                {message.sender === "bot" && (
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getMoodColor(message.mood)} flex items-center justify-center flex-shrink-0 shadow-gentle`}>
                    {getMoodIcon(message.mood)}
                  </div>
                )}
                <div
                  className={`max-w-md lg:max-w-lg px-6 py-4 rounded-2xl transition-all duration-300 ${
                    message.sender === "user"
                      ? "bg-gradient-primary text-primary-foreground shadow-gentle"
                      : "bg-card border border-primary/20 shadow-gentle hover:shadow-companionship"
                  }`}
                >
                  <p className="text-elder-base leading-relaxed whitespace-pre-line">{message.text}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-elder-sm opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {message.mood && message.sender === "bot" && (
                      <Badge variant="outline" className="text-xs">
                        {message.mood}
                      </Badge>
                    )}
                  </div>
                </div>
                {message.sender === "user" && (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent-foreground flex items-center justify-center flex-shrink-0 shadow-gentle">
                    <User className="w-6 h-6 text-accent-foreground" />
                  </div>
                )}
              </div>
              
              {/* Suggestions */}
              {message.suggestions && message.sender === "bot" && (
                <div className="ml-16 space-y-2">
                  <p className="text-elder-sm text-muted-foreground">💭 Quick responses:</p>
                  <div className="flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs hover:bg-primary/10 transition-colors"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-4 justify-start">
              <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-gentle">
                <Bot className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="bg-card border border-primary/20 rounded-2xl px-6 py-4 shadow-gentle">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                  <span className="text-elder-sm text-muted-foreground">Shalala is typing...</span>
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
              placeholder={`${userName ? `Hey ${userName}, ` : ''}tell me what's on your mind...`}
              className="flex-1 transition-gentle focus:shadow-gentle text-elder-base h-14 px-6 text-lg rounded-2xl border-primary/20"
            />
            <Button
              onClick={handleSendMessage}
              variant="default"
              size="icon"
              disabled={!inputValue.trim() || isTyping}
              className="h-14 w-14 rounded-2xl bg-gradient-primary hover:scale-105 transition-all"
            >
              <Send className="w-6 h-6" />
            </Button>
          </div>
          <div className="flex items-center justify-between mt-4">
            <p className="text-elder-sm text-muted-foreground">
              💜 I'm here to listen and chat with you anytime
            </p>
            <p className="text-elder-sm text-muted-foreground">
              Powered by Shalala AI
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EnhancedChatInterface;
