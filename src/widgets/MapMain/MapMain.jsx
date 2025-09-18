import React, { useEffect } from 'react';
import 'ol/ol.css'; // OpenLayers 기본 스타일
import Map from 'ol/Map';
import View from 'ol/View';
import { defaults as defaultInteractions, KeyboardPan, KeyboardZoom } from 'ol/interaction';
import createVworldTileGrop from "../../shared/utils/openlayers/MapTile/VworldMap";
import { get as getProjection, transform } from 'ol/proj';

const MapMain = () => {
    useEffect(() => {
        // 광주 시청 기준
        const center = transform([126.8513271, 35.1600702], 'EPSG:4326', 'EPSG:5186');

        const map = new Map({
            target: 'map',
            view: new View({
                projection: getProjection('EPSG:5186'),
                center,
                zoom: 17,
                minZoom: 11,
            }),
            interactions: defaultInteractions({ keyboard: true })
        });

        map.addLayer(createVworldTileGrop());

        // cleanup: 컴포넌트 언마운트 시 지도 제거
        return () => map.setTarget(null);
    }, []);

    return (
        <main className="flex-1 bg-gray-100 relative">
            <div id='map' className='absolute inset-0 bg-gray-300'></div>

            <div className="absolute top-6 left-6 right-6 p-6 bg-white rounded-lg shadow-md">
                <p className="text-gray-600">This is a dark sidebar example with submenus.</p>
            </div>
        </main>
    );
};

export default MapMain;