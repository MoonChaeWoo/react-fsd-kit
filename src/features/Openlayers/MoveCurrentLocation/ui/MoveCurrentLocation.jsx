import {currentLocation} from "../../../../widgets/MapMain/assets/index.js";
import React from "react";

const MoveCurrentLocation = ({ mapUtile, setToast, setToastMessage}) => {
    const currentLocationFromIp = async () => {
        try {
            // 먼저 ipapi.co 시도
            const res1 = await fetch('https://ipapi.co/json/');
            if (!res1.ok) throw new Error('ipapi.co fetch 실패');
            const data1 = await res1.json();

            mapUtile.moveTo([data1.longitude, data1.latitude], 'EPSG:4326');
            mapUtile.zoom = 18;
            mapUtile.generatePulse(
                mapUtile.epsgTransform([data1.longitude, data1.latitude], 'EPSG:4326')
            );
        } catch (error1) {
            console.warn('ipapi.co 실패, ip-api.com 시도:', error1);

            // ipapi.co 실패하면 ip-api.com 시도
            try {
                const res2 = await fetch('http://ip-api.com/json');
                if (!res2.ok) throw new Error('ip-api.com fetch 실패');
                const data2 = await res2.json();

                mapUtile.moveTo([data2.lon, data2.lat], 'EPSG:4326');
                mapUtile.zoom = 18;
                mapUtile.generatePulse(
                    mapUtile.epsgTransform([data2.lon, data2.lat], 'EPSG:4326')
                );
            } catch (error2) {
                console.error('모든 IP 기반 위치 조회 실패:', error2);
            }
        }
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <button
                onClick={() => {setToast(true); setToastMessage('GPS가 아닌 무료 IP 기반 위치 정보이므로 실제 위치와 다를 수 있습니다.'); currentLocationFromIp();}}
                type="button"
                className={`w-10 h-10 bg-cover bg-center cursor-pointer`}
                style={{ backgroundImage: `url(${currentLocation})` }}
            ></button>
            <span style={{ fontSize: '10px' }}>
                현재 내 위치
            </span>
        </div>
    );

};

export default MoveCurrentLocation;