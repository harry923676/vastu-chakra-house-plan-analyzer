/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Move, Eye, Layers } from 'lucide-react';
import { ProjectState, RoomEntity } from '../engine/sampleData';
import { Point, polygonCentroid, ZONES_8, ZONES_16, normalize360 } from '../engine/geometry';
import { Language } from '../engine/i18n';

interface Props {
  project: ProjectState;
  language: Language;
  activeRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
  onCenterChange?: (center: Point) => void;
}

export const CanvasPlanViewer: React.FC<Props> = ({
  project,
  language,
  activeRoomId,
  onSelectRoom,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState<Point>({ x: 0, y: 0 });

  // Calculate Centers
  const footprintCentroid = polygonCentroid(project.buildingFootprint);
  const plotCentroid = polygonCentroid(project.plotBoundary);
  const activeCenter =
    project.selectedCenterType === 'plot'
      ? plotCentroid
      : project.selectedCenterType === 'custom'
      ? project.customCenter
      : footprintCentroid;

  // Active zones
  const zones = project.selectedMode === '8-zone' ? ZONES_8 : ZONES_16;

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setZoom((prev) => Math.min(Math.max(prev * zoomFactor, 0.4), 3.5));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Left click drag for pan
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const rawX = (e.clientX - rect.left - pan.x) / zoom;
      const rawY = (e.clientY - rect.top - pan.y) / zoom;
      setMousePos({ x: Math.round(rawX), y: Math.round(rawY) });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Convert polygon vertices to SVG polygon points string
  const pointsToString = (pts: Point[]) => pts.map((p) => `${p.x},${p.y}`).join(' ');

  // Generate SVG path for a circular sector wedge
  const createSectorPath = (
    center: Point,
    radius: number,
    startAngleDeg: number,
    endAngleDeg: number
  ) => {
    // Angular rotation takes True North bearing into account:
    // Angle on canvas: 0° is image-up (North).
    // Clockwise angle theta from image-up:
    // angleOnCanvas = bearing - beta
    const startRad = ((startAngleDeg - project.trueNorthBearingBeta - 90) * Math.PI) / 180;
    const endRad = ((endAngleDeg - project.trueNorthBearingBeta - 90) * Math.PI) / 180;

    const x1 = center.x + radius * Math.cos(startRad);
    const y1 = center.y + radius * Math.sin(startRad);
    const x2 = center.x + radius * Math.cos(endRad);
    const y2 = center.y + radius * Math.sin(endRad);

    let diff = endAngleDeg - startAngleDeg;
    if (diff < 0) diff += 360;
    const largeArcFlag = diff > 180 ? 1 : 0;

    return `M ${center.x} ${center.y} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  // Brahmasthan box computation
  const minX = Math.min(...project.buildingFootprint.map((p) => p.x));
  const maxX = Math.max(...project.buildingFootprint.map((p) => p.x));
  const minY = Math.min(...project.buildingFootprint.map((p) => p.y));
  const maxY = Math.max(...project.buildingFootprint.map((p) => p.y));
  const bW = maxX - minX;
  const bH = maxY - minY;
  const brahmasthanRect = {
    x: minX + bW / 3,
    y: minY + bH / 3,
    width: bW / 3,
    height: bH / 3,
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[520px] bg-slate-950 overflow-hidden select-none cursor-crosshair border border-slate-800 rounded-lg shadow-inner"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Zoom / Viewport Overlay Toolbar */}
      <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-lg border border-slate-700/80 shadow-md">
        <button
          onClick={() => setZoom((prev) => Math.min(prev * 1.2, 3.5))}
          className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded transition"
          title="Zoom In"
          aria-label="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom((prev) => Math.max(prev * 0.8, 0.4))}
          className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded transition"
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={resetView}
          className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded transition"
          title="Reset Zoom & Pan"
          aria-label="Reset View"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <div className="text-[11px] text-slate-400 font-mono px-2 border-l border-slate-700">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* Interactive North Indicator Dial on Canvas */}
      <div className="absolute top-3 right-3 z-30 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-700/80 shadow-md flex items-center gap-2.5">
        <div className="relative w-9 h-9 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="16" fill="none" stroke="#334155" strokeWidth="1.5" />
            {/* North pointer rotating to match project.trueNorthBearingBeta */}
            <g transform={`rotate(${-project.trueNorthBearingBeta} 18 18)`}>
              <polygon points="18,3 21,18 18,15 15,18" fill="#ef4444" />
              <polygon points="18,33 21,18 18,21 15,18" fill="#64748b" />
              <circle cx="18" cy="18" r="2" fill="#f8fafc" />
            </g>
          </svg>
        </div>
        <div>
          <div className="text-[10px] text-slate-400 uppercase font-semibold">True North</div>
          <div className="text-xs font-mono font-bold text-amber-400">
            {project.trueNorthBearingBeta.toFixed(1)}°
          </div>
        </div>
      </div>

      {/* Coordinate & Scale HUD */}
      <div className="absolute bottom-3 left-3 z-30 bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] text-slate-400 font-mono border border-slate-800 flex items-center gap-3">
        <span>X: {mousePos.x}px</span>
        <span>Y: {mousePos.y}px</span>
        <span className="text-slate-600">|</span>
        <span>Scale: ~{(100 * project.scaleMetersPerPixel).toFixed(1)}m / 100px</span>
      </div>

      {/* SVG Interactive Canvas */}
      <svg
        id="vastu-plan-svg"
        className="w-full h-full"
        viewBox="0 0 850 700"
        preserveAspectRatio="xMidYMid meet"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.08s ease-out',
        }}
      >
        <defs>
          {/* Subtle Grid pattern for architectural scale */}
          <pattern id="plan-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" opacity="0.6" />
          </pattern>
          {/* Main Entrance Arrow Marker */}
          <marker id="door-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b" />
          </marker>
        </defs>

        {/* Background Grid */}
        <rect width="850" height="700" fill="url(#plan-grid)" />

        {/* 1. Plot Boundary */}
        <polygon
          points={pointsToString(project.plotBoundary)}
          fill="none"
          stroke="#475569"
          strokeWidth="2"
          strokeDasharray="6 4"
        />
        <text x="60" y="70" fill="#64748b" fontSize="10" fontFamily="sans-serif">
          {language === 'hi' ? 'भूखंड सीमा (Plot Boundary)' : 'Plot Boundary'}
        </text>

        {/* 2. Building Footprint */}
        <polygon
          points={pointsToString(project.buildingFootprint)}
          fill="#0f172a"
          fillOpacity="0.85"
          stroke="#38bdf8"
          strokeWidth="2.5"
        />

        {/* 3. Vāstu Chakra Overlay Sectors */}
        <g id="chakra-sectors" opacity={project.chakraOpacity}>
          {zones.map((z) => (
            <path
              key={z.id}
              d={createSectorPath(activeCenter, 380, z.startAngle, z.endAngle)}
              fill={z.color}
              stroke="#0f172a"
              strokeWidth="1"
            />
          ))}
        </g>

        {/* 4. Chakra Boundary Rays */}
        {project.showBoundaryRays && (
          <g id="boundary-rays">
            {zones.map((z) => {
              // Convert ray angle to canvas coordinate vector
              const rad = ((z.startAngle - project.trueNorthBearingBeta - 90) * Math.PI) / 180;
              const rx = activeCenter.x + 400 * Math.cos(rad);
              const ry = activeCenter.y + 400 * Math.sin(rad);
              return (
                <line
                  key={`ray-${z.id}`}
                  x1={activeCenter.x}
                  y1={activeCenter.y}
                  x2={rx}
                  y2={ry}
                  stroke="#94a3b8"
                  strokeWidth="0.8"
                  strokeDasharray="3 3"
                  opacity="0.6"
                />
              );
            })}
          </g>
        )}

        {/* 5. Direction Labels along the Perimeter Ring */}
        <g id="chakra-labels">
          {zones.map((z) => {
            const rad = ((z.centerAngle - project.trueNorthBearingBeta - 90) * Math.PI) / 180;
            const lx = activeCenter.x + 340 * Math.cos(rad);
            const ly = activeCenter.y + 340 * Math.sin(rad);
            return (
              <g key={`lbl-${z.id}`} transform={`translate(${lx}, ${ly})`}>
                <circle cx="0" cy="0" r="16" fill="#0f172a" stroke={z.color} strokeWidth="1.5" />
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fill="#f8fafc"
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  {z.id}
                </text>
              </g>
            );
          })}
        </g>

        {/* 6. Central Brahmasthāna (1/9th core area) */}
        {project.showBrahmasthan && (
          <g id="brahmasthan-layer">
            <rect
              x={brahmasthanRect.x}
              y={brahmasthanRect.y}
              width={brahmasthanRect.width}
              height={brahmasthanRect.height}
              fill="#fbbf24"
              fillOpacity="0.12"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeDasharray="5 5"
            />
            <text
              x={brahmasthanRect.x + brahmasthanRect.width / 2}
              y={brahmasthanRect.y + brahmasthanRect.height / 2 + 4}
              textAnchor="middle"
              fill="#fbbf24"
              fontSize="11"
              fontWeight="bold"
              fontFamily="sans-serif"
              letterSpacing="1"
            >
              {language === 'hi' ? 'ब्रह्मस्थान' : 'BRAHMASTHĀNA'}
            </text>
          </g>
        )}

        {/* 7. Room Polygons */}
        <g id="rooms-layer">
          {project.rooms.map((room) => {
            const isSelected = room.id === activeRoomId;
            const centroid = polygonCentroid(room.polygon);
            return (
              <g
                key={room.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectRoom(room.id);
                }}
                className="cursor-pointer transition-all duration-150"
              >
                <polygon
                  points={pointsToString(room.polygon)}
                  fill={room.color}
                  fillOpacity={isSelected ? 0.45 : 0.22}
                  stroke={isSelected ? '#f59e0b' : room.color}
                  strokeWidth={isSelected ? 3 : 1.5}
                />
                {/* Room Label */}
                <text
                  x={centroid.x}
                  y={centroid.y - 4}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="sans-serif"
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
                >
                  {language === 'hi' ? room.nameHi : room.nameEn}
                </text>
                <text
                  x={centroid.x}
                  y={centroid.y + 12}
                  textAnchor="middle"
                  fill="#cbd5e1"
                  fontSize="9"
                  fontFamily="sans-serif"
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
                >
                  {room.type.replace('_', ' ').toUpperCase()}
                </text>
              </g>
            );
          })}
        </g>

        {/* 8. Windows */}
        <g id="windows-layer">
          {project.windows.map((win) => (
            <line
              key={win.id}
              x1={win.segment.start.x}
              y1={win.segment.start.y}
              x2={win.segment.end.x}
              y2={win.segment.end.y}
              stroke="#38bdf8"
              strokeWidth="5"
              strokeLinecap="round"
            />
          ))}
        </g>

        {/* 9. Doors and Entrance Normal Vectors */}
        <g id="doors-layer">
          {project.doors.map((door) => {
            const mx = (door.segment.start.x + door.segment.end.x) / 2;
            const my = (door.segment.start.y + door.segment.end.y) / 2;
            const dx = door.segment.end.x - door.segment.start.x;
            const dy = door.segment.end.y - door.segment.start.y;
            const len = Math.hypot(dx, dy) || 1;
            // Outward normal vector (dy, -dx) scaled
            const nx = (door.flipNormal ? -dy : dy) / len;
            const ny = (door.flipNormal ? dx : -dx) / len;
            const arrowLen = 35;

            return (
              <g key={door.id}>
                {/* Door leaf line */}
                <line
                  x1={door.segment.start.x}
                  y1={door.segment.start.y}
                  x2={door.segment.end.x}
                  y2={door.segment.end.y}
                  stroke={door.isMainEntrance ? '#f59e0b' : '#e2e8f0'}
                  strokeWidth={door.isMainEntrance ? 6 : 4}
                  strokeLinecap="round"
                />

                {/* Outward normal arrow for Main Entrance */}
                {door.isMainEntrance && (
                  <g>
                    <line
                      x1={mx}
                      y1={my}
                      x2={mx + nx * arrowLen}
                      y2={my + ny * arrowLen}
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                      markerEnd="url(#door-arrow)"
                    />
                    <circle cx={mx} cy={my} r="3" fill="#f59e0b" />
                    <rect
                      x={mx + nx * (arrowLen + 15) - 36}
                      y={my + ny * (arrowLen + 15) - 10}
                      width="72"
                      height="20"
                      rx="4"
                      fill="#0f172a"
                      stroke="#f59e0b"
                      strokeWidth="1.2"
                    />
                    <text
                      x={mx + nx * (arrowLen + 15)}
                      y={my + ny * (arrowLen + 15) + 4}
                      textAnchor="middle"
                      fill="#fef08a"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      DOOR OUT
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>

        {/* 10. Center Centroid Marker */}
        <g id="center-marker" transform={`translate(${activeCenter.x}, ${activeCenter.y})`}>
          <circle cx="0" cy="0" r="7" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
          <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
          <text
            x="0"
            y="-12"
            textAnchor="middle"
            fill="#ef4444"
            fontSize="9"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            {project.selectedCenterType === 'plot'
              ? 'PLOT CENTER'
              : project.selectedCenterType === 'custom'
              ? 'CUSTOM REF'
              : 'BUILDING CENTER'}
          </text>
        </g>
      </svg>
    </div>
  );
};
