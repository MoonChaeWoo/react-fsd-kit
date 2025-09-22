import React from 'react';
import { lineString, polygon } from '../../../../widgets/MapMain/assets/index.js';

const DrawTool = ({ mapUtile }) => {
    const drawShape = (type) => {
        if (!mapUtile) return;
        const _this = e.currentTarget;


    }

    return (
        <>
            <div className="flex flex-col items-center">
                <button onClick={() => drawShape('LineString')} type="button" className="w-10 h-10 bg-cover bg-center cursor-pointer" style={{ backgroundImage: `url(${lineString})` }}></button>
                <span style={{ fontSize: '10px' }}>선</span>
            </div>
            <div className="flex flex-col items-center">
                <button onClick={() => drawShape('Polygon')} type="button" className="w-10 h-10 bg-cover bg-center cursor-pointer" style={{ backgroundImage: `url(${polygon})` }}></button>
                <span style={{ fontSize: '10px' }}>면</span>
            </div>
        </>
    );
};

export default DrawTool;
