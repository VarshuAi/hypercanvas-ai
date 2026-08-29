import React from 'react';
import { CanvasElement, AnchorPosition } from '../../types/canvas';
import { 
  Server, 
  Database, 
  Shield, 
  Key, 
  Box, 
  Zap, 
  Activity, 
  Cloud, 
  Cpu, 
  Globe, 
  Workflow, 
  Terminal, 
  FileText,
  Layers,
  Lock,
  HardDrive
} from 'lucide-react';

interface Props {
  element: CanvasElement;
  isSelected: boolean;
  elements: CanvasElement[];
  onAnchorClick?: (elementId: string, anchor: AnchorPosition) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Server: <Server className="w-4 h-4" />,
  Database: <Database className="w-4 h-4" />,
  Shield: <Shield className="w-4 h-4" />,
  Key: <Key className="w-4 h-4" />,
  Box: <Box className="w-4 h-4" />,
  Zap: <Zap className="w-4 h-4" />,
  Activity: <Activity className="w-4 h-4" />,
  Cloud: <Cloud className="w-4 h-4" />,
  Cpu: <Cpu className="w-4 h-4" />,
  Globe: <Globe className="w-4 h-4" />,
  Workflow: <Workflow className="w-4 h-4" />,
  Terminal: <Terminal className="w-4 h-4" />,
  FileText: <FileText className="w-4 h-4" />,
  Layers: <Layers className="w-4 h-4" />,
  Lock: <Lock className="w-4 h-4" />,
  HardDrive: <HardDrive className="w-4 h-4" />
};

export const CanvasElementRenderer: React.FC<Props> = ({ 
  element, 
  isSelected, 
  elements,
  onAnchorClick
}) => {
  const { 
    id, 
    type, 
    x, 
    y, 
    width, 
    height, 
    title, 
    subtitle, 
    text, 
    author, 
    iconName,
    fillColor, 
    strokeColor, 
    strokeWidth, 
    strokeStyle,
    textColor, 
    fontSize,
    borderRadius 
  } = element;

  const stroke = strokeColor || '#6366f1';
  const fill = fillColor || '#141c2e';
  const strokeW = strokeWidth || 2;
  const rad = borderRadius ?? 12;
  const fontSz = fontSize || 12;

  if (type === 'connector' && element.fromId && element.toId) {
    const from = elements.find(el => el.id === element.fromId);
    const to = elements.find(el => el.id === element.toId);
    if (!from || !to) return null;

    let startX = from.x + from.width;
    let startY = from.y + from.height / 2;
    let endX = to.x;
    let endY = to.y + to.height / 2;

    if (Math.abs(from.y - to.y) > Math.abs(from.x - to.x)) {
      if (from.y < to.y) {
        startX = from.x + from.width / 2;
        startY = from.y + from.height;
        endX = to.x + to.width / 2;
        endY = to.y;
      } else {
        startX = from.x + from.width / 2;
        startY = from.y;
        endX = to.x + to.width / 2;
        endY = to.y + to.height;
      }
    }

    let pathD = '';
    const routing = element.connectorRouting || 'bezier';

    if (routing === 'straight') {
      pathD = `M ${startX} ${startY} L ${endX} ${endY}`;
    } else if (routing === 'orthogonal') {
      const midX = (startX + endX) / 2;
      pathD = `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`;
    } else {
      const dx = Math.abs(endX - startX) * 0.5;
      pathD = `M ${startX} ${startY} C ${startX + dx} ${startY}, ${endX - dx} ${endY}, ${endX} ${endY}`;
    }

    const midLabelX = (startX + endX) / 2;
    const midLabelY = (startY + endY) / 2;

    return (
      <g className="cursor-pointer group">
        <path
          d={pathD}
          fill="none"
          stroke={isSelected ? '#6366f1' : stroke}
          strokeWidth={isSelected ? strokeW + 2 : strokeW}
          strokeDasharray={strokeStyle === 'dashed' ? '6 4' : strokeStyle === 'dotted' ? '2 3' : 'none'}
          className="transition-all"
        />
        <path
          d={pathD}
          fill="none"
          stroke="transparent"
          strokeWidth={14}
        />
        {element.arrowEnd === 'arrow' && (
          <polygon
            points={`${endX},${endY} ${endX - 9},${endY - 5} ${endX - 9},${endY + 5}`}
            fill={isSelected ? '#6366f1' : stroke}
          />
        )}
        {element.text && (
          <g transform={`translate(${midLabelX}, ${midLabelY})`}>
            <rect
              x={-((element.text.length * 6.5) / 2 + 8)}
              y={-12}
              width={element.text.length * 6.5 + 16}
              height={22}
              rx={6}
              fill="#090d18"
              stroke="#334155"
              strokeWidth={1}
            />
            <text
              x={0}
              y={3}
              fill="#cbd5e1"
              fontSize={10}
              textAnchor="middle"
              fontFamily="monospace"
              className="select-none font-medium"
            >
              {element.text}
            </text>
          </g>
        )}
      </g>
    );
  }

  const icon = iconName && ICON_MAP[iconName] ? ICON_MAP[iconName] : null;

  return (
    <g transform={`translate(${x}, ${y})`} className="cursor-move group">
      {type === 'frame' && (
        <g>
          <rect
            width={width}
            height={height}
            rx={8}
            fill={fill}
            fillOpacity={0.4}
            stroke={isSelected ? '#6366f1' : stroke}
            strokeWidth={isSelected ? 2 : 1}
            strokeDasharray="6 4"
          />
          <rect
            x={0}
            y={0}
            width={width}
            height={30}
            rx={8}
            fill="#0f172a"
            fillOpacity={0.9}
          />
          <text
            x={12}
            y={20}
            fill={textColor || '#94a3b8'}
            fontSize={11}
            fontFamily="monospace"
            className="font-bold uppercase tracking-wider select-none"
          >
            {title || 'System Group Container'}
          </text>
        </g>
      )}

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
          <line x1={0} y1={28} x2={width} y2={28} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
          {title && (
            <text
              x={12}
              y={19}
              fill={textColor || '#f8fafc'}
              fontSize={11}
              fontFamily="sans-serif"
              className="font-bold select-none truncate"
            >
              {title}
            </text>
          )}
          {text && (
            <foreignObject x={10} y={34} width={width - 20} height={height - 40} className="pointer-events-none">
              <div className="w-full h-full text-slate-200 font-sans text-xs leading-snug overflow-hidden select-none">
                {text}
              </div>
            </foreignObject>
          )}
          {author && (
            <text
              x={width - 8}
              y={height - 8}
              fill="#94a3b8"
              fontSize={9}
              textAnchor="end"
              fontFamily="monospace"
              className="select-none font-medium opacity-80"
            >
              {author}
            </text>
          )}
        </g>
      )}

      {type === 'rectangle' && (
        <g>
          <rect
            width={width}
            height={height}
            rx={rad}
            fill={fill}
            stroke={isSelected ? '#6366f1' : stroke}
            strokeWidth={isSelected ? strokeW + 2 : strokeW}
            className="drop-shadow-lg transition-all"
          />
          <foreignObject x={10} y={8} width={width - 20} height={height - 16} className="pointer-events-none">
            <div className="w-full h-full flex flex-col justify-center items-center text-center p-1 overflow-hidden select-none">
              <div className="flex items-center gap-1.5 mb-1 text-indigo-400">
                {icon}
                <span className="font-bold font-sans text-slate-100 text-xs tracking-tight">{title || text || 'Service'}</span>
              </div>
              {subtitle && <span className="text-[10px] text-slate-400 font-mono leading-tight">{subtitle}</span>}
            </div>
          </foreignObject>
        </g>
      )}

      {type === 'rounded' && (
        <g>
          <rect
            width={width}
            height={height}
            rx={height / 2}
            fill={fill}
            stroke={isSelected ? '#6366f1' : stroke}
            strokeWidth={isSelected ? strokeW + 2 : strokeW}
            className="drop-shadow-lg transition-all"
          />
          <foreignObject x={12} y={6} width={width - 24} height={height - 12} className="pointer-events-none">
            <div className="w-full h-full flex flex-col justify-center items-center text-center overflow-hidden select-none">
              <div className="flex items-center gap-1.5 text-indigo-400">
                {icon}
                <span className="font-bold text-slate-100 text-xs">{title || text || 'Endpoint'}</span>
              </div>
              {subtitle && <span className="text-[10px] text-slate-400 font-mono">{subtitle}</span>}
            </div>
          </foreignObject>
        </g>
      )}

      {type === 'cylinder' && (
        <g>
          <rect
            x={0}
            y={12}
            width={width}
            height={height - 24}
            fill={fill}
            stroke={isSelected ? '#6366f1' : stroke}
            strokeWidth={isSelected ? strokeW + 2 : strokeW}
          />
          <ellipse
            cx={width / 2}
            cy={height - 12}
            rx={width / 2}
            ry={12}
            fill={fill}
            stroke={isSelected ? '#6366f1' : stroke}
            strokeWidth={isSelected ? strokeW + 2 : strokeW}
          />
          <ellipse
            cx={width / 2}
            cy={12}
            rx={width / 2}
            ry={12}
            fill="#1e293b"
            stroke={isSelected ? '#6366f1' : stroke}
            strokeWidth={isSelected ? strokeW + 2 : strokeW}
          />
          <foreignObject x={8} y={24} width={width - 16} height={height - 40} className="pointer-events-none">
            <div className="w-full h-full flex flex-col justify-center items-center text-center overflow-hidden select-none">
              <div className="flex items-center gap-1 text-cyan-400">
                {icon || <Database className="w-3.5 h-3.5" />}
                <span className="font-bold text-slate-100 text-xs">{title || text || 'Database'}</span>
              </div>
              {subtitle && <span className="text-[10px] text-slate-400 font-mono">{subtitle}</span>}
            </div>
          </foreignObject>
        </g>
      )}

      {type === 'diamond' && (
        <polygon
          points={`${width / 2},0 ${width},${height / 2} ${width / 2},${height} 0,${height / 2}`}
          fill={fill}
          stroke={isSelected ? '#6366f1' : stroke}
          strokeWidth={isSelected ? strokeW + 2 : strokeW}
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
          strokeWidth={isSelected ? strokeW + 2 : strokeW}
          className="drop-shadow-lg"
        />
      )}

      {type === 'cloud' && (
        <rect
          width={width}
          height={height}
          rx={20}
          fill={fill}
          stroke={isSelected ? '#6366f1' : stroke}
          strokeWidth={isSelected ? strokeW + 2 : strokeW}
          className="drop-shadow-lg"
        />
      )}

      {isSelected && type !== 'connector' && (
        <g className="pointer-events-none">
          <rect
            x={-4}
            y={-4}
            width={width + 8}
            height={height + 8}
            fill="none"
            stroke="#6366f1"
            strokeWidth={1.5}
            strokeDasharray="4 2"
          />
          <rect x={-7} y={-7} width={6} height={6} fill="#ffffff" stroke="#6366f1" strokeWidth={1.5} />
          <rect x={width + 1} y={-7} width={6} height={6} fill="#ffffff" stroke="#6366f1" strokeWidth={1.5} />
          <rect x={width + 1} y={height + 1} width={6} height={6} fill="#ffffff" stroke="#6366f1" strokeWidth={1.5} />
          <rect x={-7} y={height + 1} width={6} height={6} fill="#ffffff" stroke="#6366f1" strokeWidth={1.5} />
          <g transform={`translate(${width / 2}, ${height + 18})`}>
            <rect x={-32} y={-10} width={64} height={16} rx={4} fill="#090d18" stroke="#334155" strokeWidth={1} />
            <text x={0} y={2} fill="#94a3b8" fontSize={9} textAnchor="middle" fontFamily="monospace">
              {Math.round(width)} × {Math.round(height)}
            </text>
          </g>
        </g>
      )}
    </g>
  );
};
