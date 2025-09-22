
import React from 'react';
import { normalMap, satelliteMap, trafficConfusion } from '../../../../widgets/MapMain/assets/index.js';

const MapLayerControl = ({ mapUtile }) => {
    const mapLayerChange = (e) => {
        if (!mapUtile) return;
        const _this = e.currentTarget;
        const { visible, invisible } = JSON.parse(_this.dataset.mapName);
        const visibleLayer = mapUtile.getFindLayer('id', visible);
        if (visibleLayer) visibleLayer.setVisible(true);

        const inVisibleLayer = mapUtile.getFindLayer('id', invisible);
        if (inVisibleLayer) inVisibleLayer.setVisible(false);
    };

    const itsMapOnOff = () => {
        if (!mapUtile) return;
        const visibleLayer = mapUtile.getFindLayer('id', 'trafficConfusion');
        visibleLayer && visibleLayer.setVisible(!visibleLayer.getVisible());
    }

    return (
        <>
            <div className="flex flex-col items-center">
                <button onClick={itsMapOnOff} data-map-name={'trafficConfusion'} type="button" className="w-10 h-10 bg-cover bg-center cursor-pointer" style={{ backgroundImage: `url(${trafficConfusion})` }}></button>
                <span style={{ fontSize: '10px' }}>교통혼잡지도</span>
            </div>
            <div className="flex flex-col items-center">
                <button onClick={mapLayerChange} data-map-name={JSON.stringify({ visible: 'vworld2D', invisible: 'vworldSatellite' })} type="button" className="w-10 h-10 bg-cover bg-center cursor-pointer" style={{ backgroundImage: `url(${normalMap})` }}></button>
                <span style={{ fontSize: '10px' }}>일반지도</span>
            </div>
            <div className="flex flex-col items-center">
                <button onClick={mapLayerChange} data-map-name={JSON.stringify({ visible: 'vworldSatellite', invisible: 'vworld2D' })} type="button" className="w-10 h-10 bg-cover bg-center cursor-pointer" style={{ backgroundImage: `url(${satelliteMap})` }}></button>
                <span style={{ fontSize: '10px' }}>위성지도</span>
            </div>
        </>
    );
};

export default MapLayerControl;
