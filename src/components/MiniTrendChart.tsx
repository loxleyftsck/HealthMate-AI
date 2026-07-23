import React from 'react';

interface MiniTrendChartProps {
  data: number[];
  color: string;
  height?: number;
}

export const MiniTrendChart: React.FC<MiniTrendChartProps> = ({
  data = [0, 0, 0, 0, 0, 0, 0],
  color = '#10B981',
  height = 36,
}) => {
  const pointsCount = data.length;
  if (pointsCount < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min === 0 ? 1 : max - min;

  const width = 140;
  const paddingX = 4;
  const paddingY = 4;

  const getSvgCoordinates = () => {
    return data.map((val, index) => {
      const x = paddingX + (index / (pointsCount - 1)) * (width - 2 * paddingX);
      const normalizedY = (val - min) / range;
      const y = paddingY + (1 - normalizedY) * (height - 2 * paddingY);
      return { x, y };
    });
  };

  const coordinates = getSvgCoordinates();
  
  const linePath = coordinates
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');

  const areaPath = `
    ${linePath} 
    L ${coordinates[coordinates.length - 1].x.toFixed(1)} ${height} 
    L ${coordinates[0].x.toFixed(1)} ${height} 
    Z
  `;

  const lastPoint = coordinates[coordinates.length - 1];

  const uniqueId = React.useId().replace(/:/g, '');

  return (
    <div className="flex flex-col gap-1 w-full mt-2">
      <div className="flex items-center justify-between text-[10px] text-gray-400 dark:text-gray-500 font-semibold px-0.5 select-none">
        <span>7d {Math.min(...data) === Math.max(...data) ? 'stable' : 'trend'}</span>
        <span>{data[data.length - 1]} avg</span>
      </div>
      <div className="relative" style={{ height }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={`grad-${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.2" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>
          
          <path d={areaPath} fill={`url(#grad-${uniqueId})`} />

          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <circle
            cx={lastPoint.x}
            cy={lastPoint.y}
            r="2"
            fill={color}
            className="animate-pulse"
          />
          <circle
            cx={lastPoint.x}
            cy={lastPoint.y}
            r="4.5"
            fill={color}
            fillOpacity="0.35"
            className="animate-ping"
          />
        </svg>
      </div>
    </div>
  );
};
