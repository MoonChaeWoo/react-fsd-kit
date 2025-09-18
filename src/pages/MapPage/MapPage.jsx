import MapSideLeft from '../../widgets/MapSideLeft/MapSideLeft';
import MapMain from '../../widgets/MapMain/MapMain';

const MapPage = () => {

    return (
        <div className="flex h-screen">
            <MapSideLeft/>
            <MapMain/>
        </div>
    );
};

export default MapPage;