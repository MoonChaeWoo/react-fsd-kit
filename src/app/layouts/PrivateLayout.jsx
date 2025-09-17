import { Outlet, useMatches, Navigate } from "react-router-dom";
import {Header, Footer} from '../../widgets'
import useClientInfoStore from '../providers/store'

const PrivateLayout = () => {
    const match = useMatches().slice(-1)[0];

    const isLoggedIn = false;
    if(!isLoggedIn) return <Navigate to='/login'/>

    // 헤더 푸터 사용 여부 확인
    const showLayout = match?.handle?.layout ?? true;

    return showLayout ? (
        <div className="private-layout">
            <Header />
            <main><Outlet /></main>
            <Footer />
        </div>
    ) : (
        <Outlet />
    );
};

export default PrivateLayout;