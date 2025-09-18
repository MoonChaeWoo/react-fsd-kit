import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';

const registerKoreanEPSG = () => {
    proj4.defs([
        // 한국 TM 2000
        ['EPSG:5181', '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs'], // 동부
        ['EPSG:5182', '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs'], // 중부
        ['EPSG:5183', '+proj=tmerc +lat_0=38 +lon_0=128 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs'], // 서부
        ['EPSG:5184', '+proj=tmerc +lat_0=38 +lon_0=129 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs'], // 동남부
        ['EPSG:5185', '+proj=tmerc +lat_0=38 +lon_0=126 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs'], // 서북부
        ['EPSG:5186', '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs'], // 한국 중앙 TM

        // 한국 TM 1995
        ['EPSG:2096', '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=400000 +y_0=500000 +ellps=GRS80 +units=m +no_defs'], // 서부
        ['EPSG:2097', '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=1 +x_0=400000 +y_0=600000 +ellps=GRS80 +units=m +no_defs'], // 중부
        ['EPSG:2098', '+proj=tmerc +lat_0=38 +lon_0=128 +k=1 +x_0=400000 +y_0=600000 +ellps=GRS80 +units=m +no_defs'], // 동부
        ['EPSG:2099', '+proj=tmerc +lat_0=38 +lon_0=129 +k=1 +x_0=400000 +y_0=600000 +ellps=GRS80 +units=m +no_defs'], // 동남부

        // WGS84
        ['EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs'],

        // Web Mercator
        ['EPSG:3857', '+proj=merc +a=6378137 +b=6378137 +lat_ts=0 +lon_0=0 +x_0=0 +y_0=0 +k=1 +units=m +nadgrids=@null +no_defs']
    ]);

    register(proj4);
};

export default registerKoreanEPSG;