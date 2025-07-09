import React, { useEffect, useState } from 'react';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 500);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Animasyonlu dolma efekti
    const progress = ((currentStep - 1) / (steps.length - 1)) * 100;
    setAnimationProgress(progress);
  }, [currentStep, steps.length]);

  if (isMobile) {
    return (
      <div className="flex flex-col w-full max-w-full items-center gap-1">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className={`flex w-full ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
              <div className={`min-w-[110px] max-w-[80vw] h-[38px] rounded-xl flex items-center bg-gradient-to-r from-[#4964A9] to-[#022171] shadow-lg px-3 py-1 transition-all duration-300 z-40`}>
                <p className="font-extrabold text-[13px] text-white text-center truncate w-full">{step}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="flex w-full justify-center items-center h-7 my-2">
                <div className="w-2 h-full rounded-full bg-gray-200 relative overflow-hidden">
                  <div 
                    className={`absolute left-0 top-0 w-full transition-all duration-1000 ease-out bg-gradient-to-b from-[#4964A9] to-[#022171]`}
                    style={{
                      height: index < currentStep - 1 ? '100%' : '0%',
                      transform: `scaleY(${index < currentStep - 1 ? 1 : 0})`,
                      transformOrigin: 'top'
                    }}
                  ></div>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-row w-full max-w-full justify-center items-center overflow-x-auto px-1 xs:px-2 sm:px-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div
            className={`min-w-[70px] h-[32px] xs:min-w-[90px] xs:h-[40px] sm:min-w-[110px] sm:h-[56px] md:min-w-[120px] md:h-[64px] lg:h-[80px] lg:min-w-[95px] rounded-xl flex justify-center items-center bg-gradient-to-r from-[#4964A9] to-[#022171] shadow-lg transition-all duration-300 z-40 px-1 xs:px-2 sm:px-1 ${
              currentStep === index + 1 ? 'scale-110' : 'scale-100'
            }`}
          >
            <p className="font-extrabold text-[9px] xs:text-[10px] sm:text-xs md:text-sm text-white text-center leading-tight truncate w-full px-1">{step}</p>
          </div>
          {index < steps.length - 1 && (
            <div className="h-1 w-[16px] xs:w-[24px] sm:w-[36px] md:w-[48px] lg:w-[92px] relative flex items-center justify-center mx-1 xs:mx-2 sm:mx-3">
              <div className="absolute inset-0 shadow-md bg-white rounded-full" />
              <div
                className="absolute inset-0 bg-gradient-to-r from-[#4964A9] to-[#022171] transition-all duration-1000 ease-out rounded-full"
                style={{
                  width: index < currentStep - 1 ? '100%' : '0%',
                  transform: `scaleX(${index < currentStep - 1 ? 1 : 0})`,
                  transformOrigin: 'left',
                  boxShadow: index < currentStep - 1 ? '0 2px 8px #4964A955' : 'none',
                }}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;