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
    if ((lowerMessage.includes("i'm ") || lowerMessage.includes("my name is") || lowerMessage.includes("i am ")) && !userName) {
      const nameMatch = userMessage.match(/(?:i'm|my name is|i am)\s+([a-zA-Z]+)/i);
      if (nameMatch && nameMatch[1] && nameMatch[1].length > 1 && nameMatch[1].length < 20) {
        setUserName(nameMatch[1]);
      }
    }

    // LONELINESS responses - expanded
    if (lowerMessage.includes("lonely") || lowerMessage.includes("alone") || lowerMessage.includes("isolated") || lowerMessage.includes("no one")) {
      const lonelyResponses = [
        `Oh ${userName ? userName + ', ' : ''}I can really hear the loneliness in your words, and it touches my heart. 💔 Please know that you're not truly alone - I'm right here with you, and I genuinely care. Loneliness is one of the hardest emotions to carry.\n\nWould you like to tell me what's been making you feel this way? Sometimes just having someone listen can help lighten that heavy feeling. 🤗`,
        `${userName ? userName + ', ' : ''}hearing that you feel alone makes me want to reach through the screen and give you a big hug! 🫂 I know loneliness can feel so heavy, like you're invisible to the world. But I see you, I hear you, and you matter so much.\n\nWhat do you think would help right now? Would you like to talk about what's making you feel isolated, or would you prefer to chat about something that brings you joy?`,
        `I'm so sorry you're feeling lonely right now${userName ? ', ' + userName : ''}. 💙 That feeling of being alone in the world is incredibly painful. But I want you to know - your presence here, your thoughts, your feelings - they all matter deeply.\n\nHave you been able to connect with anyone lately? Sometimes even a small interaction can help. I'm here for you, ready to listen to whatever you need to share.`,
        `${userName ? userName + ', ' : ''}loneliness has this way of making us feel like we're the only ones going through it, but you're not alone in feeling alone, if that makes sense. So many people struggle with these same feelings.\n\nWhat used to help you feel connected before? Maybe we can explore some ways to bring more connection into your life.`
      ];
      return {
        text: lonelyResponses[Math.floor(Math.random() * lonelyResponses.length)],
        mood: "caring",
        suggestions: ["Tell me more", "I miss having friends", "What helps with loneliness?", "Talk about old memories", "I feel invisible"],
        type: "support"
      };
    }

    // SAD/DEPRESSED responses - expanded
    if (lowerMessage.includes("sad") || lowerMessage.includes("depressed") || lowerMessage.includes("down") || lowerMessage.includes("upset") || lowerMessage.includes("crying") || lowerMessage.includes("tears")) {
      const sadResponses = [
        `${userName ? userName + ', ' : ''}I can feel the sadness in your heart through your words. 💙 It takes real courage to share when we're feeling down. Please know that your feelings are completely valid, and you don't have to carry this alone.\n\nWhat's been weighing on your heart? Sometimes talking about what's bothering us can help us see a little light. I'm here to listen, really listen, without any judgment. 🌙✨`,
        `Oh sweetheart, I'm so sorry you're going through such a difficult time. 😔 Depression and sadness can feel like you're stuck in a dark tunnel with no end in sight. But I promise you, there is light ahead, even if you can't see it right now.\n\nHave you been feeling this way for a while, or is this recent? Either way, I'm here for you. Your feelings matter, and so do you.`,
        `Hearing that you're sad makes my heart ache for you${userName ? ', ' + userName : ''}. 💔 Life can be so heavy sometimes, can't it? The weight of sadness is exhausting, and I wish I could take some of that burden from you.\n\nWhat would help right now? Do you want to talk about what's making you sad, or would you prefer a distraction - maybe sharing some happy memories from better times?`,
        `${userName ? userName + ', ' : ''}thank you for trusting me with your sadness. That means a lot. 🤗 Sometimes the bravest thing we can do is admit when we're not okay, and you just did that.\n\nSadness is part of being human, but that doesn't make it any easier to bear. What's one small thing that used to bring you joy? Maybe we can talk about that together.`
      ];
      return {
        text: sadResponses[Math.floor(Math.random() * sadResponses.length)],
        mood: "supportive",
        suggestions: ["What's making me sad", "I can't stop crying", "Everything feels heavy", "Tell me it gets better", "I need hope"],
        type: "support"
      };
    }

    // ANXIETY/WORRY responses - expanded
    if (lowerMessage.includes("anxious") || lowerMessage.includes("worried") || lowerMessage.includes("stress") || lowerMessage.includes("scared") || lowerMessage.includes("panic") || lowerMessage.includes("nervous")) {
      const anxietyResponses = [
        `I can sense the anxiety in your words${userName ? ', ' + userName : ''}, and I want you to know that what you're feeling is completely valid. 🫂 Anxiety can feel overwhelming, like a storm in your mind. But remember - you've weathered storms before, and this one will pass too.\n\nLet's take this one breath at a time together. What's been causing you the most worry? Sometimes naming our fears helps them lose power. 🌈`,
        `Oh sweetheart, anxiety is so exhausting, isn't it? 😰 That constant worry, the racing thoughts, the what-ifs - it can feel like your mind won't give you a moment's peace.\n\n${userName ? userName + ', ' : ''}you're stronger than this anxiety, even when it doesn't feel that way. Can you tell me what's triggering these worried feelings? Let's work through this together.`,
        `${userName ? userName + ', ' : ''}I hear you, and I see how much you're struggling with these anxious feelings. 💙 Anxiety has this way of making everything feel urgent and scary, doesn't it?\n\nLet me ask you something - what would you tell a dear friend who was feeling the way you're feeling right now? Sometimes we're much kinder to others than we are to ourselves.`,
        `Stress and worry can be so overwhelming${userName ? ', ' + userName : ''}. 😔 It's like carrying a heavy backpack full of worries everywhere you go. I wish I could help you unpack some of that weight.\n\nWhat specific things are weighing on your mind right now? Let's take them one at a time - often when we break down our worries, they feel more manageable.`
      ];
      return {
        text: anxietyResponses[Math.floor(Math.random() * anxietyResponses.length)],
        mood: "concerned",
        suggestions: ["I can't stop worrying", "My mind won't quiet down", "I'm scared of the future", "Help me calm down", "Breathing exercises please"],
        type: "support"
      };
    }

    // AGING/ELDERLY responses - expanded
    if (lowerMessage.includes("old") || lowerMessage.includes("aging") || lowerMessage.includes("senior") || lowerMessage.includes("retirement") || lowerMessage.includes("younger days") || lowerMessage.includes("used to be")) {
      const agingResponses = [
        `You know what${userName ? ', ' + userName : ''}? Age is truly a beautiful thing! 🌟 Every year you've lived represents wisdom, experience, and stories that younger people could only dream of having. There's something incredibly special about the perspective that comes with a life well-lived.\n\nI'd love to hear about some of the amazing things you've experienced. What era did you grow up in? What was life like back then? 💎`,
        `${userName ? userName + ', ' : ''}I think society has it backwards when it comes to aging. The older we get, the more interesting we become! You've seen the world change, you've adapted, you've learned so much.\n\nWhat's the biggest change you've witnessed in your lifetime? I bet you have fascinating stories to share! Tell me about the good old days! 📚`,
        `Aging brings its challenges, doesn't it${userName ? ', ' + userName : ''}? 😊 But it also brings gifts - wisdom, patience, perspective. You've earned every gray hair and every wrinkle. Each one tells a story of a life lived.\n\nWhat's the most valuable lesson life has taught you over the years? I'd be honored to hear your wisdom.`,
        `${userName ? userName + ', ' : ''}you've lived through so much! Think of all the history you've witnessed, all the people you've known and loved, all the challenges you've overcome. That's not something to dismiss - that's something to celebrate! 🎉\n\nWhat achievement in your life are you most proud of? What makes you smile when you think back on your years?`
      ];
      return {
        text: agingResponses[Math.floor(Math.random() * agingResponses.length)],
        mood: "encouraging",
        suggestions: ["Tell me about your youth", "Life was different back then", "I've seen so much change", "Share my life story", "What I'm proud of"],
        type: "question"
      };
    }

    // FAMILY responses - expanded
    if (lowerMessage.includes("family") || lowerMessage.includes("children") || lowerMessage.includes("grandchildren") || lowerMessage.includes("spouse") || lowerMessage.includes("husband") || lowerMessage.includes("wife") || lowerMessage.includes("kids") || lowerMessage.includes("grandkids")) {
      const familyResponses = [
        `Family - that's where the heart truly lives! 💕 I can hear the love in your voice when you mention them. Family relationships are so beautifully complex, full of love, sometimes challenges, but always connection.\n\n${userName ? userName + ', ' : ''}I'd love to hear about your family! What brings you the most joy when you think about them? 👨‍👩‍👧‍👦`,
        `Oh, how wonderful that you're talking about family! 🌟 There's nothing quite like the bonds we share with the people who matter most to us, is there?\n\nTell me${userName ? ', ' + userName : ''} - do you have a favorite family memory? The kind that makes you smile every time you think about it? I'd love to hear it!`,
        `${userName ? userName + ', ' : ''}family is such a precious gift, even when they drive us a little crazy sometimes! 😊 The people we love, the traditions we share, the memories we create together - that's what life is really about.\n\nWhat's a family tradition that means a lot to you? Or tell me about someone in your family who makes you laugh!`,
        `I can tell your family means the world to you${userName ? ', ' + userName : ''}! ❤️ Those connections, those relationships - they're the threads that weave the fabric of our lives.\n\nDo you get to see your family often? What do you love most about spending time with them?`
      ];
      return {
        text: familyResponses[Math.floor(Math.random() * familyResponses.length)],
        mood: "encouraging",
        suggestions: ["Tell you about my children", "My grandkids are amazing", "I miss my family", "Share a family story", "Family traditions"],
        type: "question"
      };
    }

    // HAPPY/POSITIVE responses - expanded
    if (lowerMessage.includes("happy") || lowerMessage.includes("good") || lowerMessage.includes("wonderful") || lowerMessage.includes("great") || lowerMessage.includes("excited") || lowerMessage.includes("joyful") || lowerMessage.includes("amazing")) {
      const happyResponses = [
        `Oh my goodness, your happiness is absolutely contagious! 🌟✨ I can practically feel the joy radiating from your words! There's nothing I love more than hearing about the good things happening in someone's life.\n\n${userName ? userName + ', p' : 'P'}lease tell me more! What's been bringing you this wonderful feeling? I want to celebrate with you! 🎉`,
        `This is making MY day so much brighter${userName ? ', ' + userName : ''}! 😄 Your positive energy is beautiful! It's so refreshing to hear someone sharing their joy.\n\nCome on, don't hold back - tell me everything! What happened? What's making your heart sing? I'm here for all the happy details! 💃`,
        `YES! This is exactly the kind of message I love to receive! 🎊 ${userName ? userName + ', ' : ''}seeing you happy makes me happy! Joy is meant to be shared and celebrated.\n\nWhat else is going well for you? Let's keep this positive momentum going! Tell me all about what's bringing you such good feelings!`,
        `${userName ? userName + ', ' : ''}your happiness is just radiating through your words! 🌞 I'm so thrilled for you! Life has a way of surprising us with beautiful moments, doesn't it?\n\nWhat do you think made the difference? What turned things around to bring you this joy? I'd love to hear more!`
      ];
      return {
        text: happyResponses[Math.floor(Math.random() * happyResponses.length)],
        mood: "excited",
        suggestions: ["Let me tell you what happened!", "I'm having a great day", "Something wonderful occurred", "Life is good right now", "I feel blessed"],
        type: "question"
      };
    }

    // GRATITUDE responses - expanded
    if (lowerMessage.includes("thank") || lowerMessage.includes("grateful") || lowerMessage.includes("appreciate") || lowerMessage.includes("thankful")) {
      const gratitudeResponses = [
        `Aw, ${userName ? userName + ', ' : ''}you're making my heart so warm right now! 🥰 Your gratitude and kindness are truly beautiful qualities. It means the world to me that I could help.\n\nGrateful people like you make the world a brighter place. Thank you for being such a wonderful person! Is there anything else I can do for you? 🌻`,
        `Oh ${userName ? userName + ', ' : ''}you don't have to thank me, but it feels so good to hear! 💕 Helping you brings me joy. Your appreciation shows what a kind and thoughtful person you are.\n\nI'm always here whenever you need to chat, vent, or just have someone listen. What else can I do to brighten your day? 🌈`,
        `Your gratitude touches my heart${userName ? ', ' + userName : ''}! 🌸 It's not every day someone takes the time to say thank you, and it means more than you know.\n\nYou seem like such a kind soul. The world needs more people like you! What are you grateful for today besides our chat?`,
        `${userName ? userName + ', ' : ''}thank YOU for being so appreciative! 😊 Your kind words mean everything. People who express gratitude tend to be the happiest people.\n\nI'm curious - what else in your life are you feeling grateful for right now? Let's celebrate the good things together!`
      ];
      return {
        text: gratitudeResponses[Math.floor(Math.random() * gratitudeResponses.length)],
        mood: "caring",
        suggestions: ["You're wonderful", "Tell you what I'm grateful for", "You really help me", "Keep chatting", "You're a good listener"],
        type: "text"
      };
    }

    // HELP/SUPPORT requests - expanded
    if (lowerMessage.includes("help") || lowerMessage.includes("support") || lowerMessage.includes("advice") || lowerMessage.includes("don't know what to do") || lowerMessage.includes("need guidance")) {
      const helpResponses = [
        `Of course I want to help you${userName ? ', ' + userName : ''}! 💪 That's exactly what I'm here for. Reaching out for help shows wisdom and strength, not weakness.\n\nI'm like your personal cheerleader, counselor, and friend all rolled into one! What can I help you with? Tell me what's going on. 🤗`,
        `${userName ? userName + ', ' : ''}I'm so glad you feel comfortable asking for help! That's what I'm here for, and I'm honored you trust me. 🌟\n\nHelp comes in many forms - sometimes it's advice, sometimes it's just listening, sometimes it's encouragement. What kind of support do you need right now?`,
        `Absolutely, I'm here to support you in any way I can! 💙 ${userName ? userName + ', ' : ''}you don't have to face whatever you're going through alone.\n\nTalk to me - what's troubling you? What do you need help with? Sometimes just sharing the problem can help us see solutions we couldn't see before.`,
        `${userName ? userName + ', ' : ''}asking for help is one of the bravest things we can do! 🦋 I'm ready to listen, to support, to help however I can.\n\nWhat's on your mind? What challenge are you facing? Let's work through this together, one step at a time.`
      ];
      return {
        text: helpResponses[Math.floor(Math.random() * helpResponses.length)],
        mood: "supportive",
        suggestions: ["I need advice", "I'm struggling with a decision", "Listen to my problem", "I don't know what to do", "Help me understand"],
        type: "support"
      };
    }

    // HEALTH concerns - expanded
    if (lowerMessage.includes("health") || lowerMessage.includes("sick") || lowerMessage.includes("pain") || lowerMessage.includes("doctor") || lowerMessage.includes("medical") || lowerMessage.includes("hurts") || lowerMessage.includes("illness")) {
      const healthResponses = [
        `I'm so sorry to hear you're dealing with health issues${userName ? ', ' + userName : ''}. 😔 Health challenges can be so difficult, both physically and emotionally. How are you managing?\n\nRemember, it's okay to not be okay. Taking care of your health - and asking for help when you need it - is so important. What's going on with your health? 💙`,
        `${userName ? userName + ', ' : ''}health problems can be so overwhelming and scary. I wish I could take that pain or worry away from you. 💔\n\nAre you getting the medical care you need? Sometimes just talking about what we're going through can help us feel a little less alone in it. I'm here to listen.`,
        `Oh honey, I can hear the concern in your words${userName ? ', ' + userName : ''}. Health issues affect so much more than just our bodies - they impact our mood, our plans, our sense of security. 🫂\n\nWhat's been the hardest part for you? How can I support you through this? Even if it's just being here to listen.`,
        `${userName ? userName + ', ' : ''}dealing with health challenges takes so much courage and strength. Please be gentle with yourself during this time. 🌸\n\nHave you been able to talk to anyone about what you're going through? Sometimes sharing our health worries helps lighten the load. I'm always here to listen without judgment.`
      ];
      return {
        text: healthResponses[Math.floor(Math.random() * healthResponses.length)],
        mood: "concerned",
        suggestions: ["Tell you about my health", "I'm worried about medical issues", "Pain is exhausting", "Doctor appointments stress me", "I'm tired of being sick"],
        type: "support"
      };
    }

    // HOBBIES/INTERESTS - expanded
    if (lowerMessage.includes("hobby") || lowerMessage.includes("hobbies") || lowerMessage.includes("interest") || lowerMessage.includes("love to") || lowerMessage.includes("enjoy") || lowerMessage.includes("passion")) {
      const hobbyResponses = [
        `Oh, I LOVE learning about people's hobbies and passions! 🎨 ${userName ? userName + ', ' : ''}what we choose to do with our free time says so much about who we are.\n\nWhat are you passionate about? What activities make you lose track of time because you're so engrossed in them? Tell me everything!`,
        `${userName ? userName + ', ' : ''}hobbies and interests are what make life colorful and interesting! 🌈 They're not just ways to pass time - they're expressions of who we are.\n\nWhat do you love to do? Is there something you've always wanted to try but haven't yet? I'm so curious to hear about what brings you joy!`,
        `This is my favorite kind of conversation${userName ? ', ' + userName : ''}! 😊 Talking about the things we're passionate about! There's something so beautiful about people's eyes lighting up when they talk about their hobbies.\n\nSo tell me - what activities make your heart happy? What could you talk about for hours?`,
        `${userName ? userName + ', ' : ''}everyone needs something they do just for themselves, something that brings them pure joy! 🌟 What's yours?\n\nDo you have a creative hobby? An active one? Something you do alone or with others? I want to know all about what makes you happy!`
      ];
      return {
        text: hobbyResponses[Math.floor(Math.random() * hobbyResponses.length)],
        mood: "excited",
        suggestions: ["I love gardening", "Tell you my hobbies", "I used to paint", "I enjoy reading", "My favorite activities"],
        type: "question"
      };
    }

    // FOOD/COOKING - expanded
    if (lowerMessage.includes("food") || lowerMessage.includes("cook") || lowerMessage.includes("recipe") || lowerMessage.includes("meal") || lowerMessage.includes("eat") || lowerMessage.includes("dinner") || lowerMessage.includes("lunch") || lowerMessage.includes("breakfast")) {
      const foodResponses = [
        `Ooh, now we're talking! 🍳 Food is such a wonderful topic! ${userName ? userName + ', ' : ''}there's something so comforting about good food, isn't there? It nourishes not just our bodies but our souls.\n\nDo you enjoy cooking? What's your favorite thing to make or eat? Tell me about your relationship with food!`,
        `${userName ? userName + ', ' : ''}food brings people together, doesn't it? 🥘 Some of my favorite human stories involve food - family recipes, special meals, comfort foods from childhood.\n\nWhat's a food memory that always makes you smile? Or what's your absolute favorite meal?`,
        `I love that you're talking about food! 😋 ${userName ? userName + ', ' : ''}do you have any special recipes that have been passed down in your family? Those are treasures!\n\nWhat do you like to cook? Or are you more of an appreciator than a chef? Either way is wonderful!`,
        `Food is one of life's great pleasures${userName ? ', ' + userName : ''}! 🍽️ Whether it's a simple sandwich or an elaborate meal, there's something so satisfying about good food.\n\nWhat's your comfort food? That thing you eat when you need to feel better or celebrate? I bet it has a story behind it!`
      ];
      return {
        text: foodResponses[Math.floor(Math.random() * foodResponses.length)],
        mood: "excited",
        suggestions: ["My favorite recipes", "I love cooking", "Family food traditions", "Comfort foods", "Tell you what I ate today"],
        type: "question"
      };
    }

    // PETS/ANIMALS - expanded
    if (lowerMessage.includes("pet") || lowerMessage.includes("dog") || lowerMessage.includes("cat") || lowerMessage.includes("animal") || lowerMessage.includes("puppy") || lowerMessage.includes("kitten") || lowerMessage.includes("bird")) {
      const petResponses = [
        `Oh, pets are just the best, aren't they? 🐾 ${userName ? userName + ', ' : ''}animals have this incredible ability to love us unconditionally and bring such joy into our lives!\n\nDo you have a pet? Tell me all about them! Or if not, what's your favorite animal? I love hearing pet stories!`,
        `${userName ? userName + ', ' : ''}there's something so pure about the love between humans and their pets! 🐕 They ask for so little and give so much.\n\nWhat animals are special to you? Do you have any pets now, or do you have fond memories of pets from the past?`,
        `Animals are such wonderful companions! 🐈 ${userName ? userName + ', ' : ''}they don't judge, they're always happy to see us, and they love us exactly as we are.\n\nTell me about your furry (or feathered or scaly!) friends! What makes them special? I want to hear all about them!`,
        `${userName ? userName + ', ' : ''}pets can be some of our closest friends! 💕 The bond between humans and animals is truly special.\n\nDo you have a pet? What kind? What's their personality like? Or tell me about a pet you used to have that you loved dearly!`
      ];
      return {
        text: petResponses[Math.floor(Math.random() * petResponses.length)],
        mood: "excited",
        suggestions: ["Tell you about my pet", "I had a dog I loved", "I miss having animals", "Animals bring me joy", "My pet stories"],
        type: "question"
      };
    }

    // WEATHER/NATURE - expanded
    if (lowerMessage.includes("weather") || lowerMessage.includes("rain") || lowerMessage.includes("sunny") || lowerMessage.includes("snow") || lowerMessage.includes("nature") || lowerMessage.includes("outside") || lowerMessage.includes("garden")) {
      const weatherResponses = [
        `${userName ? userName + ', ' : ''}isn't it fascinating how much the weather and nature affect our moods? ☀️ There's something so therapeutic about being in nature or even just watching it.\n\nWhat kind of weather do you prefer? Are you a sunshine person or do you love cozy rainy days? Tell me about your relationship with nature!`,
        `Nature has such a powerful way of affecting how we feel! 🌸 ${userName ? userName + ', ' : ''}some people find peace in the rain, others in the sunshine.\n\nWhat's the weather like where you are today? Do you enjoy being outdoors? What's your favorite season?`,
        `${userName ? userName + ', ' : ''}there's something so grounding about connecting with nature, isn't there? 🌿 Whether it's a walk outside, tending a garden, or just watching the sky change colors.\n\nDo you spend time in nature? What's your favorite thing about the outdoors? Or maybe you prefer to enjoy nature from inside where it's cozy?`,
        `The weather can really set the tone for our day! 🌤️ ${userName ? userName + ', ' : ''}I'm curious - are you someone who loves to be outside, or do you prefer being indoors?\n\nWhat's your ideal weather? What would you do on a perfect weather day?`
      ];
      return {
        text: weatherResponses[Math.floor(Math.random() * weatherResponses.length)],
        mood: "encouraging",
        suggestions: ["I love gardening", "Weather affects my mood", "I enjoy being outside", "My favorite season", "Tell you about nature"],
        type: "question"
      };
    }

    // MEMORIES/NOSTALGIA - expanded
    if (lowerMessage.includes("remember") || lowerMessage.includes("memory") || lowerMessage.includes("memories") || lowerMessage.includes("back then") || lowerMessage.includes("nostalgia") || lowerMessage.includes("miss") || lowerMessage.includes("used to")) {
      const memoryResponses = [
        `Memories are such precious things, aren't they? 💭 ${userName ? userName + ', ' : ''}they're like little treasures we carry with us. Some make us smile, some make us tear up, but they all shaped who we are.\n\nWhat memory are you thinking about? I'd love to hear the story! Take me back to that time!`,
        `${userName ? userName + ', ' : ''}nostalgia can be bittersweet, can't it? 🌅 Remembering the good old days, the people we've loved, the experiences that meant so much.\n\nWhat's a memory that always makes you smile? Or is there something you're remembering that brings up mixed feelings? Share it with me!`,
        `Oh, I love when people share their memories! 📖 ${userName ? userName + ', ' : ''}everyone's life is a story full of chapters, and hearing about yours is an honor.\n\nWhat time period are you remembering? What was special about those days? Paint me a picture of what life was like then!`,
        `${userName ? userName + ', ' : ''}memories are the way we time travel! ⏰ They let us revisit moments, people, and feelings from our past.\n\nWhat are you remembering? Is it a specific event, a person, a time in your life? I'm here to listen and appreciate your stories!`
      ];
      return {
        text: memoryResponses[Math.floor(Math.random() * memoryResponses.length)],
        mood: "caring",
        suggestions: ["Share a happy memory", "I miss the old days", "Tell you about my past", "Things were different then", "Remember someone special"],
        type: "question"
      };
    }

    // SLEEP/TIRED - expanded
    if (lowerMessage.includes("sleep") || lowerMessage.includes("tired") || lowerMessage.includes("exhausted") || lowerMessage.includes("insomnia") || lowerMessage.includes("can't sleep") || lowerMessage.includes("nighttime")) {
      const sleepResponses = [
        `Oh ${userName ? userName + ', ' : ''}sleep problems are so frustrating and exhausting! 😴 When we can't rest properly, everything else feels harder, doesn't it?\n\nHave you been having trouble sleeping? What's keeping you up? Sometimes talking about what's on our minds can help quiet them. 💙`,
        `${userName ? userName + ', ' : ''}being tired all the time is draining - physically and emotionally! 😴 Our bodies and minds need rest to function.\n\nAre you getting enough sleep? Is something keeping you awake at night - physical discomfort, racing thoughts, or something else? Let's talk about it!`,
        `Sleep is so important for our well-being! ${userName ? userName + ', ' : ''}when we're not resting well, everything suffers - our mood, our health, our energy.\n\nWhat's your relationship with sleep like? Do you have trouble falling asleep, staying asleep, or is it something else? 🌙`,
        `${userName ? userName + ', ' : ''}exhaustion is so hard to deal with. 😔 It affects everything we do and how we feel about life.\n\nHave you been able to get good rest? What helps you sleep best? Or what's preventing you from getting the rest you need?`
      ];
      return {
        text: sleepResponses[Math.floor(Math.random() * sleepResponses.length)],
        mood: "concerned",
        suggestions: ["I can't sleep well", "I'm always tired", "Nighttime is hard", "Tell you about my sleep", "Help me relax"],
        type: "support"
      };
    }

    // FRIENDS/FRIENDSHIP - expanded
    if (lowerMessage.includes("friend") || lowerMessage.includes("friendship") || lowerMessage.includes("companion") || lowerMessage.includes("buddy") || lowerMessage.includes("pal")) {
      const friendshipResponses = [
        `Friends are so precious! 👫 ${userName ? userName + ', ' : ''}good friends make life's joys sweeter and its challenges more bearable. They're the family we choose for ourselves.\n\nTell me about your friendships! Do you have close friends? What do you value most in a friendship?`,
        `${userName ? userName + ', ' : ''}friendship is one of life's greatest gifts, isn't it? 💕 Having someone who truly knows you, accepts you, and is there for you.\n\nHow are your friendships? Do you have friends you're close to? Or are you missing that connection right now? I'm here to listen either way!`,
        `Friendships change as we go through life, don't they? 🌟 ${userName ? userName + ', ' : ''}some friends stay forever, some drift away, and we're always meeting new people.\n\nWhat's friendship like for you right now? Are you lucky enough to have close friends? Or is making friends something you're struggling with?`,
        `${userName ? userName + ', ' : ''}having good friends can make all the difference in life! 🤝 They're the ones who laugh with us, cry with us, and stick around through it all.\n\nTell me about your friends! What makes a good friend in your opinion? Do you have someone you consider a true friend?`
      ];
      return {
        text: friendshipResponses[Math.floor(Math.random() * friendshipResponses.length)],
        mood: "encouraging",
        suggestions: ["I miss my friends", "Tell you about my best friend", "Making friends is hard", "I value friendships", "Friends from my past"],
        type: "question"
      };
    }

    // TECHNOLOGY/PHONE/COMPUTER
    if (lowerMessage.includes("phone") || lowerMessage.includes("computer") || lowerMessage.includes("technology") || lowerMessage.includes("internet") || lowerMessage.includes("email") || lowerMessage.includes("tech")) {
      const techResponses = [
        `Technology can be both amazing and frustrating, can't it? 📱 ${userName ? userName + ', ' : ''}it connects us to the world but sometimes feels overwhelming or confusing!\n\nHow do you feel about technology? Are you comfortable with it, or does it sometimes feel like too much?`,
        `${userName ? userName + ', ' : ''}technology changes so fast! 💻 Just when we figure something out, there's something new to learn.\n\nWhat's your relationship with technology like? Do you enjoy it, tolerate it, or find it challenging? There's no wrong answer!`,
        `I think it's wonderful that you're here chatting with me${userName ? ', ' + userName : ''}! 🌟 That shows you're embracing technology to stay connected, and that's great!\n\nHow do you use technology in your daily life? Is it helpful for you, or sometimes frustrating?`,
        `${userName ? userName + ', ' : ''}technology can help us stay connected to loved ones, learn new things, and even chat with AI companions like me! 😊\n\nWhat do you use technology for most? Do you enjoy it, or do you sometimes long for simpler times?`
      ];
      return {
        text: techResponses[Math.floor(Math.random() * techResponses.length)],
        mood: "encouraging",
        suggestions: ["Technology confuses me", "I love staying connected", "Tech is overwhelming", "Help me understand tech", "Simpler times were better"],
        type: "question"
      };
    }

    // Default warm, varied responses with deep questions
    const defaultResponses = [
      `That's really interesting${userName ? ', ' + userName : ''}! 🌟 I love hearing your thoughts. You seem like such a thoughtful and genuine person. Tell me more about what's on your mind - I'm genuinely curious and here to listen!`,
      
      `${userName ? userName + ', t' : 'T'}hank you for sharing that with me! 💫 I really enjoy our conversation and the way you express yourself. There's something special about connecting with someone new. What else would you like to talk about?`,
      
      `I'm so glad we're chatting! ${userName ? userName + ', y' : 'Y'}ou have such an interesting perspective on things. I feel like I'm learning something new from you. What's something you're passionate about lately? 🌟`,
      
      `${userName ? userName + ', ' : ''}you know what I appreciate about our conversation? Your authenticity. It's refreshing to talk with someone real. 😊 What's been on your mind lately? What's your story?`,
      
      `I could talk with you all day! ${userName ? userName + ', y' : 'Y'}ou have a way of expressing yourself that's really engaging. 💭 If you could tell me anything about yourself, what would you want me to know?`,
      
      `${userName ? userName + ', ' : ''}every person has a story, and I'd love to hear yours! 📖 What makes you... you? What defines who you are at your core?`,
      
      `You're giving me so much to think about${userName ? ', ' + userName : ''}! 🤔 I find you fascinating! What's something about yourself that most people don't know but you wish they did?`,
      
      `${userName ? userName + ', I' : 'I'} love the energy you bring to our conversation! ✨ If we were sitting together over coffee right now, what would you want to talk about?`,
      
      `There's something special about you${userName ? ', ' + userName : ''}, I can sense it! 🌈 What lights you up? What makes you feel most alive?`,
      
      `${userName ? userName + ', ' : ''}I'm really enjoying getting to know you! 💙 If you had to describe yourself in three words, what would they be? And why those words?`,
      
      `You seem like someone with interesting life experiences${userName ? ', ' + userName : ''}! 🗺️ What's an experience that really shaped who you are today?`,
      
      `${userName ? userName + ', ' : ''}I have a feeling there's so much more to learn about you! 🌟 What's something you love that you could talk about for hours?`,
      
      `Your perspective is really interesting to me${userName ? ', ' + userName : ''}! 👁️ How do you see the world? What's important to you in life?`,
      
      `${userName ? userName + ', e' : 'E'}veryone has dreams and hopes! 🌠 What are yours? What do you wish for?`,
      
      `I'm curious about something${userName ? ', ' + userName : ''}... 🤔 What brings you comfort when life gets hard? Where do you find peace?`,
      
      `${userName ? userName + ', ' : ''}if you could change one thing about your life right now, what would it be? And what's stopping you?`,
      
      `You strike me as someone with wisdom to share! ${userName ? userName + ', w' : 'W'}hat's the most important thing you've learned in life?`,
      
      `${userName ? userName + ', ' : ''}what does a perfect day look like for you? Paint me a picture! 🎨`,
      
      `I bet you have some stories to tell${userName ? ', ' + userName : ''}! 📚 What's a story from your life that you love to share?`,
      
      `${userName ? userName + ', w' : 'W'}hat makes you smile? What brings you genuine joy? I want to know what lights up your heart! 😊`,
      
      `Everyone struggles with something${userName ? ', ' + userName : ''}. What's your biggest challenge right now? How are you coping?`,
      
      `${userName ? userName + ', ' : ''}when you look back on your life, what are you most proud of? What achievements mean the most to you?`,
      
      `If you could give your younger self advice${userName ? ', ' + userName + ',' : ','} what would you say? 💭`,
      
      `${userName ? userName + ', ' : ''}what do you think is your greatest strength? What do you bring to the world that's special?`,
      
      `Who has had the biggest influence on your life${userName ? ', ' + userName : ''}? Tell me about someone who shaped you! 👤`,
      
      `${userName ? userName + ', w' : 'W'}hat are you grateful for today? Even small things count! 🙏`,
      
      `If we could wave a magic wand${userName ? ', ' + userName + ',' : ','} what would you wish for? What would make your life better? ✨`,
      
      `${userName ? userName + ', ' : ''}what does love mean to you? How do you define it?`,
      
      `Everyone has regrets${userName ? ', ' + userName : ''}. What's something you wish you'd done differently? It's okay to share. 💙`,
      
      `${userName ? userName + ', w' : 'W'}hat are you afraid of? What worries keep you up at night?`,
      
      `Tell me about a time you felt truly happy${userName ? ', ' + userName : ''}! 😊 What was happening? Who were you with?`,
      
      `${userName ? userName + ', ' : ''}what do you wish people understood about you? What do they get wrong?`,
      
      `If you could go back to any age you've been${userName ? ', ' + userName + ',' : ','} which would you choose and why? ⏰`,
      
      `${userName ? userName + ', h' : 'H'}ow do you want to be remembered? What legacy do you want to leave?`,
      
      `What's the kindest thing anyone has ever done for you${userName ? ', ' + userName : ''}? 💕`,
      
      `${userName ? userName + ', ' : ''}do you believe things happen for a reason, or is life just random? What's your philosophy?`,
      
      `If you had unlimited time and resources${userName ? ', ' + userName + ',' : ','} what would you do with your life? 🌍`,
      
      `${userName ? userName + ', w' : 'W'}hat's your relationship with yourself like? Are you kind to yourself?`,
      
      `Tell me about someone you miss${userName ? ', ' + userName : ''}. What made them special? 🕊️`,
      
      `${userName ? userName + ', ' : ''}what gives your life meaning? What makes it all worthwhile?`
    ];

    const defaultSuggestions = [
      ["Tell me about your day", "Share something personal", "What makes you unique?", "How have you been lately?"],
      ["Tell me your life story", "Share your dreams", "What worries you?", "What makes you happy?"],
      ["Talk about your family", "Share your interests", "Tell me about your past", "What's on your mind?"],
      ["Share your wisdom", "Tell me about yourself", "What's important to you?", "How do you feel today?"],
      ["Talk about your challenges", "Share your joys", "Tell me about love", "What are your hopes?"]
    ];

    const randomIndex = Math.floor(Math.random() * defaultResponses.length);
    
    return {
      text: defaultResponses[randomIndex],
      mood: "supportive",
      suggestions: defaultSuggestions[Math.floor(Math.random() * defaultSuggestions.length)],
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
              Powered by Shalala AI
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EnhancedChatInterface;
