import React from 'react';
import { CanvasElement } from '../../types/canvas';

interface Props {
  element: CanvasElement;
  isSelected: boolean;
  elements: CanvasElement[];
}

export const CanvasElementRenderer: React.FC<Props> = ({ element, isSelected, elements }) => {
  const { type, x, y, width, height, text, fillColor, strokeColor, strokeWidth, textColor, fontSize } = element;

  const stroke = strokeColor || '#818cf8';
  const fill = fillColor || '#1e293b';
  const widthVal = strokeWidth || 2;
  const fSize = fontSize || 12;

  if (type === 'connector' && element.fromId && element.toId) {
    const from = elements.find(el => el.id === element.fromId);
    const to = elements.find(el => el.id === element.toId);

    if (!from || !to) return null;

    const startX = from.x + from.width;
    const startY = from.y + from.height / 2;
    const endX = to.x;
    const endY = to.y + to.height / 2;

    const midX = (startX + endX) / 2;
    const pathD = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;

    return (
      <g className="cursor-pointer">
        <path
          d={pathD}
          fill="none"
          stroke={isSelected ? '#6366f1' : stroke}
          strokeWidth={isSelected ? widthVal + 2 : widthVal}
          strokeDasharray={element.strokeStyle === 'dashed' ? '6 4' : 'none'}
        />
        {element.arrowEnd && (
          <polygon
            points={`${endX},${endY} ${endX - 8},${endY - 5} ${endX - 8},${endY + 5}`}
            fill={stroke}
          />
        )}
        {element.text && (
          <text
            x={midX}
            y={(startY + endY) / 2 - 6}
            fill="#94a3b8"
            fontSize="10"
            textAnchor="middle"
            fontFamily="monospace"
            className="select-none bg-slate-900"
          >
            {element.text}
          </text>
        )}
      </g>
    );
  }

  return (
    <g transform={`translate(${x}, ${y})`} className="cursor-move">
      {type === 'sticky' && (
        <g>
          <rect
            width={width}
            height={height}
            rx={8}
            fill={fill}
            stroke={isSelected ? '#6366f1' : stroke}
            strokeWidth={isSelected ? 3 : 1}
            className="drop-shadow-xl"
          />
          <line x1={0} y1={24} x2={width} y2={24} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
        </g>
      )}

      {type === 'rectangle' && (
        <rect
          width={width}
          height={height}
          rx={12}
          fill={fill}
          stroke={isSelected ? '#6366f1' : stroke}
          strokeWidth={isSelected ? widthVal + 2 : widthVal}
          className="drop-shadow-lg"
        />
      )}

      {type === 'diamond' && (
        <polygon
          points={`${width / 2},0 ${width},${height / 2} ${width / 2},${height} 0,${height / 2}`}
          fill={fill}
          stroke={isSelected ? '#6366f1' : stroke}
          strokeWidth={isSelected ? widthVal + 2 : widthVal}
          className="drop-shadow-lg"
        />
      )}

      {type === 'circle' && (
        <ellipse
          cx={width / 2}
          cy={height / 2}
          rx={width / 2}
          ry={height / 2}
          fill={fill}
          stroke={isSelected ? '#6366f1' : stroke}
          strokeWidth={isSelected ? widthVal + 2 : widthVal}
          className="drop-shadow-lg"
        />
      )}

      {text && (
        <foreignObject x={8} y={8} width={width - 16} height={height - 16} className="pointer-events-none">
          <div className="w-full h-full flex items-center justify-center text-center p-1 overflow-hidden">
            <p
              className="text-slate-200 font-sans font-medium whitespace-pre-wrap leading-tight select-none"
              style={{ fontSize: `${fSize}px`, color: textColor || '#f8fafc' }}
            >
              {text}
            </p>
          </div>
        </foreignObject>
      )}
    </g>
  );
};
