import React, { useEffect, useState } from 'react';

const breakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280
};

const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenSize({
        isMobile: width < breakpoints.mobile,
        isTablet: width >= breakpoints.mobile && width < breakpoints.tablet,
        isDesktop: width >= breakpoints.tablet
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
};

const Responsive = ({ children }) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const baseClasses = 'min-h-screen w-full flex flex-col bg-midnight overflow-x-hidden';
  const containerClasses = `
    flex-1 w-full mx-auto max-w-7xl
    ${isMobile ? 'px-4 py-2' : ''}
    ${isTablet ? 'px-6 py-3' : ''}
    ${isDesktop ? 'px-8 py-4' : ''}
  `;

  return (
    <div className={baseClasses}>
      <div className={containerClasses}>
        {children}
      </div>
    </div>
  );
};

export { Responsive as default, useResponsive };
