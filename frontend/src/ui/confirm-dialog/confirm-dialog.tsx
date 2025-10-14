"use client";

import Modal from "@/ui/modal/modal";
import Button from "@/ui/button/button";

export type ConfirmDialogProps = {
	isOpen: boolean;
	onConfirm: () => void;
	onCancel: () => void;
	title?: string;
	message?: string;
	confirmText?: string;
	cancelText?: string;
	isLoading?: boolean;
	variant?: "danger" | "warning" | "info";
};

const ConfirmDialog = ({
	isOpen,
	onConfirm,
	onCancel,
	title = "Confirm Action",
	message = "Are you sure you want to proceed?",
	confirmText = "Confirm",
	cancelText = "Cancel",
	isLoading = false,
	variant = "info",
}: ConfirmDialogProps) => {
	const handleConfirm = () => {
		onConfirm();
	};

	return (
		<Modal isOpen={isOpen} onClose={onCancel} title={title} size="sm">
			<div className="space-y-6">
				<p className="text-sm text-muted-foreground leading-relaxed">
					{message}
				</p>

				<div className="flex gap-3 justify-end">
					<Button
						onClick={onCancel}
						state="secondary"
						disabled={isLoading}
						type="button">
						{cancelText}
					</Button>
					<Button
						onClick={handleConfirm}
						state={variant === "danger" ? "danger" : "primary"}
						disabled={isLoading}
						type="button">
						{isLoading ? "Processing..." : confirmText}
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default ConfirmDialog;
