import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
	FLUSH,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
	REHYDRATE,
	persistReducer,
	persistStore,
} from "redux-persist";
import type { PersistConfig } from "redux-persist";

import authReducer from "./auth-slice";
import storage from "./storage";

const rootReducer = combineReducers({
	auth: authReducer,
});

type RootReducerState = ReturnType<typeof rootReducer>;

const persistConfig: PersistConfig<RootReducerState> = {
	key: "root",
	storage,
	whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () =>
	configureStore({
		reducer: persistedReducer,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({
				serializableCheck: {
					ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
				},
			}),
	});

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const createPersistor = (store: AppStore) => persistStore(store);
