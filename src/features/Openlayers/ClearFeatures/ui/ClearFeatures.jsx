import React from 'react';
import { clearImg } from '../../../../widgets/MapMain/assets/index.js';

const ClearFeatures = ({ mapUtile }) => {
    const clearFeatures = () => {
        if (!mapUtile) return;
        mapUtile.clearDrawEventFeature(true);
    };

    return (
        <div className="flex flex-col items-center">
            <button
                onClick={clearFeatures}
                type="button"
                className={`w-10 h-10 bg-cover bg-center cursor-pointer`}
                style={{ backgroundImage: `url(${clearImg})` }}
            ></button>
            <span style={{ fontSize: '10px' }}>
                그린 객체 모두 비우기
            </span>
        </div>
    );
};

export default ClearFeatures;
