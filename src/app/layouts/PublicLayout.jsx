import { Outlet, useMatches } from "react-router-dom";
import {Header, Footer} from '../../widgets'
import useClientInfoStore from '../providers/store'

const PublicLayout = () => {
    // 헤더 푸터 사용 여부 확인
    const match = useMatches().slice(-1)[0];
    const showLayout = match?.handle?.layout ?? true;

    // 라이트 / 다크 테마 확인
    const theme = useClientInfoStore(state => state.theme);

    return showLayout ? (
        <div className="public-layout">
            <Header />
            <main><Outlet /></main>
            <Footer />
        </div>
    ) : (
        <Outlet />
    );
};

export default PublicLayout;