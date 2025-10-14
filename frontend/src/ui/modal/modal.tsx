"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";

const contentVariants = cva(
	"relative z-50 w-full bg-surface border border-muted rounded-lg shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200",
	{
		variants: {
			size: {
				sm: "max-w-md",
				md: "max-w-lg",
				lg: "max-w-2xl",
				xl: "max-w-4xl",
			},
		},
		defaultVariants: {
			size: "md",
		},
	}
);

export type ModalProps = {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	children: ReactNode;
	className?: string;
	size?: VariantProps<typeof contentVariants>["size"];
	hideCloseButton?: boolean;
};

const Modal = ({
	isOpen,
	onClose,
	title,
	children,
	className,
	size,
	hideCloseButton = false,
}: ModalProps) => {
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isOpen) {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			document.body.style.overflow = "hidden";
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "unset";
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div
				className="fixed inset-0 bg-background/80 backdrop-blur-sm"
				onClick={onClose}
				aria-hidden="true"
			/>

			<div
				className={clsx(contentVariants({ size }), className)}
				onClick={(e) => e.stopPropagation()}>
				{(title || !hideCloseButton) && (
					<div className="flex items-center justify-between p-6 border-b border-muted">
						{title && (
							<h2 className="text-lg font-semibold text-foreground">{title}</h2>
						)}
						{!hideCloseButton && (
							<button
								onClick={onClose}
								className="ml-auto p-2 rounded-md hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
								aria-label="Close modal">
								<X size={20} className="text-muted-foreground" />
							</button>
						)}
					</div>
				)}

				<div className="p-6">{children}</div>
			</div>
		</div>
	);
};

export default Modal;
