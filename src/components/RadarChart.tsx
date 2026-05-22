import React, { useState } from "react";
import { DIMENSIONS } from "../data/questions";

interface RadarChartProps {
  scoresPorDimensao: Record<number, number>; // dimensionId -> value (0 to 3)
}

export default function RadarChart({ scoresPorDimensao }: RadarChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const size = 360;
  const center = size / 2;
  const maxVal = 3.0;
  const outerRadius = 120; // Maximum radius at score 3.0
  const numAxes = DIMENSIONS.length; // 8 dimensions

  // Helper to compute coordinate
  const getCoordinates = (index: number, score: number) => {
    // 8 points octagon, rotate by -PI/2 to start at top center
    const angle = (index * (2 * Math.PI)) / numAxes - Math.PI / 2;
    // Cap score to max value
    const val = Math.min(Math.max(score, 0), maxVal);
    const distance = (val / maxVal) * outerRadius;
    const x = center + distance * Math.cos(angle);
    const y = center + distance * Math.sin(angle);
    return { x, y, angle };
  };

  // Generate background circles/rings (Nível 1 to Nível 5 or score thresholds)
  const rings = [0.2, 0.4, 0.6, 0.8, 1.0]; // divisions of maxVal

  // Calculate coordinates for the actual score shape
  const points = DIMENSIONS.map((dim, idx) => {
    const rawScore = scoresPorDimensao[dim.id] || 0;
    return getCoordinates(idx, rawScore);
  });

  // SVG polyline string for original scores
  const scorePathString = points.map((p) => `${p.x},${p.y}`).join(" ");

  // Coordinates for the 100% / Maduro goal baseline (score 3.0)
  const basePoints = DIMENSIONS.map((_, idx) => getCoordinates(idx, 3.0));
  const baseOuterPathString = basePoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
      <div className="absolute top-2 left-2 flex items-center space-x-1">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">Radar de Maturidade (8 Dimensões)</span>
      </div>

      <div className="w-full flex justify-center mt-2">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full max-w-[340px] drop-shadow-[0_0_15px_rgba(59,130,246,0.03)]"
        >
          {/* Background Concentric Rings (Concentric Octagons) */}
          {rings.map((factor, rIdx) => {
            const ringPoints = DIMENSIONS.map((_, idx) => getCoordinates(idx, maxVal * factor));
            const ringPath = ringPoints.map((p) => `${p.x},${p.y}`).join(" ");
            const levelLabel = rIdx + 1;

            return (
              <g key={`ring-${rIdx}`}>
                {/* Octagon Line */}
                <polygon
                  points={ringPath}
                  fill="none"
                  stroke="rgba(100, 116, 139, 0.12)"
                  strokeWidth="1"
                  strokeDasharray={rIdx === rings.length - 1 ? "none" : "2,2"}
                />
                {/* Level indicators on the y-axis (pointing straight up direction) */}
                {rIdx > 0 && (
                  <text
                    x={center + 4}
                    y={center - (outerRadius * factor) + 4}
                    fill="rgba(100, 116, 139, 0.5)"
                    fontSize="7"
                    fontFamily="monospace"
                    className="select-none font-semibold text-[8px]"
                  >
                    N{levelLabel}
                  </text>
                )}
              </g>
            );
          })}

          {/* Radial Axis Lines */}
          {DIMENSIONS.map((_, idx) => {
            const target = getCoordinates(idx, maxVal);
            return (
              <line
                key={`axis-${idx}`}
                x1={center}
                y1={center}
                x2={target.x}
                y2={target.y}
                stroke="rgba(100, 116, 139, 0.15)"
                strokeWidth="1.2"
              />
            );
          })}

          {/* 100% Target Boundary Line (Hollow outer target) */}
          <polygon
            points={baseOuterPathString}
            fill="none"
            stroke="rgba(37, 99, 235, 0.15)"
            strokeWidth="1"
            strokeDasharray="4,4"
          />

          {/* Area Polygons - ACTUAL MATURITY */}
          {points.length > 0 && (
            <polygon
              points={scorePathString}
              fill="url(#radarGradient)"
              fillOpacity="0.2"
              stroke="#2563eb"
              strokeWidth="2.5"
              strokeLinejoin="round"
              className="transition-all duration-700 ease-out"
            />
          )}

          {/* Render Active Highlights & Interactive Outer Text Labels */}
          {DIMENSIONS.map((dim, idx) => {
            const labelPos = getCoordinates(idx, maxVal + 0.45); // offset label outward
            const isHovered = hoveredIndex === idx;
            const scoreVal = scoresPorDimensao[dim.id] || 0;
            const percentage = Math.round((scoreVal / 3) * 100);

            // Fine tune label positions specifically to avoid svg cutoffs
            let textAnchor: "end" | "middle" | "start" = "middle";
            if (labelPos.x < center - 20) textAnchor = "end";
            if (labelPos.x > center + 20) textAnchor = "start";

            return (
              <g
                key={`label-group-${idx}`}
                className="cursor-pointer select-none"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Active Anchor Hotspots */}
                <circle
                  cx={points[idx].x}
                  cy={points[idx].y}
                  r={isHovered ? 6 : 4}
                  fill={isHovered ? "#3b82f6" : "#2563eb"}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  className="transition-all duration-200 shadow-sm"
                />

                {/* Micro Tooltip on Point Hover */}
                {isHovered && (
                  <g>
                    <rect
                      x={points[idx].x - 30}
                      y={points[idx].y - 25}
                      width="60"
                      height="16"
                      rx="3"
                      fill="#1e293b"
                      stroke="#2563eb"
                      strokeWidth="1"
                    />
                    <text
                      x={points[idx].x}
                      y={points[idx].y - 14}
                      fill="#ffffff"
                      fontSize="8"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      Nota {scoreVal.toFixed(1)} / {percentage}%
                    </text>
                  </g>
                )}

                {/* Dimension Abbreviated Text Label */}
                <text
                  x={labelPos.x}
                  y={labelPos.y + 3}
                  textAnchor={textAnchor}
                  fill={isHovered ? "#2563eb" : "#64748b"}
                  fontSize={isHovered ? "9" : "8"}
                  fontWeight={isHovered ? "700" : "500"}
                  fontFamily="sans-serif"
                  className="transition-all duration-200 select-none"
                >
                  {dim.id}. {dim.name.split("—")[0].split("e")[0].slice(0, 10)}...
                </text>
              </g>
            );
          })}

          {/* Gradients definitions inside SVG */}
          <defs>
            <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.05" />
              <stop offset="70%" stopColor="#3b82f6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.4" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Interactive Legend with current values */}
      <div className="w-full mt-3 grid grid-cols-2 gap-2 text-[10px]">
        {DIMENSIONS.map((dim, idx) => {
          const rawScore = scoresPorDimensao[dim.id] || 0;
          const percentage = Math.round((rawScore / 3) * 100);
          return (
            <div
              key={`legend-${idx}`}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`flex items-center justify-between p-1.5 rounded-lg border transition-all ${
                hoveredIndex === idx
                  ? "bg-blue-50 border-blue-200 text-blue-700 scale-[1.02]"
                  : "bg-slate-50 border-slate-100 text-slate-600"
              }`}
            >
              <span className="truncate max-w-[100px] font-medium">
                {dim.id}. {dim.name.split(" — ")[0]}
              </span>
              <span className="font-mono font-semibold px-1 rounded bg-white border border-slate-200 text-slate-700">
                {rawScore.toFixed(1)} / {percentage}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
