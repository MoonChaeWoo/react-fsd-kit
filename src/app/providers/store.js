import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import createAuthSlice from "./slices/createAuthSlice";
import createThemeSlice from "./slices/createThemeSlice";

const useClientInfoStore = create(
    devtools(
        persist((set, get) => ({
                ...createAuthSlice(set, get),
                ...createThemeSlice(set, get),
            }),
            {name: 'client-info'} // localStorage 키
        ),
        { name: "AuthStore" } // devtools 이름
    )
);

export const useMapUtileStore = create((set) => ({
    mapUtile: {},
    setMapUtile: (instance) => set({ mapUtile: instance }),
}));

export default useClientInfoStore;