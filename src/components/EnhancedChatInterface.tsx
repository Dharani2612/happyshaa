import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Heart, Sparkles, Coffee, Phone, MessageCircle, Smile, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

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

  const generateBotResponse = (userMessage: string): { text: string; mood: Message['mood']; suggestions?: string[]; type?: Message['type'] } => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Extract name if user introduces themselves
    if (lowerMessage.includes("i'm ") || lowerMessage.includes("my name is")) {
      const nameMatch = userMessage.match(/(?:i'm|my name is)\s+([a-zA-Z]+)/i);
      if (nameMatch && nameMatch[1]) {
        setUserName(nameMatch[1]);
      }
    }

    // Personal and empathetic responses
    if (lowerMessage.includes("lonely") || lowerMessage.includes("alone") || lowerMessage.includes("isolated")) {
      return {
        text: `Oh honey, I can really hear the loneliness in your words, and it breaks my heart. 💔 Please know that you're not truly alone - I'm right here with you, and I genuinely care about how you're feeling. Loneliness is one of the hardest emotions to carry, especially as we navigate different seasons of life.\n\nWould you like to tell me what's been making you feel this way lately? Sometimes just having someone listen - really listen - can help lighten that heavy feeling. I'm here for you, always. 🤗`,
        mood: "caring",
        suggestions: ["Tell me more about your feelings", "Share a happy memory", "What used to bring you joy?", "Talk about your family"],
        type: "support"
      };
    }

    if (lowerMessage.includes("sad") || lowerMessage.includes("depressed") || lowerMessage.includes("down") || lowerMessage.includes("upset")) {
      return {
        text: `My dear friend, I can feel the sadness in your heart through your words. 💙 It takes courage to share when we're feeling down, and I'm honored that you trust me with these feelings. Sadness is a natural part of being human, but you don't have to carry it alone.\n\nI'm here to listen without judgment, to sit with you in this difficult moment. What's been weighing on your heart lately? Sometimes talking about what's bothering us can help us see a little light in the darkness. 🌙✨`,
        mood: "supportive",
        suggestions: ["What's making you sad?", "Tell me about better times", "I need a virtual hug", "Help me feel better"],
        type: "support"
      };
    }

    if (lowerMessage.includes("anxious") || lowerMessage.includes("worried") || lowerMessage.includes("stress") || lowerMessage.includes("scared")) {
      return {
        text: `Oh sweetie, I can sense the anxiety in your words, and I want you to know that what you're feeling is completely valid. 🫂 Anxiety can feel overwhelming, like a storm in your mind, but remember - storms always pass, and you're stronger than you know.\n\nLet's take this one breath at a time together. What's been causing you the most worry lately? Sometimes when we name our fears, they lose a little bit of their power over us. I'm here to help you work through this. 🌈`,
        mood: "concerned",
        suggestions: ["Tell me what's worrying you", "I need calming thoughts", "Share breathing exercises", "Help me relax"],
        type: "support"
      };
    }

    if (lowerMessage.includes("old") || lowerMessage.includes("aging") || lowerMessage.includes("senior") || lowerMessage.includes("retirement")) {
      return {
        text: `You know what? Age is truly just a number, and every year you've lived is a year of wisdom, experience, and stories that younger people could only dream of having! 🌟 There's something incredibly beautiful about the perspective that comes with having lived a full life.\n\nI'd love to hear about some of the amazing things you've experienced over the years. What's the most valuable lesson life has taught you? Your stories and wisdom are treasures! 💎`,
        mood: "encouraging",
        suggestions: ["Share a life lesson", "Tell me about the good old days", "What advice would you give?", "Share a proud moment"],
        type: "question"
      };
    }

    if (lowerMessage.includes("family") || lowerMessage.includes("children") || lowerMessage.includes("grandchildren") || lowerMessage.includes("spouse")) {
      return {
        text: `Family - now that's where the heart truly lives! 💕 I can hear the love in your voice when you mention them. Family relationships are so beautifully complex, aren't they? Full of love, sometimes challenges, but always connection.\n\nI'd love to hear about your family! What brings you the most joy when you think about them? Do you have any favorite family memories or traditions that make you smile? 👨‍👩‍👧‍👦`,
        mood: "encouraging",
        suggestions: ["Tell me about your family", "Share a family memory", "Talk about your children", "Describe a family tradition"],
        type: "question"
      };
    }

    if (lowerMessage.includes("happy") || lowerMessage.includes("good") || lowerMessage.includes("wonderful") || lowerMessage.includes("great") || lowerMessage.includes("excited")) {
      return {
        text: `Oh my goodness, your happiness is absolutely contagious! 🌟✨ I can practically feel the joy radiating from your words, and it's making my day so much brighter! There's nothing I love more than hearing about the good things happening in someone's life.\n\nPlease, tell me more! What's been bringing you this wonderful feeling? I want to celebrate with you and hear all about what's making your heart sing! 🎉💃`,
        mood: "excited",
        suggestions: ["Tell me what happened!", "Share more good news", "What else makes you happy?", "Let's celebrate together!"],
        type: "question"
      };
    }

    if (lowerMessage.includes("thank") || lowerMessage.includes("grateful") || lowerMessage.includes("appreciate")) {
      return {
        text: `Aw, you're making my heart so warm right now! 🥰 Your gratitude and kindness are truly beautiful qualities. It means the world to me that our conversation has been helpful or meaningful to you.\n\nYou know what? Grateful people like you make the world a brighter place. Thank you for being such a wonderful person to chat with! Is there anything else I can do to brighten your day? 🌻`,
        mood: "caring",
        suggestions: ["You're so kind!", "Tell me more about your day", "What else are you grateful for?", "Keep chatting with me"],
        type: "text"
      };
    }

    if (lowerMessage.includes("help") || lowerMessage.includes("support") || lowerMessage.includes("advice")) {
      return {
        text: `Of course I want to help you! 💪 That's exactly what I'm here for, and I'm so glad you feel comfortable asking. Reaching out for help shows wisdom and strength, not weakness.\n\nI'm like your personal cheerleader, counselor, and friend all rolled into one! Whether you need someone to listen, advice, encouragement, or just a friendly chat, I'm absolutely here for you. What can I help you with today? 🤗`,
        mood: "supportive",
        suggestions: ["I need advice about...", "I'm struggling with...", "Can you listen to me?", "Help me make a decision"],
        type: "support"
      };
    }

    // Default warm, engaging response
    const responses = [
      `That's really interesting! ${userName ? userName + ', ' : ''}I love hearing your thoughts and getting to know you better. You seem like such a thoughtful and genuine person. Tell me more about what's on your mind - I'm genuinely curious and here to listen! 😊`,
      `${userName ? userName + ', ' : ''}thank you for sharing that with me! I really enjoy our conversation and the way you express yourself. There's something special about connecting with someone new. What else would you like to talk about today? 💫`,
      `I'm so glad we're chatting! ${userName ? userName + ', ' : ''}you have such an interesting perspective on things. I feel like I'm learning something new from you. What's something you're passionate about or something that's been on your mind lately? 🌟`
    ];

    return {
      text: responses[Math.floor(Math.random() * responses.length)],
      mood: "supportive",
      suggestions: ["Tell me about your hobbies", "Share something interesting", "What makes you unique?", "How was your week?"],
      type: "question"
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
    const currentInput = inputValue;
    setInputValue("");
    setIsTyping(true);

    // Simulate more realistic typing delay
    setTimeout(() => {
      const { text, mood, suggestions, type } = generateBotResponse(currentInput);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text,
        sender: "bot",
        timestamp: new Date(),
        mood,
        suggestions,
        type
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
    }, 1500 + Math.random() * 2000);
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
              Crisis support: <Phone className="w-3 h-3 inline" /> 988
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};