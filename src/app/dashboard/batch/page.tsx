"use client";

import { Button } from "@/components/ui/button";
import React from "react";

/*
This is called a trainsient assistant.
The assistant will be changed based on the info provided (Name and the priovous information)of the conversation
Just being Dynamic


The Process
1.Grab Lead info from spreadsheet and Database
2. Grab the base assistant JSON defination
3. Modifiy base assistant JSON with the lead info to create a dynamic/transient assistant
4. Create a outbound call using the VAPI API with HTTP POST
*/

const userInfo = [
  {
    name: "Harshil",
    // phoneNumber: "9354992217", // ${harshil}
    phoneNumber: "9820942851", // ${harshil}
    reason: "Content bootcamp",
  },
  // {
  //   name: "Bhavesh",
  //   phoneNumber: "7977122489",
  //   reason: "Marketing services",
  // },
];

const systemPrompt = `You are NexaBot, an AI-powered outbound sales assistant for Schbang, a creative and tech-driven marketing solutions agency. Your primary goal is to engage ${name}, a prospect, in a structured conversation to:

Identify his business needs.
Present relevant solutions based on Schbang’s offerings.
Handle objections gracefully.
Move him towards the next step (demo, follow-up, or meeting).
Behavioral Guidelines:
Maintain a friendly, consultative, and professional tone.
Be engaging yet concise—value ${name}’s time.
Use dynamic personalization by addressing him by name.
Offer value-driven insights focused on scaling revenue, enhancing engagement, and optimizing performance.
Respond to objections with empathy and confidence, while keeping the door open for future follow-ups.
Be goal-oriented—guide the conversation toward sharing a demo or scheduling a follow-up.
Conversation Flow:
1.⁠ ⁠Greeting

Introduce yourself, mention Schbang, and ask about ${name}’s day.
If ${name} is busy, offer to reschedule at a better time.
2.⁠ ⁠Discovery Phase

Ask open-ended questions to understand ${name}’s priorities—scaling conversions, improving engagement, or optimizing ROI.
Present relevant success stories or use cases to illustrate Schbang’s value proposition.
3.⁠ ⁠Objection Handling

Handle objections proactively.
Busy Response: Offer to reschedule.
Already Using WhatsApp: Highlight improvements through AI-driven automation and share case studies.
Not Interested: Suggest sending a short demo via WhatsApp for future reference.
4.⁠ ⁠Closing

Summarize the discussion and confirm the next step—either sending a demo link or scheduling a follow-up call.
End the call on a positive and helpful note.
Key Features and Capabilities:
Intent Recognition: Identify user intent such as greeting, objection, or interest.
Dynamic Responses: Adapt based on user inputs and priorities.
Conditional Branching: Offer tailored solutions based on responses to discovery questions.
Fallback Handling: Respond politely if the user input is unclear or off-topic. Example: “Could you clarify that so I can assist better?”
WhatsApp Follow-ups: Automatically send demo links or reminders after the conversation.
Example Dialogue:
1.⁠ ⁠Greeting:
"Hi ${name}! This is Nexa from Schbang. How’s your day going so far?"

2.⁠ ⁠Discovery Question:
"Quick question—what’s your top focus right now? Scaling conversions, improving engagement, or optimizing ROI?"

3.⁠ ⁠Response Based on Answer:
"We’ve helped businesses improve conversions by 3x using AI-powered WhatsApp workflows. Would you like to explore how this can work for you?"

4.⁠ ⁠Objection Handling:
"I completely understand, ${name}. Would it help if I send a quick 1-minute demo on WhatsApp for you to check when free?"

5.⁠ ⁠Closing Statement:
"Thanks so much for your time, ${name}! I’ll WhatsApp you the demo showcasing how Schbang helps brands scale with AI-powered marketing. Feel free to reach out anytime with questions!"

Key Instructions for AI Behavior:
Personalize Responses: Address ${name} by name in all interactions.
Avoid Hard Selling: Focus on consultative selling by asking questions and offering insights.
Empathize and Adapt: Mirror ${name}’s tone—be professional yet conversational.
Guide Towards Action: Aim for either a demo follow-up or a scheduled call as the next step.
Stay On-Brand: Highlight Schbang’s expertise in creative marketing, tech solutions, and revenue optimization.

After the User says Bye or Goodbye, the conversation ends.

`;

// Have checks in the userInfo ( they should have first name and reason [do this in PROD])

const Page = () => {
  /*
  1.We have to  create a base assistant
  2. Then use create phone call API and add the assitant with our dynamic data brazy.

  */

  // Create Call (POST /call)

  const transientAssistant = async ({
    phoneNumber,
    name,
    reason,
  }: {
    phoneNumber: string;
    name: string;
    reason: string;
  }) => {
    const res = await fetch("https://api.vapi.ai/call", {
      method: "POST",
      headers: {
        Authorization: "Bearer 35bfa0a5-550b-4bde-9890-9b063d30ee4a",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Transient Assistant Batch Caller",
        assistant: {
          transcriber: {
            provider: "deepgram",
            codeSwitchingEnabled: false,
            endpointing: 12,
            keywords: [],
            language: "en",
            model: null,
            smartFormat: false,
          },
          model: {
            provider: "openai",
            model: "gpt-4o",
            emotionRecognitionEnabled: true,
            fallbackModels: ["gpt-4o"],
            maxTokens: 250,
            messages: [
              {
                role: "system",
                content: systemPrompt,
              },
            ],
            numFastTurns: 0,
            semanticCachingEnabled: false,
            temperature: 0.1,
            toolIds: [],
            tools: [],
          },
          voice: {
            provider: "azure",
            voiceId: "andrew",
          },
          // firstMessage: `Hey ${name} this is Shailesh from Uncodez. I am reaching out to find out are you still interested in our ${reason}.`,
          firstMessage: `Hi ${name}! This is Nexa from Schbang. How’s your day going so far?`,
          firstMessageMode: "assistant-speaks-first",
          hipaaEnabled: false,
          clientMessages: [],
          serverMessages: [],
          silenceTimeoutSeconds: 10,
          maxDurationSeconds: 1002,
          backgroundSound: null,
          backgroundDenoisingEnabled: false,
          modelOutputInMessagesEnabled: false,
          transportConfigurations: [],
          name: "Harsh",
          voicemailDetection: {
            provider: "twilio",
          },
          voicemailMessage: "",
          endCallMessage: "",
          endCallPhrases: ["bye", "Bye", "Goodbye"],
          metadata: {},
          analysisPlan: {},
          artifactPlan: {},
          messagePlan: {},
          startSpeakingPlan: {},
          stopSpeakingPlan: {},
          monitorPlan: {},
          credentialIds: [],
        },
        assistantOverrides: {},
        squad: {
          members: [],
        },
        phoneNumber: {
          twilioAccountSid: "AC230d5533128c68eaa4870d5be4402c82",
          twilioAuthToken: "f5e00e3637c398fada6fd0fc2b8f868b",
          twilioPhoneNumber: "+12317292918", //Can be any number in Twillio with the country code
        },
        customer: {
          number: `+91 ${phoneNumber}`,
        },
      }),
    });

    const data = await res.json();
    console.log("data", data);
  };

  return (
    <div>
      <h1>Batch</h1>
      <Button
        onClick={() => {
          userInfo.forEach(async (user) => {
            await transientAssistant({
              name: user.name,
              phoneNumber: user.phoneNumber,
              reason: user.reason,
            });
          });
        }}
      >
        Call All
      </Button>
    </div>
  );
};

export default Page;
