import {useState} from "react";

const MapSideLeft = () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <aside className="w-90 bg-gray-900 text-white flex flex-col">

            {/* Logo */}
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                <div className="flex items-center">
                    <img
                        src="https://tailwindflex.com/images/logo.svg"
                        alt="Logo"
                        className="h-8 w-auto"
                    />
                    <span className="text-xl font-bold ml-2">Admin Pro</span>
                </div>
            </div>

            {/* Search Bar */}
            <div className="p-4">
                <div className="relative">
                    <input
                        type="text"
                        className="w-full bg-gray-800 text-white rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Search..."
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                            className="h-5 w-5 text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                </div>
            </div>


            {/* User Profile */}
            <div className="mt-auto p-4 border-t border-gray-800">
                <div className="flex items-center">
                    <img
                        className="h-8 w-8 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt="User"
                    />
                    <div className="ml-3">
                        <p className="text-sm font-medium text-white">Tom Cook</p>
                        <p className="text-xs text-gray-400">View profile</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default MapSideLeft;