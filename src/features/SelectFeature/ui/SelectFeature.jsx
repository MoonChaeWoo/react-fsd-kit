import React from 'react';
import { selectMarker } from '../../../widgets/MapMain/assets';

const SelectFeature = ({ mapUtile, selectFeatureState, setSelectFeatureState, dispatchActiveMeasure }) => {
    const drawFeatureHandler = () => {
        if (!mapUtile) return;

        setSelectFeatureState(prev => {
            dispatchActiveMeasure({ target: 'all' });
            return !prev;
        });

        mapUtile.finishDrawing();

        if (selectFeatureState) {
            mapUtile.unsetSelectDrawFeatureEvent();
        } else {
            mapUtile.setSelectDrawFeatureEvent();
        }
    };

    return (
        <div className="flex flex-col items-center">
            <button
                onClick={drawFeatureHandler}
                type="button"
                className={`w-10 h-10 bg-cover bg-center cursor-pointer ${selectFeatureState && "drop-shadow-[2px_4px_6px_black]"}`}
                style={{ backgroundImage: `url(${selectMarker})` }}
            ></button>
            <span style={{ fontSize: '10px' }}>그린 객체 선택</span>
        </div>
    );
};

export default SelectFeature;
