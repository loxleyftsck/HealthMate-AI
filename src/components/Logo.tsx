import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  textSize?: 'sm' | 'md' | 'lg';
  iconSize?: number;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  showText = false,
  textSize = 'md',
  iconSize = 36,
}) => {
  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl font-black',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-md"
      >
        {/* Outer squircle background with gradient */}
        <rect
          x="2"
          y="2"
          width="44"
          height="44"
          rx="14"
          fill="url(#logo-gradient)"
        />
        
        {/* Soft Inner Glow Circle */}
        <circle cx="24" cy="24" r="14" fill="white" fillOpacity="0.12" />
        
        {/* Heart + Cross Integrated Shape */}
        <path
          d="M24 35C24 35 14.5 29.5 14.5 21.5C14.5 17.5 17.5 14.5 21.5 14.5C22.9 14.5 24 15.2 24 15.2C24 15.2 25.1 14.5 26.5 14.5C30.5 14.5 33.5 17.5 33.5 21.5C33.5 29.5 24 35 24 35Z"
          fill="white"
          fillOpacity="0.2"
        />

        {/* Dynamic Glowing Medical Cross in the center */}
        <path
          d="M24 17.5V30.5M17.5 24H30.5"
          stroke="#FFFFFF"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Sparkling/AI star in the upper right quadrant */}
        <path
          d="M32.5 11.5C32.5 13.5 33.5 14.5 35.5 14.5C33.5 14.5 32.5 15.5 32.5 17.5C32.5 15.5 31.5 14.5 29.5 14.5C31.5 14.5 32.5 13.5 32.5 11.5Z"
          fill="#E6FFFA"
        />

        <defs>
          <linearGradient
            id="logo-gradient"
            x1="2"
            y1="2"
            x2="46"
            y2="46"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#059669" /> {/* Emerald 650 */}
            <stop offset="0.6" stopColor="#10B981" /> {/* Emerald 500 */}
            <stop offset="1" stopColor="#34D399" /> {/* Emerald 400 */}
          </linearGradient>
        </defs>
      </svg>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-extrabold font-display tracking-tight text-gray-900 dark:text-white ${textSizes[textSize]}`}>
            HealthMate <span className="text-emerald-600 dark:text-emerald-400">AI</span>
          </span>
          <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5 font-sans">
            Smart Care Assistant
          </span>
        </div>
      )}
    </div>
  );
};
