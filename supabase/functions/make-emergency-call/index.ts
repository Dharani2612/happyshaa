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
    const { 
      phoneNumber, 
      contactName, 
      gpsLocation, 
      photoUrl,
      sendSMS = true,
      sendCall = true,
      emergency911 = false
    } = await req.json();

    const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
    const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
    const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      throw new Error('Twilio credentials not configured');
    }

    console.log(`Emergency alert for ${contactName} at ${phoneNumber}`);

    const results = {
      sms: null,
      call: null,
      emergency911: null
    };

    // Construct emergency message
    let messageText = `🚨 EMERGENCY ALERT from Shalala App\n\n`;
    messageText += `${contactName}, your loved one may need immediate assistance!\n\n`;
    
    if (gpsLocation) {
      messageText += `📍 Location: ${gpsLocation.latitude}, ${gpsLocation.longitude}\n`;
      messageText += `🗺️ Map: https://maps.google.com/?q=${gpsLocation.latitude},${gpsLocation.longitude}\n\n`;
    }
    
    if (photoUrl) {
      messageText += `📸 Photo: ${photoUrl}\n\n`;
    }
    
    messageText += `⚡ Action Required: Please check on them IMMEDIATELY!`;

    // Send SMS if enabled
    if (sendSMS) {
      try {
        const smsResponse = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
          {
            method: 'POST',
            headers: {
              'Authorization': 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              To: phoneNumber,
              From: TWILIO_PHONE_NUMBER,
              Body: messageText
            }),
          }
        );

        const smsData = await smsResponse.json();
        
        if (smsResponse.ok) {
          results.sms = { success: true, sid: smsData.sid };
          console.log(`SMS sent successfully to ${contactName}: ${smsData.sid}`);
        } else {
          throw new Error(smsData.message || 'SMS failed');
        }
      } catch (smsError) {
        console.error(`SMS error for ${contactName}:`, smsError);
        results.sms = { success: false, error: smsError.message };
      }
    }

    // Make voice call if enabled
    if (sendCall) {
      try {
        const voiceMessage = `This is an automated emergency alert from Shalala. ${contactName}, your loved one may need immediate assistance. `;
        const voiceMessageWithLocation = gpsLocation 
          ? `${voiceMessage} Their location is latitude ${gpsLocation.latitude}, longitude ${gpsLocation.longitude}. `
          : voiceMessage;
        const finalVoiceMessage = `${voiceMessageWithLocation} Please check on them immediately. This is an emergency notification.`;

        const twimlMessage = `<?xml version="1.0" encoding="UTF-8"?>
          <Response>
            <Say voice="Polly.Joanna">${finalVoiceMessage}</Say>
            <Pause length="1"/>
            <Say voice="Polly.Joanna">Press any key to acknowledge this emergency.</Say>
          </Response>`;

        const callResponse = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Calls.json`,
          {
            method: 'POST',
            headers: {
              'Authorization': 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              To: phoneNumber,
              From: TWILIO_PHONE_NUMBER,
              Twiml: twimlMessage
            }),
          }
        );

        const callData = await callResponse.json();
        
        if (callResponse.ok) {
          results.call = { success: true, sid: callData.sid };
          console.log(`Call initiated successfully to ${contactName}: ${callData.sid}`);
        } else {
          throw new Error(callData.message || 'Call failed');
        }
      } catch (callError) {
        console.error(`Call error for ${contactName}:`, callError);
        results.call = { success: false, error: callError.message };
      }
    }

    // Call 911 if enabled (for demo, we'll just log it - in production, this would be handled carefully)
    if (emergency911) {
      console.log('⚠️ 911 Emergency call would be initiated here in production');
      console.log('Location:', gpsLocation);
      results.emergency911 = { 
        success: true, 
        note: 'In production, this would dial emergency services with location data' 
      };
    }

    const overallSuccess = (sendSMS ? results.sms?.success : true) && 
                          (sendCall ? results.call?.success : true);

    return new Response(
      JSON.stringify({ 
        success: overallSuccess,
        results,
        message: `Emergency alert sent to ${contactName}`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: overallSuccess ? 200 : 207 // 207 = Multi-Status (partial success)
      }
    );

  } catch (error) {
    console.error('Error in make-emergency-call:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
