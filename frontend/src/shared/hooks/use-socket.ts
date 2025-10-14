import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/shared/store";
import {
	applyPatch,
	bootstrapChats,
	setConnectionStatus,
} from "@/shared/store/chat-slice";
import { socketService } from "@/shared/services/socket.service";

export const useSocket = () => {
	const dispatch = useDispatch<AppDispatch>();
	const token = useSelector((state: RootState) => state.auth.token);
	const isConnected = useSelector((state: RootState) => state.chat.isConnected);

	useEffect(() => {
		if (!token) {
			socketService.disconnect();
			dispatch(setConnectionStatus(false));
			return;
		}

		socketService.connect(token, {
			onConnect: () => {
				dispatch(setConnectionStatus(true));
			},
			onDisconnect: () => {
				dispatch(setConnectionStatus(false));
			},
			onBootstrap: (data) => {
				dispatch(bootstrapChats(data));
			},
			onPatch: (data) => {
				dispatch(applyPatch(data));
			},
			onNotification: (data) => {
				console.log("Notification received:", data);
			},
		});

		return () => {
			socketService.disconnect();
		};
	}, [token, dispatch]);

	return {
		isConnected,
		toggleAutoBot: (enabled: boolean) => socketService.toggleAutoBot(enabled),
	};
};
