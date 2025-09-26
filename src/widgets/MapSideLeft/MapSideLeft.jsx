import { Input } from '../../shared/ui/Input';
import profileImg from './assets/profile.png';
import openlayersImg from './assets/openlayers.png';
import styles from './MapSideLeft.module.css';
import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {useMapUtileStore} from "../../app/providers/store.js";
import {useNavigate} from "react-router-dom";

const fetchKakaoAddress = async(address) => {
    const res = await fetch(`http://chaewoo.synology.me:25011/kakao?query=${address}`);
    if (!res.ok) throw new Error('주소 조회 실패');
    return res.json();
};

const MapSideLeft = () => {
    const [value, setValue] = useState('');
    const mapUtile = useMapUtileStore((state) => state.mapUtile);
    const navigate = useNavigate();

    const { data, refetch, isLoading } = useQuery({
        queryKey: ['address', value],
        queryFn: () => fetchKakaoAddress(value),
        enabled: false
    });

    const handleChangeDown = (e) => {
        if(e.key === 'Enter') {
            refetch();
        }
    };

    const clickMoveBtn = (e) => {
        const _this = e.currentTarget;
        const {lon, lat} = _this.dataset;

        const [transLon, transeLat] = mapUtile.epsgTransform([lon, lat]);
        mapUtile.moveTo([transLon, transeLat]);
        mapUtile.generatePulse([transLon, transeLat]);
    };

    return (
        <aside className="w-90 relative flex flex-col p-4 rounded-2xl shadow-xl overflow-hidden text-gray-900">
            {/* 배경 패턴 */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-yellow-100 to-green-100 opacity-50 pointer-events-none z-0"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dot-grid.png')] bg-repeat opacity-20 pointer-events-none z-0"></div>

            {/* 리퀴드 글래스 컨테이너 */}
            <div className="relative bg-white/10 backdrop-blur-3xl border border-white/20 rounded-2xl p-4 flex flex-col h-full z-10">

                {/* Logo */}
                <div className="flex justify-between items-center mb-6">
                    <div className="cursor-pointer flex items-center" onClick={() => {navigate('/')}}>
                        <img
                            src={profileImg}
                            alt="Logo"
                            className="h-10 w-10 rounded-full border-2 border-white/30"
                        />
                        <span className="text-xl font-bold ml-2">MoonChaeWoo</span>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <Input
                            type="text"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="w-full bg-white/20 text-gray-900 rounded-3xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-gray-700"
                            placeholder="주소 키워드 입력..."
                            onKeyDown={handleChangeDown}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg
                                className="h-5 w-5 text-gray-600"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Result List */}
                <div className="item-result-list flex-grow my-4 overflow-y-auto">
                    <ul className={styles.resultList}>
                        {/*<li className={styles.resultItem}>*/}
                        {/*    <div className={styles.itemContent}>*/}
                        {/*        <span><strong>주소 :</strong> 서울 서초구 서초동 1748-4</span>*/}
                        {/*        <span><strong>도로명 주소 :</strong> 서울 서초구 서초동 1748-4</span>*/}
                        {/*        <span><a href="http://place.map.kakao.com/21160636" target="_blank" rel="noopener noreferrer">http://place.map.kakao.com/21160636</a></span>*/}
                        {/*    </div>*/}
                        {/*    <button className={styles.moveButton}>이동</button>*/}
                        {/*</li>*/}
                        {isLoading ? '...조회중' : data?.map((item) => {
                            return (
                                <li className={styles.resultItem} key={item?.id}>
                                    <div className={styles.itemContent}>
                                        <span><strong>장소 이름 : </strong>{item?.place_name || '-'}</span>
                                        <span><strong>도로명 주소 :</strong>{item?.road_address_name || '-'}</span>
                                        <span><a href={item?.place_url || '#'} target="_blank" rel="noopener noreferrer">{item?.place_url || '-'}</a></span>
                                    </div>
                                    <button onClick={clickMoveBtn} className={styles.moveButton} data-lon={item?.x} data-lat={item?.y}>이동</button>
                                </li>
                            )
                        })}
                    </ul>
                </div>

                {/* User Profile */}
                <div className="mt-auto flex items-center p-2 rounded-xl bg-white/20 backdrop-blur-2xl border border-white/20">
                    <div className="profile flex items-center">
                        <img
                            className="h-10 w-10 rounded-full border-2 border-white/30"
                            src={openlayersImg}
                            alt="Icon"
                        />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">openlayers v10.6.0</p>
                            <p className="text-xs text-gray-700">tyche0529@naver.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default MapSideLeft;