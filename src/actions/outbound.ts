"use server";

import { VapiError } from "@vapi-ai/server-sdk";
import axios from "axios";

const assistantIdMary = "96b40510-7cac-4cf1-add2-80f4d1cc3797";
const squadId = "c7a25ab8-1dd9-4762-ba67-72c9e7802c31";
const phoneNumberId = "ddaf2af4-fd42-4c94-95a5-20756d178db9";

// Create Call (POST /call)

export const outBoundAction = async ({
	phone,
	name,
}: { phone: string; name: string }) => {
	try {
		// Create Call (POST /call)

		const bodyData = {
			name: "Cally", // Not sure
			assistantId: assistantIdMary, //  Calling Assistant
			assistant: {},
			assistantOverrides: {},
			squadId: squadId, // Needed for some reason
			phoneNumberId: phoneNumberId, //Twillio gives it
			phoneNumber: {
				twilioAccountSid: process.env.TWILIOSID,
				twilioAuthToken: process.env.TWILIOAUTHTOKEN,
				twilioPhoneNumber: process.env.TWILIONUMBER, //Can be any number in Twillio with the country code
			},
			customer: {
				numberE164CheckEnabled: true,
				extension: "+91", //country code
				number: `+${phone}`, // Should start with country code [ Working for my number but not for harsh for some reason]
				//                 {
				//   "message": "Couldn't Create Twilio Call. Twilio Error: The number +918291526869 is unverified. Trial accounts may only make calls to verified numbers.",
				//   "error": "Bad Request",
				//   "statusCode": 400
				// }
				sipUri: `sip:${process.env.VAPIUSERNAME}@sip.vapi.ai`,
				name: name || "Unknown", //Name of the person
			},
		};
		console.log("bodyData :", bodyData);
		// return;
		const config = {
			headers: {
				Authorization: `Bearer ${process.env.VAPIPRIVATE}`,
				"Content-Type": "application/json",
			},
		};

		const response = await axios.post(
			"https://api.vapi.ai/call",
			bodyData,
			config,
		);
		console.log("response :", response);

		const hehe = await response.data;
		console.log(hehe);
	} catch (err) {
		console.log("err :", err);
		if (err instanceof VapiError) {
			console.log(err.statusCode);
			console.log(err.message);
			console.log(err.body);
		}
	}
};
