import ProfileImg from './assets/profile.png'
import profileImg from "../../../widgets/MapSideLeft/assets/profile.png";
export const Logo = () => {
    return (
        <a className="block text-teal-600" href="#">
            <img
                src={profileImg}
                alt="Logo"
                className="h-10 w-10 rounded-full border-2 border-white/30"
            />
        </a>
    )
}
