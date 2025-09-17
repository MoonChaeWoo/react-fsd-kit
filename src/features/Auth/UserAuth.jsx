import useLogin from './model/useLogin.js';
import LoginForm from "./ui/LoginForm.jsx";

const UserAuth = () => {
    const loginProps = useLogin();

    return <LoginForm {...loginProps}/>;
};

export default UserAuth;