import { Logo } from '../../shared/ui/Logo';
import { Nav } from './ui/Nav';
import { UserMenu } from '../../features/Auth';
import { MobileMenuButton } from '../../features/MobileMenu';
import GlassButton from '../../shared/ui/Button/GlassButton';

const Header = () => {
    return (
        <header className="bg-white/70 backdrop-blur-md fixed top-0 left-0 right-0 z-50">
            <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex-1 md:flex md:items-center md:gap-12">
                        <Logo />
                        <h1>MoonChaeWoo</h1>
                    </div>

                    <div className="md:flex md:items-center md:gap-12">
                        <Nav />

                        <div className="hidden md:relative md:block">
                            <GlassButton to="/login">
                                로그인
                            </GlassButton>
                        </div>

                        <div className="block md:hidden">
                            <MobileMenuButton />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;