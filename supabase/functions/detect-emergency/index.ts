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
    const { imageData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log('Analyzing image for emergency detection...');

    const systemPrompt = `You are an AI emergency detection system. Analyze the image and determine if there's an emergency situation.

Look for:
- Person fallen on the ground
- Person in distress or pain
- Unusual body positions indicating injury
- Signs of medical emergency
- Fire, smoke, or hazardous situations
- Any situation requiring immediate help

Respond with a JSON object:
{
  "emergency": true/false,
  "confidence": 0-100,
  "type": "fall" | "distress" | "medical" | "hazard" | "none",
  "description": "brief description of what you see"
}

Be conservative - only flag as emergency if you're quite confident.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { 
            role: 'user', 
            content: [
              {
                type: 'text',
                text: systemPrompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageData
                }
              }
            ]
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('AI detection service error');
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log('AI Response:', aiResponse);

    // Parse the JSON response from AI
    let result;
    try {
      // Extract JSON from the response (AI might wrap it in markdown)
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : { emergency: false, confidence: 0, type: 'none' };
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      result = { emergency: false, confidence: 0, type: 'none', description: 'Analysis failed' };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Emergency detection error:', error);
    return new Response(JSON.stringify({ 
      emergency: false,
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
