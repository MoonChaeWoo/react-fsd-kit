import { Outlet, Navigate } from "react-router-dom";
import {Header, Footer} from '../../widgets'
import useClientInfoStore from '../providers/store'

const PrivateLayout = () => {

    const isLoggedIn = false;

    if(!isLoggedIn) return <Navigate to='/login'/>

    return (
        <div className="private-layout">
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    )
};

export default PrivateLayout;