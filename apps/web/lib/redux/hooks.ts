import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { store, AppDispatch } from "./store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<typeof store.getState> =
  useSelector;
