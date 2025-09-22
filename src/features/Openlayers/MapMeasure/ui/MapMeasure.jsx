import React from 'react';
import { distanceImg, areaImg } from '../../../../widgets/MapMain/assets';

const MapMeasure = ({ mapUtile, activeMeasure, dispatchActiveMeasure }) => {
    const mapMeasure = (e) => {
        if (!mapUtile) return;
        const _this = e.currentTarget;
        const measure = _this.dataset.measure; // 'LineString', 'Polygon'

        dispatchActiveMeasure({ target: measure });

        let popup = null;
        mapUtile.drawEventFeature(measure, (type, geom, feature) => {
            popup = mapUtile.createOverlay(geom.getFirstCoordinate(), feature, geom.getType());
        }, (type, geom) => {
            mapUtile.moveOverlay(popup, geom.getLastCoordinate());
            if(popup.element){
                if(geom.getType() === 'LineString'){
                    popup.element.querySelector('.calc').textContent = (geom.getLength() / 1000).toFixed(2) + 'km';
                }else if(geom.getType() === 'Polygon'){
                    popup.element.querySelector('.calc').textContent = (geom.getArea() / 1_000_000).toFixed(2) + 'km²';
                }

            }
        }, () => {
            dispatchActiveMeasure({ target: measure });
            if(popup.element){
                popup.element.querySelector('.ing').parentNode.remove();
            }
        });
    }

    return (
        <>
            <div className="flex flex-col items-center">
                <button onClick={mapMeasure}
                    data-measure={'LineString'}
                    type="button"
                    className={`w-10 h-10 bg-cover bg-center cursor-pointer ${activeMeasure.distanceState && "drop-shadow-[2px_4px_6px_black]"}`}
                    style={{ backgroundImage: `url(${distanceImg})` }}></button>
                <span style={{ fontSize: '10px' }}>거리</span>
            </div>
            <div className="flex flex-col items-center">
                <button onClick={mapMeasure}
                    data-measure={'Polygon'}
                    type="button"
                    className={`w-10 h-10 bg-cover bg-center cursor-pointer ${activeMeasure.areaState && "drop-shadow-[2px_4px_6px_black]"}`}
                    style={{ backgroundImage: `url(${areaImg})` }}></button>
                <span style={{ fontSize: '10px' }}>면적</span>
            </div>
        </>
    );
};

export default MapMeasure;
