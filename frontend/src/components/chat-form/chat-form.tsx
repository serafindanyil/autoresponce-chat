"use client";

import { useState, type FormEvent } from "react";
import Button from "@/ui/button/button";
import Input from "@/ui/input/input";

export type ChatFormData = {
	firstName: string;
	lastName: string;
};

type ChatFormProps = {
	initialData?: ChatFormData;
	onSubmit: (data: ChatFormData) => void | Promise<void>;
	onCancel: () => void;
	isLoading?: boolean;
	submitLabel?: string;
};

const ChatForm = ({
	initialData = { firstName: "", lastName: "" },
	onSubmit,
	onCancel,
	isLoading = false,
	submitLabel = "Save",
}: ChatFormProps) => {
	const [firstName, setFirstName] = useState(initialData.firstName);
	const [lastName, setLastName] = useState(initialData.lastName);
	const [errors, setErrors] = useState<Partial<ChatFormData>>({});

	const validate = (): boolean => {
		const newErrors: Partial<ChatFormData> = {};

		if (!firstName.trim()) {
			newErrors.firstName = "First name is required";
		}

		if (!lastName.trim()) {
			newErrors.lastName = "Last name is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		if (!validate()) {
			return;
		}

		await onSubmit({ firstName: firstName.trim(), lastName: lastName.trim() });
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="space-y-2">
				<label
					htmlFor="firstName"
					className="text-sm font-medium text-foreground">
					First Name
				</label>
				<Input
					id="firstName"
					type="text"
					value={firstName}
					onChange={(e) => setFirstName(e.target.value)}
					placeholder="Enter first name"
					disabled={isLoading}
					className={errors.firstName ? "border-red-500" : ""}
				/>
				{errors.firstName && (
					<p className="text-xs text-red-500">{errors.firstName}</p>
				)}
			</div>

			<div className="space-y-2">
				<label
					htmlFor="lastName"
					className="text-sm font-medium text-foreground">
					Last Name
				</label>
				<Input
					id="lastName"
					type="text"
					value={lastName}
					onChange={(e) => setLastName(e.target.value)}
					placeholder="Enter last name"
					disabled={isLoading}
					className={errors.lastName ? "border-red-500" : ""}
				/>
				{errors.lastName && (
					<p className="text-xs text-red-500">{errors.lastName}</p>
				)}
			</div>

			<div className="flex gap-3 justify-end pt-4">
				<Button
					type="button"
					onClick={onCancel}
					state="transparent"
					size="md"
					disabled={isLoading}>
					Cancel
				</Button>
				<Button type="submit" state="active" size="md" disabled={isLoading}>
					{isLoading ? "Saving..." : submitLabel}
				</Button>
			</div>
		</form>
	);
};

export default ChatForm;
