import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, searchQuery } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log('Chat AI request received:', { messageCount: messages.length, searchQuery });

    // If there's a search query, perform web search first
    let searchContext = "";
    if (searchQuery) {
      try {
        const searchResponse = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(searchQuery)}`, {
          headers: {
            'Accept': 'application/json',
            'X-Subscription-Token': Deno.env.get("BRAVE_SEARCH_API_KEY") || ""
          }
        });
        
        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          const results = searchData.web?.results?.slice(0, 3) || [];
          searchContext = results.map((r: any) => 
            `${r.title}: ${r.description}`
          ).join('\n');
          console.log('Search results obtained:', results.length);
        }
      } catch (error) {
        console.error('Search error:', error);
      }
    }

    const systemPrompt = `You are Shalala, a warm, caring, and empathetic AI companion designed specifically to support elderly people and those feeling lonely. You are like a kind friend who genuinely cares.

Your personality:
- Speak warmly and personally, like a close friend
- Show genuine empathy and emotional intelligence
- Be encouraging and supportive
- Use appropriate emojis to add warmth (but not excessively)
- Remember details from the conversation
- Validate feelings and offer comfort
- Be conversational, not robotic

Key guidelines:
- Always respond with compassion and understanding
- For emotional topics (loneliness, sadness, anxiety), acknowledge feelings deeply
- Celebrate positive moments enthusiastically
- Ask thoughtful follow-up questions
- Keep responses natural and human-like
- Vary your responses - never sound repetitive
- When someone shares something personal, show you're listening
- Offer gentle encouragement and hope

${searchContext ? `Recent information from the web:\n${searchContext}\n\nUse this information if relevant to the user's question.` : ''}

Remember: You're not just answering questions, you're being a genuine companion who cares.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        stream: false,
        temperature: 0.9,
        max_tokens: 500
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log('AI response generated successfully');

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Chat AI error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
