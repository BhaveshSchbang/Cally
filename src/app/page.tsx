"use client";

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { useState } from "react";
import { outBoundAction } from "@/actions/outbound";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Label } from "@/components/ui/label";


export default function Home() {
	const [phoneNumber, setphoneNumber] = useState("");
	const [name, setName] = useState("");

	const callHandler = async (name: string, phoneNumber:string) => {

		await outBoundAction({ phone: phoneNumber, name: name });
	};

	return (
		<main className="min-h-screen p-4 bg-background">
			<div className="max-w-md mx-auto">
				<Card>
					<CardHeader>
						<CardTitle>Contact Information</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<label
								htmlFor="name"
								className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>
								Name
							</label>
							<Input
								id="name"
								placeholder="Enter your name"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
								Phone
							</Label>
							<PhoneInput
								country={"in"}
								value={phoneNumber}
								onChange={(phone) => setphoneNumber(phone)}
								inputStyle={{
									width: "100%",
									height: "36px",
									borderRadius: "6px ",
									border: "1px solid hsl(var(--input)) ",
									backgroundColor: "transparent",
									fontSize: "14px",
									paddingLeft: "48px",
									outline: "none",
									color: "hsl(var(--foreground))",
								}}
								containerStyle={{
									width: "100%",
									backgroundColor: "transparent",
								}}
								buttonStyle={{
									backgroundColor: "transparent",
									border: "1px solid hsl(var(--input))",
									borderRight: "none",
									borderRadius: "6px 0 0 6px",
								}}
								dropdownStyle={{
									width: "300px",
									backgroundColor: "hsl(var(--background))",
									borderRadius: "0.5rem",
									color: "hsl(var(--foreground))",
								}}
							/>
						</div>
						<Button onClick={() => callHandler(name, phoneNumber)}>
							<Phone />
							Call
						</Button>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
