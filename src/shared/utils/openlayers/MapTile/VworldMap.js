import XYZ from 'ol/source/XYZ';
import TileLayer from 'ol/layer/Tile';
import LayerGroup from 'ol/layer/Group';

class VworldMap extends XYZ {
    /**
     * VWorld 타일 소스
     * @param {Object} options
     * @param {'SATELLITE'|'BASE'} options.type
     * @param {string} [options.proxyUrl]
     */
    constructor(options = {}) {
        const proxyUrl = options.proxyUrl || '';
        const extension = options.type === 'SATELLITE' ? 'jpeg' : 'png';
        const type = options.type === 'SATELLITE' ? 'Satellite' : 'Base';

        super({
            crossOrigin: 'Anonymous',
            url: `${proxyUrl}https://xdworld.vworld.kr/2d/${type}/service/{z}/{x}/{y}.${extension}`,
            maxZoom: 19,
        });
    }
}

const createVworldTileGrop = () => {
    // vworld(2D)
    const vworld2DTileLayer = new TileLayer({
        id: 'vworld2D',
        source: new VworldMap({
            type: 'BASE'
        }),
        preload: 4,
        useInterimTilesOnError: false,
        visible: true
    });

    // vworld(위성)
    const vworldSatelliteTileLayer = new TileLayer({
        id: 'vworldSatellite',
        source: new VworldMap({
            type: 'SATELLITE',
        }),
        preload: 4,
        useInterimTilesOnError: false,
        visible: false
    });

    const vworldTileGroup = new LayerGroup({
        id: 'vworldTileGroup',
        name: 'vworld지도'
    });

    vworldTileGroup.getLayers().push(vworld2DTileLayer);
    vworldTileGroup.getLayers().push(vworldSatelliteTileLayer);

    return vworldTileGroup;
}

export default createVworldTileGrop;