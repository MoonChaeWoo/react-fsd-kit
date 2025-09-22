const Toast = ({ isToastVisible, toastMessage }) => {
    return (
        <div
            className={`toast-liquid fixed bottom-5 right-5 z-50
                min-w-[200px] max-w-[400px]
                p-4 rounded-2xl border border-white/20
                bg-transparent backdrop-blur-2xl backdrop-saturate-150
                shadow-xl shadow-black/20 overflow-hidden
                transition-all duration-300 ease-in-out
                ${isToastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
        >
            <div className="absolute inset-0 rounded-2xl pointer-events-none
                    bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-30" />

            <span className="relative z-10 text-gray-500">
                {toastMessage}
            </span>
        </div>
    );
};

export default Toast;
