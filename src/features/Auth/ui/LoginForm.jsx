const LoginForm = ({ state, formAction, isPending }) => {
    return (
        <form action={formAction} className="max-w-sm p-10 m-auto rounded shadow-xl bg-white/25" style={{ transform: 'translateY(100%)' }}>
            <p className="mb-8 text-2xl font-light text-center text-white">
                Login
            </p>
            <div className="mb-2">
                <div className="relative">
                    <input
                        type="text"
                        id="login-with-bg-email"
                        autoComplete="username"
                        className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        placeholder="아이디를 입력하세요."
                    />
                </div>
            </div>
            <div className="mb-2">
                <div className="relative">
                    <input
                        type="password"
                        id="login-with-bg-password"
                        autoComplete="current-password"
                        className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        placeholder="패스워드를 입력하세요."
                    />
                </div>
            </div>
            <div className="flex items-center justify-between mt-4">
                <button
                    type="submit"
                    className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
                >
                    {isPending ? '로그인 중...' : '로그인'}
                </button>
            </div>
            <div className="text-center">
                <a
                    href="#"
                    className="right-0 inline-block text-sm font-light align-baseline text-500 hover:text-gray-800"
                >
                    회원가입
                </a>
            </div>
        </form>
    )
};

export default LoginForm;