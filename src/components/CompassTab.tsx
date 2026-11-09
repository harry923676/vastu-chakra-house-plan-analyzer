/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { Compass, RotateCw, Navigation, ArrowUpRight, AlertTriangle, ShieldCheck, Check } from 'lucide-react';
import { ProjectState } from '../engine/sampleData';
import { normalize360, magneticToTrue, trueToMagnetic, calculateDoorFacing } from '../engine/geometry';
import { Language, TRANSLATIONS } from '../engine/i18n';

interface Props {
  project: ProjectState;
  language: Language;
  onUpdateOrientation: (updates: Partial<ProjectState>) => void;
}

export const CompassTab: React.FC<Props> = ({
  project,
  language,
  onUpdateOrientation,
}) => {
  const t = TRANSLATIONS[language];
  const compassDialRef = useRef<SVGSVGElement>(null);

  // Door facing calculation
  const mainDoor = project.doors.find((d) => d.isMainEntrance) || project.doors[0];
  const doorFacingAngle = mainDoor
    ? calculateDoorFacing(mainDoor.segment, mainDoor.flipNormal, project.trueNorthBearingBeta)
    : 90;

  // Change True North directly
  const handleSetTrueNorth = (deg: number) => {
    const normalized = normalize360(Math.round(deg * 10) / 10);
    const newMag = trueToMagnetic(normalized, project.magneticDeclination);
    onUpdateOrientation({
      trueNorthBearingBeta: normalized,
      magneticBearing: Math.round(newMag * 10) / 10,
    });
  };

  // Change Magnetic North directly
  const handleSetMagneticNorth = (deg: number) => {
    const normalized = normalize360(Math.round(deg * 10) / 10);
    const newTrue = magneticToTrue(normalized, project.magneticDeclination);
    onUpdateOrientation({
      magneticBearing: normalized,
      trueNorthBearingBeta: Math.round(newTrue * 10) / 10,
    });
  };

  // Change Magnetic Declination
  const handleSetDeclination = (decl: number) => {
    const cleanDecl = Math.round(decl * 10) / 10;
    const newTrue = magneticToTrue(project.magneticBearing, cleanDecl);
    onUpdateOrientation({
      magneticDeclination: cleanDecl,
      trueNorthBearingBeta: Math.round(newTrue * 10) / 10,
    });
  };

  // Interactive Drag on Dial
  const handleDialPointer = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!compassDialRef.current) return;
    const rect = compassDialRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    // Clockwise angle from top (+y up, so -dy in screen)
    const rad = Math.atan2(dx, -dy);
    const deg = (rad * 180) / Math.PI;
    handleSetTrueNorth(deg);
  };

  const handleFlipDoorNormal = () => {
    if (!mainDoor) return;
    const updatedDoors = project.doors.map((d) =>
      d.id === mainDoor.id ? { ...d, flipNormal: !d.flipNormal } : d
    );
    onUpdateOrientation({ doors: updatedDoors });
  };

  // Presets
  const presets = [
    { label: 'North (0°)', deg: 0 },
    { label: 'NE (45°)', deg: 45 },
    { label: 'East (90°)', deg: 90 },
    { label: 'SE (135°)', deg: 135 },
    { label: 'South (180°)', deg: 180 },
    { label: 'SW (225°)', deg: 225 },
    { label: 'West (270°)', deg: 270 },
    { label: 'NW (315°)', deg: 315 },
  ];

  return (
    <div className="space-y-6">
      {/* Primary Orientation Badge Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 rounded-xl border border-slate-700 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-4 h-4" />
            <span>{t.orientationSummary}</span>
          </div>
          <div className="text-xl font-bold text-white font-mono mt-0.5">
            {project.trueNorthBearingBeta.toFixed(1)}°{' '}
            <span className="text-xs font-normal text-slate-300">
              clockwise from Image-Up
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
            <span>
              Entrance Facing: <strong className="text-amber-300 font-mono">{doorFacingAngle.toFixed(1)}°</strong>
            </span>
            <span className="text-slate-600">•</span>
            <span>
              Declination: <strong className="text-slate-300 font-mono">{project.magneticDeclination > 0 ? `+${project.magneticDeclination}° E` : `${project.magneticDeclination}° W`}</strong>
            </span>
            <span className="text-slate-600">•</span>
            <span>
              Uncertainty: <strong className="text-slate-300 font-mono">±{project.uncertaintyMarginDeg}°</strong>
            </span>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => onUpdateOrientation({ isMagneticMode: false })}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              !project.isMagneticMode
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            True North
          </button>
          <button
            onClick={() => onUpdateOrientation({ isMagneticMode: true })}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              project.isMagneticMode
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Magnetic North
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Interactive Circular Compass Dial */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
          <div className="text-xs font-semibold text-slate-400 mb-3 text-center">
            Interactive Compass (Click or Drag to Rotate North Pointer)
          </div>

          <div className="relative w-64 h-64 select-none">
            <svg
              ref={compassDialRef}
              className="w-full h-full cursor-pointer touch-none"
              viewBox="0 0 240 240"
              onPointerDown={handleDialPointer}
              onPointerMove={(e) => {
                if (e.buttons === 1) handleDialPointer(e);
              }}
            >
              <defs>
                <radialGradient id="compass-bg" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </radialGradient>
              </defs>

              {/* Outer dial ring */}
              <circle cx="120" cy="120" r="110" fill="url(#compass-bg)" stroke="#334155" strokeWidth="3" />
              <circle cx="120" cy="120" r="85" fill="none" stroke="#475569" strokeWidth="1" strokeDasharray="2 4" />

              {/* Degree tick marks every 10° */}
              {Array.from({ length: 36 }).map((_, i) => {
                const deg = i * 10;
                const isMajor = deg % 30 === 0;
                const isCardinal = deg % 90 === 0;
                const rad = ((deg - 90) * Math.PI) / 180;
                const r1 = 110;
                const r2 = isCardinal ? 94 : isMajor ? 99 : 104;
                const x1 = 120 + r1 * Math.cos(rad);
                const y1 = 120 + r1 * Math.sin(rad);
                const x2 = 120 + r2 * Math.cos(rad);
                const y2 = 120 + r2 * Math.sin(rad);

                return (
                  <line
                    key={deg}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={isCardinal ? '#f59e0b' : isMajor ? '#94a3b8' : '#475569'}
                    strokeWidth={isCardinal ? 2 : 1}
                  />
                );
              })}

              {/* Cardinal Labels */}
              <text x="120" y="32" textAnchor="middle" fill="#ef4444" fontSize="13" fontWeight="bold">N</text>
              <text x="210" y="125" textAnchor="middle" fill="#38bdf8" fontSize="13" fontWeight="bold">E</text>
              <text x="120" y="218" textAnchor="middle" fill="#f59e0b" fontSize="13" fontWeight="bold">S</text>
              <text x="30" y="125" textAnchor="middle" fill="#a855f7" fontSize="13" fontWeight="bold">W</text>

              {/* Rotating Compass Needle (pointing towards project.trueNorthBearingBeta) */}
              <g transform={`rotate(${project.trueNorthBearingBeta} 120 120)`}>
                {/* North needle tip */}
                <polygon points="120,40 127,120 120,110 113,120" fill="#ef4444" />
                {/* South needle tip */}
                <polygon points="120,200 127,120 120,130 113,120" fill="#64748b" />
                <circle cx="120" cy="120" r="6" fill="#f8fafc" stroke="#0f172a" strokeWidth="2" />
              </g>

              {/* Center digital readout */}
              <rect x="80" y="105" width="80" height="30" rx="6" fill="#020617" stroke="#334155" strokeWidth="1" />
              <text x="120" y="125" textAnchor="middle" fill="#fef08a" fontSize="12" fontWeight="bold" fontFamily="monospace">
                {project.trueNorthBearingBeta.toFixed(1)}°
              </text>
            </svg>
          </div>

          <div className="text-[11px] text-slate-400 mt-3 text-center">
            {t.clockwiseConvention}
          </div>
        </div>

        {/* Right: Fine 0.1° Adjustments & Measured Inputs */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-200">
              {project.isMagneticMode ? t.magneticNorth : t.trueNorth}
            </label>
            <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {project.isMagneticMode
                ? `${project.magneticBearing.toFixed(1)}° Mag`
                : `${project.trueNorthBearingBeta.toFixed(1)}° True`}
            </span>
          </div>

          {/* Continuous Angle Slider */}
          <div className="space-y-1.5">
            <input
              type="range"
              min="0"
              max="359.9"
              step="0.1"
              value={project.isMagneticMode ? project.magneticBearing : project.trueNorthBearingBeta}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (project.isMagneticMode) {
                  handleSetMagneticNorth(val);
                } else {
                  handleSetTrueNorth(val);
                }
              }}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0° (North)</span>
              <span>90° (East)</span>
              <span>180° (South)</span>
              <span>270° (West)</span>
              <span>359.9°</span>
            </div>
          </div>

          {/* Micro-Adjustment Buttons (+/- 0.1° and +/- 1.0°) */}
          <div className="space-y-2">
            <div className="text-[11px] text-slate-400 font-semibold">Fine Degree Precision</div>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => handleSetTrueNorth(project.trueNorthBearingBeta - 1.0)}
                className="py-1.5 text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition"
              >
                -1.0°
              </button>
              <button
                onClick={() => handleSetTrueNorth(project.trueNorthBearingBeta - 0.1)}
                className="py-1.5 text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 rounded border border-slate-700 transition"
              >
                -0.1°
              </button>
              <button
                onClick={() => handleSetTrueNorth(project.trueNorthBearingBeta + 0.1)}
                className="py-1.5 text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 rounded border border-slate-700 transition"
              >
                +0.1°
              </button>
              <button
                onClick={() => handleSetTrueNorth(project.trueNorthBearingBeta + 1.0)}
                className="py-1.5 text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition"
              >
                +1.0°
              </button>
            </div>
          </div>

          {/* Magnetic Declination Input */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-medium">Local Magnetic Declination (NOAA WMM)</span>
              <span className="text-xs font-mono text-cyan-400">
                {project.magneticDeclination >= 0 ? `+${project.magneticDeclination.toFixed(1)}°` : `${project.magneticDeclination.toFixed(1)}°`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.1"
                min="-30"
                max="30"
                value={project.magneticDeclination}
                onChange={(e) => handleSetDeclination(parseFloat(e.target.value) || 0)}
                className="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs font-mono text-white text-center"
              />
              <span className="text-[11px] text-slate-400 leading-tight">
                East is positive (+). True = Magnetic + Declination. (India: ~0.5°W to +1.8°E).
              </span>
            </div>
          </div>

          {/* Angle Uncertainty Input */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-medium">{t.uncertaintyMargin}</span>
              <span className="text-xs font-mono text-amber-400">±{project.uncertaintyMarginDeg.toFixed(1)}°</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0.2"
                max="5.0"
                step="0.1"
                value={project.uncertaintyMarginDeg}
                onChange={(e) => onUpdateOrientation({ uncertaintyMarginDeg: parseFloat(e.target.value) || 1.5 })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
            <p className="text-[10px] text-slate-500">
              Tests findings sensitivity at (North ± {project.uncertaintyMarginDeg}°). Flags rooms that cross zone boundaries.
            </p>
          </div>

          {/* Main Entrance Facing Vector */}
          <div className="bg-amber-950/20 border border-amber-600/30 p-3 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-amber-300">{t.entranceFacing}</span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-200">
                {doorFacingAngle.toFixed(1)}°
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {t.doorFacingExplanation}
            </p>
            <button
              onClick={handleFlipDoorNormal}
              className="w-full py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 rounded flex items-center justify-center gap-1.5 transition"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>{t.flipEntranceNormal}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cardinal Presets Grid */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="text-xs font-semibold text-slate-400 mb-2.5">
          {t.presets} (Surveying Alignment Presets)
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
          {presets.map((p) => {
            const isSelected = Math.abs(project.trueNorthBearingBeta - p.deg) < 0.2;
            return (
              <button
                key={p.label}
                onClick={() => handleSetTrueNorth(p.deg)}
                className={`py-2 text-xs font-mono font-medium rounded-lg border transition ${
                  isSelected
                    ? 'bg-amber-600 text-white border-amber-500 shadow'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
