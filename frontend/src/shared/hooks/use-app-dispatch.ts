import { useDispatch } from "react-redux";

import type { AppDispatch } from "@/shared/store";

const useAppDispatch = () => useDispatch<AppDispatch>();

export default useAppDispatch;
