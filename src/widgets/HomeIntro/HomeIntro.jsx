import {useCallback} from "react";
import { useNavigate } from 'react-router-dom';

const HomeIntro = () => {
    const navigate = useNavigate();

    const moveInnerUrl = useCallback(url => {
        navigate(url);
    }, []);

    const moveExternalUrl = useCallback(url => {
        window.open(url, '_blank');
    }, []);

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-funky-pattern"></div>
            </div>
            <div className="absolute top-[10%] left-[5%] transform rotate-12 animate-pulse-slow">
                <svg className="w-6 h-6 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
            </div>
            <div className="absolute top-[80%] left-[15%] transform -rotate-12 animate-pulse-slow">
                <svg className="w-6 h-6 text-purple-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
            </div>
            <div className="absolute top-[20%] left-[90%] transform rotate-45 animate-pulse-slow">
                <svg className="w-6 h-6 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
            </div>
            <div className="absolute top-[70%] left-[80%] transform -rotate-45 animate-pulse-slow">
                <svg className="w-6 h-6 text-purple-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
            </div>

            <div className="relative min-h-screen flex items-center justify-center px-4 py-16 md:py-24">
                <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="text-center md:text-left space-y-6 z-10">
                        <div className="inline-block mb-4">
                            <div
                                className="flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2 text-white font-medium">
                                <svg className="w-4 h-4 text-yellow-300" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                                    />
                                </svg>
                                <span className='text-black'>아이디어가 코드로, 곧 현실이 됩니다</span>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                  문제를 기회로
              </span>
                            <br/><span
                            className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-300 animate-float">
                기술을 성장으로
              </span>
                        </h1>

                        <p className="text-lg md:text-xl text-white text-opacity-90">
                            웹 개발과 인프라 운영 경험을 바탕으로, 아이디어를 실제 프로젝트로 구현합니다.
                            작은 코드 하나도 의미 있게, 사용자에게 가치를 전하는 개발자가 되고 싶습니다.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                            <button
                                onClick={() => {moveInnerUrl('/map')}}
                                className="group px-8 py-3 bg-white rounded-full font-medium text-purple-700 hover:bg-opacity-90 transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                                <span className="relative z-10">지도 서비스</span>
                            </button>

                            <button
                                onClick={() => moveExternalUrl('http://chaewoo.synology.me:11174/')}
                                className="group px-8 py-3 border-2 border-white border-opacity-50 rounded-full font-medium text-white hover:bg-white hover:bg-opacity-10 transition-all duration-300">
                                <span className="flex items-center justify-center gap-2">
                              <span>소개보기</span>
                              <svg className="w-4 h-4 text-white group-hover:animate-ping" fill="currentColor"
                                   viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10"/>
                              </svg>
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="relative h-64 md:h-full flex items-center justify-center">
                        <div className="absolute w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full animate-pulse-slow"></div>
                        <div className="absolute w-64 h-64 md:w-80 md:h-80 border-4 border-white border-opacity-20 rounded-full transform rotate-45 animate-spin-slow"></div>
                        <div className="absolute w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-float"></div>
                        <div className="absolute w-16 h-16 bg-gradient-to-br from-blue-400 to-teal-300 rounded-full top-1/4 right-1/4 animate-float-delay"></div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full overflow-hidden">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none"
                     className="w-full h-16 md:h-24">
                    <path
                        fill="rgba(255, 255, 255, 0.1)"
                        d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V92.83C0,92.83,260.94,84.31,321.39,56.44Z"
                    />
                </svg>
            </div>
        </div>
    );
};

export default HomeIntro;