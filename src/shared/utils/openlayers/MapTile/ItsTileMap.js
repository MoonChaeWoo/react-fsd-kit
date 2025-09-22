import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import { get as getProjection } from 'ol/proj';

const createItsTileLayer = () => {
    return new TileLayer({
        id: 'trafficConfusion',
        source: new TileWMS({
            url: 'https://gis.utic.go.kr/geoserver/UTIS/wms',
            params: {
                'LAYERS': 'UTIS:vi_2022_p_lv1_d',
                'TILED': true,
                'FORMAT': 'image/png',
                'TRANSPARENT': true,
                'VERSION': '1.1.1',
                'SRS': 'EPSG:5181' // 문자열로 지정
            },
            projection: getProjection('EPSG:4326') // optional, WMS source용
        }),
        visible: false
    });
};

export default createItsTileLayer;