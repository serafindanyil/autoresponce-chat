import type { Storage } from "redux-persist";

type IdbModule = typeof import("idb-keyval");
type IdbStore = ReturnType<IdbModule["createStore"]>;

const DB_NAME = "autoresponce-chat";
const STORE_NAME = "redux";

const createNoopStorage = (): Storage => ({
	getItem: () => Promise.resolve(null),
	setItem: (_key, value) => Promise.resolve(value),
	removeItem: () => Promise.resolve(),
});

let idbModule: IdbModule | null = null;
let idbStore: IdbStore | null = null;

const getIdbHelpers = async () => {
	if (!idbModule) {
		idbModule = await import("idb-keyval");
	}

	if (!idbStore) {
		idbStore = idbModule.createStore(DB_NAME, STORE_NAME);
	}

	return {
		store: idbStore,
		get: idbModule.get,
		set: idbModule.set,
		del: idbModule.del,
	};
};

const createIndexedDbStorage = (): Storage => ({
	async getItem(key) {
		const { get, store } = await getIdbHelpers();
		const value = await get(key, store);
		return (value ?? null) as string | null;
	},
	async setItem(key, value) {
		const { set, store } = await getIdbHelpers();
		await set(key, value, store);
		return value;
	},
	async removeItem(key) {
		const { del, store } = await getIdbHelpers();
		await del(key, store);
	},
});

const storage: Storage =
	typeof window === "undefined"
		? createNoopStorage()
		: createIndexedDbStorage();

export default storage;
