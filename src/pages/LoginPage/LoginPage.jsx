import { UserAuth } from '../../features/Auth'
import styles from './LoginPage.module.css';

const LoginPage = () => {
    return (
        <div className={styles.loginPage}>
            <UserAuth/>
        </div>
    );
};

export default LoginPage;