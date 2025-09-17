const createThemeSlice = (set, get) => ({
    theme: "light",

    setTheme: (newTheme) => set({ theme: newTheme }),
    toggleTheme: () =>
        set((state) => ({
            theme: state.theme === "light" ? "dark" : "light",
        })),
});

export default createThemeSlice;
