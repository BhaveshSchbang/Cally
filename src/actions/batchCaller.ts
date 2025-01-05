"use server";

export const batchCallerAction = async ({
  name,
  phoneNumber,
  reason,
  phoneCode,
}: {
  name: string;
  phoneNumber: string;
  reason: string;
  phoneCode: string;
}) => {
  try {
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
                content:
                  "You are a helpful assistant working for Schbang a leading Agency in India. You have multiple services to offer in Tech and Marketing. You can provide a list of services for the user.",
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
          firstMessage: `Hey ${name} this is Nexa from Uncodez. I am reaching out to find out are you still interested in our ${reason}.`,
          firstMessageMode: "assistant-speaks-first",
          hipaaEnabled: false,
          clientMessages: [],
          serverMessages: [],
          silenceTimeoutSeconds: 12,
          maxDurationSeconds: 12,
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
          endCallPhrases: [],
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
          twilioPhoneNumber: "+12317292918",
        },
        customer: {
          number: `${phoneCode || "+91"} ${phoneNumber}`,
        },
      }),
    });

    return {
      data: await res.json(),
      status: res.status,
    };
  } catch (error) {
    console.log("batchCallerAction error :", error);
  }
};
