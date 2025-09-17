import { useActionState } from 'react';
import loginApi from '../api/loginApi';

const loginFetch = async (previousState, formData) => {
    const id = formData.get('id');
    const password = formData.get('password');

    try{
        const response = await loginApi(id, password);
        return {success: true, error: null, message: response};
    }catch(e){
        return {success: false, error: e.message, message: '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.”'};
    }
};

const useLogin = () => {
    const [state, formAction, isPending] = useActionState(loginFetch, { success: false, message: null });
    return { state, formAction, isPending };
};

export default useLogin;