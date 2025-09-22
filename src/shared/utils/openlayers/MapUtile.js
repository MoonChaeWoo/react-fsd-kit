// 좌표 변환
import { transform } from "ol/proj";
// 레이어
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import LayerGroup from 'ol/layer/Group';
// 소스
import VectorSource from 'ol/source/Vector';
// 지오메트리
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import Polygon from 'ol/geom/Polygon';
import { MultiPoint } from 'ol/geom';
// 피처
import Feature from 'ol/Feature';
import Overlay from 'ol/Overlay.js';
// 인터랙션
import Draw, { createBox, createRegularPolygon } from 'ol/interaction/Draw';
import Modify from 'ol/interaction/Modify';
import Snap from 'ol/interaction/Snap';
import { Select } from 'ol/interaction';
// 이벤트
import { click } from 'ol/events/condition';
// 스타일
import { Style, Fill, Stroke, Icon, Circle as CircleStyle } from 'ol/style';
// 렌더링 & 유틸
import { getVectorContext } from 'ol/render';
import { unByKey } from 'ol/Observable';
import { easeOut } from 'ol/easing';
import { bbox } from 'ol/loadingstrategy';
// 포맷
import GeoJSON from 'ol/format/GeoJSON';

import {getLength, getArea} from 'ol/sphere';

// 외부 리소스
import defaultMarkerIcon from './assets/marker/default_marker.png';

/**
 * MapUtile
 *
 * 작성자 : tyche0529@naver.com
 *
 * OpenLayers Map 객체를 래핑하여, 지도 관련 기능을 편리하게 사용할 수 있도록 제공하는 유틸 클래스.
 * OpenLayers version 10.6.1
 *
 * 주요 기능:
 *  - moveTo = 지도를 특정 좌표로 이동
 *  - epsgTransform =  주어진 좌표를 다른 좌표계로 변환
 *  - getProjectionCode = 현재 맵의 좌표계(EPSG 코드)를 반환
 *  - getExtent = 현재 지도 화면에서 보여지는 영역(Extent)을 반환
 *  - getFindLayer = Map 인스턴스의 레이어 배열에서 특정 key와 value에 맞는 Layer를 찾아 반환.
 *  - generatePulse = 특정 좌표에서 원형 퍼짐(펄스) 애니메이션을 생성
 *
 *  === Setter, Getter ===
 *  - map = Setter, Getter 지도 객체 설정
 *  - zoom = Setter, Getter 줌 레벨 설정
 *  - center = Getter 현재 위치 값 [lon, lat] 반환
 *
 *  === 클릭 관련 함수 ===
 *  - setClickCoordinate = 지도 클릭 이벤트 설정
 *  - unsetClickCoordinate = 지도 클릭 이벤트 해제
 *  - setClickGenerateMarker = 지도 클릭 시 마커를 생성하는 이벤트 등록
 *  - unsetClickGenerateMarker = 지도 클릭 시 마커를 생성하는 이벤트 해제
 *
 *  === 생성 관련 함수 ===
 *  - createFeature = 피처(Feature) 생성 함수
 *  - createVectorLayer = 벡터 레이어 생성 함수
 *  - createAsyncVectorLayer = 비동기 로딩 방식으로 벡터 레이어를 생성.
 *
 *  === 도형 그리기 및 선택 관련 함수 ==
 *  - drawEventFeature = 도형 그리기 이벤트 등록
 *  - clearDrawEventFeature = 도형 그리기 이벤트 해제
 *  - setSelectDrawFeatureEvent = drawFeatureLayer 레이어의 "도형 선택 이벤트"를 활성화
 *  - unsetSelectDrawFeatureEvent = drawFeatureLayer 레이어의 "도형 선택 이벤트"를 제거
 *
 *  === 면적, 길이 관련 함수 ===
 *  - getMeter = 주어진 LineString 또는 좌표 배열의 거리를 계산
 *  - getSquareMeter = 주어진 Polygon 또는 좌표 배열의 면적을 계산
 */
class MapUtile {
    #map;
    #mapClickCoordHandler = null;
    #mapClickMarkerHandler = null;
    #mapPulseHandler = null;
    #mapDrawFeatureHandler = {};
    #mapSelectDrawFeatureHandler = null;

    constructor(map) {
        this.#map = map;

        const mapEl = this.#map.getTargetElement();
        if (mapEl) {
            mapEl.tabIndex = 0; // 포커스 가능하게
            mapEl.addEventListener('click', () => mapEl.focus());
        }

        /**
         * 맵 div 엘리먼트에 키보드 이벤트를 등록한다.
         *
         * Delete / Backspace: 선택된 피처 삭제
         * Escape: 현재 진행 중인 Draw 도형 완성 (그리던 도형 종료)
         */
        mapEl.addEventListener('keydown', (e) => {
            if (e.key === 'Delete' || e.key === 'Backspace') {
                const selectHandler = this.#mapSelectDrawFeatureHandler;
                if (!selectHandler) return;

                const selectedFeatures = selectHandler.getFeatures();
                const layer = this.getFindLayer('id', 'drawFeatureLayer');
                selectedFeatures.forEach(f => {
                    layer.getSource().removeFeature(f);
                    if(f?.popup){
                        f?.popup?.element?.remove();
                        f?.popup && this.#map.removeOverlay(f.popup);
                    }
                });
                selectedFeatures.clear();
            }else if(e.key === 'Escape'){
                this.finishDrawing();
            }
        });

        // 우클릭 시 이벤트
        mapEl.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.finishDrawing();
        });
    }

    /**
     * 내부 map 객체를 반환한다.
     *
     * @type {import('ol/Map').default}
     *
     * @example
     * const map = mapUtils.map;
     */
    get map(){
        return this.#map;
    }

    /**
     * 내부 map 객체를 설정한다.
     *
     * OpenLayers Map 객체만 허용된다.
     *
     * @param {import('ol/Map').default} map - 설정할 Map 객체
     *
     * @example
     * mapUtils.map = new Map({ target: 'map', layers: [], view: new View({...}) });
     */
    set map(map){
        if(map instanceof Map){
            this.#map = map;
            this.#mapClickCoordHandler = null;
            this.#mapClickMarkerHandler = null;
            this.#mapPulseHandler = null;
        }
    }

    /**
     * 현재 줌 레벨을 반환한다.
     *
     * @type {number}
     *
     * @example
     * const zoom = mapUtils.zoom;
     */
    get zoom(){
        return this.#map.getView().getZoom();
    }

    /**
     * 현재 줌 레벨을 변경한다.
     *
     * 숫자 또는 숫자로 변환 가능한 값을 입력해야 한다.
     *
     * @param {number|string} number - 변경할 줌 레벨
     *
     * @example
     * mapUtils.zoom = 10;       // 숫자 입력
     * mapUtils.zoom = '12';     // 문자열 입력 (자동 변환)
     */
    set zoom(number){
        if(typeof number === 'number') this.#map.getView().setZoom(number);
        else{
            const casting = Number(number);
            isNaN(casting) || this.#map.getView().setZoom(casting);
        }
    }

    /**
     * 현재 지도 중심 좌표를 반환한다.
     *
     * @type {Array<number>} [lon, lat]
     *
     * @example
     * const center = mapUtils.center;
     */
    get center(){
        return this.#map.getView().getCenter();
    }

    /**
     * 지도를 특정 좌표로 이동한다.
     *
     * @param {Array<number>} value - 이동 좌표 [lon, lat]
     * @param {string} [projection] - 입력 좌표의 EPSG 코드
     *
     * @example
     * 좌표계 epsg:5186 기준으로 설명
     *
     * 입력한 좌표가 지도와 동일 시
     * mapUtils.moveTo([141044.6803066387, 285177.31254345685]);
     *
     * 입력한 좌표와 지도의 좌표계와 다를 시
     * 입력한 좌표의 좌표 값을 입력하면 현재 지도의 좌표계로 자동 변환 후 이동
     * mapUtils.moveTo([126.9784, 37.5667], 'EPSG:4326');
     */
    moveTo([lon, lat], projection){
        if(projection){
            const coord = this.epsgTransform([lon, lat], projection);
            this.#map.getView().setCenter(coord);
        }else{
            this.#map.getView().setCenter([lon, lat]);
        }
    }

    /**
     * 주어진 좌표를 다른 좌표계로 변환.
     *
     * @param {Array<number>} coordinate - 변환할 좌표 [lon, lat]
     * @param {string} [beforeEpsg='EPSG:4326'] - 입력 좌표의 EPSG 코드
     * @param {string} [afterEpsg=this.getProjectionCode()] - 변환할 목표 EPSG 코드
     * @returns {Array<number>} 변환된 좌표 [x, y] (목표 좌표계 기준)
     *
     * @example
     * 입력된 좌표 EPSG:4326을 사용하는 지표 좌표계 값으로 변경 시
     * const coord = mapUtils.epsgTransform([126.9784, 37.5667]);
     *
     * 입력된 좌표 EPSG:3856이라면 사용하는 지표 좌표계 값으로 변경 시
     * const coord3857 = mapUtils.epsgTransform([126.9784, 37.5667], 'EPSG:3857');
     *
     * 입력된 좌표 EPSG:4326이고 특정 좌표계 값으로 변경 시
     * const coord3857 = mapUtils.epsgTransform([126.9784, 37.5667], 'EPSG:4326', 'EPSG:3857');
     */
    epsgTransform([lon, lat], beforeEpsg = 'EPSG:4326', afterEpsg = this.getProjectionCode()){
        return transform([lon, lat], beforeEpsg, afterEpsg);
    }

    /**
     * 현재 맵의 좌표계(EPSG 코드)를 반환.
     *
     * @returns {string} 현재 맵의 EPSG 코드
     *
     * @example
     * const currentEpsg = mapUtils.getProjectionCode();
     * console.log(currentEpsg);
     * 출력 : 'EPSG:3857'
     */
    getProjectionCode(){
        return this.#map.getView().getProjection().getCode();
    }

    /**
     * 현재 지도 화면에서 보여지는 영역(Extent)을 반환.
     *
     * Extent는 [minX, minY, maxX, maxY] 형식의 배열이며,
     * 현재 맵의 좌표계 기준으로 계산.
     *
     * @returns {Array<number>} 현재 화면에 보이는 좌표 범위
     *
     * @example
     * const extent = mapUtils.getExtent();
     * console.log(extent);
     * 출력 : [140000, 280000, 150000, 290000]
     */
    getExtent(){
        return this.#map.getView().calculateExtent(this.#map.getSize());
    }

    /**
     * Map 인스턴스의 레이어 배열에서 특정 key와 value에 맞는 Layer를 찾아 반환.
     *
     * @param {string} key - 검색할 Layer 속성 키
     * @param {*} value - 검색할 값
     * @returns {TileLayer | VectorLayer} - 조건에 맞는 Layer 객체(TileLayer, VectorLayer 등), 없으면 undefined 반환
     *
     * @example
     * const layer = mapUtils.getFindLayer('name', 'Buildings');
     * if (layer) {
     *     console.log('찾은 레이어:', layer);
     * } else {
     *     console.log('조건에 맞는 레이어가 없습니다.');
     * }
     */
    getFindLayer(key, value){
        const targetLayer = this.#map.getLayers().getArray().find(layers => {
            if(layers instanceof LayerGroup){
                return layers.values_.layers.array_.some(layer => layer.values_?.[key] === value);
            }else if(layers instanceof TileLayer || layers instanceof VectorLayer){
                return layers.values_?.[key] === value;
            }
        });

        if(targetLayer instanceof LayerGroup){
            return targetLayer.values_.layers.array_.find(layer => layer.values_?.[key] === value);
        }else{
            return targetLayer;
        }
    }

    /**
     * 지도 클릭 이벤트를 등록한다.
     *
     * 사용자가 지도를 클릭하면 해당 좌표([lon, lat])를 추출하여
     * 전달받은 콜백 함수에 넘겨준다.
     *
     * @param {Function} [callback=console.log] - 클릭 시 실행할 콜백 (좌표 배열을 인자로 받음)
     * @param {Object} [options={}] - 옵션 객체
     * @param {boolean} [options.once=false] - true이면 한 번만 실행 후 이벤트 해제
     *
     * @example
     * // 기본 사용 (클릭 좌표를 콘솔에 출력)
     * mapUtils.setClickCoordinate();
     *
     * @example
     * // 좌표를 받아 원하는 로직 실행
     * mapUtils.setClickCoordinate(([lon, lat]) => {
     *   console.log(`경도: ${lon}, 위도: ${lat}`);
     * });
     *
     * @example
     * // 한 번만 클릭 이벤트 실행
     * mapUtils.setClickCoordinate(([lon, lat]) => {
     *   alert(`한 번만 실행됨. 좌표: ${lon}, ${lat}`);
     * }, { once: true });
     */
    setClickCoordinate(callback = console.log, {once = false} = {}){
        if(this.#mapClickCoordHandler) {
            console.log('좌표 클릭 이벤트가 기존에 등록되어있음.');
            return;
        }

        this.#mapClickCoordHandler = (e) => {
            const [lon, lat] = e.coordinate;
            callback([lon, lat]);
        };

        if(once){
            this.#map.once('click', this.#mapClickCoordHandler);
            this.#mapClickCoordHandler = null;
        }else{
            this.#map.on('click', this.#mapClickCoordHandler);
        }

        console.log('좌표 클릭 이벤트 등록 완료. 이벤트 제거 필요 시 unsetClickCoordinate() 함수 사용.');
    }

    /**
     * 지도 클릭 이벤트를 해제한다.
     *
     * `setClickCoordinate`로 등록된 클릭 이벤트 핸들러가 있으면
     * 이를 제거하고 핸들러 참조를 초기화한다.
     *
     * @example
     * // 클릭 이벤트 등록
     * mapUtils.setClickCoordinate(([lon, lat]) => {
     *   console.log('클릭 좌표:', lon, lat);
     * });
     *
     * // 이후 이벤트 해제
     * mapUtils.unsetClickCoordinate();
     *
     * @example
     * // 이벤트가 등록되지 않은 상태에서 해제를 시도
     * mapUtils.unsetClickCoordinate(); // 콘솔에 '좌표 클릭 이벤트가 등록되어있지 않음.' 출력
     */
    unsetClickCoordinate(){
        if(!this.#mapClickCoordHandler) {
            console.log('좌표 클릭 이벤트가 등록되어있지 않음.');
            return;
        }

        this.#map.un('click', this.#mapClickCoordHandler);
        this.#mapClickCoordHandler = null;
        console.log('좌표 클릭 이벤트 해제 완료');
    }

    /**
     * 벡터 레이어를 생성한다.
     *
     * OpenLayers `VectorLayer`를 생성하여 지도에 추가한다.
     *
     * @param {Object} options - VectorLayer 옵션
     * @param {string} options.id - 레이어 고유 ID (필수)
     * @param {string} [options.className='ol-layer'] - 레이어 DOM 요소에 적용할 CSS 클래스
     * @param {number} [options.opacity=1] - 레이어 불투명도 (0~1)
     * @param {boolean} [options.visible=true] - 레이어 표시 여부
     * @param {Array<number>} [options.extent] - 레이어가 렌더링되는 범위 ([minX, minY, maxX, maxY])
     * @param {number} [options.zIndex] - 렌더링 순서 Z-Index
     * @param {number} [options.minResolution] - 최소 해상도 (포함)
     * @param {number} [options.maxResolution] - 최대 해상도 (제외)
     * @param {number} [options.minZoom] - 최소 줌 레벨 (제외)
     * @param {number} [options.maxZoom] - 최대 줌 레벨 (포함)
     * @param {Function} [options.renderOrder] - 피처 렌더링 순서를 결정하는 함수
     * @param {number} [options.renderBuffer=100] - 벡터 피처 렌더링 시 뷰포트 주변 픽셀 버퍼
     * @param {import('ol/source/Vector').default} [options.source] - 벡터 소스
     * @param {import('ol/Map').default} [options.map] - 임시로 레이어를 지도에 바로 연결
     * @param {boolean|string|number} [options.declutter=false] - 이미지/텍스트 중첩 정리 여부
     * @param {import('ol/style/Style').StyleLike} [options.style] - 레이어 스타일
     * @param {string} [options.background] - 레이어 배경색
     * @param {boolean} [options.updateWhileAnimating=false] - 애니메이션 중 피처 업데이트 여부
     * @param {boolean} [options.updateWhileInteracting=false] - 상호작용 중 피처 업데이트 여부
     * @param {Object<string, *>} [options.properties] - 임의의 관찰 가능한 속성
     * @returns {import('ol/layer/Vector').default} 생성된 VectorLayer 객체
     *
     * @example
     * 레이어에 특정 소스를 넣지 않을 시
     * const vectorLayer = mapUtils.createVectorLayer({ id: 'LayerIdName' });
     *
     * 레이어에 특정 소스를 넣을 시
     * const vectorLayer = mapUtils.createVectorLayer({ id: 'LayerIdName', source : source<new VectorSource>});
     */
    createVectorLayer({
           id,
           className,
           opacity,
           visible,
           extent,
           zIndex,
           minResolution,
           maxResolution,
           minZoom,
           maxZoom,
           renderOrder,
           renderBuffer,
           source,
           map,
           declutter,
           style,
           background,
           updateWhileAnimating,
           updateWhileInteracting,
           properties
       } = {}) {

        if(!id) throw new Error('생성할 레이어의 고유 ID는 필수항목입니다.');

        source || (source = new VectorSource({
            wrapX: false
        }));

        const vectorLayer = new VectorLayer({
            id,
            className,
            opacity,
            visible,
            extent,
            zIndex,
            minResolution,
            maxResolution,
            minZoom,
            maxZoom,
            renderOrder,
            renderBuffer,
            source,
            map,
            declutter,
            style,
            background,
            updateWhileAnimating,
            updateWhileInteracting,
            properties
        });

        this.#map.addLayer(vectorLayer);
        return vectorLayer;
    }

    /**
     * 비동기 로딩 방식으로 벡터 레이어를 생성한다.
     *
     * WFS(웹 피처 서비스) 요청을 통해 GeoJSON 데이터를 불러오고,
     * 지정된 레이어 ID로 벡터 레이어를 생성하여 지도에 추가한다.
     *
     * @param {Object} layer - 레이어 정보 객체
     * @param {string} [layer.id] - 레이어 고유 ID (없으면 자동 생성)
     *
     * @example
     * mapUtils.createAsyncVectorLayer({ id: 'asyncLayer' });
     */
    createAsyncVectorLayer(layer){
        const vectorSource = new VectorSource({
            format: new GeoJSON(),
            loader: function(extent, resolution, projection, success, failure) {
                const proj = projection.getCode();
                const url = 'https://ahocevar.com/geoserver/wfs?service=WFS&' +
                    'version=1.1.0&request=GetFeature&typename=osm:water_areas&' +
                    'outputFormat=application/json&srsname=' + proj + '&' +
                    'bbox=' + extent.join(',') + ',' + proj;
                const xhr = new XMLHttpRequest();
                xhr.open('GET', url);
                const onError = function() {
                    vectorSource.removeLoadedExtent(extent);
                    failure();
                }
                xhr.onerror = onError;
                xhr.onload = function() {
                    if (xhr.status == 200) {
                        const features = vectorSource.getFormat().readFeatures(xhr.responseText);
                        vectorSource.addFeatures(features);
                        success(features);
                    } else {
                        onError();
                    }
                }
                xhr.send();
            },
            strategy: bbox,
        });

        this.createVectorLayer({
            id : layer?.id || `map_${Date.now()}`,
            source: vectorSource,
        });
    }

    /**
     * 피처(Feature)를 생성한다.
     *
     * 지정된 geometry 타입(point, lineString, polygon)에 따라 좌표와 스타일을 적용한
     * OpenLayers Feature 객체를 반환한다.
     *
     * @param {string} name - 피처 이름 (고유 식별용)
     * @param {Array} coordinate - 좌표값
     *   - point: [lon, lat]
     *   - lineString: [[lon, lat], [lon, lat], ...]
     *   - polygon: [[[lon, lat], [lon, lat], ...]]
     * @param {ol.style.Style} style - 적용할 스타일 객체
     * @param {string} [shape='point'] - geometry 타입 (point | lineString | polygon)
     * @returns {ol.Feature} 생성된 Feature 객체
     * @throws {Error} 지원하지 않는 shape 값 입력 시 에러 발생
     *
     * @example
     * const feature = mapUtils.createFeature('featureName', [141044.6803066387, 285177.31254345685]);
     * vectorLayer.getSource().addFeature(feature);
     */
    createFeature(name, coordinate = [], style, shape = 'point'){
        let geometry;

        if(shape === 'point'){
            geometry = new Point(coordinate); // [경도(lon), 위도(lat)]
        }else if(shape === 'lineString'){
            geometry = new LineString(coordinate); // [[경도(lon), 위도(lat)], [경도(lon), 위도(lat)]]
        }else if(shape === 'polygon'){
            geometry = new Polygon(coordinate); // [[[경도(lon), 위도(lat)], [경도(lon), 위도(lat)]]]
        }else{
            throw new Error('shape이 point, lineString, polygon 3가지 중에서 선택.');
        }

        const feature = new Feature({
            geometry,
            name
        });

        style ? feature.setStyle(style) : feature.setStyle(
            new Style({
                image: new Icon({
                    src: defaultMarkerIcon, // 이미지 경로
                    scale: .8,         // 크기 조정
                    anchor: [0.5, 1], // 기준점 (중앙 하단)
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'fraction'
                })
            })
        );

        return feature;
    }

    /**
     * 지도 클릭 시 마커를 생성하는 이벤트를 등록.
     *
     * 이미 등록된 이벤트가 있으면 중복 등록하지 않는다.
     *
     * @param {boolean} [once=false] - true면 한 번만 실행 후 이벤트 해제
     *
     * @example
     * mapUtils.setClickGenerateMarker();        // 클릭할 때마다 마커 생성
     * mapUtils.setClickGenerateMarker(true);    // 한 번만 마커 생성 후 해제
     */
    setClickGenerateMarker(once = false){
        if(this.#mapClickMarkerHandler) {
            console.log('클릭 시 마커 생성 이벤트 기존에 있음.');
            return;
        }

        this.#mapClickMarkerHandler = (e) => {
            let targetLayer = this.getFindLayer('id', 'clickMarkerLayer');
            if(!targetLayer) targetLayer = this.createVectorLayer({id : 'clickMarkerLayer'});

            const [lon, lat] = e.coordinate;
            targetLayer.getSource().addFeature(this.createFeature('clickMarker', [lon, lat]));
        };

        if(once){
            this.#map.once('click', this.#mapClickMarkerHandler);
            this.#mapClickMarkerHandler = null;
        }else{
            this.#map.on('click', this.#mapClickMarkerHandler);
        }
        console.log('클릭 시 마커 생성 이벤트 등록 완료. 이벤트 제거 필요 시 unsetClickGenerateMarker() 사용.');
    }

    /**
     * 지도 클릭 시 마커 생성 이벤트를 해제.
     *
     * 등록된 이벤트 핸들러가 있으면 제거하고 null로 초기화.
     * 필요 시 해당 마커 레이어도 함께 제거 가능.
     *
     * @param {boolean} [removeLayerBoolean=false] - true면 마커 레이어도 제거
     *
     * @example
     * mapUtils.unsetClickGenerateMarker();          // 이벤트만 해제
     * mapUtils.unsetClickGenerateMarker(true);      // 이벤트 + 레이어 제거
     */
    unsetClickGenerateMarker(removeLayerBoolean = false){
        if(!this.#mapClickMarkerHandler) {
            console.log('클릭 시 마커 생성 이벤트가 기존에 등록되어있지 않음.');
            return;
        }

        this.#map.un('click', this.#mapClickMarkerHandler);
        this.#mapClickMarkerHandler = null;

        const targetLayer = this.getFindLayer('id', 'clickMarkerLayer');
        removeLayerBoolean && this.#map.removeLayer(targetLayer);
        console.log('클릭 시 마커 생성 이벤트 해제 완료');
    }

    /**
     * 특정 좌표에서 원형 퍼짐(펄스) 애니메이션을 생성한다.
     *
     * @param {Array<number>} geom - 좌표 [lon, lat]
     * @param {Function} [callback] - 애니메이션 완료 시 실행할 콜백
     * @param {Object} [options] - 애니메이션 옵션
     * @param {number} [options.count=3] - 애니메이션 반복 횟수
     * @param {number} [options.timeout=400] - 각 반복 사이의 간격(ms)
     * @param {number} [options.duration=3000] - 애니메이션 지속 시간(ms)
     *
     * @example
     * 각 지도의 epsg에 맞는 좌표 [lon, lat]값 주입
     *
     * 단순 펄스만 생성 시
     * mapUtils.generatePulse([141044.6803066387, 285177.31254345685]);
     *
     * 펄스 생성과 callback함수 호출 시
     * mapUtils.generatePulse([141044.6803066387, 285177.31254345685], () => {
     *   console.log('펄스 애니메이션 완료');
     * });
     *
     * 펄스 생성과 callback함수 호출과 option 수정 시
     * mapUtils.generatePulse([141044.6803066387, 285177.31254345685], () => {
     *   console.log('펄스 애니메이션 완료');
     * }, { count: 5, duration: 2000 });
     */
    generatePulse(geom, callback, {count = 3, timeout = 400, duration = 3000} = {}){
        if(!geom || geom.length < 2) throw new Error('애니메이션이 발생할 경도, 위도 값이 누락.');

        let targetLayer = this.getFindLayer('id', 'pluseLayer');
        let targetSource = targetLayer?.getSource();
        const featureTemp = new Feature(new Point(geom));

        const addFeatureInterval = (targetSource) => {
            targetSource.addFeature(featureTemp);
            targetSource.removeFeature(featureTemp);

            const interval = setInterval(() => {
                targetSource.addFeature(featureTemp);
                targetSource.removeFeature(featureTemp);
            }, timeout);

            setTimeout(() => {
                clearInterval(interval);
            }, timeout * (count - 1));

            typeof callback === 'function' && callback();
        };

        if(this.#mapPulseHandler){
            addFeatureInterval(targetSource);
        }else{
            const self = this;
            if(!targetLayer){
                targetLayer = this.createVectorLayer({id : 'pluseLayer', zIndex : 999});
                targetSource = targetLayer.getSource();
            }

            this.#mapPulseHandler = e => {
                const feature = e.feature;
                const start = Date.now();
                const featureGeomDeepCopy = feature.getGeometry().clone();
                const pluseLayerEventKey = targetLayer.on('postrender', animateCallback);

                function animateCallback(event){
                    const layerInfo = event.frameState;
                    const elapsedTime = layerInfo.time - start;
                    if(elapsedTime > duration){
                        unByKey(pluseLayerEventKey);
                        return;
                    }

                    const vectorContext = getVectorContext(event);
                    const elapsedRatio = elapsedTime / duration;
                    const radius = easeOut(elapsedRatio) * 25 + 5;
                    const opacity = easeOut(1 - elapsedRatio);

                    const style = new Style({
                        image: new CircleStyle({
                            radius: radius,
                            stroke: new Stroke({
                                color: 'rgba(255, 0, 0, ' + opacity + ')',
                                width: 0.25 + opacity,
                            }),
                        }),
                    });

                    vectorContext.setStyle(style);
                    vectorContext.drawGeometry(featureGeomDeepCopy);

                    self.#map.render();
                }
            };

            targetSource.on('addfeature', this.#mapPulseHandler);
            addFeatureInterval(targetSource);
        }
    }

    /**
     * 도형 그리기 이벤트 등록
     *
     * - Modify: 이미 그려진 도형의 점/선을 수정 가능하게 함
     * - Draw: 새로운 도형(geometry)을 직접 그릴 수 있게 함
     * - Snap: 도형을 그리거나 수정할 때 기존 도형의 꼭짓점/선에 자동 맞춤(스냅) 기능
     *
     * @param {string} [type='LineString'] - 그릴 도형 타입 ('Point', 'LineString', 'Polygon', 'Circle', 'Square', 'Box')
     * @param {function} [callback]
     * @param {string} [color='LineString'] - 테두리 색상
     *
     * @example
     * // 선(LineString) 그리기 기능 활성화
     * mapUtils.drawEventFeature('LineString');
     *
     * // 원(Circle) 그리기 기능 활성화
     * mapUtils.drawEventFeature('Circle');
     */
    drawEventFeature(type = 'LineString',
                     drawstartCallback = null,
                     drawingCallback = null,
                     drawendCallback = null,
                     color= 'deeppink'){
        let targetLayer = this.getFindLayer('id', 'drawFeatureLayer');
        if(!targetLayer) targetLayer = this.createVectorLayer({id : 'drawFeatureLayer'});
        const targetSource = targetLayer?.getSource();

        const style = [
            new Style({
                stroke: new Stroke({
                    color,
                    width: 2,
                }),
            }),
            new Style({
                image: new CircleStyle({
                    radius: 4,
                    fill: new Fill({ color: '#fff' }),
                    stroke: new Stroke({ color, width: 2 }), // 분홍 테두리
                }),
                geometry(feature) {
                    const geom = feature.getGeometry();

                    // LineString → [ [x1, y1], [x2, y2], ... ]
                    if (geom.getType() === 'LineString') {
                        return new MultiPoint(geom.getCoordinates());
                    }

                    // Polygon → [[[x1, y1], [x2, y2], ...]]
                    if (geom.getType() === 'Polygon') {
                        return new MultiPoint(geom.getCoordinates()[0]);
                    }

                    // Point 그대로 리턴
                    if (geom.getType() === 'Point') {
                        return geom;
                    }

                    return null;
                },
            })
        ];

        targetLayer.setStyle(style);

        if(!Object.keys(this.#mapDrawFeatureHandler).length){
            const validTypes = ['Point', 'LineString', 'Polygon', 'Circle', 'Square', 'Box'];
            type = validTypes.find(v => new RegExp(`^${v}$`, 'i').test(type?.trim()));

            this.#mapDrawFeatureHandler.type = type;

            // 이미 그려진 도형을 “수정(점 옮기기, 선/면 변형)
            //this.#mapDrawFeatureHandler.modify = new Modify({source: targetSource});
            //this.#map.addInteraction(this.#mapDrawFeatureHandler.modify);

            // Snap은 사용자가 도형을 그리거나 편집할 때 기존 도형의 꼭짓점(vertex)이나 선(segment)에 "착 달라붙게" 해주는 기능
            this.#mapDrawFeatureHandler.snap = new Snap({source: targetSource});
            this.#map.addInteraction(this.#mapDrawFeatureHandler.snap);

            // Draw는 사용자가 직접 도형(geometry)을 그릴 수 있게 해주는 인터랙션
            if(type !== 'Square' && type !== 'Box'){
                this.#mapDrawFeatureHandler.draw = new Draw({
                    source : targetSource,
                    type,
                    style
                });
            }else{
                this.#mapDrawFeatureHandler.draw = new Draw({
                    source : targetSource,
                    type : 'Circle',
                    style,
                    geometryFunction : type === 'Square' ? createRegularPolygon(4) : createBox(),
                });
            }
            this.#map.addInteraction(this.#mapDrawFeatureHandler.draw);

            this.#mapDrawFeatureHandler.draw.on('drawstart', (e) => {
                const geom = e.feature.getGeometry();

                typeof drawstartCallback === 'function' && drawstartCallback('drawstart', geom, e.feature);
                geom.on('change', () => {
                    if (geom.getType() === 'LineString') {
                        // getLength(geom), getArea(geom)도 가능!
                        typeof drawingCallback === 'function' && drawingCallback('drawing', geom, geom.getLength());
                        console.log('실시간 길이 (m):', geom.getLength());
                    } else if (geom.getType() === 'Polygon') {
                        typeof drawingCallback === 'function' && drawingCallback('drawing', geom, geom.getArea());
                        console.log('실시간 면적 (㎡):', geom.getArea());
                    }
                });
            });

            this.#mapDrawFeatureHandler.draw.on('drawend', (e) => {
                const feature = e.feature;
                const geom = feature.getGeometry();

                typeof drawendCallback === 'function' && drawendCallback('drawend', geom);

                if (geom.getType() === 'LineString') {
                    const length = geom.getLength(); // 단위: m
                    console.log('라인 길이 (m):', length);
                } else if (geom.getType() === 'Polygon') {
                    const area = geom.getArea(); // 단위: ㎡
                    console.log('폴리곤 면적 (㎡):', area);
                }
                this.clearDrawEventFeature();
            });

            console.log('도형 그리기 이벤트 등록 완료. 이벤트 제거 필요 시 clearDrawEventFeature() 사용.');
        }else{
            console.log(`기존 도형 그리기 '${this.#mapDrawFeatureHandler.type}'타입 이벤트 존재함.`);
        }
    }

    /**
     * 도형 그리기 이벤트 해제
     *
     * - 등록된 Modify, Draw, Snap 인터랙션을 제거
     * - 필요 시 도형이 그려진 레이어 자체도 제거 가능
     *
     * @param {boolean} [removeLayerBoolean=false] - true이면 도형 레이어도 함께 제거
     *
     * @example
     * // 이벤트만 해제
     * mapUtils.clearDrawEventFeature();
     *
     * // 이벤트 + 레이어도 삭제
     * mapUtils.clearDrawEventFeature(true);
     */
    clearDrawEventFeature(removeLayerBoolean = false){
        const targetLayer = this.getFindLayer('id', 'drawFeatureLayer');
        if(targetLayer && removeLayerBoolean){
            const targetSource = targetLayer.getSource();
            targetSource.getFeatures().forEach(v => {
                v?.popup && this.#map.removeOverlay(v?.popup);
                v?.popup?.element?.remove();
            });

            this.#map.removeLayer(targetLayer);
            console.log('drawFeatureLayer 삭제 완료');
        }

        if(Object.keys(this.#mapDrawFeatureHandler).length){
            this.#map.removeInteraction(this.#mapDrawFeatureHandler?.modify);
            this.#map.removeInteraction(this.#mapDrawFeatureHandler?.draw);
            this.#map.removeInteraction(this.#mapDrawFeatureHandler?.snap);
            this.#mapDrawFeatureHandler = {};
            console.log('도형 그리기 이벤트 제거 완료.');
        }else{
            console.log('제거할 도형 그리기 이벤트가 없음.');
        }
    }

    /**
     * drawFeatureLayer 레이어의 피처 선택 기능을 활성화한다.
     *
     * 선택된 피처는 지정한 색상으로 스타일이 적용된다.
     * LineString은 선, Polygon은 면과 선, Point는 원으로 표현됨.
     * 또한, 선택된 피처는 Backspace/Delete로 삭제 가능.
     *
     * @param {string} [color='blue'] - 선택된 피처의 강조 색상
     *
     * @example
     * mapUtils.setSelectDrawFeatureEvent(); // 기본 파란색
     * mapUtils.setSelectDrawFeatureEvent('red'); // 빨간색
     */
    setSelectDrawFeatureEvent(color = 'blue'){
        const targetLayer = this.getFindLayer('id', 'drawFeatureLayer');
        if(targetLayer && !this.#mapSelectDrawFeatureHandler){
            this.#mapSelectDrawFeatureHandler = new Select({
                layers: [targetLayer],
                condition: click,
                style: function(feature) {
                    const geom = feature.getGeometry();
                    const geomType = geom.getType();

                    return [
                        new Style({
                            stroke: new Stroke({
                                color,
                                width: geomType === 'LineString' ? 3 : 2,
                            }),
                            fill: geomType === 'Polygon' ? new Fill({ color: 'rgba(0,0,255,0.1)' }) : undefined
                        }),
                        new Style({
                            image: new CircleStyle({
                                radius: 4,
                                fill: new Fill({ color: '#fff' }),
                                stroke: new Stroke({ color, width: 2 }),
                            }),
                            geometry() {
                                if (geomType === 'LineString') return new MultiPoint(geom.getCoordinates());
                                if (geomType === 'Polygon') return new MultiPoint(geom.getCoordinates()[0]);
                                if (geomType === 'Point') return geom;
                                return null;
                            }
                        })
                    ];
                }
            });
            this.#map.addInteraction(this.#mapSelectDrawFeatureHandler);
            console.log('id : drawFeatureLayer 레이어의 피처 선택 함수 활성화. 비활성화 필요 시 unsetSelectDrawFeatureEvent() 사용.');
        }else{
            console.log('drawEventFeature()를 최초 한번이라도 실행 시 가능');
            console.log('clearDrawEventFeature(true)로 옵션 사용 했을 시 drawEventFeature()를 다시 호출하여야 사용 가능.');
        }
    }

    /**
     * drawFeatureLayer 레이어의 피처 선택 이벤트를 제거한다.
     *
     * 기존에 선택 이벤트가 설정되어 있다면 맵에서 제거하고
     * 내부 핸들러를 null로 초기화한다.
     *
     * @example
     * mapUtils.unsetSelectDrawFeatureEvent();
     */
    unsetSelectDrawFeatureEvent(){
        if(this.#mapSelectDrawFeatureHandler){
            this.#map.removeInteraction(this.#mapSelectDrawFeatureHandler);
            this.#mapSelectDrawFeatureHandler = null;
            console.log('setSelectDrawFeatureEvent() 이벤트 삭제 완료');
        }else{
            console.log('setSelectDrawFeatureEvent() 이벤트가 없음.');
        }
    }

    /**
     * 주어진 LineString 또는 좌표 배열의 거리를 계산.
     *
     * 좌표계를 EPSG:4326으로 변환 후 `ol/sphere` 의 getLength를 사용
     *
     * @param {import("ol/geom/LineString").default|Array<Array<number>>} geom - 거리 계산할 LineString 또는 좌표 배열
     * @param {Object} [options={}] - 옵션 객체
     * @param {string} [options.epsg=this.getProjectionCode()] - 입력 좌표의 EPSG 코드
     * @param {string} [options.unit='m'] - 결과 단위 ('m' | 'km')
     * @returns {number} 거리 (단위: 미터 또는 킬로미터)
     *
     * @example
     * // 현재 지도 좌표계(EPSG:5186) 기준 LineString
     * const line = new LineString([[200000, 500000], [210000, 510000]]);
     * const distM = mapUtils.getMeter(line);       // 미터 단위
     * const distKm = mapUtils.getMeter(line, {unit: 'km'}); // 킬로미터 단위
     */
    getMeter(geom, {epsg = this.getProjectionCode(), unit = 'm'} = {}){
        let coords = geom instanceof LineString ? geom.getCoordinates() : geom;

        if(epsg.toUpperCase() !== 'EPSG:4326'){
            coords = coords.map(coord => {this.epsgTransform(coord, epsg, 'EPSG:4326')});
        }
        return unit === 'm' ? getLength(new LineString(coords)) : getLength(new LineString(coords)) / 1000;
    }

    /**
     * 주어진 Polygon 또는 좌표 배열의 면적을 계산.
     *
     * 좌표계를 EPSG:4326으로 변환 후 `ol/sphere` 의 getArea를 사용
     *
     * @param {import("ol/geom/Polygon").default|Array<Array<Array<number>>>} geom - 면적 계산할 Polygon 또는 좌표 배열
     * @param {string} [epsg=this.getProjectionCode()] - 입력 좌표의 EPSG 코드
     * @returns {number} 면적 (단위: 제곱미터)
     *
     * @example
     * // 현재 지도 좌표계(EPSG:5186) 기준 Polygon
     * const poly = new Polygon([[
     *   [200000, 500000],
     *   [210000, 500000],
     *   [210000, 510000],
     *   [200000, 510000],
     *   [200000, 500000]
     * ]]);
     * const area = mapUtils.getSquareMeter(poly); // 단위: m²
     */
    getSquareMeter(geom, epsg = this.getProjectionCode()){
        let coords = geom instanceof Polygon ? geom.getCoordinates() : geom;

        if(epsg.toUpperCase() !== 'EPSG:4326'){
            coords = coords.map(coord => {this.epsgTransform(coord, epsg, 'EPSG:4326')});
        }
        return getArea(new LineString(coords));
    }

    finishDrawing(){
        const drawHandler = this.#mapDrawFeatureHandler?.draw;
        if (!drawHandler) return;
        drawHandler.finishDrawing();
    }

    createModal(type, data = []) {
        // 최상위 wrapper
        const wrapper = document.createElement("div");
        wrapper.className = "overlay-ol w-[150px] m-3"; // 너비 고정 150px

        // 카드 본체
        const card = document.createElement("div");
        card.className = "flex flex-col bg-white/20 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl pointer-events-auto";
        wrapper.appendChild(card);

        // Body
        const body = document.createElement("div");
        body.className = "p-3 overflow-x-auto overflow-y-auto h-[100px] flex justify-center items-center"; // 높이 고정, 데이터 많으면 스크롤
        card.appendChild(body);

        // ul 구조
        const ul = document.createElement("ul");
        ul.className = "flex flex-col gap-2 text-sm text-gray-500"; // 글자 작게, 색상 적용
        body.appendChild(ul);

        // 데이터 배열
        data = data.length === 0 ? [
            { name: type === 'LineString' ? "총거리" : "총면적", value: "0.0", key: "calc"},
            { name: "", value: "중지하려면 esc 또는 마우스 우클릭", key: "ing" },
        ] : data;

        data.forEach(item => {
            const li = document.createElement("li");
            li.className = "flex justify-between";

            const spanName = document.createElement("span");
            spanName.className = "font-medium";
            spanName.textContent = item.name;

            const spanValue = document.createElement("span");
            spanValue.className = `font-semibold ${item?.key && item.key}`;
            spanValue.textContent = item.value;

            li.appendChild(spanName);
            li.appendChild(spanValue);
            ul.appendChild(li);
        });

        // Footer
        const footer = document.createElement("div");
        footer.className = "flex flex-col gap-2 py-2 px-3 border-t border-white/20";
        card.appendChild(footer);

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "w-full py-2 px-3 text-sm font-medium rounded-lg bg-blue-500/70 text-white hover:bg-blue-500/90";
        deleteBtn.textContent = "제거하기";
        footer.appendChild(deleteBtn);

        return {wrapper, deleteBtn};
    }

    createOverlay([lon, lat], feature = null, type = 'LineString'){
        const {wrapper, deleteBtn} = this.createModal(type, []);

        const popup = new Overlay({
            element: wrapper,
            offset: [2, 2],
        });

        feature && (feature.popup = popup);

        popup.setPosition([lon, lat]);
        this.#map.addOverlay(popup);

        deleteBtn.onclick = () => {
            this.#map.removeOverlay(popup);
            wrapper?.remove();

            const targetLayer = this.getFindLayer('id', 'drawFeatureLayer');
            if(targetLayer && feature){
                targetLayer.getSource().removeFeature(feature);
            }
        };

        return popup;
    }

    moveOverlay(overlay, [lon, lat]){
        if(!overlay) return;
        overlay.setPosition([lon, lat]);
    }

    // getFeatures(targetLayer, key, value){
    //     //targetLayer.array_[1].getSource().getFeatures()
    //     targetLayer.getSource().getFeatures().find(feature => {
    //        feature.values_
    //     });
    // }
}

export default MapUtile;