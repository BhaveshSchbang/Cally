"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Phone, Trash, Edit, Check, X } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import Papa from "papaparse";

const systemPrompt = (name: string) => {
  const text = `You are NexaBot, an AI-powered outbound sales assistant for Schbang, a creative and tech-driven marketing solutions agency. Your primary goal is to engage ${name}, a prospect, in a structured conversation to:

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

  return text;
};

interface Contact {
  name: string;
  phoneNumber: string;
  phoneCode: string;
  reason: string;
  callStatus?: "success" | "failed" | null;
  isEditing?: boolean;
}

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          const parsedContacts = results.data.slice(1).map((row: any) => ({
            name: row[0],
            phoneNumber: row[1],
            phoneCode: row[2],
            reason: row[3],
            callStatus: null,
            isEditing: false,
          }));
          setContacts(parsedContacts);
        },
        header: false,
      });
    }
  };

  const handleCall = async (contact: Contact, index: number) => {
    try {
      await transientAssistant({
        name: contact.name,
        phoneNumber: contact.phoneNumber,
        reason: contact.reason,
        phoneCode: contact.phoneCode,
      });

      const updatedContacts = [...contacts];
      updatedContacts[index] = {
        ...contact,
        callStatus: "success",
      };
      setContacts(updatedContacts);
    } catch (error) {
      console.error("Call failed:", error);
      const updatedContacts = [...contacts];
      updatedContacts[index] = {
        ...contact,
        callStatus: "failed",
      };
      setContacts(updatedContacts);
    }
  };

  const handleDelete = (index: number) => {
    const updatedContacts = contacts.filter((_, i) => i !== index);
    setContacts(updatedContacts);
  };

  const handleEdit = (contact: Contact, index: number) => {
    const updatedContacts = contacts.map((c, i) => ({
      ...c,
      isEditing: i === index,
    }));
    setContacts(updatedContacts);
    setEditingContact({ ...contact });
  };

  const handleSaveEdit = (index: number) => {
    if (editingContact) {
      const updatedContacts = contacts.map((contact, i) =>
        i === index ? { ...editingContact, isEditing: false } : contact
      );
      setContacts(updatedContacts);
      setEditingContact(null);
    }
  };

  const transientAssistant = async ({
    phoneNumber,
    name,
    reason,
    phoneCode,
  }: {
    phoneNumber: string;
    name: string;
    reason?: string;
    phoneCode: string;
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
                content: systemPrompt(name),
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
          twilioAccountSid: process.env.TWILIOSID,
          twilioAuthToken: process.env.TWILIOAUTHTOKEN,
          twilioPhoneNumber: process.env.TWILIONUMBER, //Can be any number in Twillio with the country code
        },
        customer: {
          number: `${phoneCode} ${phoneNumber}`,
        },
      }),
    });

    const data = await res.json();
    console.log("data", data);
  };

  return (
    <main className="min-h-screen p-4 bg-background">
      <div className="max-w-5xl mx-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Contact Manager</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="max-w-sm border border-primary"
              />
              {/* <Button onClick={() => document.getElementById('csvInput')?.click()}>
                <Upload className="mr-2 h-4 w-4" />
                Upload CSV
              </Button> */}
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Phone Code</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact, index) => (
                  <TableRow key={index}>
                    {contact.isEditing ? (
                      <>
                        <TableCell>
                          <Input
                            value={editingContact?.name}
                            onChange={(e) =>
                              setEditingContact((prev) =>
                                prev ? { ...prev, name: e.target.value } : null
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={editingContact?.phoneNumber}
                            onChange={(e) =>
                              setEditingContact((prev) =>
                                prev
                                  ? { ...prev, phoneNumber: e.target.value }
                                  : null
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={editingContact?.phoneCode}
                            onChange={(e) =>
                              setEditingContact((prev) =>
                                prev
                                  ? { ...prev, phoneCode: e.target.value }
                                  : null
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={editingContact?.reason}
                            onChange={(e) =>
                              setEditingContact((prev) =>
                                prev
                                  ? { ...prev, reason: e.target.value }
                                  : null
                              )
                            }
                          />
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>{contact.name}</TableCell>
                        <TableCell>{contact.phoneNumber}</TableCell>
                        <TableCell>{contact.phoneCode}</TableCell>
                        <TableCell>{contact.reason}</TableCell>
                      </>
                    )}
                    <TableCell>
                      {contact.callStatus === "success" && (
                        <Check className="h-4 w-4 text-green-500" />
                      )}
                      {contact.callStatus === "failed" && (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {contact.isEditing ? (
                          <Button
                            size="sm"
                            onClick={() => handleSaveEdit(index)}
                          >
                            Save
                          </Button>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCall(contact, index)}
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(contact, index)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(index)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {contacts.length > 0 && (
              <div className="flex flex-col items-center gap-2 mt-4">
                <Button
                  size="lg"
                  disabled={
                    !contacts.every(
                      (contact) =>
                        contact.name &&
                        contact.phoneNumber &&
                        contact.phoneCode &&
                        contact.reason
                    )
                  }
                  onClick={() => {
                    contacts.forEach((contact, index) =>
                      handleCall(contact, index)
                    );
                  }}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Start Calling All Contacts
                </Button>
                {!contacts.every(
                  (contact) =>
                    contact.name &&
                    contact.phoneNumber &&
                    contact.phoneCode &&
                    contact.reason
                ) && (
                  <p className="text-sm text-red-500">
                    {contacts.map((contact, index) => {
                      const missing = [];
                      if (!contact.name) missing.push("name");
                      if (!contact.phoneNumber) missing.push("phone number");
                      if (!contact.phoneCode) missing.push("phone code");
                      if (!contact.reason) missing.push("reason");
                      return missing.length > 0 ? (
                        <span key={index} className="block">
                          Row {index + 1} is missing: {missing.join(", ")}
                        </span>
                      ) : null;
                    })}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
