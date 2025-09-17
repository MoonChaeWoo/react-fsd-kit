import { Outlet } from "react-router-dom";
import {Header, Footer} from '../../widgets'
import useClientInfoStore from '../providers/store'

const PublicLayout = () => {
    const theme = useClientInfoStore(state => state.theme);

    log(theme);

    return (
        <div className="public-layout">
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    )
};

export default PublicLayout;