const createAuthSlice = (set, get) => ({
    isAuthenticated: false,
    user: null,

    login: ({ user }) => set({
        isAuthenticated: true,
        user,
    }),

    logout: () => set({
        isAuthenticated: false,
        user: null,
    }),
});

export default createAuthSlice;