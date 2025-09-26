import React, { useEffect, useState, useReducer } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import { defaults as defaultInteractions } from 'ol/interaction';
import createVworldTileGrop from "../../shared/utils/openlayers/MapTile/VworldMap";
import createItsTileLayer from "../../shared/utils/openlayers/MapTile/ItsTileMap";
import { get as getProjection, transform } from 'ol/proj';
import MapUtile from '../../shared/utils/openlayers/MapUtile';
import MapLayerControl from '../../features/Openlayers/MapLayerControl/ui/MapLayerControl';
import MapMeasure from '../../features/Openlayers/MapMeasure/ui/MapMeasure';
import SelectFeature from '../../features/SelectFeature/ui/SelectFeature';
import ClearFeatures from '../../features/Openlayers/ClearFeatures/ui/ClearFeatures';
import MoveCurrentLocation from "../../features/Openlayers/MoveCurrentLocation/ui/MoveCurrentLocation.jsx";
import { Toast } from "../../shared/ui/Toast";
import {useMapUtileStore} from "../../app/providers/store.js";

const initialState = {
    target: null,
    distanceState: false,
    areaState: false
};

const measureReducer = (state, action) => {
    switch (action.target) {
        case 'LineString':
            return { ...state, distanceState: !state.distanceState, areaState: false };
        case 'Polygon':
            return { ...state, areaState: !state.areaState, distanceState: false };
        case 'all':
            return { ...state, areaState: false, distanceState: false };
        default:
            return state;
    }
};

const MapMain = () => {
    const [mapUtile, setMapUtile] = useState(null);
    const [activeMeasure, dispatchActiveMeasure] = useReducer(measureReducer, initialState);
    const [selectFeatureState, setSelectFeatureState] = useState(false);
    const [isToastVisible, setIsToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const setMapUtileStore = useMapUtileStore((state) => state.setMapUtile);

    useEffect(() => {
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
        map.addLayer(createItsTileLayer());

        const mapUtileInstance = new MapUtile(map);
        setMapUtile(mapUtileInstance);
        setMapUtileStore(mapUtileInstance);

        return () => {
            map.setTarget(null);
        };
    }, []);

    useEffect(() => {
        let showTimer;
        let hideTimer;
        if(isToastVisible){
            showTimer = setTimeout(() => {
                setIsToastVisible(true);
            }, 500);

            hideTimer = setTimeout(() => {
                setIsToastVisible(false);
            }, 5000);
        }

        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };
    }, [isToastVisible])

    window.mapUtile = mapUtile;
    window.MapUtile = MapUtile;
    return (
        <main className="flex-1 bg-gray-100 relative">
            <div id='map' className='absolute inset-0 bg-gray-300'></div>

            <div className="absolute top-6 left-1/2 p-6 w-1/2 -translate-x-1/2 flex justify-between items-center rounded-[2rem] border border-white/20 bg-transparent backdrop-blur-3xl backdrop-saturate-200 shadow-lg shadow-black/10 relative overflow-hidden">
                <div className="absolute inset-0 rounded-[2rem] pointer-events-none bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-20"/>
                <MapMeasure mapUtile={mapUtile} activeMeasure={activeMeasure}
                            dispatchActiveMeasure={dispatchActiveMeasure}/>
                {/*<DrawTool mapUtile={mapUtile}/>*/}
                <SelectFeature mapUtile={mapUtile} selectFeatureState={selectFeatureState}
                               setSelectFeatureState={setSelectFeatureState}
                               dispatchActiveMeasure={dispatchActiveMeasure}/>
                <ClearFeatures mapUtile={mapUtile}/>
                <MoveCurrentLocation mapUtile={mapUtile} setToast={setIsToastVisible}
                                     setToastMessage={setToastMessage}/>
                <MapLayerControl mapUtile={mapUtile}/>
            </div>

            <Toast isToastVisible={isToastVisible} toastMessage={toastMessage}/>
        </main>
    );
};

export default MapMain;