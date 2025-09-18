import { Logo } from '../../shared/ui/Logo';
import { Nav } from './ui/Nav';
import { UserMenu } from '../../features/Auth';
import { MobileMenuButton } from '../../features/MobileMenu';

const Header = () => {
    return (
        <header className="bg-white">
            <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex-1 md:flex md:items-center md:gap-12">
                        <Logo />
                    </div>

                    <div className="md:flex md:items-center md:gap-12">
                        <Nav />

                        <div className="hidden md:relative md:block">
                            <UserMenu />
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