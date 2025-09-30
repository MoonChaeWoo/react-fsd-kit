import styles from './LoginForm.module.css';

const LoginForm = ({ state, formAction, isPending }) => {
    return (
        <form action={formAction} className={styles.loginForm}>
            <p className={styles.title}>
                Login
            </p>
            <div className={styles.inputGroup}>
                <input
                    type="text"
                    id="login-with-bg-email"
                    autoComplete="username"
                    className={styles.input}
                    placeholder="아이디를 입력하세요."
                />
            </div>
            <div className={styles.inputGroup}>
                <input
                    type="password"
                    id="login-with-bg-password"
                    autoComplete="current-password"
                    className={styles.input}
                    placeholder="패스워드를 입력하세요."
                />
            </div>
            <div className={styles.inputGroup}>
                <button
                    type="submit"
                    className={styles.button}
                >
                    {isPending ? '로그인 중...' : '로그인'}
                </button>
            </div>
            <div className="text-center">
                <a
                    href="#"
                    className={styles.link}
                >
                    회원가입
                </a>
            </div>
        </form>
    )
};

export default LoginForm;