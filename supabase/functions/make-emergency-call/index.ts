import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phoneNumber, contactName } = await req.json();

    if (!phoneNumber || !contactName) {
      throw new Error('Phone number and contact name are required');
    }

    const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
    const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
    const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      throw new Error('Twilio credentials not configured');
    }

    console.log(`Making emergency call to ${contactName} at ${phoneNumber}`);

    // Create TwiML for the call message
    const twimlMessage = `
      <Response>
        <Say voice="alice">
          Emergency alert! This is an automated emergency call from Shalala. 
          Your loved one may need immediate assistance. 
          Please call them back immediately or check on them as soon as possible. 
          This is an automated emergency detection system. 
          Emergency, emergency, emergency.
        </Say>
        <Pause length="2"/>
        <Say voice="alice">
          I repeat: This is an emergency alert from Shalala. 
          Please respond immediately.
        </Say>
      </Response>
    `.trim();

    // Make the call using Twilio API
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Calls.json`;
    
    const formData = new URLSearchParams();
    formData.append('To', phoneNumber);
    formData.append('From', TWILIO_PHONE_NUMBER);
    formData.append('Twiml', twimlMessage);

    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Twilio API error:', errorText);
      throw new Error(`Twilio API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Call initiated successfully:', data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        callSid: data.sid,
        message: `Emergency call initiated to ${contactName}` 
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error making emergency call:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
