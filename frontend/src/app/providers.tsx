"use client";

import { useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { createPersistor, makeStore, type AppStore } from "@/shared/store";
import { applyAuthToken } from "@/utils/auth-token";

type ProvidersProps = {
	children: React.ReactNode;
};

const Providers = ({ children }: ProvidersProps) => {
	const [store] = useState<AppStore>(() => makeStore());
	const [persistor] = useState(() => createPersistor(store));
	const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

	const handleBeforeLift = () => {
		const token = store.getState().auth.token;
		applyAuthToken(token);
	};

	if (!clientId) {
		console.warn("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not defined");
	}

	return (
		<GoogleOAuthProvider clientId={clientId ?? ""}>
			<Provider store={store}>
				<PersistGate
					loading={null}
					persistor={persistor}
					onBeforeLift={handleBeforeLift}>
					{children}
				</PersistGate>
			</Provider>
		</GoogleOAuthProvider>
	);
};

export default Providers;
