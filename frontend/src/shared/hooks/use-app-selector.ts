import { useSelector, type TypedUseSelectorHook } from "react-redux";

import type { RootState } from "@/shared/store";

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default useAppSelector;
