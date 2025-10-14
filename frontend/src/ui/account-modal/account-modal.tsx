"use client";

import { useState } from "react";
import Modal from "@/ui/modal/modal";
import ConfirmDialog from "@/ui/confirm-dialog/confirm-dialog";
import Button from "@/ui/button/button";
import IconUser from "@/ui/icon-user/icon-user";
import { Mail, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/shared/hooks";

export type AccountModalProps = {
	isOpen: boolean;
	onClose: () => void;
};

const AccountModal = ({ isOpen, onClose }: AccountModalProps) => {
	const { user, logout } = useAuth();
	const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	if (!user) return null;

	const handleLogoutConfirm = async () => {
		setIsLoggingOut(true);
		try {
			await logout();
			setIsLogoutConfirmOpen(false);
			onClose();
		} finally {
			setIsLoggingOut(false);
		}
	};

	const userName = user.name?.split(" ") || ["User"];

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose} title="Account" size="sm">
				<div className="space-y-6">
					{/* User Avatar and Name */}
					<div className="flex flex-col items-center gap-4 pb-4 border-b border-muted">
						<IconUser userName={userName} state="active" size="lg" />
						<div className="text-center">
							<h3 className="text-lg font-semibold text-foreground">
								{user.name}
							</h3>
						</div>
					</div>

					{/* Account Information */}
					<div className="space-y-4">
						<div className="flex items-start gap-3">
							<div className="mt-1">
								<UserIcon size={18} className="text-muted-foreground" />
							</div>
							<div className="flex-1">
								<p className="text-xs text-muted-foreground uppercase tracking-wide">
									Full Name
								</p>
								<p className="text-sm text-foreground mt-1">{user.name}</p>
							</div>
						</div>

						<div className="flex items-start gap-3">
							<div className="mt-1">
								<Mail size={18} className="text-muted-foreground" />
							</div>
							<div className="flex-1">
								<p className="text-xs text-muted-foreground uppercase tracking-wide">
									Email Address
								</p>
								<p className="text-sm text-foreground mt-1 break-all">
									{user.email}
								</p>
							</div>
						</div>
					</div>

					{/* Actions */}
					<div className="pt-4 border-t border-muted">
						<Button
							onClick={() => setIsLogoutConfirmOpen(true)}
							state="danger"
							className="w-full"
							type="button">
							<LogOut size={18} />
							<span>Logout</span>
						</Button>
					</div>
				</div>
			</Modal>

			<ConfirmDialog
				isOpen={isLogoutConfirmOpen}
				onConfirm={handleLogoutConfirm}
				onCancel={() => setIsLogoutConfirmOpen(false)}
				title="Logout"
				message="Are you sure you want to logout? You will need to sign in again to access your chats."
				confirmText="Logout"
				cancelText="Cancel"
				isLoading={isLoggingOut}
				variant="danger"
			/>
		</>
	);
};

export default AccountModal;
